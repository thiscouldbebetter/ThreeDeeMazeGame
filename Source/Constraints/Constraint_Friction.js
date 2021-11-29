"use strict";
class Constraint_Friction {
    constructor(speedMax, frictionPerTick, epsilon) {
        this.speedMax = speedMax;
        this.frictionPerTick = frictionPerTick;
        this.epsilon = epsilon;
    }
    constrain(uwpe) {
        var entityToConstrain = uwpe.entity;
        var vel = entityToConstrain.locatable().loc.vel;
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
            var animatable = entityToConstrain.animatable();
            if (animatable != null) {
                animatable.animationStopByName("Walk");
                animatable.transformableReset();
            }
        }
        vel.z = velZ;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
