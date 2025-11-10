
class WorldExtended extends World
{
	actions: Action[];
	actionToInputsMappings: ActionToInputsMapping[];
	materials: Material[];
	sizeInPixels: Coords;

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
		placeInitial: PlaceZoned2
	)
	{
		super
		(
			name,
			DateTime.now(),
			WorldExtended.defnBuild(),
			() => placeInitial,
			placeInitial.name
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

		this.dateStarted = new Date();

		this.timerTicksSoFar = 0;

		this.placeCurrent = placeInitial;
	}

	// static methods

	static create(universe: Universe): WorldExtended
	{
		var actions = PlaceBuilder.actionsCreate();

		var actionToInputsMappings = PlaceBuilder.actionToInputsMappingsCreate(actions);

		var materials = PlaceBuilder.materialsCreate();
		var materialsByName = ArrayHelper.addLookupsByName(materials);

		var mazeSizeInCells = Coords.fromXYZ(4, 4, 1);
		var mazeCellSizeInPixels = Coords.fromXYZ(2, 2, 1).multiplyScalar(40);
		var randomizer = universe.randomizer;
		var place = PlaceBuilder.placeMazeBuildRandom
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
		var place = this.place();
		place.initialize(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = this.place();
		place.updateForTimerTick(uwpe);

		this.timerTicksSoFar++;
	}

	// drawable

	draw(universe: Universe): void
	{
		var place = this.place() as PlaceZoned2;
		place.draw(universe);
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
