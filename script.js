/*
============================================================
 Mini Engine Simulator
 Version : v0.0.5
 Fichier : script.js
============================================================
*/



const GAME_VERSION = "v0.0.5";



/* =========================
        VEHICULE
========================= */


let vehicleData;



const vehicle = {


    speed:0,


    gear:0,


    brake:false


};





/* =========================
        ELEMENTS
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



const gasButton =
document.getElementById("gasButton");


const brakeButton =
document.getElementById("brakeButton");



const gearUpButton =
document.getElementById("gearUp");


const gearDownButton =
document.getElementById("gearDown");



const settingsButton =
document.getElementById("settingsButton");


const settingsPanel =
document.getElementById("settingsPanel");



const closeSettings =
document.getElementById("closeSettings");



const vehicleInfo =
document.getElementById("vehicleInfo");



const applySettings =
document.getElementById("applySettings");



const massInput =
document.getElementById("massInput");


const powerInput =
document.getElementById("powerInput");


const torqueInput =
document.getElementById("torqueInput");


const idleRPMInput =
document.getElementById("idleRPMInput");


const maxRPMInput =
document.getElementById("maxRPMInput");





versionDisplay.textContent =
GAME_VERSION;






/* =========================
        CHARGEMENT VEHICULE
========================= */


async function loadVehicle(){


    const response =

    await fetch(
        "./vehicles/default.json"
    );


    vehicleData =

    await response.json();



 engine.rpm = vehicleData.engine.idleRPM;
engine.throttle = 0;
engine.targetThrottle = 0;



    loadSettings();



    displayVehicle();



    requestAnimationFrame(loop);



}







function displayVehicle(){


    vehicleInfo.innerHTML = `


<b>${vehicleData.name}</b>
<br><br>

Type :
${vehicleData.type}

<br>

Masse :
${vehicleData.mass} kg

<br><br>

Puissance :
${vehicleData.engine.powerHP} ch

<br>

Couple :
${vehicleData.engine.maxTorqueNm} Nm


`;



}





function loadSettings(){


massInput.value =
vehicleData.mass;


powerInput.value =
vehicleData.engine.powerHP;


torqueInput.value =
vehicleData.engine.maxTorqueNm;


idleRPMInput.value =
vehicleData.engine.idleRPM;


maxRPMInput.value =
vehicleData.engine.maxRPM;


}








/* =========================
        PARAMETRES
========================= */


settingsButton.onclick = ()=>{

settingsPanel.style.display="flex";

};



closeSettings.onclick = ()=>{

settingsPanel.style.display="none";

};





applySettings.onclick = ()=>{


vehicleData.mass =

Number(
massInput.value
);



vehicleData.engine.powerHP =

Number(
powerInput.value
);



vehicleData.engine.maxTorqueNm =

Number(
torqueInput.value
);



vehicleData.engine.idleRPM =

Number(
idleRPMInput.value
);



vehicleData.engine.maxRPM =

Number(
maxRPMInput.value
);



displayVehicle();



};







/* =========================
        COMMANDES
========================= */


gasButton.onpointerdown = ()=>{


setThrottle(1);


};



gasButton.onpointerup = ()=>{


setThrottle(0);


};





brakeButton.onpointerdown = ()=>{


vehicle.brake=true;


};



brakeButton.onpointerup = ()=>{


vehicle.brake=false;


};







gearUpButton.onclick = ()=>{


if(

vehicle.gear <

vehicleData.transmission.gears.length

){


vehicle.gear++;


}


};





gearDownButton.onclick = ()=>{


if(vehicle.gear>0){


vehicle.gear--;


}


};








/* =========================
        VITESSE SIMPLE
        (sera remplacée v0.0.6)
========================= */


function updateSpeed(dt){



if(vehicle.gear===0){


vehicle.speed -=

10*dt;


}


else{


let ratio =

vehicleData.transmission.gears

[vehicle.gear-1];




let engineForce =

engine.torque *

engine.throttle;



let ratioForce =

engineForce /

ratio;



vehicle.speed +=


ratioForce *

0.00005 *

dt;



}



if(vehicle.brake){


vehicle.speed -=

100 *

dt;


}



vehicle.speed = Math.max(

0,

vehicle.speed

);



}








/* =========================
        CADRANS
========================= */


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

(

Math.PI*1.5 *

Math.min(

value/max,

1

)

);



ctx.beginPath();


ctx.moveTo(

cx,

cy

);



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

ctx.font="bold 28px Arial";

ctx.textAlign="center";


ctx.fillText(

Math.floor(value),

cx,

cy+60

);



}










/* =========================
        BOUCLE
========================= */


let lastTime =

performance.now();





function loop(time){



let dt =

(time-lastTime)

/1000;



lastTime=time;





updateEngine(dt);
console.log(
"RPM:",
Math.round(engine.rpm),
"Gaz:",
engine.throttle.toFixed(2),
"Couple:",
Math.round(engine.torque)
);


updateSpeed(dt);





gearDisplay.textContent =


vehicle.gear===0

?

"N"

:

vehicle.gear;





drawGauge(

speedCtx,

vehicle.speed,

300

);



drawGauge(

rpmCtx,

engine.rpm,

vehicleData.engine.maxRPM

);



requestAnimationFrame(loop);



}







loadVehicle();
