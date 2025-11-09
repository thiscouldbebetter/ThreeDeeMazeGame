"use strict";
class Action_Turn extends ActionTimed {
    constructor(amountToTurnRightAndDown) {
        super("Turn" + amountToTurnRightAndDown.toString());
        this.ticksToHold = 1;
        this.amountToTurnRightAndDown = amountToTurnRightAndDown;
        this.orientationTemp = Orientation.Instances().ForwardXDownZ.clone();
    }
    static fromAmountToTurnRightAndDown(amountToTurnRightAndDown) {
        return new Action_Turn(amountToTurnRightAndDown);
    }
    perform(uwpe) {
        var entity = uwpe.entity;
        var entityOrientation = Locatable.of(entity).loc.orientation;
        this.orientationTemp.overwriteWith(entityOrientation);
        entityOrientation.overwriteWith(new Orientation(this.orientationTemp.forward.add(this.orientationTemp.right.multiplyScalar(this.amountToTurnRightAndDown.x)), entityOrientation.down));
        // todo - Down.
    }
}
