$(document).ready(function(){ 
    var select_gunluk = document.getElementById("selectgunluk");
    var gunluk_options = ["gunlukveriler","Adana","Adapazari","Adiyaman","Afyonkarahisar", "Agri","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin",
        "Aydin","Balikesir","Bartin","Batman","Bayburt","Bilecik","Bingol","Bitlis","Bolu","Burdur","Bursa","Canakkale","Cankırı","Corum",
        "Denizli","Diyarbakir","Duzce","Edirne","Elazig","Erzincan","Erzurum","Eskisehir","Gaziantep","Giresun","Gumushkhane","Hakkari","Antioch","Isparta",
        "Igdir","Istanbul","Izmir","Kahramanmaras","Karabuk","Karaman","Kars","Kastamonu","Kayseri","Kilis","Kirikkale","Kirklareli","Kirsehir","Kocaeli",
        "Konya","Kutahya","Malatya","Manisa","Mardin","Icel","Mugla","Mus","Nevsehir","Nigde","Ordu","Osmaniye","Rize","Samsun","Siirt",
        "Sinop","Sirnak","Sivas","Tekirdag","Tokat","Trabzon","Tunceli","Sanliurfa","Usak","Van","Yalova","Yozgat","Zonguldak"];
    for(var i=0;i<gunluk_options.length;i++){
        var opt = gunluk_options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select_gunluk.appendChild(el);
    }
    var select_gecmis = document.getElementById("selectgecmis");
    var gecmis_options=["gecmisveriler","ADAPAZARI, TU","ADIYAMAN, TU","AFYON, TU","AGRI, TU","ANKARA CENTRAL, TU","ANTALYA, TU","ARTVIN, TU",
        "AYDIN, TU","BALIKESIR, TU","BATMAN, TU","BINGOL, TU","BOLU, TU","BURSA, TU","CANAKKALE, TU","CANKIRI, TU","CORUM, TU","DENIZLI, TU",
        "DIYARBAKIR, TU","EDIRNE, TU","ELAZIG, TU","ERZINCAN, TU","ERZURUM, TU","GIRESUN, TU","GUMUSHANE, TU","HAKKARI, TU","ISPARTA, TU",
        "KAHRAMANMARAS, TU","KARS, TU","KASTAMONU, TU","KIRSEHIR, TU","KONYA, TU","KUTAHYA, TU","MALATYA BOLGE, TU","MERSIN, TU","MUGLA, TU",
        "MUS, TU","NEVSEHIR, TU","NIGDE, TU","SAMSUN, TU","SIIRT, TU","SINOP, TU","SIVAS, TU","SANLIURFA, TU","TEKIRDAG, TU","TOKAT, TU",
        "USAK, TU","VAN, TU","YOZGAT, TU","ZONGULDAK, TU"];
        for(var i=0;i<gecmis_options.length;i++){
            var opt = gecmis_options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select_gecmis.appendChild(el);
        }   
    $("#selectgecmis").hide();    
    $('#dailyWeatherTable').hide();        
    $('#historicalWeatherTable').hide();        
    var now = new Date();
    
    $("#datepickers").hide();
    $("#initday").datepicker({
        defaultDate: now,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',

        minDate: new Date('2000-01-01'),
        maxDate: now,
        onSelect: function(date){
            $("#finalday").datepicker( "option", "minDate", $("#initday").datepicker('getDate'));
            $("#finalday").datepicker( "option", "maxDate", now );
        }        
    })
    $("#finalday").datepicker({
        defaultDate: now,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',     
    })
    $("#gunluk").click(function(){
        $("#rbgunluk").attr('checked', true);
        if($("#rbgunluk").prop('checked', 'checked')){                           
            $("#selectgunluk").show();
            $("#selectgecmis").hide();
            $("#datepickers").hide(); 
        }
    });
    $("#gecmis").click(function(){
        $("#rbgecmis").attr('checked', true);
        if($("#rbgecmis").prop('checked', 'checked')){    
            $("#selectgecmis").show();
            $("#selectgunluk").hide();
            $("#datepickers").show();
        }
    });    
});
function cursorchange(){
    $('#gunluk').css({'cursor': 'default'});
    $('#gecmis').css({'cursor': 'default'});
}
function hdbul(){        
    var gunlukveritablosu = document.getElementById("dailyWeatherTable").getElementsByTagName('tbody')[0];
    var gecmisveritablosu = document.getElementById("historicalWeatherTable").getElementsByTagName('tbody')[0];
    gunlukveritablosu.innerHTML="";
    gecmisveritablosu.innerHTML=""

    if($('#selectgunluk').is(":visible")){        
        $('#historicalWeatherTable').hide();        
        $('#dailyWeatherTable').show(); 
        jsonData = {"VeriTuru": "Gunluk","sehirAdi": $("#selectgunluk").val()};        
    }
    else if($('#selectgecmis').is(":visible")){
        $('#dailyWeatherTable').hide(); 
        $('#historicalWeatherTable').show();        
        jsonData = {"VeriTuru": "Gecmis", "BaslangicTarih": $("#initday").datepicker('getDate'), "BitisTarih": $("#finalday").datepicker('getDate'), "sehirAdi": $("#selectgecmis").val()};        
    }    
  
    $.ajax({
        type: 'POST',
        url: "http://localhost:57000",  // the local Node server                
        async:true,
        data: jsonData,
        cache: false,
        success: function (result) {   
            if(jsonData.VeriTuru === "Gunluk"){
                let gunlukHavaBilgisi = JSON.parse(result);
                var row = gunlukveritablosu.insertRow(gunlukveritablosu.rows.length);                
                switch(gunlukHavaBilgisi.sehirAdi){
                    case "Antioch":
                    gunlukHavaBilgisi.sehirAdi = "Hatay"
                    break;
                    case "Icel":
                    gunlukHavaBilgisi.sehirAdi = "Mersin"
                    break;
                    case "Gumushkhane":
                    gunlukHavaBilgisi.sehirAdi = "Gümüşhane"
                    break;
                    default:
                    
                }
                row.insertCell(0).innerHTML = gunlukHavaBilgisi.sehirAdi;
                row.insertCell(1).innerHTML = gunlukHavaBilgisi.sehirSicaklik + "°C";
                row.insertCell(2).innerHTML = gunlukHavaBilgisi.sehirBasinc + "mbar" ;
                row.insertCell(3).innerHTML = "% " + gunlukHavaBilgisi.sehirNem;                    
            }
            else if(jsonData.VeriTuru === "Gecmis"){
                let gecmisHavaBilgisi = JSON.parse(result);
                for(i=0; i<gecmisHavaBilgisi.kayitlar.length; i++){
                    var row = gecmisveritablosu.insertRow(gecmisveritablosu.rows.length);
                    row.insertCell(0).innerHTML = gecmisHavaBilgisi.kayitlar[i].sehirAdi;
                    row.insertCell(1).innerHTML = gecmisHavaBilgisi.kayitlar[i].sehirTarih;
                    row.insertCell(2).innerHTML = gecmisHavaBilgisi.kayitlar[i].sehirOrtSicaklik;
                    row.insertCell(3).innerHTML = gecmisHavaBilgisi.kayitlar[i].sehirMaxSicaklik;
                    row.insertCell(4).innerHTML = gecmisHavaBilgisi.kayitlar[i].sehirMinSicaklik;
                    if(gecmisHavaBilgisi.kayitlar[i].sehirOrtSicaklik != null)
                        row.cells[2].innerHTML += "°C";
                    if(gecmisHavaBilgisi.kayitlar[i].sehirMaxSicaklik != null)
                        row.cells[3].innerHTML += "°C";
                    if(gecmisHavaBilgisi.kayitlar[i].sehirMinSicaklik != null)
                        row.cells[4].innerHTML += "°C";
                }                
            }                      
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {            
            alert(XMLHttpRequest.statusText);                       
        }
    });
}