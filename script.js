/*
============================================================
 Mini Engine Simulator
 Version : v0.0.2
 Fichier : script.js
============================================================
*/


console.log("Mini Engine Simulator v0.0.2");



let vehicleData;



const vehicle = {

    speed:0,

    rpm:0,

    gear:0,

    throttle:false,

    brake:false

};



/* ==========================================================
   ELEMENTS HTML
========================================================== */


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



const gasButton =
document.getElementById("gasButton");


const brakeButton =
document.getElementById("brakeButton");


const gearUpButton =
document.getElementById("gearUp");


const gearDownButton =
document.getElementById("gearDown");



/* ==========================================================
   CHARGEMENT VEHICULE
========================================================== */


async function loadVehicle(){


    const response = await fetch(

        "vehicles/default.json"

    );


    vehicleData = await response.json();



    vehicle.rpm =

    vehicleData.engine.idleRPM;



    console.log(

        "Véhicule chargé :",

        vehicleData.name

    );


    startSimulation();


}



/* ==========================================================
   BOITE
========================================================== */


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


    if(vehicle.gear>0){


        vehicle.gear--;

    }


}



/* ==========================================================
   COMMANDES
========================================================== */


gasButton.addEventListener(

"pointerdown",

()=>vehicle.throttle=true

);


gasButton.addEventListener(

"pointerup",

()=>vehicle.throttle=false

);


gasButton.addEventListener(

"pointerleave",

()=>vehicle.throttle=false

);



brakeButton.addEventListener(

"pointerdown",

()=>vehicle.brake=true

);


brakeButton.addEventListener(

"pointerup",

()=>vehicle.brake=false

);


brakeButton.addEventListener(

"pointerleave",

()=>vehicle.brake=false

);



gearUpButton.onclick = gearUp;

gearDownButton.onclick = gearDown;



/* ==========================================================
   PHYSIQUE MOTEUR
========================================================== */


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



/* ==========================================================
   VITESSE
========================================================== */


function updateSpeed(dt){


    if(vehicle.gear===0){


        vehicle.speed -=

        15*dt;


    }

    else{


        let ratio =

        vehicleData

        .transmission

        .gears[vehicle.gear-1];



        let target =


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

        120*dt;


    }



    vehicle.speed = Math.max(

        0,

        vehicle.speed

    );

}



/* ==========================================================
   AFFICHAGE CADRANS
========================================================== */


function drawGauge(ctx,value,max){


    let cx =
    ctx.canvas.width/2;


    let cy =
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



    let angle =

    -Math.PI*0.75

    +

    Math.PI*1.5*

    Math.min(

        value/max,

        1

    );



    ctx.beginPath();


    ctx.moveTo(cx,cy);


    ctx.lineTo(

        cx+

        Math.cos(angle)*90,

        cy+

        Math.sin(angle)*90

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



/* ==========================================================
   BOUCLE
========================================================== */


let lastTime;



function startSimulation(){


    lastTime = performance.now();


    requestAnimationFrame(loop);


}



function loop(time){


    let dt =

    (

        time-lastTime

    )/1000;


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
