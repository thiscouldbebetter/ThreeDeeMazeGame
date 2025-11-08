
class PlaceZoned2 extends PlaceBase
{
	zones: Zone2[];

	zoneCurrent: Zone2;
	zoneNext: Zone2;
	zonesActive: Zone2[];
	_zonesByName: Map<string, Zone2>;

	meshesToDraw: Mesh[];
	spacePartitioningTreeForZonesActive: SpacePartitioningTree;

	entityForPlayer: Entity;

	camera: Camera;
	cameraEntity: Entity;

	constructor
	(
		sizeInPixels: Coords,
		zones: Zone2[],
		entityForPlayer: Entity
	)
	{
		super
		(
			PlaceZoned2.name,
			null, // defnName
			null, // parentName
			sizeInPixels,
			[] // entities
		);

		this.zones = zones;
		this.entityForPlayer = entityForPlayer;

		this._zonesByName = ArrayHelper.addLookupsByName(this.zones);
	}

	static actionsCreate(): Action[]
	{
		var amountToMoveForward = .4;
		var amountToMoveBackward = amountToMoveForward / 2;
		var amountToYaw = 0.1;
		var amountToStrafe = .1;

		var actions =
		[
			new Action_Turn(Coords.fromXY(0 - amountToYaw, 0)), // 0 - a - turn right
			new Action_DoSomething(), // 1
			new Action_Move(Coords.fromXY(0, amountToStrafe)), // 2
			new Action_Turn(Coords.fromXY(amountToYaw, 0)), // 3
			new Action_Move(Coords.fromXY(-amountToMoveBackward, 0)), // 4
			new Action_Move(Coords.fromXY(amountToMoveForward, 0)), // 5
			new Action_Stop(), // 6
			new Action_Move(Coords.fromXY(0, 0 - amountToStrafe)), // 7
			new Action_Jump(.6), // 8
		];

		return actions;
	}

	static actionToInputsMappingsCreate(actions: Action[]): ActionToInputsMapping[]
	{
		var atim =
			(action: Action, input: Input) =>
				ActionToInputsMapping.fromActionNameAndInputName(action.name, input.name);

		var inputs = Input.Instances();

		var actionToInputsMappings =
		[
			atim(actions[0], inputs.a),
			atim(actions[1], inputs.e),
			atim(actions[2], inputs.c),
			atim(actions[3], inputs.d),
			atim(actions[4], inputs.s),
			atim(actions[5], inputs.w),
			atim(actions[6], inputs.x),
			atim(actions[7], inputs.z),
			atim(actions[8], inputs.Space)
		];

		return actionToInputsMappings;
	}

	static materialsCreate(): Material[]
	{
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

		var colors = Color.Instances();
		var imageBuilder = new ImageBuilder(colors._All);

		var textures =
		[
			Texture.fromNameAndImage
			(
				"Chest",
				imageBuilder.buildImageFromStrings
				(
					"Chest",
					pixelsGrayWithColoredBorders.get("R")
				)
			),

			Texture.fromNameAndImage
			(
				"Door",
				imageBuilder.buildImageFromStrings
				(
					"Door",
					pixelsGrayWithColoredBorders.get("B")
				)
			),

			Texture.fromNameAndImage
			(
				"Floor",
				imageBuilder.buildImageFromStrings
				(
					"Floor",
					pixelsGrayWithDarkBorder
				)
			),

			Texture.fromNameAndImage
			(
				"Goal",
				imageBuilder.buildImageFromStrings
				(
					"Goal",
					pixelsGrayWithColoredBorders.get("G")
				)
			),

			Texture.fromNameAndImage
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

			Texture.fromNameAndImage
			(
				"Start",
				imageBuilder.buildImageFromStrings
				(
					"Start",
					pixelsGrayWithColoredBorders.get("R")
				)
			),

			Texture.fromNameAndImage
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

		var materials = textures.map(x => Material.fromTexture(x) );

		return materials;
	}

	static random
	(
		mazeSizeInCells: Coords,
		mazeCellSizeInPixels: Coords,
		randomizer: Randomizer,
		materialsByName: Map<string, Material>
	): PlaceZoned2
	{

		var maze = new Maze
		(
			mazeCellSizeInPixels,
			mazeSizeInCells,
			// neighborOffsets
			[
				Coords.fromXY(-1, 0), // west
				Coords.fromXY(1, 0), // east
				Coords.fromXY(0, -1), // north
				Coords.fromXY(0, 1), // south
			]
		).generateRandom(randomizer);

		var meshBuilder = MeshBuilder.Instance();

		var ceilingHeight = maze.cellSizeInPixels.z;
		var moverHeight = ceilingHeight / 7;

		var meshMover = meshBuilder.biped
		(
			materialsByName.get("Mover"),
			moverHeight
		).faceTexturesBuild();

		var cellPosOfStart =
			Coords
				.create()
				.randomize(randomizer)
				.multiply(maze.sizeInCells)
				.floor();

		var cellPosOfGoal = null;

		var distanceOrthogonalFromStartToGoalMin = maze.sizeInCells.x / 2;
		var distanceOrthogonalFromStartToGoal = 0;

		// hack - The time this will take is nondeterministic.

		while (distanceOrthogonalFromStartToGoal < distanceOrthogonalFromStartToGoalMin)
		{
			cellPosOfGoal =
				Coords
					.create()
					.randomize(randomizer)
					.multiply(maze.sizeInCells)
					.floor();

			distanceOrthogonalFromStartToGoal =
				cellPosOfGoal
					.clone()
					.subtract(cellPosOfStart)
					.absolute()
					.sumOfDimensions();
		}

		var zones = Zone2.manyFromMaze
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

		var entityForPlayer =
			this.random_1_EntityForPlayer
			(
				maze, nameOfZoneStart, cellPosOfStart, meshMover
			);

		var entityForMoverOther =
			this.random_2_EntityForMoverOther
			(
				maze, nameOfZoneStart, cellPosOfStart, meshMover
			);

		var entityForChest =
			this.random_3_EntityForChest
			(
				maze,
				nameOfZoneStart,
				cellPosOfStart,
				materialsByName.get("Chest"),
				moverHeight
			);

		var entityForDoor =
			this.random_4_EntityForDoor
			(
				maze,
				nameOfZoneStart,
				cellPosOfStart,
				materialsByName.get("Door"),
				moverHeight
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

		var place = new PlaceZoned2
		(
			maze.sizeInPixels,
			zones,
			entityForPlayer
		);

		return place;
	}

	static random_1_EntityForPlayer
	(
		maze: Maze,
		nameOfZoneStart: string,
		cellPosOfStart: Coords,
		mesh: MeshTextured
	): Entity
	{
		var loc = Disposition.fromPosOrientationAndPlaceName
		(
			cellPosOfStart.clone().multiply
			(
				maze.cellSizeInPixels
			).add
			(
				Coords.fromXYZ(0, 0, -10)
			),
			Orientation.fromForwardAndDown
			(
				Coords.fromXYZ(0, 1, 0),
				Coords.fromXYZ(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		var locatable = Locatable.fromDisposition(loc);
		var visual: Visual = VisualMesh.fromMesh(mesh.clone());

		var skeletonAtRest = SkeletonHelper.biped
		(
			6 // hack - figureHeightInPixels
		);
		var transformPose =
			Transform_MeshPoseWithSkeleton.fromMeshSkeletonAndBoneInfluences
			(
				mesh,
				skeletonAtRest,
				BoneInfluence.buildManyForBonesAndVertexGroups
				(
					skeletonAtRest.bonesAll, mesh.vertexGroups
				)
			);
		visual = VisualTransform.fromTransformAndChild
		(
			Transform_Multiple.fromChildren
			([
				//new Transform_Overwrite(mesh),
				transformPose,
				new Transform_Orient2(loc.orientation), // hack
				Transform_Translate.fromDisplacement(loc.pos),
			]),
			visual
		);

		var drawable = Drawable.fromVisual(visual);

		var animationDefnGroupBiped = SkeletonHelper.bipedAnimationDefnGroup();

		var skeletonPosed = transformPose.skeletonPosed;
		var animatable = new Animatable2
		(
			animationDefnGroupBiped, skeletonAtRest, skeletonPosed
		);

		var activity = Activity.fromDefnName("UserInputAccept");
		var actor = Actor.fromActivity(activity);

		var collidable = Collidable.fromCollider(mesh);

		var groundable = new Groundable();

		var movable = Movable.default();

		var entityForPlayer = Entity.fromNameAndProperties
		(
			"Player",
			[
				actor,
				animatable, // hack
				collidable,
				drawable,
				groundable,
				locatable,
				movable
			]
		);

		return entityForPlayer;
	}

	static random_2_EntityForMoverOther
	(
		maze: Maze,
		nameOfZoneStart: string,
		cellPosOfStart: Coords,
		meshDefnMover: MeshTextured
	): Entity
	{
		var loc = Disposition.fromPosOrientationAndPlaceName
		(
			cellPosOfStart.clone().add
			(
				Coords.fromXYZ(1, 1, 0).multiplyScalar(.1)
			).multiply
			(
				maze.cellSizeInPixels
			),
			Orientation.fromForwardAndDown
			(
				Coords.fromXYZ(0, 1, 0),
				Coords.fromXYZ(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		var locatable = Locatable.fromDisposition(loc);
		var mesh = meshDefnMover;
		var visual = VisualTransform.fromTransformAndChild
		(
			Transform_Multiple.fromChildren
			([
				new Transform_Overwrite(mesh),
				Transform_Orient.fromOrientation(loc.orientation),
				Transform_Translate.fromDisplacement(loc.pos)
			]),
			VisualMesh.fromMesh(mesh.clone())
		);

		var collidable = Collidable.fromCollider(mesh);
		var drawable = Drawable.fromVisual(visual);
		var groundable = new Groundable();
		var movable = Movable.default();

		var entityForMoverOther = Entity.fromNameAndProperties
		(
			"MoverOther",
			[
				collidable,
				drawable,
				groundable,
				locatable,
				movable
			]
		);

		return entityForMoverOther;
	}

	static random_3_EntityForChest
	(
		maze: Maze,
		nameOfZoneStart: string,
		cellPosOfStart: Coords,
		material: Material,
		moverHeight: number
	): Entity
	{
		var chestHeight = moverHeight / 4;

		var meshBuilder = MeshBuilder.Instance();

		var mesh = meshBuilder.box
		(
			material,
			Coords.fromXYZ(2, 1, 1).multiplyScalar(chestHeight), // size
			Coords.fromXYZ(0, 0, -1).multiplyScalar(chestHeight) // pos
		).faceTexturesBuild();

		var loc = Disposition.fromPosOrientationAndPlaceName
		(
			cellPosOfStart.clone().add
			(
				Coords.fromXYZ(1, -1, 0).multiplyScalar(.05)
			).multiply
			(
				maze.cellSizeInPixels
			),
			Orientation.fromForwardAndDown
			(
				Coords.fromXYZ(1, -1, 0),
				Coords.fromXYZ(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		var locatable = Locatable.fromDisposition(loc);
		var visual = VisualTransform.fromTransformAndChild
		(
			Transform_Multiple.fromChildren
			([
				new Transform_Overwrite(mesh),
				Transform_Orient.fromOrientation(loc.orientation),
				Transform_Translate.fromDisplacement(loc.pos)
			]),
			VisualMesh.fromMesh(mesh.clone() )
		);

		var collidable = Collidable.fromCollider(mesh);
		var drawable = Drawable.fromVisual(visual);
		var groundable = new Groundable();

		var entityForChest = Entity.fromNameAndProperties
		(
			"Chest",
			[
				collidable,
				drawable,
				groundable,
				locatable
			]
		);

		return entityForChest;
	}

	static random_4_EntityForDoor
	(
		maze: Maze,
		nameOfZoneStart: string,
		cellPosOfStart: Coords,
		materialDoor: Material,
		moverHeight: number
	): Entity
	{
		var doorHeight = moverHeight / 2 * 1.33; // ?

		var meshBuilder = MeshBuilder.Instance();

		var mesh = meshBuilder.box
		(
			materialDoor,
			Coords.fromXYZ(.67, .05, 1).multiplyScalar(doorHeight), // size - ?
			Coords.fromXYZ(0, 0, -1).multiplyScalar(doorHeight) // pos
		).faceTexturesBuild();

		var loc = Disposition.fromPosOrientationAndPlaceName
		(
			cellPosOfStart.clone().add
			(
				new Coords(0, -1, 0).multiplyScalar(.125)
			).multiply
			(
				maze.cellSizeInPixels
			),
			Orientation.fromForwardAndDown
			(
				Coords.fromXYZ(1, 0, 0),
				Coords.fromXYZ(0, 0, 1)
			),
			nameOfZoneStart // venue
		);
		var locatable = Locatable.fromDisposition(loc);
		var visual = VisualTransform.fromTransformAndChild
		(
			Transform_Multiple.fromChildren
			([
				new Transform_Overwrite(mesh),
				Transform_Orient.fromOrientation(loc.orientation),
				Transform_Translate.fromDisplacement(loc.pos)
			]),
			VisualMesh.fromMesh(mesh.clone() )
		);

		var collidable = Collidable.fromCollider(mesh);
		var drawable = Drawable.fromVisual(visual);
		var groundable = new Groundable();

		var entityForDoor = Entity.fromNameAndProperties
		(
			"Door",
			[
				collidable,
				drawable,
				groundable,
				locatable
			]
		);

		return entityForDoor;
	}

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

	draw(universe: Universe): void
	{
		var display = universe.display;
		var displayTypeName = display.constructor.name;
		if (displayTypeName == Display2D.name)
		{
			this.draw2d(universe);
		}
		else if (displayTypeName == Display3D.name)
		{
			this.draw3d(universe);
		}
	}

	draw2d(universe: Universe): void
	{
		var display = universe.display as Display2D;
		var facesToDraw = new Array<FaceTextured>();

		var cameraPos = Locatable.of(this.cameraEntity).loc.pos;

		var spacePartitioningTreeRoot =
			this.spacePartitioningTreeForZonesActive.nodeRoot;

		spacePartitioningTreeRoot.addFacesBackToFrontForCameraPosToList
		(
			cameraPos, facesToDraw
		);

		var entities = this._entities;
		var collisionHelper = universe.collisionHelper;
		for (var b = 0; b < entities.length; b++)
		{
			var entity = entities[b];

			if (Drawable.of(entity) != null && Movable.of(entity) != null)
			{
				// hack
				// Find the floor the mover is standing on,
				// and draw the mover immediately after that floor.

				var entityPos = Locatable.of(entity).loc.pos;
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
						var moverMesh = Collidable.of(entity).collider as MeshTextured;
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

		display.drawBackground();
		DisplayHelper.drawFacesForCamera(display, facesToDraw, this.cameraEntity);

		var fontHeight = 10;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var world = universe.world as WorldExtended;
		display.drawTextWithFontAtPos
		(
			world.name,
			font,
			Coords.fromXY(0, 1).multiplyScalar(fontHeight)
		);
		display.drawTextWithFontAtPos
		(
			"" + world.secondsElapsed(),
			font,
			Coords.fromXY(0, 2).multiplyScalar(fontHeight)
		);
	}

	draw3d(universe: Universe): void
	{
		var uwpe =
			UniverseWorldPlaceEntities.fromUniverse(universe);

		var display = universe.display as Display3D;
		display.drawBackground();

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
				var drawable = Drawable.of(entity);
				if (drawable != null)
				{
					var entityVisual = drawable.visual;
					entityVisual.draw(uwpe, display);
				}
			}
		}
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
			var zoneMesh = Collidable.of(zoneEntity).collider as MeshTextured;
			if (zoneMesh.materials[1].name == "Start")
			{
				zoneStart = zone;
				break;
			}
		}

		this.zoneNext = zoneStart;
		this.zonesActive = [];

		var constraintsCommon =
		[
			new Constraint_Gravity2(.1),
			new Constraint_Solid(),
			new Constraint_Friction(1, .5, .01),
			new Constraint_Movable2(),
		];

		var constrainable = Constrainable.fromConstraints(constraintsCommon);
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
		var offsetOfCameraFromPlayer = Coords.fromXYZ
		(
			0 - focalLength,
			0,
			0 - focalLength
		).divideScalar(followDivisor);

		var loc = Disposition.fromPosOrientationAndPlaceName
		(
			Locatable.of(this.zoneNext.entities[0] ).loc.pos.clone().add
			(
				offsetOfCameraFromPlayer
			),

			Orientation.fromForwardAndDown
			(
				Coords.fromXYZ(1, 0, 1), // forward
				Coords.fromXYZ(0, 0, 1) // down
			),

			this.zoneNext.name
		);

		var locatable = Locatable.fromDisposition(loc);
		var cameraEntity = Entity.fromNameAndProperties
		(
			"Camera",
			[
				Constrainable.fromConstraints
				([
					new Constraint_Follow(this.entityForPlayer, focalLength / followDivisor),
					new Constraint_OrientToward(this.entityForPlayer),
				]),
				locatable,
				new Groundable()
			]
		);

		this.camera = Camera.fromViewSizeFocalLengthAndDisposition
		(
			viewSizeInPixels,
			focalLength,
			Locatable.of(cameraEntity).loc
		);

		zoneStart.entities.push(cameraEntity);

		this.cameraEntity = cameraEntity;
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var world = uwpe.world as WorldExtended;

		if (this.zoneNext != null)
		{
			var zoneNextEntity = this.zoneNext.entities[0];
			var zoneNextMesh =
				Collidable.of(zoneNextEntity).collider as MeshTextured;
			if (zoneNextMesh.materials[0].name == "Goal")
			{
				var messageWin =
					"You reached the goal in "
					+ world.secondsElapsed()
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
				var zoneMesh = Collidable.of(zoneActiveEntity).collider as MeshTextured;
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
			Collidable.of(zoneCurrentEntity).collider as MeshTextured;
		var zoneCurrentBounds =
			zoneCurrentMesh.geometry.box();

		var playerIsInZoneCurrent = zoneCurrentBounds.containsPoint
		(
			Locatable.of(this.entityForPlayer).loc.pos
		);

		if (playerIsInZoneCurrent == false)
		{
			for (var z = 0; z < this.zonesActive.length; z++)
			{
				var zoneActive = this.zonesActive[z];
				var zoneActiveEntity = zoneActive.entities[0];
				var zoneActiveMesh =
					Collidable.of(zoneActiveEntity).collider as MeshTextured;
				var zoneActiveBounds = zoneActiveMesh.geometry.box();
				var isPlayerInZoneActive = zoneActiveBounds.containsPoint
				(
					Locatable.of(this.entityForPlayer).loc.pos
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
	}

	zoneByName(name: string): Zone2
	{
		return this._zonesByName.get(name);
	}
}
