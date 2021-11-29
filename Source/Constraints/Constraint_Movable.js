"use strict";
class Constraint_Movable {
    constructor() {
        this.transformLocate = new Transform_Locate(null);
    }
    constrain(uwpe) {
        var entityToConstrain = uwpe.entity;
        var entityLoc = entityToConstrain.locatable().loc;
        var entityPos = entityLoc.pos;
        var entityVel = entityLoc.vel;
        var entityAccel = entityLoc.accel;
        entityVel.add(entityAccel);
        entityAccel.clear();
        entityPos.add(entityVel);
        var collidable = entityToConstrain.collidable();
        if (collidable != null) {
            var meshTransformed = collidable.collider;
            var mesh = meshTransformed.geometry;
            this.transformLocate.loc = entityLoc;
            mesh.transform(this.transformLocate);
        }
    }
    ;
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
