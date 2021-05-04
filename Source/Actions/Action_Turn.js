"use strict";
class Action_Turn extends ActionTimed {
    constructor(amountToTurnRightAndDown) {
        super("Turn" + amountToTurnRightAndDown.toString());
        this.ticksToHold = 1;
        this.amountToTurnRightAndDown = amountToTurnRightAndDown;
        this.orientationTemp = Orientation.Instances().ForwardXDownZ.clone();
    }
    perform(universe, world, place, entity) {
        var entityOrientation = entity.locatable().loc.orientation;
        this.orientationTemp.overwriteWith(entityOrientation);
        entityOrientation.overwriteWith(new Orientation(this.orientationTemp.forward.add(this.orientationTemp.right.multiplyScalar(this.amountToTurnRightAndDown.x)), entityOrientation.down));
        // todo - Down.
    }
}
