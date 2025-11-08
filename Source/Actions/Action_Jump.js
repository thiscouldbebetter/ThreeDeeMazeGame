"use strict";
class Action_Jump extends ActionTimed {
    constructor(acceleration) {
        super("Jump");
        this.acceleration = acceleration;
    }
    perform(uwpe) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var place = world.place2;
        var entity = uwpe.entity;
        var entityLoc = Locatable.of(entity).loc;
        var isEntityGrounded = Groundable.fromEntity(entity).isGrounded(universe, world, place, entity);
        if (isEntityGrounded) {
            entityLoc.accel.z -= this.acceleration;
        }
        var animatable = Animatable2.of(entity);
        animatable.animationStartByName("Jump", world);
    }
}
