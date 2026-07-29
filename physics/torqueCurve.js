/*
============================================================
 Mini Engine Simulator
 Version : v0.0.5
 Module : Torque Curve
============================================================
*/


/*
    Courbe moteur prototype

    RPM     Couple Nm

    1300    40
    2500    58
    4000    74
    6000    92
    8000    105
    9500    110
    11000   108
    12500   101
    14000   92

*/


const torqueCurve = [


    {
        rpm:1300,
        torque:40
    },


    {
        rpm:2500,
        torque:58
    },


    {
        rpm:4000,
        torque:74
    },


    {
        rpm:6000,
        torque:92
    },


    {
        rpm:8000,
        torque:105
    },


    {
        rpm:9500,
        torque:110
    },


    {
        rpm:11000,
        torque:108
    },


    {
        rpm:12500,
        torque:101
    },


    {
        rpm:14000,
        torque:92
    }


];







/*
============================================================
 Recherche du couple disponible selon RPM
============================================================
*/


function getTorque(currentRPM){



    if(currentRPM <= torqueCurve[0].rpm){


        return torqueCurve[0].torque;


    }




    for(let i = 0; i < torqueCurve.length - 1; i++){



        let pointA = torqueCurve[i];


        let pointB = torqueCurve[i+1];





        if(

            currentRPM >= pointA.rpm &&

            currentRPM <= pointB.rpm

        ){



            let ratio =


            (

                currentRPM - pointA.rpm

            )

            /

            (

                pointB.rpm - pointA.rpm

            );





            return (

                pointA.torque +

                (

                    pointB.torque -

                    pointA.torque

                )

                *

                ratio

            );


        }



    }





    return torqueCurve[torqueCurve.length-1].torque;



}







/*
============================================================
 Calcul puissance moteur instantanée

 P(ch)=Couple(Nm)*RPM/7127
============================================================
*/


function getPowerHP(currentRPM){



    let torque = getTorque(currentRPM);



    return (

        torque *

        currentRPM

    )

    /

    7127;



}
