"use strict";
class Constraint_Gravity {
    constructor(accelerationPerTick) {
        this.accelerationPerTick = accelerationPerTick;
    }
    constrain(universe, world, place, entityToConstrain) {
        var entityLoc = entityToConstrain.locatable().loc;
        var isEntityGrounded = Groundable.fromEntity(entityToConstrain).isGrounded(universe, world, place, entityToConstrain);
        if (isEntityGrounded == false) {
            entityLoc.accel.z += this.accelerationPerTick;
        }
        else {
            entityLoc.vel.z = 0;
            entityLoc.pos.z = -.01;
            var animatable = entityToConstrain.animatable();
            if (animatable != null) {
                if (animatable.animationsRunningNames().indexOf("Jump") >= 0) {
                    animatable.animationStartByName("Walk", world);
                }
            }
        }
        Groundable.fromEntity(entityToConstrain).ground(universe, world, place, entityToConstrain);
    }
}
