/*
============================================================
 Mini Engine Simulator
 Debug v0.0.1
============================================================
*/

window.onerror = function(message, source, line){

    let debug = document.getElementById("debug");

    if(debug){

        debug.innerHTML =
        "Erreur JS : " + message +
        "<br>Ligne : " + line;

    }

};


console.log("Mini Engine Simulator JS chargé");

/*
============================================================
 Mini Engine Simulator
 Version : v0.0.1
 Fichier : script.js
 Partie : 1 / 3
============================================================
*/


/* ==========================================================
    ETAT GLOBAL DU SIMULATEUR
========================================================== */

console.log("SCRIPT OK v0.0.1");

const simulator = {

    version: "v0.0.1",

    running: true,

    speed: 0,

    rpm: 1300,

    idleRPM: 1300,

    maxRPM: 14000,

    redlineRPM: 12000,

    gear: 0,

    maxGear: 6,

    throttle: false,

    brake: false,

    sound: false,

    deltaTime: 0,

    lastFrame: performance.now()

};


/* ==========================================================
    RAPPORTS DE BOITE
========================================================== */

const gearRatio = [

    0.00, // N

    2.80,

    2.05,

    1.70,

    1.45,

    1.28,

    1.10

];


/* ==========================================================
    CANVAS
========================================================== */

const speedCanvas = document.getElementById("speedGauge");

const rpmCanvas = document.getElementById("rpmGauge");

const speedCtx = speedCanvas.getContext("2d");

const rpmCtx = rpmCanvas.getContext("2d");


/* ==========================================================
    INTERFACE
========================================================== */

const gearDisplay = document.getElementById("gearDisplay");

const gasButton = document.getElementById("gasButton");

const brakeButton = document.getElementById("brakeButton");

const gearUpButton = document.getElementById("gearUp");

const gearDownButton = document.getElementById("gearDown");

const soundButton = document.getElementById("soundButton");


/* ==========================================================
    OUTILS
========================================================== */

function clamp(value, min, max){

    return Math.max(min, Math.min(max, value));

}


/* ==========================================================
    AFFICHAGE RAPPORT
========================================================== */

function updateGearDisplay(){

    if(simulator.gear === 0){

        gearDisplay.textContent = "N";

    }

    else{

        gearDisplay.textContent = simulator.gear;

    }

}


/* ==========================================================
    CHANGEMENT DE RAPPORT
========================================================== */

function gearUp(){

    if(simulator.gear < simulator.maxGear){

        simulator.gear++;

        updateGearDisplay();

    }

}

function gearDown(){

    if(simulator.gear > 0){

        simulator.gear--;

        updateGearDisplay();

    }

}


/* ==========================================================
    CONTROLES TACTILES
========================================================== */

gasButton.addEventListener("pointerdown", () => {

    simulator.throttle = true;

});

gasButton.addEventListener("pointerup", () => {

    simulator.throttle = false;

});

gasButton.addEventListener("pointerleave", () => {

    simulator.throttle = false;

});


brakeButton.addEventListener("pointerdown", () => {

    simulator.brake = true;

});

brakeButton.addEventListener("pointerup", () => {

    simulator.brake = false;

});

brakeButton.addEventListener("pointerleave", () => {

    simulator.brake = false;

});


gearUpButton.addEventListener("click", gearUp);

gearDownButton.addEventListener("click", gearDown);


/* ==========================================================
    CONTROLES CLAVIER
========================================================== */

document.addEventListener("keydown", (event)=>{

    switch(event.code){

        case "ArrowUp":
            simulator.throttle = true;
            break;

        case "ArrowDown":
            simulator.brake = true;
            break;

        case "KeyE":
            gearUp();
            break;

        case "KeyA":
            gearDown();
            break;

    }

});


document.addEventListener("keyup", (event)=>{

    switch(event.code){

        case "ArrowUp":
            simulator.throttle = false;
            break;

        case "ArrowDown":
            simulator.brake = false;
            break;

    }

});


/* ==========================================================
    INITIALISATION
========================================================== */

updateGearDisplay();

console.log("Mini Engine Simulator", simulator.version);

/*
============================================================
 Mini Engine Simulator
 Version : v0.0.1
 Fichier : script.js
 Partie : 2 / 3
============================================================
*/


/* ==========================================================
    MOTEUR
========================================================== */

function updateEngine(delta){


    /* -----------------------------
       Accélération
    ----------------------------- */

    if(simulator.throttle){

        simulator.rpm += 7200 * delta;

    }

    else{

        simulator.rpm -= 4200 * delta;

    }


    /* -----------------------------
       Ralenti
    ----------------------------- */

    if(simulator.rpm < simulator.idleRPM){

        simulator.rpm = simulator.idleRPM;

    }


    /* -----------------------------
       Rupteur
    ----------------------------- */

    if(simulator.rpm > simulator.maxRPM){

        simulator.rpm = simulator.maxRPM;

    }

}


/* ==========================================================
    CALCUL VITESSE
========================================================== */

function updateSpeed(delta){

    if(simulator.gear === 0){

        simulator.speed *= 0.992;

    }

    else{

        const ratio = gearRatio[simulator.gear];

        const targetSpeed =

            (simulator.rpm / simulator.maxRPM)

            *

            ((70 * simulator.gear) / ratio);


        simulator.speed +=

            (targetSpeed - simulator.speed)

            * 2.6

            * delta;

    }


    /* -----------------------------
       Frein
    ----------------------------- */

    if(simulator.brake){

        simulator.speed -= 90 * delta;

    }


    if(simulator.speed < 0){

        simulator.speed = 0;

    }

}


/* ==========================================================
    MISE A JOUR INTERFACE
========================================================== */

function updateDashboard(){

    gearDisplay.textContent =

        simulator.gear === 0

        ? "N"

        : simulator.gear;

}


/* ==========================================================
    BOUCLE PRINCIPALE
========================================================== */

function gameLoop(time){

    simulator.deltaTime =

        (time - simulator.lastFrame)

        / 1000;


    simulator.lastFrame = time;


    updateEngine(simulator.deltaTime);

    updateSpeed(simulator.deltaTime);

    updateDashboard();


    requestAnimationFrame(gameLoop);

}


requestAnimationFrame(gameLoop);

/*
============================================================
 Mini Engine Simulator
 Version : v0.0.1
 Fichier : script.js
 Partie : 3 / 3
============================================================
*/


/* ==========================================================
    OUTILS CANVAS
========================================================== */

function drawGaugeBackground(ctx, maxValue, redZone){

    const width = ctx.canvas.width;

    const height = ctx.canvas.height;

    const centerX = width / 2;

    const centerY = height / 2;

    const radius = 120;


    ctx.clearRect(0,0,width,height);


    /* Cercle extérieur */

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#ff7a00";

    ctx.lineWidth = 8;

    ctx.stroke();



    /* Graduations */

    for(let i = 0; i <= 10; i++){

        const angle =

            Math.PI * 0.75

            +

            (Math.PI * 1.5 * i / 10);


        const startX =

            centerX +

            Math.cos(angle) * 95;


        const startY =

            centerY +

            Math.sin(angle) * 95;


        const endX =

            centerX +

            Math.cos(angle) * 112;


        const endY =

            centerY +

            Math.sin(angle) * 112;


        ctx.beginPath();

        ctx.moveTo(startX,startY);

        ctx.lineTo(endX,endY);

        ctx.strokeStyle="#ffffff";

        ctx.lineWidth=3;

        ctx.stroke();

    }


    /* Zone rouge RPM */

    if(redZone){

        ctx.beginPath();

        ctx.arc(

            centerX,

            centerY,

            radius,

            Math.PI * 0.75 +

            (Math.PI * 1.5 * 0.85),

            Math.PI * 2.25

        );

        ctx.strokeStyle="#ff0000";

        ctx.lineWidth=8;

        ctx.stroke();

    }

}



/* ==========================================================
    AIGUILLE
========================================================== */

function drawNeedle(ctx,value,maxValue){


    const width = ctx.canvas.width;

    const height = ctx.canvas.height;


    const centerX = width / 2;

    const centerY = height / 2;


    const angle =

        Math.PI * 0.75

        +

        (

            Math.PI * 1.5 *

            clamp(value / maxValue,0,1)

        );


    const length = 95;


    const x =

        centerX +

        Math.cos(angle) * length;


    const y =

        centerY +

        Math.sin(angle) * length;



    ctx.beginPath();

    ctx.moveTo(centerX,centerY);

    ctx.lineTo(x,y);

    ctx.strokeStyle="#ffffff";

    ctx.lineWidth=4;

    ctx.stroke();



    /* Centre aiguille */

    ctx.beginPath();

    ctx.arc(

        centerX,

        centerY,

        8,

        0,

        Math.PI*2

    );

    ctx.fillStyle="#ffffff";

    ctx.fill();

}



/* ==========================================================
    TEXTE DIGITAL
========================================================== */

function drawDigitalValue(ctx,value,label){


    const centerX = ctx.canvas.width/2;

    const centerY = ctx.canvas.height/2 + 55;


    ctx.font="bold 38px Arial";

    ctx.textAlign="center";

    ctx.fillStyle="#ffffff";


    ctx.fillText(

        Math.floor(value),

        centerX,

        centerY

    );

}



/* ==========================================================
    AFFICHAGE COMPLET
========================================================== */

function drawDashboard(){


    /* Vitesse
