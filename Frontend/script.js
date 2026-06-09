function Update(){
                var CurrTime=new Date().toLocaleString();
                var timetxt= document.querySelector("#time");
                timetxt.innerHTML=CurrTime;
            }
            setInterval(Update,1000);