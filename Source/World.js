
function World(name, actions, actionToInputsMappings, materials, sizeInPixels, zones, entityForPlayer)
{
	this.name = name;
	this.actions = actions.addLookupsByName();
	this.actionToInputsMappings = actionToInputsMappings.addLookups( function(x) { return x.inputNames[0]; } );
	this.materials = materials;
	this.sizeInPixels = sizeInPixels;
	this.zones = zones;
	this.entityForPlayer = entityForPlayer;

	this.zones.addLookupsByName();

	this.timerTicksSoFar = 0;
}

{
	// static methods

	World.new = function(universe)
	{
		var mazeSizeInCells = new Coords(4, 4, 1);
		var mazeCellSizeInPixels = new Coords(80, 80, 40);
		var randomizer = universe.randomizer;
		var returnValue = World.random(mazeSizeInCells, mazeCellSizeInPixels, randomizer);
		return returnValue;
	}

	World.random = function(mazeSizeInCells, mazeCellSizeInPixels, randomizer)
	{
		var amountToMoveForward = .4;
		var amountToMoveBackward = amountToMoveForward / 2;
		var amountToYaw = 0.1;
		var amountToStrafe = .1;

		var actions =
		[
			new Action_Turn(new Coords(amountToYaw, 0, 0)),
			new Action_DoSomething(),
			new Action_Move(new Coords(0, amountToStrafe, 0)),
			new Action_Turn(new Coords(0 - amountToYaw, 0, 0)),
			new Action_Move(new Coords(-amountToMoveBackward, 0, 0)),
			new Action_Move(new Coords(amountToMoveForward, 0, 0)),
			new Action_Stop(),
			new Action_Move(new Coords(0, 0 - amountToStrafe, 0)),
			new Action_Jump(.6),
		];

		var actionToInputsMappings =
		[
			new ActionToInputsMapping( actions[0].name, [ "a" ] ),
			new ActionToInputsMapping( actions[1].name, [ "e" ] ),
			new ActionToInputsMapping( actions[2].name, [ "c" ] ),
			new ActionToInputsMapping( actions[3].name, [ "d" ] ),
			new ActionToInputsMapping( actions[4].name, [ "s" ] ),
			new ActionToInputsMapping( actions[5].name, [ "w" ] ),
			new ActionToInputsMapping( actions[6].name, [ "x" ] ),
			new ActionToInputsMapping( actions[7].name, [ "z" ] ),
			new ActionToInputsMapping( actions[8].name, [ "_" ] ),
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

		var pixelsGrayWithColoredBorders = [];
		var colorCodesForBorders = [ "R", "G", "B" ];
		for (var c = 0; c < colorCodesForBorders.length; c++)
		{
			var colorCodeForBorder = colorCodesForBorders[c];
			var pixelsGrayWithColoredBorder =
				pixelsGrayWithDarkBorder.join(",").split("A").join(colorCodeForBorder).split(",");
			pixelsGrayWithColoredBorders[colorCodeForBorder] = pixelsGrayWithColoredBorder;
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
					pixelsGrayWithColoredBorders["R"]
				)
			),

			new Texture
			(
				"Door",
				imageBuilder.buildImageFromStrings
				(
					"Door",
					pixelsGrayWithColoredBorders["B"]
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
					pixelsGrayWithColoredBorders["G"]
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
					pixelsGrayWithColoredBorders["R"]
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
		].addLookupsByName();

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

		materials.addLookupsByName();

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

		var meshDefns = {};
		meshDefns["Chest"] = meshBuilder.box
		(
			materials["Chest"],
			new Coords(2, 1, 1).multiplyScalar(chestHeight), // size
			new Coords(0, 0, -1).multiplyScalar(chestHeight) // pos
		).faceTexturesBuild();

		meshDefns["Door"] = meshBuilder.box
		(
			materials["Door"],
			new Coords(.67, .05, 1).multiplyScalar(doorHeight), // size - ?
			new Coords(0, 0, -1).multiplyScalar(doorHeight) // pos
		).faceTexturesBuild();

		meshDefns["Mover"] = meshBuilder.biped
		(
			materials["Mover"],
			moverHeight
		).faceTexturesBuild();

		var cellPosOfStart = new Coords().randomize().multiply
		(
			maze.sizeInCells
		).floor();

		var cellPosOfGoal = null;

		var distanceOrthogonalFromStartToGoalMin = maze.sizeInCells.x / 2;
		var distanceOrthogonalFromStartToGoal = 0;

		// hack - The time this will take is nondeterministic.

		while (distanceOrthogonalFromStartToGoal < distanceOrthogonalFromStartToGoalMin)
		{
			cellPosOfGoal = new Coords().randomize().multiply
			(
				maze.sizeInCells
			).floor();

			distanceOrthogonalFromStartToGoal = cellPosOfGoal.clone().subtract
			(
				cellPosOfStart
			).absolute().sumOfDimensions();
		}

		zones = Zone.manyFromMaze
		(
			maze,
			materials["Wall"],
			materials["Floor"],
			cellPosOfStart,
			materials["Start"],
			cellPosOfGoal,
			materials["Goal"]
		);

		var nameOfZoneStart = cellPosOfStart.toString();
		var zoneStart = zones[nameOfZoneStart];

		var skeleton = SkeletonHelper.biped
		(
			6 // hack - figureHeightInPixels
		);

		var animationDefnGroupBiped = SkeletonHelper.bipedAnimationDefnGroup();

		var loc = new Location
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
		var mesh = meshDefns["Mover"];
		var visual = new VisualMesh(mesh.clone());
		var transformPose = new Transform_MeshPoseWithSkeleton
		(
			mesh,
			skeleton,
			BoneInfluence.buildManyForBonesAndVertexGroups
			(
				skeleton.bonesAll,
				mesh.vertexGroups
			)
		);
		visual = new VisualTransform
		(
			new Transform_Multiple
			([
				new Transform_Overwrite(mesh),
				transformPose,
				new Transform_Orient(loc.orientation),
				new Transform_Translate(loc.pos)
			]),
			visual
		);
		var transformAnimate = new Transform_Animate(animationDefnGroupBiped);
		visual = new VisualGroup
		([
			new VisualTransform
			(
				new Transform_Multiple
				([
					new Transform_Overwrite(skeleton),
					transformAnimate
				]),
				new VisualInvisible(transformPose.skeletonPosed)
			),
			visual
		]);
		var drawable = new Drawable(visual);

		var activities = new ActivityInstances();
		var actor = new Actor
		(
			activities.UserInputAccept
		);

		var groundable = new Groundable();

		var entityForPlayer = new Entity
		(
			"Player",
			[
				actor,
				transformAnimate.animatable, // hack
				new Collidable(mesh),
				drawable,
				groundable,
				locatable,
				new Movable()
			]
		);

		loc = new Location
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
		var mesh = meshDefns["Mover"];
		var visual = new VisualTransform
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
				new Collidable(mesh),
				new Drawable(visual),
				groundable,
				locatable,
				new Movable()
			]
		);

		loc = new Location
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
		mesh = meshDefns["Chest"];
		var visual = new VisualTransform
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
				new Collidable(mesh),
				new Drawable(visual),
				groundable,
				locatable
			]
		);

		loc = new Location
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
		mesh = meshDefns["Door"];
		var visual = new VisualTransform
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
				new Collidable(mesh),
				new Drawable(visual),
				groundable,
				locatable
			]
		);

		zoneStart.entities.addMany
		([
			entityForPlayer,
			entityForMoverOther,
			entityForChest,
			entityForDoor,
		]);

		var returnValue = new World
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

	// instance methods

	World.prototype.secondsElapsed = function()
	{
		var now = new Date();
		var secondsElapsed = Math.floor
		(
			(now - this.dateStarted) / 1000
		);

		return secondsElapsed;
	}

	// venue

	World.prototype.finalize = function()
	{
		// todo
	}

	World.prototype.initialize = function(universe)
	{
		this.meshesToDraw = [];

		// todo - hack
		var zoneStart;
		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			var zoneEntity = zone.entities[0];
			if (zoneEntity.collidable.collider.materials[1].name == "Start")
			{
				zoneStart = zone;
				break;
			}
		}

		this.zoneNext = zoneStart;
		this.zonesActive = [];

		var skeleton = SkeletonHelper.biped
		(
			6 // hack - figureHeightInPixels
		);

		var animationDefnGroupBiped = SkeletonHelper.bipedAnimationDefnGroup();

		var constraintsCommon =
		[
			new Constraint_Gravity(.1),
			new Constraint_Solid(),
			new Constraint_Friction(1, .5, .01),
			new Constraint_Movable(),
		];

		for (var z = 0; z < this.zones.length; z++)
		{
			var zone = this.zones[z];
			var entities = zone.entities;

			for (var i = 1; i < entities.length; i++)
			{
				var entity = entities[i];

				entity.constraints = constraintsCommon.slice();
			}
		}

		var viewSizeInPixels = universe.display.sizeInPixels.clone();
		var focalLength = viewSizeInPixels.z / 16;
		var followDivisor = 16;
		var offsetOfCameraFromPlayer = new Coords
		(
			0 - focalLength,
			0,
			0 - focalLength
		).divideScalar(followDivisor);

		var loc = new Location
		(
			this.zoneNext.entities[0].locatable.loc.pos.clone().add
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
				locatable,
				new Groundable()
			]
		);

		this.camera = new Camera
		(
			viewSizeInPixels,
			focalLength,
			cameraEntity.locatable.loc
		);

		cameraEntity.constraints =
		[
			new Constraint_Follow(this.entityForPlayer, focalLength / followDivisor),
			new Constraint_OrientToward(this.entityForPlayer),
		].addLookupsByName();

		zoneStart.entities.push(cameraEntity);

		this.cameraEntity = cameraEntity;

		this.dateStarted = new Date();
	}

	World.prototype.updateForTimerTick = function(universe)
	{
		if (this.zoneNext != null)
		{
			var zoneNextEntity = this.zoneNext.entities[0];
			if (zoneNextEntity.collidable.collider.materials[0].name == "Goal")
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

			var facesForZonesActive = [];

			for (var i = 0; i < this.zonesActive.length; i++)
			{
				var zoneActive = this.zonesActive[i];
				var zoneActiveEntity = zoneActive.entities[0];
				var facesForZone = zoneActiveEntity.collidable.collider.faces();
				facesForZonesActive.append(facesForZone);
			}

			this.spacePartitioningTreeForZonesActive = SpacePartitioningTree.fromFaces
			(
				facesForZonesActive
			);

			this.zoneNext = null;
		}

		for (var z = 0; z < this.zonesActive.length; z++)
		{
			var zoneActive = this.zonesActive[z];
			zoneActive.updateForTimerTick(universe, this);
		}

		this.draw(universe);

		var zoneCurrentEntity = this.zoneCurrent.entities[0];
		var zoneCurrentBounds = zoneCurrentEntity.collidable.collider.geometry.box();

		if (zoneCurrentBounds.containsPoint(this.entityForPlayer.locatable.loc.pos) == false)
		{
			for (var z = 0; z < this.zonesActive.length; z++)
			{
				var zoneActive = this.zonesActive[z];
				var zoneActiveEntity = zoneActive.entities[0];
				var zoneActiveMesh = zoneActiveEntity.collidable.collider;
				var zoneActiveBounds = zoneActiveMesh.geometry.box();
				var isPlayerInZoneActive = zoneActiveBounds.containsPoint
				(
					this.entityForPlayer.locatable.loc.pos
				);
				if (isPlayerInZoneActive == true)
				{
					this.zoneNext = zoneActive;
					this.zoneCurrent.entities.remove(this.entityForPlayer);
					this.zoneCurrent.entities.remove(this.cameraEntity);
					this.zoneNext.entities.push(this.entityForPlayer);
					this.zoneNext.entities.push(this.cameraEntity);
					break;
				}
			}
		}

		this.timerTicksSoFar++;
	}

	// drawable

	World.prototype.draw = function(universe)
	{
		var display = universe.display;
		var displayTypeName = display.constructor.name;
		if (displayTypeName == Display.name)
		{
			this.draw2D(universe);
		}
		else if (displayTypeName == Display3D.name)
		{
			this.draw3D(universe);
		}
	}

	World.prototype.draw2D = function(universe)
	{
		var display = universe.display;
		var world  = this;
		var facesToDraw = [];

		var cameraPos = world.camera.locatable.loc.pos;

		var spacePartitioningTreeRoot =
			world.spacePartitioningTreeForZonesActive.nodeRoot;

		spacePartitioningTreeRoot.addFacesBackToFrontForCameraPosToList
		(
			cameraPos,
			facesToDraw
		);

		var entities = world.entities;
		for (var b = 0; b < entities.length; b++)
		{
			var entity = entities[b];

			if (entity.drawable != null && entity.movable != null)
			{
				// hack
				// Find the floor the mover is standing on,
				// and draw the mover immediately after that floor.

				var entityPos = entity.locatable.loc.pos;
				var edgeForFootprint = new Edge
				([
					entityPos,
					entityPos.clone().add(new Coords(0, 0, 100))
				]);

				for (var g = facesToDraw.length - 1; g >= 0; g--)
				{
					var face = facesToDraw[g];
					var collisionForFootprint =
						universe.collisionHelper.collisionOfEdgeAndFace(edgeForFootprint, face);

					var isEntityStandingOnFace = (collisionForFootprint != null && collisionForFootprint.isActive);

					if (isEntityStandingOnFace)
					{
						var moverFaces = entity.collidable.collider.faces();
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
		display.drawFacesForCamera(facesToDraw, world.camera);
		display.drawText(world.name, 10, new Coords(0, 10));
		display.drawText(world.secondsElapsed(), 10, new Coords(0, 20));
	}

	World.prototype.draw3D = function(universe)
	{
		var display = universe.display;
		display.drawBackground();

		display.cameraSet(this.camera);

		display.lightingSet(null); // todo

		for (var z = 0; z < this.zonesActive.length; z++)
		{
			var zone = this.zonesActive[z];
			var entities = zone.entities;

			for (var b = 0; b < entities.length; b++)
			{
				var entity = entities[b];
				var drawable = entity.drawable;
				if (drawable != null)
				{
					var entityVisual = drawable.visual;
					entityVisual.draw(universe, this, display, entity);
				}
			}
		}
	}

	// collisions

	World.prototype.collisionsWithEdge = function(universe, edge, collisions)
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

}
