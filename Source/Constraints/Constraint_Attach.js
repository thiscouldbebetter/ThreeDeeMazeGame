"use strict";
class Constraint_Attach {
    constructor(entityAttachedTo, offsetForwardRightDown) {
        this.entityAttachedTo = entityAttachedTo;
        this.offsetForwardRightDown = offsetForwardRightDown;
        this.transformOrient = new Transform_Orient(Locatable.of(this.entityAttachedTo).loc.orientation);
    }
    constrain(uwpe) {
        var entityToConstrain = uwpe.entity;
        this.transformOrient.transformCoords(Locatable.of(entityToConstrain).loc.pos.overwriteWith(this.offsetForwardRightDown)).add(Locatable.of(this.entityAttachedTo).loc.pos);
    }
    nameSet(value) {
        this.name = value;
        return this;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
