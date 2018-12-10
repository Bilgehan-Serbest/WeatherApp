const express = require('express');
var http = require('http');
var dateFormat = require('dateformat');
var cors = require('cors');
var fs = require('fs');
let bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.get('/', function(req, res){
    res.send("Connection Established");
})

var istenensehirAdi;

app.post('/', function(req, res){
    istenenverituru = req.body.VeriTuru;
    istenensehirAdi= req.body.sehirAdi;   

    var url = "mongodb://admin:password@188.166.42.235:31460";
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbo = db.db("weatherdatabase");
        if(istenenverituru === "Gunluk"){            
            colname = "weatherdata";
            var query = {City: istenensehirAdi};
            dbo.collection(colname).find(query).toArray(function(err, result){                
                let sehirHavaDurumu = {
                    sehirAdi: result[0].City,
                    sehirSicaklik: result[0].Temp,
                    sehirBasinc: result[0].Pressure,
                    sehirNem: result[0].Humidity
                };
                res.end(JSON.stringify(sehirHavaDurumu));
                console.log(sehirHavaDurumu.sehirAdi + " " + sehirHavaDurumu.sehirSicaklik + " " + sehirHavaDurumu.sehirBasinc + " " + sehirHavaDurumu.sehirNem);
                db.close();
            })
        }
        else if(istenenverituru === "Gecmis"){
            var baslangicTarih = new Date(req.body.BaslangicTarih);
            baslangicTarih = dateFormat(baslangicTarih, "yy-mm-dd");
            var bitisTarih = new Date(req.body.BitisTarih);
            bitisTarih = dateFormat(bitisTarih, "yy-mm-dd");            
            colname = "historicalweatherdata";
            var query = {NAME: istenensehirAdi};
            var gecmisKayitlar = [];            
            console.log(baslangicTarih);
            console.log(bitisTarih);
            dbo.collection(colname).find(query).toArray(function(err, result){
                for(i = 0; i<result.length; i++){                                        
                    var tempTarih = dateFormat(result[i].DATE, "yy-mm-dd");                    
                    if(tempTarih >= baslangicTarih && tempTarih <= bitisTarih){                        
                        let sehirkaydi = {
                            sehirAdi: result[i].NAME,
                            sehirTarih: tempTarih,
                            sehirOrtSicaklik: result[i].TAVG,
                            sehirMaxSicaklik: result[i].TMAX,
                            sehirMinSicaklik: result[i].TMIN
                        };
                        console.log(sehirkaydi.sehirAdi + " " + sehirkaydi.sehirTarih + " " + sehirkaydi.sehirOrtSicaklik + " " + sehirkaydi.sehirMaxSicaklik + " " +sehirkaydi.sehirMinSicaklik);
                        gecmisKayitlar.push(sehirkaydi);                              
                    }                    
                }
                var jsonresponse = {kayitlar: gecmisKayitlar}                
                res.end(JSON.stringify(jsonresponse));              
                db.close();
            })
        }
    });
})

var server = app.listen(57000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at ", port);
})



