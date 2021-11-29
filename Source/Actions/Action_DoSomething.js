"use strict";
class Action_DoSomething extends ActionTimed {
    constructor() {
        super("DoSomething");
    }
    perform(uwpe) {
        var world = uwpe.world;
        var entity = uwpe.entity;
        var animatable = entity.animatable();
        animatable.animationStartByName("DoSomething", world);
    }
}
