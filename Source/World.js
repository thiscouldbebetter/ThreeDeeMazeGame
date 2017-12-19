
function World(name, actions, inputToActionMappings, materials, entityDefns, sizeInPixels, zones, bodies)
{
	this.name = name;
	this.actions = actions.addLookups("name");
	this.inputToActionMappings = inputToActionMappings.addLookups("inputName");
	this.materials = materials;
	this.entityDefns = entityDefns;
	this.sizeInPixels = sizeInPixels;
	this.zones = zones;
	this.bodies = bodies;

	this.zones.addLookups("name");

	this.timerTicksSoFar = 0;
}

{
	// static methods

	World.buildRandom = function(mazeSizeInCells, mazeCellSizeInPixels)
	{
		var textures = Texture.Instances;

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
			new InputToActionMapping( "_a", actions[0].name ),
			new InputToActionMapping( "_e", actions[1].name ),
			new InputToActionMapping( "_c", actions[2].name ),
			new InputToActionMapping( "_d", actions[3].name ),
			new InputToActionMapping( "_s", actions[4].name ),
			new InputToActionMapping( "_w", actions[5].name ),
			new InputToActionMapping( "_x", actions[6].name ),
			new InputToActionMapping( "_z", actions[7].name ),
			new InputToActionMapping( "_ ", actions[8].name ),
		];

		var materials =
		[
			new Material
			(
				"MaterialMover",
				Color.Instances.Black,
				Color.Instances.Gray,
				textures.TestPattern
			),
			new Material
			(
				"MaterialGoal",
				Color.Instances.Blue,
				Color.Instances.GrayLight,
				textures.Goal
			),
			new Material
			(
				"MaterialStart",
				Color.Instances.Blue,
				Color.Instances.GrayDark,
				textures.Start
			),
			new Material
			(
				"MaterialWall",
				Color.Instances.Blue,
				Color.Instances.Gray,
				textures.Wall
			),
		];

		materials.addLookups("name");

		var meshMover = MeshHelper.buildBiped
		(
			materials["MaterialMover"],
			6 // height
		);

		var entityDefnMover = new EntityDefn
		(
			"EntityDefnMover",
			true, // isDrawable
			true, // isMovable
			meshMover
		);

		var entityDefns =
		[
			entityDefnMover,
		];

		entityDefns.addLookups("name");
		
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

		zones = maze.convertToZones
		(
			materials["MaterialWall"],
			cellPosOfStart, 
			materials["MaterialStart"], 
			cellPosOfGoal, 
			materials["MaterialGoal"]
		);

		var nameOfZoneStart = cellPosOfStart.toString();

		var entityForPlayer = new Entity
		(
			"Player", 
			entityDefns["EntityDefnMover"],
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
			entityDefns["EntityDefnMover"],
			new Location
			(
				cellPosOfStart.clone().multiply
				(
					maze.cellSizeInPixels
				).add
				(
					maze.cellSizeInPixels.multiplyScalar(.1)
				),
				new Orientation
				(
					new Coords(0, 1, 0),
					new Coords(0, 0, 1)
				),
				nameOfZoneStart // venue
			)
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
			// bodies
			[
				entityForPlayer,
				entityForMoverOther,
			]
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

		var entityForPlayer = this.bodies[0];

		var zoneName = entityForPlayer.loc.venue;
		this.zoneNext = this.zones[zoneName];
		this.zonesActive = [];

		var activityDefns = new ActivityDefn_Instances();
		entityForPlayer.activity = new Activity(activityDefns.UserInputAccept);

		var skeleton = SkeletonHelper.biped
		(
			6 // hack - figureHeightInPixels
		);

		var animationDefnGroupBiped = SkeletonHelper.bipedAnimationDefnGroup();

		var constraintsForMovers = 
		[
			new Constraint_Gravity(.1),
			new Constraint_Solid(),
			new Constraint_Friction(1, .5, .01),
			new Constraint_Movable(),
		];

		for (var i = 0; i < this.bodies.length; i++)
		{
			var entity = this.bodies[i];

			if (entity.defn.name == "EntityDefnMover") // hack
			{
				entity.actions = [];

				entity.constraints = [];
				entity.constraints.append(constraintsForMovers);

				var skeletonCloned = skeleton.clone();
				entity.constraints.prepend
				([
					new Constraint_Pose(skeleton, skeletonCloned),
					new Constraint_Animate(skeleton, skeletonCloned, animationDefnGroupBiped),
				]);

				entity.constraints.addLookups("name");
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
				"EntityDefnCamera",
				false, // isDrawable
				true, // isMovable
				null // mesh
			),

			new Location
			(
				this.zoneNext.entity.loc.pos.clone().add
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
			new Constraint_Follow(entityForPlayer, focalLength / followDivisor),
			new Constraint_OrientToward(entityForPlayer),
		].addLookups("name");

		this.bodies.push(cameraEntity);

		this.cameraEntity = cameraEntity;

		this.dateStarted = new Date();
	}

	World.prototype.update = function(universe)
	{
		if (this.zoneNext != null)
		{
			if (this.zoneNext.entity.meshTransformed.material.name == "MaterialGoal")
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
				var zoneActiveEntityIndex = this.bodies.indexOf(zoneActive.entity);
				this.bodies.splice(zoneActiveEntityIndex, 1);
			}

			this.zoneCurrent = this.zoneNext;

			this.zonesActive.length = 0;

			this.zonesActive.push(this.zoneCurrent);

			var namesOfZonesAdjacent = this.zoneCurrent.namesOfZonesAdjacent;
			for (var i = 0; i < namesOfZonesAdjacent.length; i++)
			{
				var nameOfZoneAdjacent = namesOfZonesAdjacent[i];
				var zoneAdjacent = this.zones[nameOfZoneAdjacent];
				this.zonesActive.push(zoneAdjacent);
			}

			var facesForZonesActive = [];

			for (var i = 0; i < this.zonesActive.length; i++)
			{
				var zoneActive = this.zonesActive[i];
				zoneActive.initialize();
				this.bodies.push(zoneActive.entity);

				facesForZonesActive.append
				(
					zoneActive.entity.meshTransformed.faces
				);
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
			zoneActive.update(universe, this);
		}

		for (var b = 0; b < this.bodies.length; b++)
		{
			var entity = this.bodies[b];

			if (entity.activity != null)
			{
				entity.activity.perform(universe, this, entity);
			}

			if (entity.actions != null)
			{
				for (var a = 0; a < entity.actions.length; a++)
				{
					var action = entity.actions[a];
					action.perform(universe, this, entity);
				}

				entity.actions.length = 0;
			}

			var entityConstraints = entity.constraints;

			if (entityConstraints != null)
			{
				entity.resetMeshTransformed();
				for (var c = 0; c < entityConstraints.length; c++)
				{
					var constraint = entityConstraints[c];
					constraint.constrainEntity(this, entity);
				}
			}
		}

		this.draw(universe.display);

		var entityForPlayer = this.bodies[0];

		var zoneCurrentBounds = this.zoneCurrent.entity.meshTransformed.bounds;

		if (zoneCurrentBounds.containsPoint(entityForPlayer.loc.pos) == false)
		{
			for (var z = 0; z < this.zonesActive.length; z++)
			{
				var zoneActive = this.zonesActive[z];
				var zoneActiveMesh = zoneActive.entity.meshTransformed;
				var zoneActiveBounds = zoneActiveMesh.bounds;
				var isPlayerInZoneActive = zoneActiveBounds.containsPoint
				(
					entityForPlayer.loc.pos
				);
				if (isPlayerInZoneActive == true)
				{
					this.zoneNext = zoneActive;
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

		var bodies = world.bodies;
		for (var b = 0; b < bodies.length; b++)
		{
			var entity = bodies[b];
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
							var moverFaces = entity.meshTransformed.faces;
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

		display.clear();
		display.drawFacesForCamera(facesToDraw, world.camera);
		display.drawText(world.name, 10, new Coords(0, 10));
		display.drawText(world.secondsElapsed(), 10, new Coords(0, 20));
		display.drawText
 		(
			world.bodies[0].loc.pos.clone().floor().toString(), 
			10, // fontHeightInPixels
			new Coords(0, 30)
		);
	}

	World.prototype.draw3D = function(display)
	{
		display.clear();

		display.cameraSet(this.camera);

		display.lightingSet(null); // todo

		var bodies = this.bodies;

		for (var b = 0; b < bodies.length; b++)
		{
			var body = bodies[b];
			var bodyMesh = body.meshTransformed;
			if (bodyMesh != null)
			{
				display.drawMeshWithOrientation(bodyMesh, body.loc.orientation);
			}
		}
	}
}
