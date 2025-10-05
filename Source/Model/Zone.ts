
class Zone2 extends PlaceBase
{
	name: string;
	pos: Coords;
	namesOfZonesAdjacent: string[];
	entities: Entity[];

	constructor
	(
		name: string,
		pos: Coords,
		namesOfZonesAdjacent: string[],
		entities: Entity[]
	)
	{
		super
		(
			name,
			null, // defnName
			null, // parentName
			null, // size
			entities
		);
		this.pos = pos;
		this.namesOfZonesAdjacent = namesOfZonesAdjacent;
		this.entities = entities;

		var entity = this.entities[0];
		var meshTransformed = Collidable.of(entity).collider;
		meshTransformed.transform
		(
			new Transform_Locate(Locatable.of(entity).loc)
		);
	}

	static manyFromMaze
	(
		maze: Maze,
		materialWall: Material,
		materialFloor: Material,
		cellPosOfStart: Coords,
		materialStart: Material,
		cellPosOfGoal: Coords,
		materialGoal: Material
	): Zone2[]
	{
		var returnValues = new Array<Zone2>();

		//var meshBuilder = new MeshBuilder();

		//var sizeInPixels = maze.sizeInPixels;
		var cellSizeInPixels = maze.cellSizeInPixels;
		var sizeInCells = maze.sizeInCells;
		//var neighborOffsets = maze.neighborOffsets;

		var cellPos = Coords.create();
		var cellPosInPixels = Coords.create();

		for (var y = 0; y < sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellPos.x = x;

				var materialForRoomFloor;
				if (cellPos.equals(cellPosOfStart))
				{
					materialForRoomFloor = materialStart;
				}
				else if (cellPos.equals(cellPosOfGoal) == true)
				{
					materialForRoomFloor =  materialGoal;
				}
				else
				{
					materialForRoomFloor = materialFloor;
				}

				this.manyFromMaze_Cell
				(
					maze, cellPos, cellPosInPixels, cellSizeInPixels,
					materialWall, materialForRoomFloor, materialFloor, returnValues
				);
			}
		}

		return returnValues;
	}

	static manyFromMaze_Cell
	(
		maze: Maze,
		cellPos: Coords,
		cellPosInPixels: Coords,
		cellSizeInPixels: Coords,
		materialWall: Material,
		materialRoomFloor: Material,
		materialConnectorFloor: Material,
		returnValues: Zone2[]
	): void
	{
		var returnValuesByName = new Map<string, Zone2>();

		//var cellSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(2);
		var roomSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(8);
		var meshBuilder = new MeshBuilder();

		cellPosInPixels.overwriteWith(cellPos).multiply
		(
			cellSizeInPixels
		);

		var cellCurrent = maze.cellAtPos(cellPos);

		var zoneForNodeName = cellPos.toString();

		var tuple = Zone2.manyFromMaze_Cell_Neighbors
		(
			maze, cellPos, cellCurrent, materialWall, materialConnectorFloor
		);

		var zonesForConnectorsToNeighbors: Zone2[] = tuple[0];
		var zonesAdjacentNames: string[] = tuple[1];

		var mesh = meshBuilder.room
		(
			roomSizeInPixelsHalf,
			maze.neighborOffsets,
			cellCurrent.connectedToNeighbors,
			materialWall,
			materialRoomFloor,
			null, null // ?
		);

		var loc = Disposition.fromPos(cellPosInPixels.clone());
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
		var zoneEntity = new Entity
		(
			this.name,
			[
				Collidable.fromCollider(mesh),
				Drawable.fromVisual(visual),
				new Locatable(loc)
			]
		);

		var zoneForNode = new Zone2
		(
			zoneForNodeName,
			cellPosInPixels.clone(), //pos,
			zonesAdjacentNames,
			[ zoneEntity ]
		);

		returnValues.push(zoneForNode);
		returnValuesByName.set(zoneForNode.name, zoneForNode);

		for (var i = 0; i < zonesForConnectorsToNeighbors.length; i++)
		{
			var zoneForConnector = zonesForConnectorsToNeighbors[i];
			returnValues.push(zoneForConnector);
			returnValuesByName.set(zoneForConnector.name, zoneForConnector);
		}
	}

	static manyFromMaze_Cell_Neighbors
	(
		maze: Maze, cellPos: Coords, cellCurrent: any,
		materialWall: Material, materialFloor: Material
	): any[][]
	{
		//var materialsWallAndFloor = [ materialWall, materialFloor ];

		var zonesForConnectorsToNeighbors = [];
		var zonesAdjacentNames = [];

		var cellSizeInPixels = maze.cellSizeInPixels;
		var cellSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(2);
		var roomSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(8);
		var hallWidthMultiplier = 0.5;
		var meshBuilder = new MeshBuilder();

		var zoneForNodeName = cellPos.toString();
		var neighborOffsets = maze.neighborOffsets;
		var faceIndicesToRemove = [ 4 ]; // Ceiling?
		//var namesOfZonesAdjacent = [];

		var numberOfNeighbors = neighborOffsets.length;
		for (var n = 0; n < numberOfNeighbors; n++)
		{
			var isCellCurrentConnectedToNeighbor =
				cellCurrent.connectedToNeighbors[n];

			if (isCellCurrentConnectedToNeighbor)
			{
				faceIndicesToRemove.push(n);

				var neighborOffset = neighborOffsets[n];
				var neighborPosInCells = cellPos.clone().add
				(
					neighborOffset
				);

				var zoneNeighborName = neighborPosInCells.toString();

				var zoneConnectorName;
				if (n % 2 == 1)
				{
					zoneConnectorName = zoneForNodeName + zoneNeighborName;
				}
				else
				{
					zoneConnectorName = zoneNeighborName + zoneForNodeName
				}

				zonesAdjacentNames.push(zoneConnectorName);

				var isNeighborOdd = n % 2;
				// Only create connectors for neighbors south and east,
				// because north and west are handled by another node.
				if (isNeighborOdd)
				{
					var neighborOffset = neighborOffsets[n];
					var neighborPosInCells = cellPos.clone().add(neighborOffset);
					var zoneForConnectorName = zoneForNodeName + zoneNeighborName;

					var connectorPosInPixels = cellPos.clone().multiply
					(
						cellSizeInPixels
					).clone().add
					(
						new Coords
						(
							cellSizeInPixelsHalf.x,
							cellSizeInPixelsHalf.y,
							0
						).multiply
						(
							neighborOffset
						)
					);

					var connectorSizeInPixels = new Coords
					(
						(
							n == 1
							? (cellSizeInPixelsHalf.x - roomSizeInPixelsHalf.x)
							: (roomSizeInPixelsHalf.x * hallWidthMultiplier)
						),
						(
							n == 3 ?
							(cellSizeInPixelsHalf.y - roomSizeInPixelsHalf.y)
							: (roomSizeInPixelsHalf.y * hallWidthMultiplier)
						),
						roomSizeInPixelsHalf.z
					);

					var mesh = meshBuilder.room
					(
						connectorSizeInPixels,
						neighborOffsets,
						// connectedToNeighbors
						[
							(n == 1), (n == 1), (n != 1), (n != 1)
						],
						materialWall,
						materialFloor,
						1 / hallWidthMultiplier, // doorwayWidthScaleFactor
						.1 // wallThickness
					);

					var loc =
						Disposition.fromPos(connectorPosInPixels.clone());
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
					var zoneEntity = new Entity
					(
						this.name,
						[
							Collidable.fromCollider(mesh),
							Drawable.fromVisual(visual),
							new Locatable(loc)
						]
					);

					var zoneForConnector = new Zone2
					(
						zoneForConnectorName,
						connectorPosInPixels,
						// namesOfZonesAdjacent
						[
							zoneForNodeName,
							zoneNeighborName,
						],
						[ zoneEntity ]
					);

					zonesForConnectorsToNeighbors.push(zoneForConnector);
				}
			}

		} // end for each neighbor

		return [ zonesForConnectorsToNeighbors, zonesAdjacentNames ];
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var b = 0; b < this.entities.length; b++)
		{
			var entity = this.entities[b];
			uwpe.entitySet(entity);

			var actor = Actor.of(entity);
			if (actor != null)
			{
				var activity = actor.activity;
				if (activity != null)
				{
					activity.perform(uwpe);
				}

				var actions = actor.actions;
				if (actions != null)
				{
					for (var a = 0; a < actions.length; a++)
					{
						var action = actions[a];
						action.perform(uwpe);
					}

					actions.length = 0;
				}
			}

			var entityAnimatable = Animatable2.of(entity);
			if (entityAnimatable != null)
			{
				entityAnimatable.updateForTimerTick(uwpe);
			}

			var entityConstrainable = Constrainable.of(entity);

			if (entityConstrainable != null)
			{
				var entityConstraints = entityConstrainable.constraints;
				for (var c = 0; c < entityConstraints.length; c++)
				{
					var constraint = entityConstraints[c];
					constraint.constrain(uwpe);
				}
			}
		}
	}

	zonesAdjacent(world: WorldExtended): Zone2[]
	{
		var returnValues = [];

		var zonesByName = world.zonesByName;
		var namesOfZonesAdjacent = this.namesOfZonesAdjacent;
		for (var i = 0; i < namesOfZonesAdjacent.length; i++)
		{
			var nameOfZoneAdjacent = namesOfZonesAdjacent[i];
			var zoneAdjacent = zonesByName.get(nameOfZoneAdjacent);
			returnValues.push(zoneAdjacent);
		}

		return returnValues;
	}

	// collisions

	collisionsWithEdge
	(
		universe: Universe, edge: Edge, collisions: Collision[]
	): Collision[]
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var zoneMesh =
			(Collidable.of(this.entities[0]).collider as MeshTextured).geometry;

		universe.collisionHelper.collisionsOfEdgeAndMesh
		(
			edge, zoneMesh, collisions, null // first?
		);

		return collisions;
	}
}
