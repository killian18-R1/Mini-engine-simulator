/*
============================================================
 Mini Engine Simulator
 Version : v0.0.1d
 Fichier : script.js
============================================================
*/


console.log("Mini Engine Simulator v0.0.1d chargé");



/* ==========================================================
   DONNEES VEHICULE
========================================================== */


const vehicle = {

    speed: 0,

    rpm: 1300,

    idleRPM: 1300,

    maxRPM: 14000,

    gear: 0,

    maxGear: 6,

    throttle: false,

    brake: false

};



const gearbox = [

    0,

    2.80,

    2.05,

    1.65,

    1.35,

    1.15,

    1.00

];



/* ==========================================================
   ELEMENTS HTML
========================================================== */


const speedCanvas = document.getElementById("speedGauge");

const rpmCanvas = document.getElementById("rpmGauge");


const speedCtx = speedCanvas.getContext("2d");

const rpmCtx = rpmCanvas.getContext("2d");


const gearDisplay = document.getElementById("gearDisplay");


const gasButton = document.getElementById("gasButton");

const brakeButton = document.getElementById("brakeButton");

const gearUpButton = document.getElementById("gearUp");

const gearDownButton = document.getElementById("gearDown");



/* ==========================================================
   OUTILS
========================================================== */


function clamp(value,min,max){

    return Math.max(min,Math.min(max,value));

}



/* ==========================================================
   BOITE DE VITESSE
========================================================== */


function updateGearDisplay(){

    gearDisplay.textContent =

    vehicle.gear === 0

    ? "N"

    : vehicle.gear;

}



function gearUp(){

    if(vehicle.gear < vehicle.maxGear){

        vehicle.gear++;

        updateGearDisplay();

    }

}



function gearDown(){

    if(vehicle.gear > 0){

        vehicle.gear--;

        updateGearDisplay();

    }

}



/* ==========================================================
   COMMANDES
========================================================== */


gasButton.addEventListener("pointerdown",()=>{

    vehicle.throttle=true;

});


gasButton.addEventListener("pointerup",()=>{

    vehicle.throttle=false;

});


gasButton.addEventListener("pointerleave",()=>{

    vehicle.throttle=false;

});



brakeButton.addEventListener("pointerdown",()=>{

    vehicle.brake=true;

});


brakeButton.addEventListener("pointerup",()=>{

    vehicle.brake=false;

});


brakeButton.addEventListener("pointerleave",()=>{

    vehicle.brake=false;

});



gearUpButton.addEventListener("click",gearUp);

gearDownButton.addEventListener("click",gearDown);



/* ==========================================================
   CLAVIER PC
========================================================== */


document.addEventListener("keydown",(event)=>{


    if(event.code==="ArrowUp")

        vehicle.throttle=true;


    if(event.code==="ArrowDown")

        vehicle.brake=true;


    if(event.code==="KeyE")

        gearUp();


    if(event.code==="KeyA")

        gearDown();


});



document.addEventListener("keyup",(event)=>{


    if(event.code==="ArrowUp")

        vehicle.throttle=false;


    if(event.code==="ArrowDown")

        vehicle.brake=false;


});



/* ==========================================================
   MOTEUR
========================================================== */


function updateEngine(dt){


    if(vehicle.throttle){


        vehicle.rpm += 8000 * dt;


    }

    else{


        vehicle.rpm -= 5000 * dt;


    }



    vehicle.rpm = clamp(

        vehicle.rpm,

        vehicle.idleRPM,

        vehicle.maxRPM

    );

}



/* ==========================================================
   TRANSMISSION
========================================================== */


function updateSpeed(dt){


    if(vehicle.gear === 0){


        vehicle.speed -= 15 * dt;


    }

    else{


        const ratio = gearbox[vehicle.gear];


        const targetSpeed =

        (

            vehicle.rpm /

            vehicle.maxRPM

        )

        *

        (

            300 /

            ratio

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


        vehicle.speed -= 120 * dt;


    }



    vehicle.speed = Math.max(

        0,

        vehicle.speed

    );

}



/* ==========================================================
   CADRANS CANVAS
========================================================== */


function drawGauge(ctx,value,maxValue){


    const width = ctx.canvas.width;

    const height = ctx.canvas.height;


    const centerX = width/2;

    const centerY = height/2;


    ctx.clearRect(

        0,

        0,

        width,

        height

    );



    // cercle


    ctx.beginPath();

    ctx.arc(

        centerX,

        centerY,

        120,

        0,

        Math.PI*2

    );


    ctx.strokeStyle="#ff7a00";

    ctx.lineWidth=8;

    ctx.stroke();



    // graduations


    for(let i=0;i<=10;i++){


        let angle =

        -Math.PI*0.75

        +

        (

            Math.PI*1.5*i/10

        );



        ctx.beginPath();


        ctx.moveTo(

            centerX + Math.cos(angle)*100,

            centerY + Math.sin(angle)*100

        );


        ctx.lineTo(

            centerX + Math.cos(angle)*115,

            centerY + Math.sin(angle)*115

        );


        ctx.strokeStyle="white";

        ctx.lineWidth=3;

        ctx.stroke();


    }



    // aiguille


    let angle =

    -Math.PI*0.75

    +

    (

        Math.PI*1.5 *

        clamp(value/maxValue,0,1)

    );



    ctx.beginPath();


    ctx.moveTo(centerX,centerY);


    ctx.lineTo(

        centerX + Math.cos(angle)*90,

        centerY + Math.sin(angle)*90

    );


    ctx.strokeStyle="white";

    ctx.lineWidth=4;

    ctx.stroke();



    // valeur


    ctx.fillStyle="white";

    ctx.font="bold 32px Arial";

    ctx.textAlign="center";


    ctx.fillText(

        Math.floor(value),

        centerX,

        centerY+55

    );


}



/* ==========================================================
   BOUCLE PRINCIPALE
========================================================== */


let lastTime = performance.now();



function gameLoop(time){


    let dt =

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

        vehicle.maxRPM

    );



    requestAnimationFrame(gameLoop);

}



updateGearDisplay();


requestAnimationFrame(gameLoop);
