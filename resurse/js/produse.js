function frecventa(string1, string2){
    alert(string2);
    var ct = {};
    for(var i = 0; i<string1.length; ++i){
        var char = string1.charAt(i);
        if( ct[char] ){
            ct[char]++;
        }
        else{
            ct[char] = 0;
        }
    }

    var ct1 = {};
    for(var i = 0; i<string2.length; ++i){
        var char = string2.charAt(i);
        if( ct[char] ){
            ct[char]++;
        }
        else{
            ct[char] = 0;
        }
    }
    var dif = 0;
    ct.forEach(char => dif+= abs(ct[char]-ct1[char]));
    return dif;
}

function alphanumeric(inputtxt){
 var letterNumber = /^[0-9a-zA-Z]+$/;
 if((inputtxt.value.match(letterNumber))) {
   return true;
  }
else{ 
   alert("Introduceti numai caractere alfanumerice!"); 
   return false; 
  }
}

window.onload=function(){

    var rng=document.getElementById("inp-pret");
	rng.parentNode.insertBefore(document.createTextNode(rng.min),rng);
	rng.parentNode.appendChild(document.createTextNode(rng.max));
    let spval=document.createElement("span");
	rng.parentNode.appendChild(spval)
    rng.value=0;
    spval.innerHTML=" ("+rng.value+")";
    rng.onchange=function(){
        rng.nextSibling.nextSibling.innerHTML=" ("+this.value+")";
    }

    let btn=document.getElementById("filtrare");
    btn.onclick=function(){
        let inp=document.getElementById("inp-nume");
        let src = inp.value;
        //let alfanum = alphanumeric(src); -- nu stiu de ce nu merge
        inp=document.getElementById("inp-pret");
        let minPret=inp.value;

        ///verificam selectul
        let sel=document.getElementById("inp-livrare");
        let categorieSel=sel.value

        /// verificam radio buttons
        var comandaMinima = document.getElementById('toate').value;

        if (document.getElementById('cinci').checked){
            comandaMinima = document.getElementById('cinci').value;
        }
        if (document.getElementById('zece').checked){
            comandaMinima = document.getElementById('zece').value;
        }
        if (document.getElementById('maxim').checked){
            comandaMinima = document.getElementById('maxim').value;
        }

        ///verificam check boxes

        var checked = []
        var inputElements = document.getElementsByClassName('check');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                checked.push(inputElements[i].value);
            }
        }
        var produse=document.getElementsByClassName("produs");
        alert("Nr produse: "+produse.length);
        for (let prod of produse){
            prod.style.display="none";

            alert("produs");
            let pret= parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let conditie2= pret >= minPret;

            alert(pret + " " + minPret + " " + conditie2);

            let categorieArt= prod.getElementsByClassName("val-livrare")[0].innerHTML;
            let conditie3= (categorieArt==categorieSel || categorieSel=="toate");

            //let conditie4= (frecventa(src, prod.getElementsByClassName("val-nume")[0].innerHTML) < 2 );
           
            let conditie5 = (checked.includes(prod.getElementsByClassName("val-disp")[0].innerHTML.trim()));

            let conditieFinala=conditie2 && conditie3 && conditie5;
            if (conditieFinala)
                prod.style.display="block";
        }
    }


    function sortArticole(factor){
        
        var produse=document.getElementsByClassName("produs");
        let arrayProduse=Array.from(produse);
        arrayProduse.sort(function(art1,art2){

            let nr1 = art1.getElementsByClassName("minima")[0].innerHTML/art1.getElementsByClassName("pret")[0].innerHTML;
            let nr2 = art2.getElementsByClassName("minima")[0].innerHTML/art2.getElementsByClassName("pret")[0].innerHTML;
            return factor*nr1.localeCompare(nr2);
        
        });
        console.log(arrayProduse); 
        for (let prod of arrayProduse){
            prod.parentNode.appendChild(prod);
        }
    }

    btn=document.getElementById("sortCresc");
    btn.onclick=function(){
        sortArticole(1);
    }
    btn=document.getElementById("sortDescresc");
    btn.onclick=function(){
        sortArticole(-1);
    }

    btn=document.getElementById("resetare");
    btn.onclick=function(){
        
        var produse=document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="block";
        }
    }


    btn = document.getElementById("pretmaxim");
    btn.onclick = function(){
            var produse=document.getElementsByClassName("produs");
            let maxim = 0;
            for (let prod of produse){
                maxim = Math.max(maxim,parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML));
            }
            let infoSuma=document.createElement("p");//<p></p>
            infoSuma.innerHTML="Maximul: "+maxim;//<p>...</p>
            infoSuma.className="info-produse";
            let p=document.getElementById("p-suma")
            p.parentNode.insertBefore(infoSuma,p.nextSibling);
            setTimeout(function(){infoSuma.remove()}, 2000);
        }
    }

