"use strict";
class Action_Stop extends ActionTimed {
    constructor() {
        super("Stop");
    }
    perform(uwpe) {
        var entity = uwpe.entity;
        var entityLoc = entity.locatable().loc;
        entityLoc.vel.clear();
        entityLoc.accel.clear();
    }
}
