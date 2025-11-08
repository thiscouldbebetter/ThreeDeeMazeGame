
class WorldExtended extends World
{
	actions: Action[];
	actionToInputsMappings: ActionToInputsMapping[];
	materials: Material[];
	sizeInPixels: Coords;

	place2: PlaceZoned2;

	actionsByName: Map<string, Action>;
	actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;
	timerTicksSoFar: number;

	dateStarted: Date;

	constructor
	(
		name: string,
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[],
		materials: Material[],
		place2: PlaceZoned2
	)
	{
		super
		(
			name,
			DateTime.now(),
			WorldExtended.defnBuild(),
			() => { throw new Error("todo") }, // ?
			"", // placeInitialName
		);
		this.name = name;
		this.actions = actions;
		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
		this.actionToInputsMappings = actionToInputsMappings;
		this.actionToInputsMappingsByInputName = ArrayHelper.addLookups
		(
			this.actionToInputsMappings, x => x.inputNames[0]
		);
		this.materials = materials;
		this.place2 = place2;

		this.dateStarted = new Date();

		this.timerTicksSoFar = 0;
	}

	// static methods

	static create(universe: Universe): WorldExtended
	{
		var actions = PlaceZoned2.actionsCreate();

		var actionToInputsMappings = PlaceZoned2.actionToInputsMappingsCreate(actions);

		var materials = PlaceZoned2.materialsCreate();
		var materialsByName = ArrayHelper.addLookupsByName(materials);

		var mazeSizeInCells = Coords.fromXYZ(4, 4, 1);
		var mazeCellSizeInPixels = Coords.fromXYZ(2, 2, 1).multiplyScalar(40);
		var randomizer = universe.randomizer;
		var place = PlaceZoned2.random
		(
			mazeSizeInCells, mazeCellSizeInPixels, randomizer, materialsByName
		);

		var returnValue = new WorldExtended
		(
			World.name + place.name,
			actions,
			actionToInputsMappings,
			materials,
			place
		);

		return returnValue;
	}

	static defnBuild(): WorldDefn
	{
		var activityDefnUserInputAccept = ActivityDefn.fromNameAndPerform
		(
			"UserInputAccept",
			ActivityInstances.userInputAcceptPerform
		);

		var activityDefns =
		[
			activityDefnUserInputAccept
		];

		var returnValue = new WorldDefn
		([
			activityDefns
		]);

		return returnValue;
	}

	// instance methods

	secondsElapsed(): number
	{
		var now = new Date();
		var millisecondsSinceStarted =
			now.getTime() - this.dateStarted.getTime();
		var secondsElapsed = Math.floor
		(
			millisecondsSinceStarted / 1000
		);

		return secondsElapsed;
	}

	// venue

	finalize(): void
	{
		// todo
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.place2.initialize(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.place2.updateForTimerTick(uwpe);

		this.timerTicksSoFar++;
	}

	// drawable

	draw(universe: Universe): void
	{
		this.place2.draw(universe);
	}

	// Controls.

	toControl(): ControlBase
	{
		return new ControlNone(); // todo
	}

	toVenue(): VenueWorld
	{
		return new VenueWorld(this);
	}
}
