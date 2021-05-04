"use strict";
class Action_DoNothing extends ActionTimed {
    constructor() {
        super("DoNothing");
    }
    perform(universe, world, place, entity) {
        // Do nothing.
    }
}
