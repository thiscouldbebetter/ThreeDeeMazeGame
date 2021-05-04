"use strict";
class Action_Jump extends ActionTimed {
    constructor(acceleration) {
        super("Jump");
        this.acceleration = acceleration;
    }
    perform(universe, world, place, entity) {
        var entityLoc = entity.locatable().loc;
        var isEntityGrounded = Groundable.fromEntity(entity).isGrounded(universe, world, place, entity);
        if (isEntityGrounded) {
            entityLoc.accel.z -= this.acceleration;
        }
        var animatable = entity.animatable();
        animatable.animationStartByName("Jump", world);
    }
}
