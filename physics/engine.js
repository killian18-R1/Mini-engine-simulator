/*
============================================================
 Mini Engine Simulator
 Version : v0.0.5
 Module : Engine Physics
============================================================
*/



const engine = {


    rpm:1300,


    throttle:0,


    targetThrottle:0,


    torque:0,


    power:0,


    limiter:false


};







/*
============================================================
 Gestion accélérateur
 0 = relâché
 1 = plein gaz
============================================================
*/


function updateThrottle(dt){



    let response =

    vehicleData.engine.throttleResponse;



    engine.throttle +=

    (

        engine.targetThrottle

        -

        engine.throttle

    )

    *

    response

    *

    dt;



    engine.throttle = Math.max(

        0,

        Math.min(

            1,

            engine.throttle

        )

    );



}







/*
============================================================
 Calcul physique moteur
============================================================
*/


function updateEngine(dt){



    let rpm = engine.rpm;



    /*
    Couple disponible selon régime
    */


    let availableTorque =

    getTorque(rpm);





    /*
    Couple réellement produit

    dépend de l'ouverture papillon
    */


    let engineTorque =

    availableTorque *

    engine.throttle;





    /*
    Résistance interne moteur

    frottements mécaniques
    */


    let friction =

    vehicleData.engine.friction *

    rpm;





    /*
    Couple résultant
    */


    let netTorque =

    engineTorque

    -

    friction;







    /*
    Accélération angulaire

    Couple / inertie
    */


    let angularAcceleration =


    netTorque

    /

    vehicleData.engine.inertia;







    /*
    Conversion simplifiée

    pour obtenir une évolution RPM
    */


    engine.rpm +=


    angularAcceleration *

    0.5 *

    dt;







    /*
    Frein moteur

    si gaz fermé
    */


    if(engine.throttle < 0.01){


        engine.rpm -=


        vehicleData.engine.engineBraking

        *

        1000

        *

        dt;


    }







    /*
    Limites moteur
    */


    if(

        engine.rpm <

        vehicleData.engine.idleRPM

    ){


        engine.rpm =

        vehicleData.engine.idleRPM;


    }






    /*
    Rupteur

    */


    if(

        engine.rpm >=

        vehicleData.engine.maxRPM

    ){



        engine.rpm =

        vehicleData.engine.maxRPM;



        engine.limiter=true;



    }

    else{


        engine.limiter=false;


    }






    engine.torque =

    getTorque(engine.rpm);




    engine.power =

    getPowerHP(engine.rpm);



}






/*
============================================================
 Commande accélérateur externe
============================================================
*/


function setThrottle(value){



    engine.targetThrottle =

    Math.max(

        0,

        Math.min(

            1,

            value

        )

    );


}
