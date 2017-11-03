
function World(name, sizeInPixels, zones, bodies)
{
	this.name = name;
	this.sizeInPixels = sizeInPixels;
	this.zones = zones;
	this.bodies = bodies;

	this.zones.addLookups("name");
}

{
	// static methods

	World.buildRandom = function(materials, entityDefns, mazeSizeInCells, mazeCellSizeInPixels)
	{
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
				nameOfZoneStart,
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
				)
			)
		);	

		var entityForMoverOther = new Entity
		(
			"MoverOther", 
			entityDefns["EntityDefnMover"],
			new Location
			(
				nameOfZoneStart,
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
				)
			)
		);
	
		var returnValue = new World
		(
			"Maze-" + maze.sizeInCells.x + "x" + maze.sizeInCells.y,
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

	World.prototype.initialize = function()
	{
		this.meshesToDraw = [];

		var entityForPlayer = this.bodies[0];
	
		this.zoneNext = this.zones[entityForPlayer.loc.zoneName];
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

			if (entity.defn.mesh.name == "MeshBiped")
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

		var viewSizeInPixels = Globals.Instance.displayHelpers[0].sizeInPixels.clone();
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
				this.zoneNext.name,

				this.zoneNext.entity.loc.pos.clone().add
				(
					offsetOfCameraFromPlayer
				),

				new Orientation
				(
					new Coords(1, 0, 1), // forward
					new Coords(0, 0, 1) // down
				)
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

	World.prototype.update = function()
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
			zoneActive.update();
		}		

		for (var b = 0; b < this.bodies.length; b++)
		{
			var entity = this.bodies[b];

			if (entity.activity != null)
			{
				entity.activity.perform(this, entity);
			}

			if (entity.actions != null)
			{
				for (var a = 0; a < entity.actions.length; a++)
				{
					var action = entity.actions[a];
					action.perform(this, entity);
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

		var displayHelpers = Globals.Instance.displayHelpers;

		for (var i = 0; i < displayHelpers.length; i++)
		{
			var displayHelper = displayHelpers[i];
			displayHelper.drawWorld(this);
		}

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
	}
}
