const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const sharp =require('sharp');
const { Client} = require('pg');
const url = require('url');
const { request } = require('http');
const reqIp = require('@supercharge/request-ip');
const { exec } = require('child_process');

var app = express();

const client = new Client({
    host: 'localhost',
    user: 'alex',
    password: 'alex',
    database: 'db',
    port:5432
})
client.connect()

app.set("view engine", "ejs");
app.get("*/galerie.json", function(req,res){
    res.status(403).render("pagini/403");
});
app.use("/resurse", express.static(__dirname + "/resurse"));
var nrImagini = Math.floor(Math.random() * 6 + 5);

function checkImages(){
    var nrImag = 0;
    var textFile = fs.readFileSync("resurse/json/galerie.json");
    var jsi = JSON.parse(textFile);
    var galleryPath = jsi.cale_galerie;
    let vectImages = []
    var data = new Date();
    var quarter = 1;
    var minutes = data.getMinutes();
    if(minutes > 15 && minutes <=  30){
        quarter = 2;
    }
    else if(minutes > 30 && minutes <= 45){
            quarter = 3;
         }
         else quarter = 4;
    for(let im of jsi.imagini){
        if(im.sfert_ora == quarter){
            var imLarge = path.join(galleryPath, im.cale_imagine);
            var ext = path.extname(im.cale_imagine);
            var fileName = path.basename(im.cale_imagine, ext);
            let imSmall = path.join(galleryPath + "/mic/", fileName + "-mic"+".webp");
            vectImages.push({mare:imLarge, mic:imSmall, descriere: im.descriere, titlu:im.titlu, class:"normal"});
            if (!fs.existsSync(imSmall)){
		    sharp(imLarge)
            .resize(150)
            .toFile(imSmall, function(err) {
                if(err)
                    console.log("eroare conversie",imLarge, "->", imSmall, err);
             });
            }
            nrImag++;
            if( nrImag == 4  || nrImag == 7){
                vectImages.push({mare:imLarge, mic:imSmall, descriere: im.descriere, titlu:im.titlu, class:"ascuns"});
                nrImag++;
            }
            if(vectImages.length >= 12)
                break;
        }
    }
    return vectImages;
}

function galleryImages(){
    var textFile = fs.readFileSync("resurse/json/galerie.json");
    var jsi = JSON.parse(textFile);
    var galleryPath = jsi.cale_galerie;
    nrImagini = nrImagini + 1-(nrImagini%2);
    let vectImages = []
    for(let im of jsi.imagini){
        var imLarge = path.join(galleryPath, im.cale_imagine);
        if(vectImages.filter( x => x.titlu === im.titlu) == false)
            vectImages.push({mare: imLarge, descriere: im.descriere, titlu:im.titlu})
    }
    return vectImages;
}

app.get(["/", "/index"], function(req, res){

    res.render("pagini/index", {ip: reqIp.getClientIp(req), imagini: checkImages(), animata: galleryImages()});
});

app.get("/galerie", function(req,res){
    res.render("pagini/galerie", {imagini: checkImages()});
})

app.get("/produse", function(req,res){
    let cond = req.query.tip ? " and tip_produs='" + req.query.tip + "'" : "";
    let sqlQuery = "select id, nume, pret, um, descriere, categorie, data_adaugare, imagine, min_order, livrare, tip_produs from produse where 1=1" + cond;
    console.log(sqlQuery);
    client.query(sqlQuery, function(err,rez){
        console.log(err, rez);
        client.query("select unnest(enum_range( null::categ_produs)) as categ", function(err,rezCateg){//selectez toate valorile posibile din enum-ul categ_prajitura
            console.log(rezCateg);
            res.render("pagini/produse", {produse:rez.rows, categorii:rezCateg.rows});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
            });
        
       
    });

    
});

app.get("/produs/:id_prod", function(req,res){
    console.log(res.params);
    const rez = client.query("select * from produse where id ="+req.params.id_prod, function(err, rez){
        console.log(rez.rows);
        res.render("pagini/produs", {prod:rez.rows[0]});
    });
});

app.get("*/galerie-animata.css", function(req,res){
    res.setHeader("Content-Type","text/css");
    var procent = 100/nrImagini;
    var procent2 = 100 - procent;
    let sirScss=fs.readFileSync("./resurse/scss/galerie-animata.scss").toString("utf-8");
    let rezScss = ejs.render(sirScss, {nrImagini: nrImagini, procent: procent, procentRevenire: procent2});
    console.log(rezScss);
    fs.writeFileSync("./temp/galerie-animata.scss", rezScss);
    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });
});

app.get('/favicon.ico' , function(req , res){/*code*/});

app.get("/*",function(req, res){    
    console.log(req.url);
    res.render("pagini"+req.url, function(err,rezultatRandare){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                res.status(404).render("pagini/404");
            }
            else 
                throw err;
        }
        else{
            res.send(rezultatRandare);
        }
    });
});

app.listen(8081);
console.log("server pornit");