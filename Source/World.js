
function World(name, actions, inputToActionMappings, materials, entityDefns, sizeInPixels, zones, entityForPlayer)
{
	this.name = name;
	this.actions = actions.addLookupsByName();
	this.inputToActionMappings = inputToActionMappings.addLookups( function(x) { return x.inputName; } );
	this.materials = materials;
	this.entityDefns = entityDefns;
	this.sizeInPixels = sizeInPixels;
	this.zones = zones;
	this.entityForPlayer = entityForPlayer;

	this.zones.addLookupsByName();

	this.timerTicksSoFar = 0;
}

{
	// static methods

	World.new = function()
	{
		var mazeSizeInCells = new Coords(4, 4, 1);
		var mazeCellSizeInPixels = new Coords(80, 80, 40);
		var returnValue = World.random(mazeSizeInCells, mazeCellSizeInPixels);
		return returnValue;
	}

	World.random = function(mazeSizeInCells, mazeCellSizeInPixels)
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

		var inputToActionMappings =
		[
			new InputToActionMapping( "a", actions[0].name ),
			new InputToActionMapping( "e", actions[1].name ),
			new InputToActionMapping( "c", actions[2].name ),
			new InputToActionMapping( "d", actions[3].name ),
			new InputToActionMapping( "s", actions[4].name ),
			new InputToActionMapping( "w", actions[5].name ),
			new InputToActionMapping( "x", actions[6].name ),
			new InputToActionMapping( "z", actions[7].name ),
			new InputToActionMapping( "_", actions[8].name ),
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

		var textures =
		[
			new Texture
			(
				"Chest",
				ImageHelper.buildImageFromStrings
				(
					"Chest",
					pixelsGrayWithColoredBorders["R"]
				)
			),

			new Texture
			(
				"Door",
				ImageHelper.buildImageFromStrings
				(
					"Door",
					pixelsGrayWithColoredBorders["B"]
				)
			),

			new Texture
			(
				"Floor",
				ImageHelper.buildImageFromStrings
				(
					"Floor",
					pixelsGrayWithDarkBorder
				)
			),

			new Texture
			(
				"Goal",
				ImageHelper.buildImageFromStrings
				(
					"Goal",
					pixelsGrayWithColoredBorders["G"]
				)
			),

			new Texture
			(
				"Mover",
				ImageHelper.buildImageFromStrings
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
				ImageHelper.buildImageFromStrings
				(
					"Start",
					pixelsGrayWithColoredBorders["R"]
				)
			),

			new Texture
			(
				"Wall",
				ImageHelper.buildImageFromStrings
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
		).generateRandom();

		var ceilingHeight = maze.cellSizeInPixels.z;
		var moverHeight = ceilingHeight / 7;
		var chestHeight = moverHeight / 4;
		var doorHeight = moverHeight / 2 * 1.33; // ?

		var entityDefns =
		[
			new EntityDefn
			(
				"Chest",
				true, // isDrawable
				true, // isMovable
				meshBuilder.box
				(
					materials["Chest"],
					new Coords(2, 1, 1).multiplyScalar(chestHeight), // size
					new Coords(0, 0, -1).multiplyScalar(chestHeight) // pos
				).faceTexturesBuild()
			),

			new EntityDefn
			(
				"Door",
				true, // isDrawable
				true, // isMovable
				meshBuilder.box
				(
					materials["Door"],
					new Coords(.67, .05, 1).multiplyScalar(doorHeight), // size - ?
					new Coords(0, 0, -1).multiplyScalar(doorHeight) // pos
				).faceTexturesBuild()
			),

			new EntityDefn
			(
				"Mover",
				true, // isDrawable
				true, // isMovable
				meshBuilder.biped
				(
					materials["Mover"],
					moverHeight
				).faceTexturesBuild()
			),
		].addLookupsByName();

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

		var entityForPlayer = new Entity
		(
			"Player",
			entityDefns["Mover"],
			new Location
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
			)
		);

		var entityForMoverOther = new Entity
		(
			"MoverOther",
			entityDefns["Mover"],
			new Location
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
			)
		);

		var entityForChest = new Entity
		(
			"Chest",
			entityDefns["Chest"],
			new Location
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
			)
		);

		var entityForDoor = new Entity
		(
			"Door",
			entityDefns["Door"],
			new Location
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
			)
		);

		zoneStart.entities.addMany
		(
			[
				entityForPlayer,
				entityForMoverOther,
				entityForChest,
				entityForDoor,
			]
		);

		var returnValue = new World
		(
			"Maze-" + maze.sizeInCells.x + "x" + maze.sizeInCells.y,
			actions,
			inputToActionMappings,
			materials,
			entityDefns,
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
			if (zone.entities[0].meshTransformed.materials[1].name == "Start")
			{
				zoneStart = zone;
				break;
			}
		}

		this.zoneNext = zoneStart;
		this.zonesActive = [];

		var activityDefns = new ActivityDefn_Instances();
		this.entityForPlayer.activity = new Activity(activityDefns.UserInputAccept);

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

				var entityDefnName = entity.defn.name;
				if (entityDefnName == "Mover") // hack
				{
					entity.actions = [];

					var skeletonCloned = skeleton.clone();
					entity.constraints.prepend
					([
						new Constraint_Animate(skeleton, skeletonCloned, animationDefnGroupBiped),
						new Constraint_Pose(skeleton, skeletonCloned),
					]);

					entity.constraints.addLookupsByName();
				}
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

		var cameraEntity = new Entity
		(
			"EntityCamera",

			new EntityDefn
			(
				"Camera",
				false, // isDrawable
				true, // isMovable
				null // mesh
			),

			new Location
			(
				this.zoneNext.entities[0].loc.pos.clone().add
				(
					offsetOfCameraFromPlayer
				),

				new Orientation
				(
					new Coords(1, 0, 1), // forward
					new Coords(0, 0, 1) // down
				),

				this.zoneNext.name
			)
		);

		this.camera = new Camera
		(
			viewSizeInPixels,
			focalLength,
			cameraEntity.loc
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
			if (this.zoneNext.entities[0].meshTransformed.materials[0].name == "Goal")
			{
				var messageWin =
					"You reached the goal in "
					+ this.secondsElapsed()
					+ " seconds!  Press refresh for a new maze.";

				alert(messageWin);
			}

			for (var i = 0; i < this.zonesActive.length; i++)
			{
				var zoneActive = this.zonesActive[i];
				zoneActive.finalize();
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
				zoneActive.initialize();
				var facesForZone = zoneActive.entities[0].meshTransformed.faces();
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

		this.draw(universe.display);

		var zoneCurrentBounds = this.zoneCurrent.entities[0].meshTransformed.geometry.bounds();

		if (zoneCurrentBounds.containsPoint(this.entityForPlayer.loc.pos) == false)
		{
			for (var z = 0; z < this.zonesActive.length; z++)
			{
				var zoneActive = this.zonesActive[z];
				var zoneActiveMesh = zoneActive.entities[0].meshTransformed;
				var zoneActiveBounds = zoneActiveMesh.geometry.bounds();
				var isPlayerInZoneActive = zoneActiveBounds.containsPoint
				(
					this.entityForPlayer.loc.pos
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

	World.prototype.draw = function(display)
	{
		var displayTypeName = display.constructor.name;
		if (displayTypeName == "Display")
		{
			this.draw2D(display);
		}
		else if (displayTypeName == "Display3D")
		{
			this.draw3D(display);
		}
	}

	World.prototype.draw2D = function(display)
	{
		var world  = this;
		var facesToDraw = [];

		var cameraPos = world.camera.loc.pos;

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
			var entityDefn = entity.defn;

			if (entityDefn.isDrawable == true)
			{
				if (entityDefn.isMovable == true)
				{
					// hack
					// Find the floor the mover is standing on,
					// and draw the mover immediately after that floor.

					var edgeForFootprint = new Edge
					(
						[
							entity.loc.pos,
							entity.loc.pos.clone().add(new Coords(0, 0, 100))
						]
					);

					for (var g = facesToDraw.length - 1; g >= 0; g--)
					{
						var face = facesToDraw[g];
						var collisionForFootprint = Collision.findCollisionOfEdgeAndFace
						(
							edgeForFootprint,
							face
						);

						var isEntityStandingOnFace = (collisionForFootprint != null);

						if (isEntityStandingOnFace == true)
						{
							var moverFaces = entity.meshTransformed.faces();
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
		}

		display.drawBackground();
		display.drawFacesForCamera(facesToDraw, world.camera);
		display.drawText(world.name, 10, new Coords(0, 10));
		display.drawText(world.secondsElapsed(), 10, new Coords(0, 20));
	}

	World.prototype.draw3D = function(display)
	{
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
				var entityMesh = entity.meshTransformed;
				if (entityMesh != null)
				{
					display.drawMeshWithOrientation(entityMesh, entity.loc.orientation);
				}
			}
		}
	}

	// collisions

	World.prototype.collisionsWithEdge = function(edge, collisions)
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
				edge, collisions
			);
		}

		return collisions;
	}

}
