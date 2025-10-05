"use strict";
class Action_Move extends ActionTimed {
    constructor(amountToMoveForwardRightDown) {
        super("Move" + amountToMoveForwardRightDown.toString());
        this.ticksToHold = 1;
        this.amountToMoveForwardRightDown = amountToMoveForwardRightDown;
        this.acceleration = Coords.create();
        this.transformOrient = new Transform_Orient(null);
    }
    perform(uwpe) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var place = uwpe.place;
        var entity = uwpe.entity;
        var entityLoc = Locatable.of(entity).loc;
        var isEntityOnGround = Groundable.fromEntity(entity).isGrounded(universe, world, place, entity);
        if (isEntityOnGround) {
            this.transformOrient.orientation = entityLoc.orientation;
            this.transformOrient.transformCoords(this.acceleration.overwriteWith(this.amountToMoveForwardRightDown));
            entityLoc.accel.add(this.acceleration);
            var animatable = Animatable2.of(entity);
            animatable.animationStartByName("Walk", world);
        }
    }
}
