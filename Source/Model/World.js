"use strict";
class WorldExtended extends World {
    constructor(name, actions, actionToInputsMappings, materials, placeInitial) {
        super(name, DateTime.now(), WorldExtended.defnBuild(), () => placeInitial, placeInitial.name);
        this.name = name;
        this.actions = actions;
        this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
        this.actionToInputsMappings = actionToInputsMappings;
        this.actionToInputsMappingsByInputName = ArrayHelper.addLookups(this.actionToInputsMappings, x => x.inputNames[0]);
        this.materials = materials;
        this.dateStarted = new Date();
        this.timerTicksSoFar = 0;
        this.placeCurrent = placeInitial;
    }
    // static methods
    static create(universe) {
        var actions = PlaceBuilder.actionsCreate();
        var actionToInputsMappings = PlaceBuilder.actionToInputsMappingsCreate(actions);
        var materials = PlaceBuilder.materialsCreate();
        var materialsByName = ArrayHelper.addLookupsByName(materials);
        var mazeSizeInCells = Coords.fromXYZ(4, 4, 1);
        var mazeCellSizeInPixels = Coords.fromXYZ(2, 2, 1).multiplyScalar(40);
        var randomizer = universe.randomizer;
        var place = PlaceBuilder.placeMazeBuildRandom(mazeSizeInCells, mazeCellSizeInPixels, randomizer, materialsByName);
        var returnValue = new WorldExtended(World.name + place.name, actions, actionToInputsMappings, materials, place);
        return returnValue;
    }
    static defnBuild() {
        var activityDefnUserInputAccept = ActivityDefn.fromNameAndPerform("UserInputAccept", ActivityInstances.userInputAcceptPerform);
        var activityDefns = [
            activityDefnUserInputAccept
        ];
        var returnValue = new WorldDefn([
            activityDefns
        ]);
        return returnValue;
    }
    // instance methods
    secondsElapsed() {
        var now = new Date();
        var millisecondsSinceStarted = now.getTime() - this.dateStarted.getTime();
        var secondsElapsed = Math.floor(millisecondsSinceStarted / 1000);
        return secondsElapsed;
    }
    // venue
    finalize() {
        // todo
    }
    initialize(uwpe) {
        var place = this.place();
        place.initialize(uwpe);
    }
    updateForTimerTick(uwpe) {
        var place = this.place();
        place.updateForTimerTick(uwpe);
        this.timerTicksSoFar++;
    }
    // drawable
    draw(universe) {
        var place = this.place();
        place.draw(universe);
    }
    // Controls.
    toControl() {
        return new ControlNone(); // todo
    }
    toVenue() {
        return new VenueWorld(this);
    }
}
