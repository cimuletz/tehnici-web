function frecventa(string1, string2){
    if(!string1)
        return 0;
    var ct = {};
    var ct1 = {};
    for(var i = 0; i<string1.length; ++i){
        var char = string1.charAt(i);
        if( ct[char] ){
            ct[char]++;
        }
        else{
            ct[char] = 1;
        }
        char = string2.charAt(i);
        if(ct1[char]){
            ct[char]++;
        }
        else{
            ct1[char] = 1;
        }
    }
    var ct2 = Object.values(ct);
    var ct3 = Object.values(ct1);
    var dif = 0;
    
    for( var key in ct ){
      if(key in ct1){
        dif += Math.abs(ct1[key] - ct[key]);
      }
      else{
        dif += ct[key];
      }
    }
    //Array.prototype.forEach.call(ct, char => console.log(ct1[char]));
    return dif;
}

function alphanumeric(str) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

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
        let alfanum = alphanumeric(src);
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
        if(alfanum == true){
            for (let prod of produse){
                prod.style.display="none";

                let pret= parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
                let conditie2= pret >= minPret;

                let categorieArt= prod.getElementsByClassName("val-livrare")[0].innerHTML;
                let conditie3= (categorieArt==categorieSel || categorieSel=="toate");

                let conditie4= (frecventa(src, prod.getElementsByClassName("val-nume")[0].innerHTML) < 2 );

                let conditie5 = (checked.includes(prod.getElementsByClassName("val-disp")[0].innerHTML.trim()));

                let conditieFinala=conditie2 && conditie3 && conditie4 && conditie5;
                if (conditieFinala)
                    prod.style.display="block";
            }
        }
        else{
            alert("Introduceti numai caractere alfanumerice!");
        }
    }


    function sortArticole(factor){
        var produse=document.getElementsByClassName("produs");
        let arrayProduse=Array.from(produse);
        arrayProduse.sort(function(art1,art2){
            let nr1 = art1.getElementsByClassName("val-minima")[0].innerHTML/art1.getElementsByClassName("val-pret")[0].innerHTML;
            let nr2 = art2.getElementsByClassName("val-minima")[0].innerHTML/art2.getElementsByClassName("val-pret")[0].innerHTML;
            return factor*(nr1 - nr2);
        
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
                maxim = Math.max(maxim,parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML));
            }
            let infoSuma=document.createElement("p");//<p></p>
            infoSuma.innerHTML="Maximul: "+maxim;//<p>...</p>
            infoSuma.className="info-produse";
            let p=document.getElementById("infoMaxim")
            p.parentNode.insertBefore(infoSuma,p.nextSibling);
            setTimeout(function(){infoSuma.remove()}, 2000);
        }
}

