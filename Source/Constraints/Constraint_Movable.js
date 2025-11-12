"use strict";
class Constraint_Movable2 {
    constructor() {
        this.transformLocate = new Transform_Locate(null);
    }
    constrain(uwpe) {
        var entityToConstrain = uwpe.entity;
        var entityLoc = Locatable.of(entityToConstrain).loc;
        var entityPos = entityLoc.pos;
        var entityVel = entityLoc.vel;
        var entityAccel = entityLoc.accel;
        entityVel.add(entityAccel);
        entityAccel.clear();
        entityPos.add(entityVel);
        var collidable = Collidable.of(entityToConstrain);
        if (collidable != null) {
            var meshTransformed = collidable.collider;
            var mesh = meshTransformed;
            this.transformLocate.loc = entityLoc;
            mesh.transform(this.transformLocate);
        }
    }
    ;
    nameSet(value) {
        this.name = value;
        return this;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
