"use strict";
class Action_Stop extends ActionTimed {
    constructor() {
        super("Stop");
    }
    perform(universe, world, place, entity) {
        var entityLoc = entity.locatable().loc;
        entityLoc.vel.clear();
        entityLoc.accel.clear();
    }
}
