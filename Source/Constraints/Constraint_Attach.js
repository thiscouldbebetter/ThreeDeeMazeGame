"use strict";
class Constraint_Attach {
    constructor(entityAttachedTo, offsetForwardRightDown) {
        this.entityAttachedTo = entityAttachedTo;
        this.offsetForwardRightDown = offsetForwardRightDown;
        this.transformOrient = new Transform_Orient(this.entityAttachedTo.locatable().loc.orientation);
    }
    constrain(uwpe) {
        var entityToConstrain = uwpe.entity;
        this.transformOrient.transformCoords(entityToConstrain.locatable().loc.pos.overwriteWith(this.offsetForwardRightDown)).add(this.entityAttachedTo.locatable().loc.pos);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
