/*
============================================================
 Mini Engine Simulator
 Version : v0.0.5
 Module : Engine
============================================================
*/

const engine = {

    throttle:0,

    rpm:1300,

    limiter:false,

    limiterTimer:0

};



function updateThrottle(target, dt){

    const response = vehicleData.engine.throttleResponse;

    engine.throttle += (target-engine.throttle) * response * dt;

    engine.throttle = Math.max(0, Math.min(1, engine.throttle));

}



function updateEngine(dt){

    const torque = getTorque(engine.rpm);

    const availableTorque = torque * engine.throttle;

    const frictionTorque =
        vehicleData.engine.engineBraking *
        engine.rpm /
        vehicleData.engine.maxRPM;

    const netTorque =
        availableTorque - frictionTorque;

    const angularAcceleration =
        netTorque /
        vehicleData.engine.inertia;

    engine.rpm += angularAcceleration * 500 * dt;

    if(engine.rpm < vehicleData.engine.idleRPM){

        engine.rpm = vehicleData.engine.idleRPM;

    }

    if(engine.rpm > vehicleData.engine.maxRPM){

        engine.rpm = vehicleData.engine.maxRPM;

    }

}
