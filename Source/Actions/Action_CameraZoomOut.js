"use strict";
class Action_CameraZoomOut extends ActionTimed {
    constructor(distanceToZoomOut) {
        super("CameraZoomOut" + distanceToZoomOut);
        this.distanceToZoomOut = distanceToZoomOut;
        this.ticksToHold = 1;
        this._displacementToZoomOut =
            Coords
                .fromXYZ(-1, 0, -1)
                .normalize()
                .multiplyScalar(this.distanceToZoomOut);
    }
    perform(uwpe) {
        var world = uwpe.world;
        var place = world.place2;
        var entityForCamera = place.cameraEntity;
        var constraintAttach = Constrainable.of(entityForCamera).constraintByClassName(Constraint_Attach.name);
        constraintAttach.
            offsetForwardRightDown
            .add(this._displacementToZoomOut);
    }
}
