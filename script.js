/*
============================================================
 Mini Engine Simulator
 Version : v0.0.3
 Fichier : script.js
============================================================
*/


/* =========================
        VERSION UNIQUE
========================= */


const GAME_VERSION = "v0.0.3";


console.log(
    "Mini Engine Simulator",
    GAME_VERSION
);



/* =========================
        DONNEES VEHICULE
========================= */


let vehicleData;



const vehicle = {


    speed:0,

    rpm:0,

    gear:0,

    throttle:false,

    brake:false


};



/* =========================
        ELEMENTS HTML
========================= */


const speedCanvas =
document.getElementById("speedGauge");


const rpmCanvas =
document.getElementById("rpmGauge");


const speedCtx =
speedCanvas.getContext("2d");


const rpmCtx =
rpmCanvas.getContext("2d");



const gearDisplay =
document.getElementById("gearDisplay");



const versionDisplay =
document.getElementById("version");



const settingsButton =
document.getElementById("settingsButton");


const settingsPanel =
document.getElementById("settingsPanel");


const closeSettings =
document.getElementById("closeSettings");


const vehicleInfo =
document.getElementById("vehicleInfo");



const gasButton =
document.getElementById("gasButton");


const brakeButton =
document.getElementById("brakeButton");


const gearUpButton =
document.getElementById("gearUp");


const gearDownButton =
document.getElementById("gearDown");



/* =========================
        VERSION AFFICHAGE
========================= */


versionDisplay.textContent = GAME_VERSION;



/* =========================
        CHARGEMENT VEHICULE
========================= */


async function loadVehicle(){


    try{


        const response = await fetch(
            "./vehicles/default.json"
        );


        vehicleData = await response.json();



        console.log(
            "Véhicule chargé :",
            vehicleData.name
        );


        vehicle.rpm =
        vehicleData.engine.idleRPM;



        displayVehicleInfo();



        startSimulation();


    }


    catch(error){


        console.error(
            "Erreur chargement véhicule",
            error
        );


    }


}



/* =========================
        MENU PARAMETRES
========================= */


function displayVehicleInfo(){


    vehicleInfo.innerHTML = `


    <b>Nom :</b> ${vehicleData.name}<br>

    <b>Type :</b> ${vehicleData.type}<br>

    <b>Masse :</b> ${vehicleData.mass} kg<br><br>


    <b>Moteur</b><br>

    Puissance :
    ${vehicleData.engine.power} ch<br>

    Couple :
    ${vehicleData.engine.torque} Nm<br>

    Régime ralenti :
    ${vehicleData.engine.idleRPM} tr/min<br>

    Régime maximum :
    ${vehicleData.engine.maxRPM} tr/min<br><br>


    <b>Transmission</b><br>

    Rapports :
    ${vehicleData.transmission.gears.length}

    `;


}



settingsButton.onclick = ()=>{


    settingsPanel.style.display="flex";


};



closeSettings.onclick = ()=>{


    settingsPanel.style.display="none";


};



/* =========================
        BOITE
========================= */


function updateGearDisplay(){


    gearDisplay.textContent =

    vehicle.gear === 0

    ?

    "N"

    :

    vehicle.gear;


}



function gearUp(){


    if(
        vehicle.gear <
        vehicleData.transmission.gears.length
    ){

        vehicle.gear++;

    }


}



function gearDown(){


    if(vehicle.gear > 0){


        vehicle.gear--;

    }


}



/* =========================
        COMMANDES
========================= */


gasButton.onpointerdown = ()=>{

    vehicle.throttle=true;

};


gasButton.onpointerup = ()=>{

    vehicle.throttle=false;

};



brakeButton.onpointerdown = ()=>{

    vehicle.brake=true;

};


brakeButton.onpointerup = ()=>{

    vehicle.brake=false;

};



gearUpButton.onclick = gearUp;


gearDownButton.onclick = gearDown;



/* =========================
        PHYSIQUE MOTEUR
========================= */


function updateEngine(dt){


    if(vehicle.throttle){


        vehicle.rpm +=

        8000 * dt;


    }

    else{


        vehicle.rpm -=

        5000 * dt;


    }



    vehicle.rpm = Math.max(

        vehicleData.engine.idleRPM,

        Math.min(

            vehicle.rpm,

            vehicleData.engine.maxRPM

        )

    );


}



/* =========================
        VITESSE
========================= */


function updateSpeed(dt){



    if(vehicle.gear===0){


        vehicle.speed -=

        10*dt;


    }


    else{


        const ratio =

        vehicleData

        .transmission

        .gears[vehicle.gear-1];



        const target =


        (

            vehicle.rpm /

            vehicleData.engine.maxRPM

        )

        *

        (

            300 /

            ratio

        );



        vehicle.speed +=


        (

            target -

            vehicle.speed

        )

        *

        dt;



    }



    if(vehicle.brake){


        vehicle.speed -=

        100*dt;


    }



    vehicle.speed=Math.max(

        0,

        vehicle.speed

    );


}



/* =========================
        CADRANS
========================= */


function drawGauge(ctx,value,max){


    const cx =
    ctx.canvas.width/2;


    const cy =
    ctx.canvas.height/2;



    ctx.clearRect(

        0,

        0,

        ctx.canvas.width,

        ctx.canvas.height

    );



    ctx.beginPath();


    ctx.arc(

        cx,

        cy,

        120,

        0,

        Math.PI*2

    );


    ctx.strokeStyle="#ff7a00";

    ctx.lineWidth=8;

    ctx.stroke();



    const angle =

    -Math.PI*0.75

    +

    Math.PI*1.5*

    Math.min(value/max,1);



    ctx.beginPath();


    ctx.moveTo(cx,cy);


    ctx.lineTo(

        cx+Math.cos(angle)*90,

        cy+Math.sin(angle)*90

    );


    ctx.strokeStyle="white";

    ctx.lineWidth=4;

    ctx.stroke();



    ctx.fillStyle="white";

    ctx.font="bold 32px Arial";

    ctx.textAlign="center";


    ctx.fillText(

        Math.floor(value),

        cx,

        cy+55

    );


}



/* =========================
        BOUCLE
========================= */


let lastTime;



function startSimulation(){


    lastTime =
    performance.now();


    requestAnimationFrame(loop);


}



function loop(time){


    const dt =

    (time-lastTime)/1000;



    lastTime=time;



    updateEngine(dt);

    updateSpeed(dt);



    updateGearDisplay();



    drawGauge(

        speedCtx,

        vehicle.speed,

        300

    );


    drawGauge(

        rpmCtx,

        vehicle.rpm,

        vehicleData.engine.maxRPM

    );



    requestAnimationFrame(loop);


}



loadVehicle();
