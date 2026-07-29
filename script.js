/*
============================================================
 Mini Engine Simulator
 Version : v0.0.5B
 Fichier : script.js
============================================================
*/


/* =========================
        VERSION
========================= */


const GAME_VERSION = "v0.0.5B";


console.log(
    "Mini Engine Simulator",
    GAME_VERSION
);




/* =========================
        VEHICULE
========================= */


let vehicleData;



const vehicle = {


    speed:0,


    gear:0,


    brake:false,


    engine:{


        rpm:0,


        throttle:0,


        targetThrottle:0,


        torque:0


    }


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


const applySettings =
document.getElementById("applySettings");



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


versionDisplay.textContent =
GAME_VERSION;







/* =========================
        CHARGEMENT VEHICULE
========================= */


async function loadVehicle(){


    try{


        const response =

        await fetch(
            "./vehicles/default.json"
        );



        vehicleData =

        await response.json();





        vehicle.engine.rpm =

        vehicleData.engine.idleRPM;



        loadInputs();


        displayVehicleInfo();



        startSimulation();




        console.log(

            "Véhicule chargé :",

            vehicleData.name

        );



    }



    catch(error){


        console.error(

            "Erreur chargement véhicule",

            error

        );


    }



}









/* =========================
        AFFICHAGE VEHICULE
========================= */


function displayVehicleInfo(){



    vehicleInfo.innerHTML = `



    <b>Nom :</b>
    ${vehicleData.name}

    <br>


    <b>Type :</b>
    ${vehicleData.type}

    <br>


    <b>Masse :</b>
    ${vehicleData.mass} kg

    <br><br>



    <b>Moteur</b>

    <br>


    Puissance :
    ${vehicleData.engine.power} ch

    <br>


    Couple :
    ${vehicleData.engine.torque} Nm

    <br>


    Ralenti :
    ${vehicleData.engine.idleRPM} tr/min

    <br>


    Régime max :
    ${vehicleData.engine.maxRPM} tr/min



    `;


}








/* =========================
        INPUTS
========================= */


function loadInputs(){



    massInput.value =

    vehicleData.mass;



    powerInput.value =

    vehicleData.engine.power;



    torqueInput.value =

    vehicleData.engine.torque;



    idleRPMInput.value =

    vehicleData.engine.idleRPM;



    maxRPMInput.value =

    vehicleData.engine.maxRPM;



}








/* =========================
        APPLICATION PARAMETRES
========================= */


applySettings.onclick = ()=>{



    vehicleData.mass =

    Number(
        massInput.value
    );



    vehicleData.engine.power =

    Number(
        powerInput.value
    );



    vehicleData.engine.torque =

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





    vehicle.engine.rpm =

    vehicleData.engine.idleRPM;



    displayVehicleInfo();



    console.log(

        "Paramètres appliqués",

        vehicleData

    );



};







/* =========================
        MENU PARAMETRES
========================= */


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


    vehicle.engine.targetThrottle = 1;


};



gasButton.onpointerup = ()=>{


    vehicle.engine.targetThrottle = 0;


};



gasButton.onpointerleave = ()=>{


    vehicle.engine.targetThrottle = 0;


};





brakeButton.onpointerdown = ()=>{


    vehicle.brake = true;


};



brakeButton.onpointerup = ()=>{


    vehicle.brake = false;


};






gearUpButton.onclick = gearUp;


gearDownButton.onclick = gearDown;







/* =========================
        MOTEUR v0.0.5B
========================= */



function updateThrottle(dt){



    const response = 5;



    vehicle.engine.throttle +=



    (

        vehicle.engine.targetThrottle

        -

        vehicle.engine.throttle

    )

    *

    response

    *

    dt;




    vehicle.engine.throttle = Math.max(

        0,

        Math.min(

            1,

            vehicle.engine.throttle

        )

    );



}









function getEngineTorque(){



    let rpm =

    vehicle.engine.rpm;



    let maxRPM =

    vehicleData.engine.maxRPM;



    let torque =

    vehicleData.engine.torque;





    /*
    Perte de couple proche rupteur
    */


    let rpmFactor =



    1 -

    (

        rpm /

        maxRPM

    );





    rpmFactor = Math.max(

        0.35,

        rpmFactor + 0.35

    );





    return torque * rpmFactor;



}








function updateEngine(dt){



    updateThrottle(dt);




    let torque =

    getEngineTorque();




    vehicle.engine.torque = torque;





    /*
    Accélération moteur

    dépend du couple
    et de l'ouverture gaz

    */


    let driveTorque =


    torque *

    vehicle.engine.throttle;






    /*
    Résistance interne moteur
    */


    let friction =



    25 +

    (

        vehicle.engine.rpm *

        0.002

    );






    let netTorque =



    driveTorque

    -

    friction;







    /*
    Inertie moteur

    */


    let inertia = 0.18;





    let rpmChange =



    (

        netTorque /

        inertia

    )

    *

    dt

    *

    8;






    vehicle.engine.rpm += rpmChange;








    /*
    Frein moteur

    */


    if(

        vehicle.engine.throttle < 0.01

    ){



        vehicle.engine.rpm -=

        2500 *

        dt;



    }







    /*
    Limites

    */


    vehicle.engine.rpm = Math.max(


        vehicleData.engine.idleRPM,


        Math.min(

            vehicle.engine.rpm,

            vehicleData.engine.maxRPM

        )


    );





}










/* =========================
        VITESSE
========================= */



function updateSpeed(dt){



    if(vehicle.gear === 0){



        vehicle.speed -=

        8 *

        dt;



    }


    else{



        let ratio =



        vehicleData

        .transmission

        .gears[vehicle.gear-1];






        let rpmRatio =



        vehicle.engine.rpm /

        vehicleData.engine.maxRPM;






        let targetSpeed =



        rpmRatio *

        (

            300 /

            ratio

        )

        *

        (

            200 /

            vehicleData.mass

        );







        vehicle.speed +=



        (

            targetSpeed

            -

            vehicle.speed

        )

        *

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




    ctx.strokeStyle = "#ff7a00";


    ctx.lineWidth = 8;


    ctx.stroke();







    const angle =



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










/* =========================
        BOUCLE SIMULATION
========================= */



let lastTime;





function startSimulation(){



    lastTime =

    performance.now();



    requestAnimationFrame(loop);



}







function loop(time){



    const dt =



    (

        time -

        lastTime

    )

    /

    1000;





    lastTime = time;






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

        vehicle.engine.rpm,

        vehicleData.engine.maxRPM

    );






    requestAnimationFrame(loop);



}







loadVehicle();
