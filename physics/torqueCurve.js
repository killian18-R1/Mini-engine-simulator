/*
============================================================
 Mini Engine Simulator
 Version : v0.0.5
 Module : Torque Curve
============================================================
*/


const torqueCurve = [

    { rpm: 1300, torque: 40 },

    { rpm: 2500, torque: 58 },

    { rpm: 4000, torque: 74 },

    { rpm: 6000, torque: 92 },

    { rpm: 8000, torque: 105 },

    { rpm: 9500, torque: 110 },

    { rpm: 11000, torque: 108 },

    { rpm: 12500, torque: 101 },

    { rpm: 14000, torque: 92 }

];



function getTorque(currentRPM){

    if(currentRPM <= torqueCurve[0].rpm){

        return torqueCurve[0].torque;

    }


    for(let i=0;i<torqueCurve.length-1;i++){

        const p1 = torqueCurve[i];

        const p2 = torqueCurve[i+1];

        if(currentRPM >= p1.rpm && currentRPM <= p2.rpm){

            const ratio =

                (currentRPM-p1.rpm) /

                (p2.rpm-p1.rpm);

            return p1.torque +

                (p2.torque-p1.torque)*ratio;

        }

    }

    return torqueCurve[torqueCurve.length-1].torque;

}



function getPowerHP(currentRPM){

    const torque = getTorque(currentRPM);

    return (torque * currentRPM) / 7127;

}
