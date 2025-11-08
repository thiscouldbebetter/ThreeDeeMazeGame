"use strict";
class Constraint_Gravity2 {
    constructor(accelerationPerTick) {
        this.accelerationPerTick = accelerationPerTick;
    }
    constrain(uwpe) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var place = world.place2;
        var entityToConstrain = uwpe.entity;
        var entityLoc = Locatable.of(entityToConstrain).loc;
        var isEntityGrounded = Groundable.fromEntity(entityToConstrain).isGrounded(universe, world, place, entityToConstrain);
        if (isEntityGrounded == false) {
            entityLoc.accel.z += this.accelerationPerTick;
        }
        else {
            entityLoc.vel.z = 0;
            entityLoc.pos.z = -.01;
            var animatable = Animatable2.of(entityToConstrain);
            if (animatable != null) {
                if (animatable.animationsRunningNames().indexOf("Jump") >= 0) {
                    animatable.animationStartByName("Walk", world);
                }
            }
        }
        Groundable.fromEntity(entityToConstrain).ground(universe, world, place, entityToConstrain);
    }
    nameSet(value) {
        this.name = value;
        return this;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
