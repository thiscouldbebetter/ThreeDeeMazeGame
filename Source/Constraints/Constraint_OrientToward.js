"use strict";
class Constraint_OrientToward {
    constructor(targetEntity) {
        this.targetEntity = targetEntity;
        this.transformOrient = new Transform_Orient(Orientation.Instances().ForwardXDownZ.clone());
    }
    constrain(uwpe) {
        var entityToConstrain = uwpe.entity;
        var entityToConstrainLoc = entityToConstrain.locatable().loc;
        var targetLoc = this.targetEntity.locatable().loc;
        var entityOrientationForward = targetLoc.pos.clone().subtract(entityToConstrainLoc.pos).normalize();
        entityToConstrainLoc.orientation.overwriteWith(new Orientation(entityOrientationForward, targetLoc.orientation.down));
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
