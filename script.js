/*
============================================================
 Mini Engine Simulator
 Version : v0.0.1c
 Fichier : script.js
============================================================
*/


console.log("Mini Engine Simulator v0.0.1c chargé");



/* ==========================================================
   PARAMETRES SIMULATEUR
========================================================== */


const vehicle = {

    speed:0,

    rpm:1300,

    idleRPM:1300,

    maxRPM:14000,

    gear:0,

    maxGear:6,

    throttle:false,

    brake:false

};



const gearbox = [

    0,

    2.8,

    2.05,

    1.65,

    1.35,

    1.15,

    1.00

];



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
   UTILITAIRES
========================================================== */


function clamp(value,min,max){

    return Math.max(min,Math.min(max,value));

}



/* ==========================================================
   RAPPORTS
========================================================== */


function updateGearDisplay(){

    if(vehicle.gear===0){

        gearDisplay.textContent="N";

    }

    else{

        gearDisplay.textContent=vehicle.gear;

    }

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
   COMMANDES TACTILES
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


document.addEventListener("keydown",(e)=>{


    if(e.code==="ArrowUp")

        vehicle.throttle=true;



    if(e.code==="ArrowDown")

        vehicle.brake=true;



    if(e.code==="KeyE")

        gearUp();



    if(e.code==="KeyA")

        gearDown();



});




document.addEventListener("keyup",(e)=>{


    if(e.code==="ArrowUp")

        vehicle.throttle=false;



    if(e.code==="ArrowDown")

        vehicle.brake=false;



});



/* ==========================================================
   PHYSIQUE MOTEUR
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
   PHYSIQUE VITESSE
========================================================== */


function updateSpeed(dt){



    if(vehicle.gear===0){


        vehicle.speed -= 20*dt;


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


        vehicle.speed -= 100*dt;


    }



    vehicle.speed = Math.max(

        0,

        vehicle.speed

    );


}



/* ==========================================================
   DESSIN CADRANS
========================================================== */


function drawGauge(ctx,value,max,label){



    const w=ctx.canvas.width;

    const h=ctx.canvas.height;


    const cx=w/2;

    const cy=h/2;


    ctx.clearRect(0,0,w,h);



    // cercle


    ctx.beginPath();

    ctx.arc(cx,cy,120,0,Math.PI*2);

    ctx.strokeStyle="#ff7a00";

    ctx.lineWidth=8;

    ctx.stroke();




    // graduations


    for(let i=0;i<=10;i++){


        let angle=

        (-Math.PI*0.75)

        +

        (

        Math.PI*1.5*i/10

        );



        let x1=cx+100*Math.cos(angle);

        let y1=cy+100*Math.sin(angle);



        let x2=cx+115*Math.cos(angle);

        let y2=cy+115*Math.sin(angle);



        ctx.beginPath();

        ctx.moveTo(x1,y1);

        ctx.lineTo(x2,y2);

        ctx.strokeStyle="white";

        ctx.lineWidth=3;

        ctx.stroke();


    }



    // aiguille


    let angle=

    (-Math.PI*0.75)

    +

    (

    Math.PI*1.5*

    clamp(value/max,0,1)

    );



    ctx.beginPath();

    ctx.moveTo(cx,cy);

    ctx.lineTo(

        cx+90*Math.cos(angle),

        cy+90*Math.sin(angle)

    );



    ctx.strokeStyle="white";

    ctx.lineWidth=4;

    ctx.stroke();



    // valeur


    ctx.fillStyle="white";

    ctx.font="bold 35px Arial";

    ctx.textAlign="center";


    ctx.fillText(

        Math.floor(value),

        cx,

        cy+55

    );

}



/* ==========================================================
   BOUCLE PRINCIPALE
========================================================== */


let lastTime=performance.now();



function loop(time){


    let dt=

    (

        time-lastTime

    )

    /

    1000;



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



    requestAnimationFrame(loop);


}



updateGearDisplay();


requestAnimationFrame(loop);
