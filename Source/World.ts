
class WorldExtended extends World
{
	actions: Action[];
	actionToInputsMappings: ActionToInputsMapping[];
	materials: Material[];
	sizeInPixels: Coords;
	zones: Zone[];
	entityForPlayer: Entity;

	actionsByName: Map<string,Action>;
	actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;
	camera: Camera;
	cameraEntity: Entity;
	dateStarted: Date;
	entities: Entity[]
	timerTicksSoFar: number;
	zoneCurrent: Zone;
	zoneNext: Zone;
	zonesActive: Zone[];
	zonesByName: Map<string, Zone>;

	meshesToDraw: Mesh[];
	spacePartitioningTreeForZonesActive: SpacePartitioningTree;

	constructor
	(
		name: string,
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[],
		materials: Material[],
		sizeInPixels: Coords,
		zones: Zone[],
		entityForPlayer: Entity
	)
	{
		super
		(
			name, DateTime.now(),
			WorldExtended.defnBuild(), new Array<Place>()
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
		this.sizeInPixels = sizeInPixels;
		this.zones = zones;
		this.entityForPlayer = entityForPlayer;

		this.zonesByName = ArrayHelper.addLookupsByName(this.zones);

		this.timerTicksSoFar = 0;
	}

	// static methods

	static create(universe: Universe): WorldExtended
	{
		var mazeSizeInCells = new Coords(4, 4, 1);
		var mazeCellSizeInPixels = new Coords(2, 2, 1).multiplyScalar(40);
		var randomizer = universe.randomizer;
		var returnValue = WorldExtended.random
		(
			mazeSizeInCells, mazeCellSizeInPixels, randomizer
		);
		return returnValue;
	}

	static random
	(
		mazeSizeInCells: Coords,
		mazeCellSizeInPixels: Coords,
		randomizer: Randomizer
	): WorldExtended
	{
		var amountToMoveForward = .4;
		var amountToMoveBackward = amountToMoveForward / 2;
		var amountToYaw = 0.1;
		var amountToStrafe = .1;

		var actions =
		[
			new Action_Turn(new Coords(0 - amountToYaw, 0, 0)), // 0 - a - turn right
			new Action_DoSomething(), // 1
			new Action_Move(new Coords(0, amountToStrafe, 0)), // 2
			new Action_Turn(new Coords(amountToYaw, 0, 0)), // 3
			new Action_Move(new Coords(-amountToMoveBackward, 0, 0)), // 4
			new Action_Move(new Coords(amountToMoveForward, 0, 0)), // 5
			new Action_Stop(), // 6
			new Action_Move(new Coords(0, 0 - amountToStrafe, 0)), // 7
			new Action_Jump(.6), // 8
		];

		var canBeHeldDownTrue = true;

		var actionToInputsMappings =
		[
			new ActionToInputsMapping( actions[0].name, [ "a" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[1].name, [ "e" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[2].name, [ "c" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[3].name, [ "d" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[4].name, [ "s" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[5].name, [ "w" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[6].name, [ "x" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[7].name, [ "z" ], canBeHeldDownTrue ),
			new ActionToInputsMapping( actions[8].name, [ "_" ], canBeHeldDownTrue ),
		];

		var pixelsGrayWithDarkBorder =
		[
			"aaaaaaaaaaaaaaaa",
			"aAAAAAAAAAAAAAAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAaaaaaaaaaaaaAa",
			"aAAAAAAAAAAAAAAa",
			"aaaaaaaaaaaaaaaa",
		];

		var pixelsGrayWithColoredBorders = new Map<string, any>();
		var colorCodesForBorders = [ "R", "G", "B" ];
		for (var c = 0; c < colorCodesForBorders.length; c++)
		{
			var colorCodeForBorder = colorCodesForBorders[c];
			var pixelsGrayWithColoredBorder =
				pixelsGrayWithDarkBorder
					.join(",").split("A").join(colorCodeForBorder).split(",");
			pixelsGrayWithColoredBorders.set
			(
				colorCodeForBorder, pixelsGrayWithColoredBorder
			);
		}

		var colors = Color.Instances()._All;
		var imageBuilder = new ImageBuilder(colors);

		var textures =
		[
			new Texture
			(
				"Chest",
				imageBuilder.buildImageFromStrings
				(
					"Chest",
					pixelsGrayWithColoredBorders.get("R")
				)
			),

			new Texture
			(
				"Door",
				imageBuilder.buildImageFromStrings
				(
					"Door",
					pixelsGrayWithColoredBorders.get("B")
				)
			),

			new Texture
			(
				"Floor",
				imageBuilder.buildImageFromStrings
				(
					"Floor",
					pixelsGrayWithDarkBorder
				)
			),

			new Texture
			(
				"Goal",
				imageBuilder.buildImageFromStrings
				(
					"Goal",
					pixelsGrayWithColoredBorders.get("G")
				)
			),

			new Texture
			(
				"Mover",
				imageBuilder.buildImageFromStrings
				(
					"Mover",
					[
						"@"
					]
				)
			),

			new Texture
			(
				"Start",
				imageBuilder.buildImageFromStrings
				(
					"Start",
					pixelsGrayWithColoredBorders.get("R")
				)
			),

			new Texture
			(
				"Wall",
				imageBuilder.buildImageFromStrings
				(
					"Wall",
					[
						"AAAAAAAAAAAAAAAA",

						"AaaaAaaaAaaaAaaa",
						"AaaaAaaaAaaaAaaa",
						"AaaaAaaaAaaaAaaa",

						"AAAAAAAAAAAAAAAA",

						"aaAaaaAaaaAaaaAa",
						"aaAaaaAaaaAaaaAa",
						"aaAaaaAaaaAaaaAa",

						"AAAAAAAAAAAAAAAA",

						"AaaaAaaaAaaaAaaa",
						"AaaaAaaaAaaaAaaa",
						"AaaaAaaaAaaaAaaa",

						"AAAAAAAAAAAAAAAA",

						"aaAaaaAaaaAaaaAa",
						"aaAaaaAaaaAaaaAa",
						"aaAaaaAaaaAaaaAa",

					]
				)
			),
		];
		//var texturesByName = ArrayHelper.addLookupsByName(textures);

		var materials = [];

		for (var t = 0; t < textures.length; t++)
		{
			var texture = textures[t];
			var materialForTexture = new Material
			(
				texture.name,
				Color.Instances().Black,
				Color.Instances().Gray,
				texture
			);
			materials.push(materialForTexture);
		}

		var materialsByName = ArrayHelper.addLookupsByName(materials);

		var meshBuilder = new MeshBuilder();

		var maze = new Maze
		(
			mazeCellSizeInPixels,
			mazeSizeInCells,
			// neighborOffsets
			[
				new Coords(-1, 0, 0), // west
				new Coords(1, 0, 0), // east
				new Coords(0, -1, 0), // north
				new Coords(0, 1, 0), // south
			]
		).generateRandom(randomizer);

		var ceilingHeight = maze.cellSizeInPixels.z;
		var moverHeight = ceilingHeight / 7;
		var chestHeight = moverHeight / 4;
		var doorHeight = moverHeight / 2 * 1.33; // ?

		var meshDefnsByName = new Map
		([
			[
				"Chest", 
				meshBuilder.box
				(
					materialsByName.get("Chest"),
					new Coords(2, 1, 1).multiplyScalar(chestHeight), // size
					new Coords(0, 0, -1).multiplyScalar(chestHeight) // pos
				).faceTexturesBuild()
			],

			[
				"Door",
				meshBuilder.box
				(
					materialsByName.get("Door"),
					new Coords(.67, .05, 1).multiplyScalar(doorHeight), // size - ?
					new Coords(0, 0, -1).multiplyScalar(doorHeight) // pos
				).faceTexturesBuild()
			],

			[
				"Mover", 
				meshBuilder.biped
				(
					materialsByName.get("Mover"),
					moverHeight
				).faceTexturesBuild()
			]
		]);

		var cellPosOfStart = Coords.create().randomize(randomizer).multiply
		(
			maze.sizeInCells
		).floor();

		var cellPosOfGoal = null;

		var distanceOrthogonalFromStartToGoalMin = maze.sizeInCells.x / 2;
		var distanceOrthogonalFromStartToGoal = 0;

		// hack - The time this will take is nondeterministic.

		while (distanceOrthogonalFromStartToGoal < distanceOrthogonalFromStartToGoalMin)
		{
			cellPosOfGoal = Coords.create().randomize(randomizer).multiply
			(
				maze.sizeInCells
			).floor();

			distanceOrthogonalFromStartToGoal = cellPosOfGoal.clone().subtract
			(
				cellPosOfStart
			).absolute().sumOfDimensions();
		}

		var zones = Zone.manyFromMaze
		(
			maze,
			materialsByName.get("Wall"),
			materialsByName.get("Floor"),
			cellPosOfStart,
			materialsByName.get("Start"),
			cellPosOfGoal,
			materialsByName.get("Goal")
		);

		var nameOfZoneStart = cellPosOfStart.toString();
		var zonesByName = ArrayHelper.addLookupsByName(zones);
		var zoneStart = zonesByName.get(nameOfZoneStart);

		var skeletonAtRest = SkeletonHelper.biped
		(
			6 // hack - figureHeightInPixels
		);

		var animationDefnGroupBiped = SkeletonHelper.bipedAnimationDefnGroup();

		var loc = new Disposition
		(
			cellPosOfStart.clone().multiply
			(
				maze.cellSizeInPixels
			).add
			(
				new Coords(0, 0, -10)
			),
			new Orientation
			(
				new Coords(0, 1, 0),
				new Coords(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		var locatable = new Locatable(loc);
		var mesh = meshDefnsByName.get("Mover");
		var visual: VisualBase = new VisualMesh(mesh.clone());
		var transformPose = new Transform_MeshPoseWithSkeleton
		(
			mesh,
			skeletonAtRest,
			BoneInfluence.buildManyForBonesAndVertexGroups
			(
				skeletonAtRest.bonesAll, mesh.vertexGroups
			),
			null // ?
		);
		visual = new VisualTransform
		(
			new Transform_Multiple
			([
				//new Transform_Overwrite(mesh),
				transformPose,
				new Transform_Orient2(loc.orientation), // hack
				new Transform_Translate(loc.pos),
			]),
			visual
		);

		var drawable = Drawable.fromVisual(visual);

		var skeletonPosed = transformPose.skeletonPosed;
		var animatable = new Animatable2
		(
			animationDefnGroupBiped, skeletonAtRest, skeletonPosed
		);

		var actor = new Actor(Activity.fromDefnName("UserInputAccept"));

		var collidable = Collidable.fromCollider(mesh);

		var groundable = new Groundable();

		var entityForPlayer = new Entity
		(
			"Player",
			[
				actor,
				animatable, // hack
				collidable,
				drawable,
				groundable,
				locatable,
				Movable.default()
			]
		);

		loc = new Disposition
		(
			cellPosOfStart.clone().add
			(
				new Coords(1, 1, 0).multiplyScalar(.1)
			).multiply
			(
				maze.cellSizeInPixels
			),
			new Orientation
			(
				new Coords(0, 1, 0),
				new Coords(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		locatable = new Locatable(loc);
		var mesh = meshDefnsByName.get("Mover");
		visual = new VisualTransform
		(
			new Transform_Multiple
			([
				new Transform_Overwrite(mesh),
				new Transform_Orient(loc.orientation),
				new Transform_Translate(loc.pos)
			]),
			new VisualMesh(mesh.clone())
		);
		var entityForMoverOther = new Entity
		(
			"MoverOther",
			[
				Collidable.fromCollider(mesh),
				Drawable.fromVisual(visual),
				groundable,
				locatable,
				Movable.default()
			]
		);

		loc = new Disposition
		(
			cellPosOfStart.clone().add
			(
				new Coords(1, -1, 0).multiplyScalar(.05)
			).multiply
			(
				maze.cellSizeInPixels
			),
			new Orientation
			(
				new Coords(1, -1, 0),
				new Coords(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		locatable = new Locatable(loc);
		mesh = meshDefnsByName.get("Chest");
		visual = new VisualTransform
		(
			new Transform_Multiple
			([
				new Transform_Overwrite(mesh),
				new Transform_Orient(loc.orientation),
				new Transform_Translate(loc.pos)
			]),
			new VisualMesh(mesh.clone())
		);
		var entityForChest = new Entity
		(
			"Chest",
			[
				Collidable.fromCollider(mesh),
				Drawable.fromVisual(visual),
				groundable,
				locatable
			]
		);

		loc = new Disposition
		(
			cellPosOfStart.clone().add
			(
				new Coords(0, -1, 0).multiplyScalar(.125)
			).multiply
			(
				maze.cellSizeInPixels
			),
			new Orientation
			(
				new Coords(1, 0, 0),
				new Coords(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		locatable = new Locatable(loc);
		mesh = meshDefnsByName.get("Door");
		visual = new VisualTransform
		(
			new Transform_Multiple
			([
				new Transform_Overwrite(mesh),
				new Transform_Orient(loc.orientation),
				new Transform_Translate(loc.pos)
			]),
			new VisualMesh(mesh.clone())
		);
		var entityForDoor = new Entity
		(
			"Door",
			[
				Collidable.fromCollider(mesh),
				Drawable.fromVisual(visual),
				groundable,
				locatable
			]
		);

		ArrayHelper.addMany
		(
			zoneStart.entities,
			[
				entityForPlayer,
				entityForMoverOther,
				entityForChest,
				entityForDoor,
			]
		);

		var returnValue = new WorldExtended
		(
			"Maze-" + maze.sizeInCells.x + "x" + maze.sizeInCells.y,
			actions,
			actionToInputsMappings,
			materials,
			maze.sizeInPixels,
			zones,
			entityForPlayer
		);

		return returnValue;
	}

	static defnBuild(): WorldDefn
	{
		var activityDefnUserInputAccept = new ActivityDefn
		(
			"UserInputAccept",
			ActivityInstances.userInputAcceptPerform
		);

		var activityDefns =
		[
			activityDefnUserInputAccept
		];

		var returnValue = new WorldDefn
		(
			null, // actions
			activityDefns,
			null, null, null, null
		);

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
		this.meshesToDraw = [];

		// todo - hack
		var zoneStart;
		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			var zoneEntity = zone.entities[0];
			var zoneMesh = zoneEntity.collidable().collider as MeshTextured;
			if (zoneMesh.materials[1].name == "Start")
			{
				zoneStart = zone;
				break;
			}
		}

		this.zoneNext = zoneStart;
		this.zonesActive = [];

		/*
		var skeleton = SkeletonHelper.biped
		(
			6 // hack - figureHeightInPixels
		);

		var animationDefnGroupBiped = SkeletonHelper.bipedAnimationDefnGroup();
		*/

		var constraintsCommon =
		[
			new Constraint_Gravity(.1),
			new Constraint_Solid(),
			new Constraint_Friction(1, .5, .01),
			new Constraint_Movable(),
		];

		var constrainable = new Constrainable(constraintsCommon);
		for (var z = 0; z < this.zones.length; z++)
		{
			var zone = this.zones[z];
			var entities = zone.entities;

			for (var i = 1; i < entities.length; i++)
			{
				var entity = entities[i];

				entity.propertyAdd(constrainable);
			}
		}

		var universe = uwpe.universe;
		var viewSizeInPixels = universe.display.sizeInPixels.clone();
		var focalLength = viewSizeInPixels.z / 16;
		var followDivisor = 16;
		var offsetOfCameraFromPlayer = new Coords
		(
			0 - focalLength,
			0,
			0 - focalLength
		).divideScalar(followDivisor);

		var loc = new Disposition
		(
			this.zoneNext.entities[0].locatable().loc.pos.clone().add
			(
				offsetOfCameraFromPlayer
			),

			new Orientation
			(
				new Coords(1, 0, 1), // forward
				new Coords(0, 0, 1) // down
			),

			this.zoneNext.name
		);

		var locatable = new Locatable(loc);
		var cameraEntity = new Entity
		(
			"Camera",
			[
				new Constrainable
				([
					new Constraint_Follow(this.entityForPlayer, focalLength / followDivisor),
					new Constraint_OrientToward(this.entityForPlayer),
				]),
				locatable,
				new Groundable()
			]
		);

		this.camera = new Camera
		(
			viewSizeInPixels,
			focalLength,
			cameraEntity.locatable().loc,
			null // entitiesSort
		);

		zoneStart.entities.push(cameraEntity);

		this.cameraEntity = cameraEntity;

		this.dateStarted = new Date();
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;

		if (this.zoneNext != null)
		{
			var zoneNextEntity = this.zoneNext.entities[0];
			var zoneNextMesh =
				zoneNextEntity.collidable().collider as MeshTextured;
			if (zoneNextMesh.materials[0].name == "Goal")
			{
				var messageWin =
					"You reached the goal in "
					+ this.secondsElapsed()
					+ " seconds!  Press refresh for a new maze.";

				alert(messageWin);
			}

			this.zoneCurrent = this.zoneNext;

			this.zonesActive.length = 0;

			this.zonesActive.push(this.zoneCurrent);

			var zonesAdjacent = this.zoneCurrent.zonesAdjacent(this);
			for (var i = 0; i < zonesAdjacent.length; i++)
			{
				var zoneAdjacent = zonesAdjacent[i];
				this.zonesActive.push(zoneAdjacent);
			}

			var facesForZonesActive = new Array<FaceTextured>();

			for (var i = 0; i < this.zonesActive.length; i++)
			{
				var zoneActive = this.zonesActive[i];
				var zoneActiveEntity = zoneActive.entities[0];
				var zoneMesh = zoneActiveEntity.collidable().collider as MeshTextured;
				var facesForZone = zoneMesh.faces();
				ArrayHelper.append(facesForZonesActive, facesForZone);
			}

			this.spacePartitioningTreeForZonesActive =
				SpacePartitioningTree.fromFaces(facesForZonesActive);

			this.zoneNext = null;
		}

		for (var z = 0; z < this.zonesActive.length; z++)
		{
			var zoneActive = this.zonesActive[z];
			zoneActive.updateForTimerTick(uwpe);
		}

		this.draw(universe);

		var zoneCurrentEntity = this.zoneCurrent.entities[0];
		var zoneCurrentMesh =
			zoneCurrentEntity.collidable().collider as MeshTextured;
		var zoneCurrentBounds =
			zoneCurrentMesh.geometry.box();

		var playerIsInZoneCurrent = zoneCurrentBounds.containsPoint
		(
			this.entityForPlayer.locatable().loc.pos
		);
		if (playerIsInZoneCurrent == false)
		{
			for (var z = 0; z < this.zonesActive.length; z++)
			{
				var zoneActive = this.zonesActive[z];
				var zoneActiveEntity = zoneActive.entities[0];
				var zoneActiveMesh =
					zoneActiveEntity.collidable().collider as MeshTextured;
				var zoneActiveBounds = zoneActiveMesh.geometry.box();
				var isPlayerInZoneActive = zoneActiveBounds.containsPoint
				(
					this.entityForPlayer.locatable().loc.pos
				);

				if (isPlayerInZoneActive)
				{
					var zoneCurrentEntities = this.zoneCurrent.entities;
					ArrayHelper.remove(zoneCurrentEntities, this.entityForPlayer);
					ArrayHelper.remove(zoneCurrentEntities, this.cameraEntity);

					this.zoneNext = zoneActive;
					var zoneNextEntities = this.zoneNext.entities;
					zoneNextEntities.push(this.entityForPlayer);
					zoneNextEntities.push(this.cameraEntity);

					break;
				}
			}
		}

		this.timerTicksSoFar++;
	}

	// drawable

	draw(universe: Universe): void
	{
		var display = universe.display;
		var displayTypeName = display.constructor.name;
		if (displayTypeName == Display2D.name)
		{
			this.draw2D(universe);
		}
		else if (displayTypeName == Display3D.name)
		{
			this.draw3D(universe);
		}
	}

	draw2D(universe: Universe): void
	{
		var display = universe.display as Display2D;
		var world  = this;
		var facesToDraw = new Array<FaceTextured>();

		var cameraPos = world.cameraEntity.locatable().loc.pos;

		var spacePartitioningTreeRoot =
			world.spacePartitioningTreeForZonesActive.nodeRoot;

		spacePartitioningTreeRoot.addFacesBackToFrontForCameraPosToList
		(
			cameraPos, facesToDraw
		);

		var entities = world.entities;
		var collisionHelper = universe.collisionHelper;
		for (var b = 0; b < entities.length; b++)
		{
			var entity = entities[b];

			if (entity.drawable() != null && entity.movable() != null)
			{
				// hack
				// Find the floor the mover is standing on,
				// and draw the mover immediately after that floor.

				var entityPos = entity.locatable().loc.pos;
				var edgeForFootprint = new Edge
				([
					entityPos,
					entityPos.clone().add(new Coords(0, 0, 100))
				]);

				for (var g = facesToDraw.length - 1; g >= 0; g--)
				{
					var face = facesToDraw[g];
					var collisionForFootprint =
						collisionHelper.collisionOfEdgeAndFace
						(
							edgeForFootprint, face.geometry, Collision.create()
						);

					var isEntityStandingOnFace =
					(
						collisionForFootprint != null
						&& collisionForFootprint.isActive
					);

					if (isEntityStandingOnFace)
					{
						var moverMesh = entity.collidable().collider as MeshTextured;
						var moverFaces = moverMesh.faces();
						for (var f = 0; f < moverFaces.length; f++)
						{
							var moverFace = moverFaces[f];
							facesToDraw.splice
							(
								g + 1, 0, moverFace
							)
						}
						break;
					}

				}
			}
		}

		display.drawBackground(null, null);
		DisplayHelper.drawFacesForCamera(display, facesToDraw, world.cameraEntity);

		var fontHeight = 10;
		display.drawText
		(
			world.name,
			fontHeight,
			Coords.fromXY(0, 1).multiplyScalar(fontHeight),
			null, null, null, null, null // ?
		);
		display.drawText
		(
			"" + world.secondsElapsed(),
			fontHeight,
			Coords.fromXY(0, 2).multiplyScalar(fontHeight),
			null, null, null, null, null// ?
		);
	}

	draw3D(universe: Universe): void
	{
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, null, null, null
		);

		var display = universe.display as Display3D;
		display.drawBackground(null, null);

		display.cameraSet(this.camera);

		display.lightingSet(null); // todo

		for (var z = 0; z < this.zonesActive.length; z++)
		{
			var zone = this.zonesActive[z];
			uwpe.placeSet(zone);
			var entities = zone.entities;

			for (var b = 0; b < entities.length; b++)
			{
				var entity = entities[b];
				uwpe.entitySet(entity);
				var drawable = entity.drawable();
				if (drawable != null)
				{
					var entityVisual = drawable.visual;
					entityVisual.draw(uwpe, display);
				}
			}
		}
	}

	// collisions

	collisionsWithEdge
	(
		universe: Universe,
		edge: Edge,
		collisions: Collision[]
	): Collision[]
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var zonesActive = this.zonesActive;
		for (var z = 0; z < zonesActive.length; z++)
		{
			var zone = zonesActive[z];

			zone.collisionsWithEdge
			(
				universe, edge, collisions
			);
		}

		return collisions;
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
