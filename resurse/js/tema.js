window.addEventListener("DOMContentLoaded",function(){
    //window.addEventListener("load",function(){
        let temaSelectata=localStorage.getItem("tema")
        if(temaSelectata=="dark"){
            document.body.classList.add("dark")
            document.getElementById("sch-tema").checked = true;
        }
        var btn=document.getElementById("sch-tema");
        if (btn){
            btn.onclick=function(){
                document.body.classList.toggle("dark");
                if (document.body.classList.contains("dark"))
                    localStorage.setItem("tema","dark")
                else
                    localStorage.setItem("tema","light")
            }
        }
    });