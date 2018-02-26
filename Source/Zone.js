
function Zone(name, pos, namesOfZonesAdjacent, meshes)
{
	this.name = name;
	this.namesOfZonesAdjacent = namesOfZonesAdjacent;
	this.entity = new Entity
	(
		this.name,
		new EntityDefn
		(
			this.name,
			true, // isDrawable
			false, // isMovable
			meshes[0] // hack
		),
		new Location
		(
			pos,
			new Orientation
			(
				new Coords(1, 0, 0),
				new Coords(0, 0, 1)
			),
			this.name // venue
		)
	);
}
{
	Zone.manyFromMaze = function
	(
		maze,
		materialWall,
		materialFloor,
		cellPosOfStart,
		materialStart,
		cellPosOfGoal,
		materialGoal
	)
	{
		var returnValues = [];

		var meshBuilder = new MeshBuilder();

		var sizeInPixels = maze.sizeInPixels;
		var cellSizeInPixels = maze.cellSizeInPixels;
		var sizeInCells = maze.sizeInCells;
		var neighborOffsets = maze.neighborOffsets;

		var cellPos = new Coords(0, 0, 0);
		var cellPosInPixels = new Coords();

		for (var y = 0; y < sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellPos.x = x;

				var materialForRoomFloor;
				if (cellPos.equals(cellPosOfStart) == true)
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

				Zone.manyFromMaze_Cell
				(
					maze, cellPos, cellPosInPixels, cellSizeInPixels,
					materialWall, materialForRoomFloor, materialFloor, returnValues
				);
			}
		}

		return returnValues;
	}

	Zone.manyFromMaze_Cell = function
	(
		maze,
		cellPos,
		cellPosInPixels,
		cellSizeInPixels,
		materialWall,
		materialRoomFloor,
		materialConnectorFloor,
		returnValues
	)
	{
		var cellSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(2);
		var roomSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(8);
		var meshBuilder = new MeshBuilder();

		cellPosInPixels.overwriteWith(cellPos).multiply
		(
			cellSizeInPixels
		);

		var cellCurrent = maze.cellAtPos(cellPos);

		var zoneForNodeName = cellPos.toString();

		var tuple = Zone.manyFromMaze_Cell_Neighbors
		(
			maze, cellPos, cellCurrent, materialWall, materialConnectorFloor
		);

		var zonesForConnectorsToNeighbors = tuple[0];
		var zonesAdjacentNames = tuple[1];

		var mesh = meshBuilder.room
		(
			roomSizeInPixelsHalf,
			maze.neighborOffsets,
			cellCurrent.connectedToNeighbors,
			materialWall,
			materialRoomFloor
		);

		var zoneForNode = new Zone
		(
			zoneForNodeName,
			cellPosInPixels.clone(), //pos,
			zonesAdjacentNames,
			[ mesh ]
		);

		returnValues.push(zoneForNode);
		returnValues[zoneForNode.name] = zoneForNode;

		for (var i = 0; i < zonesForConnectorsToNeighbors.length; i++)
		{
			var zoneForConnector = zonesForConnectorsToNeighbors[i];
			returnValues.push(zoneForConnector);
			returnValues[zoneForConnector.name] = zoneForConnector;
		}
	}

	Zone.manyFromMaze_Cell_Neighbors = function
	(
		maze, cellPos, cellCurrent, materialWall, materialFloor
	)
	{
		var materialsWallAndFloor = [ materialWall, materialFloor ];

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
		var namesOfZonesAdjacent = [];

		var numberOfNeighbors = neighborOffsets.length;
		for (var n = 0; n < numberOfNeighbors; n++)
		{
			if (cellCurrent.connectedToNeighbors[n] == true)
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
				if (isNeighborOdd == true)
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
							(n == 1),
							(n == 1),
							(n != 1),
							(n != 1)
						],
						materialWall, materialFloor
					);

					var zoneForConnector = new Zone
					(
						zoneForConnectorName,
						connectorPosInPixels,
						// namesOfZonesAdjacent
						[
							zoneForNodeName,
							zoneNeighborName,
						],
						[ mesh ]
					);

					zonesForConnectorsToNeighbors.push(zoneForConnector);
				}
			}

		} // end for each neighbor

		return [ zonesForConnectorsToNeighbors, zonesAdjacentNames ];
	}

	Zone.prototype.finalize = function()
	{
		// todo
	}

	Zone.prototype.initialize = function()
	{
		this.entity.resetMeshTransformed();

		var meshTransformed = this.entity.meshTransformed;
		meshTransformed.transform
		(
			new Transform_Locate(this.entity.loc)
		);
	}

	Zone.prototype.update = function()
	{
		// todo
	}

	Zone.prototype.zonesAdjacent = function(world)
	{
		var returnValues = [];

		var zones = world.zones;
		var namesOfZonesAdjacent = this.namesOfZonesAdjacent;
		for (var i = 0; i < namesOfZonesAdjacent.length; i++)
		{
			var nameOfZoneAdjacent = namesOfZonesAdjacent[i];
			var zoneAdjacent = zones[nameOfZoneAdjacent];
			returnValues.push(zoneAdjacent);
		}

		return returnValues;
	}

	// collisions

	Zone.prototype.collisionsWithEdge = function(edge, collisions)
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var zoneMesh = this.entity.meshTransformed.geometry;

		Collision.addCollisionsOfEdgeAndMeshToList
		(
			edge, zoneMesh, collisions
		);

		return collisions;
	}

}
