/*
============================================================
 Mini Engine Simulator
 Version : v0.0.2a
 Fichier : script.js
============================================================
*/


console.log("Mini Engine Simulator v0.0.2a");



/* ==========================================================
   CONFIGURATION VEHICULE DE SECOURS
========================================================== */


const defaultVehicle = {

    name:"Prototype Bike",

    type:"motorcycle",

    mass:200,

    engine:{

        power:150,

        torque:110,

        idleRPM:1300,

        maxRPM:14000

    },


    transmission:{

        gears:[

            2.80,
            2.05,
            1.65,
            1.35,
            1.15,
            1.00

        ]

    }

};



let vehicleData;



/* ==========================================================
   ETAT SIMULATEUR
========================================================== */


const vehicle = {


    speed:0,

    rpm:1300,

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


    try{


        const response = await fetch(

            "./vehicles/default.json"

        );



        if(!response.ok){

            throw new Error(

                "Impossible de charger default.json"

            );

        }



        vehicleData = await response.json();



        console.log(

            "Véhicule chargé :",

            vehicleData.name

        );


    }


    catch(error){


        console.warn(error);


        vehicleData = defaultVehicle;


        console.log(

            "Utilisation véhicule secours"

        );


    }



    vehicle.rpm =

    vehicleData.engine.idleRPM;



    startSimulation();


}



/* ==========================================================
   RAPPORTS
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


    if(vehicle.gear > 0){


        vehicle.gear--;

    }


}



/* ==========================================================
   COMMANDES
========================================================== */


gasButton.addEventListener(

"pointerdown",

()=>{

    vehicle.throttle=true;

}

);


gasButton.addEventListener(

"pointerup",

()=>{

    vehicle.throttle=false;

}

);



gasButton.addEventListener(

"pointerleave",

()=>{

    vehicle.throttle=false;

}

);



brakeButton.addEventListener(

"pointerdown",

()=>{

    vehicle.brake=true;

}

);



brakeButton.addEventListener(

"pointerup",

()=>{

    vehicle.brake=false;

}

);



brakeButton.addEventListener(

"pointerleave",

()=>{

    vehicle.brake=false;

}

);



gearUpButton.onclick = gearUp;

gearDownButton.onclick = gearDown;



/* ==========================================================
   MOTEUR
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
   TRANSMISSION
========================================================== */


function updateSpeed(dt){



    if(vehicle.gear===0){


        vehicle.speed -=

        20 * dt;


    }


    else{


        const gearRatio =

        vehicleData

        .transmission

        .gears[vehicle.gear-1];



        const targetSpeed =


        (

            vehicle.rpm /

            vehicleData.engine.maxRPM

        )

        *

        (

            300 /

            gearRatio

        );



        vehicle.speed +=


        (

            targetSpeed -

            vehicle.speed

        )

        *

        dt;


    }



    if(vehicle.brake){


        vehicle.speed -=

        120 * dt;


    }



    vehicle.speed = Math.max(

        0,

        vehicle.speed

    );


}



/* ==========================================================
   AFFICHAGE CADRANS
========================================================== */


function drawGauge(ctx,value,maxValue){



    const cx =

    ctx.canvas.width / 2;



    const cy =

    ctx.canvas.height / 2;



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

    (

        Math.PI*1.5 *

        Math.min(

            value/maxValue,

            1

        )

    );



    ctx.beginPath();


    ctx.moveTo(

        cx,

        cy

    );


    ctx.lineTo(

        cx +

        Math.cos(angle)*90,


        cy +

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
   BOUCLE SIMULATION
========================================================== */


let lastTime;



function startSimulation(){


    lastTime = performance.now();


    requestAnimationFrame(loop);


}



function loop(time){


    const dt =

    (

        time-lastTime

    ) / 1000;



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
