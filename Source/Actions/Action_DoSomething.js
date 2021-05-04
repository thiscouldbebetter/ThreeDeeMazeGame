"use strict";
class Action_DoSomething extends ActionTimed {
    constructor() {
        super("DoSomething");
    }
    perform(universe, world, place, entity) {
        var animatable = entity.animatable();
        animatable.animationStartByName("DoSomething", world);
    }
}
