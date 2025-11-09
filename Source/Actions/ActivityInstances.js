"use strict";
class ActivityInstances {
    static doNothing(universe, world, place, entity) {
        // Do nothing.
    }
    static userInputAcceptPerform(uwpe) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var entity = uwpe.entity;
        var inputTracker = universe.inputTracker;
        var inputsActive = inputTracker.inputsPressed; //Active;
        var actionsFromActor = Actor.of(entity).actions;
        var actionsByName = world.actionsByName;
        var mappingsByInputName = world.actionToInputsMappingsByInputName;
        for (var i = 0; i < inputsActive.length; i++) {
            var inputActive = inputsActive[i];
            var mapping = mappingsByInputName.get(inputActive.name);
            if (mapping != null) {
                var actionName = mapping.actionName;
                var action = actionsByName.get(actionName);
                var ticksToHold = (action.ticksToHold == null
                    ? action.ticksSoFar // hold forever
                    : action.ticksToHold);
                // fix
                if (action.ticksSoFar == null || action.ticksSoFar <= ticksToHold) {
                    actionsFromActor.push(action);
                }
            }
        }
    }
}
