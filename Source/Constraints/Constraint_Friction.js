"use strict";
class Constraint_Friction {
    constructor(speedMax, frictionPerTick, epsilon) {
        this.speedMax = speedMax;
        this.frictionPerTick = frictionPerTick;
        this.epsilon = epsilon;
    }
    constrain(uwpe) {
        var entityToConstrain = uwpe.entity;
        var vel = Locatable.of(entityToConstrain).loc.vel;
        var velZ = vel.z;
        var speed = vel.magnitude();
        if (speed > this.speedMax) {
            vel.normalize().multiplyScalar(this.speedMax);
        }
        else if (speed > this.epsilon) {
            vel.multiplyScalar(1 - this.frictionPerTick);
        }
        else {
            vel.clear();
            var animatable = Animatable2.of(entityToConstrain);
            if (animatable != null) {
                animatable.animationStopByName("Walk");
                animatable.transformableReset();
            }
        }
        vel.z = velZ;
    }
    nameSet(value) {
        this.name = value;
        return this;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
