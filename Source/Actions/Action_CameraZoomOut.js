"use strict";
class Action_CameraZoomOut extends ActionTimed {
    constructor(distanceToZoomOut) {
        super("CameraZoomOut" + distanceToZoomOut);
        this.distanceToZoomOut = distanceToZoomOut;
        this.ticksToHold = 1;
    }
    perform(uwpe) {
        var world = uwpe.world;
        var entityForCamera = world.cameraEntity;
        var constraintAttach = Constrainable.of(entityForCamera).constraintByClassName(Constraint_Attach.name);
        constraintAttach.offsetForwardRightDown.add(new Coords(-1, 0, -1).normalize().multiplyScalar(this.distanceToZoomOut));
    }
}
