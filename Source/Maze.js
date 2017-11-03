
function Maze(cellSizeInPixels, sizeInCells, neighborOffsets)
{
	this.cellSizeInPixels = cellSizeInPixels;
	this.sizeInCells = sizeInCells;
	this.neighborOffsets = neighborOffsets;

	this.sizeInPixels = this.sizeInCells.clone().multiply(this.cellSizeInPixels);

	var numberOfNeighbors = this.neighborOffsets.length;

	var numberOfCellsInMaze = this.sizeInCells.productOfDimensions();

	this.cells = [];

	for (var i = 0; i < numberOfCellsInMaze; i++)
	{
		var cell = new MazeCell(numberOfNeighbors);
		this.cells.push(cell);
	}

	this.sizeInCellsMinusOnes = sizeInCells.clone().subtract
	(
		new Coords(1, 1, 1)
	);
}

{
	// static methods

	Maze.prototype.generateRandom = function()
	{		
		var cells = this.cells;
		var sizeInCells = this.sizeInCells;
		var neighborOffsets = this.neighborOffsets;

		var numberOfCellsInMaze = this.sizeInCells.productOfDimensions();
		var numberOfNeighbors = neighborOffsets.length;

		var cellPos = new Coords(0, 0, 0);
		var cellPosNeighbor = new Coords(0, 0, 0);

		var numberOfCellsInLargestNetworkSoFar = 0;

		while (numberOfCellsInLargestNetworkSoFar < numberOfCellsInMaze)
		{
			for (var y = 0; y < sizeInCells.y; y++)
			{
				cellPos.y = y;

				for (var x = 0; x < sizeInCells.x; x++)
				{
					cellPos.x = x;

					var numberOfCellsInNetworkMerged = this.generateRandom_ConnectCellToRandomNeighbor
					(
						cellPos, 
						cellPosNeighbor
					);

					if (numberOfCellsInNetworkMerged > numberOfCellsInLargestNetworkSoFar)
					{
						numberOfCellsInLargestNetworkSoFar = numberOfCellsInNetworkMerged
					}
				}
			}
		}

		return this;
	}

	Maze.prototype.generateRandom_ConnectCellToRandomNeighbor = function
	(
		cellPos, 
		cellPosNeighbor
	)
	{
		var cells = this.cells;
		var sizeInCells = this.sizeInCells;
		var sizeInCellsMinusOnes = this.sizeInCellsMinusOnes;
		var neighborOffsets = this.neighborOffsets;
		var numberOfNeighbors = neighborOffsets.length;
	
		var numberOfCellsInNetworkMerged = 0;

		var cellCurrent = this.cellAtPos(cellPos);

		var randomizer = Randomizer.Instance;

		var neighborOffsetIndex = Math.floor
		(
			randomizer.next() * numberOfNeighbors
		);

		var neighborOffset = neighborOffsets[neighborOffsetIndex];

		cellPosNeighbor.overwriteWith
		(
			cellPos
		).add
		(
			neighborOffset
		);

		if (cellPosNeighbor.isWithinRangeMax(sizeInCellsMinusOnes) == true)
		{
			if (cellCurrent.connectedToNeighbors[neighborOffsetIndex] == false)
			{
				var cellNeighbor = this.cellAtPos(cellPosNeighbor);

				if (cellCurrent.network.networkID != cellNeighbor.network.networkID)
				{
					cellCurrent.connectedToNeighbors[neighborOffsetIndex] = true;

					var neighborOffsetIndexReversed = 
						Math.floor(neighborOffsetIndex / 2) 
						* 2 
						+ (1 - (neighborOffsetIndex % 2));

					cellNeighbor.connectedToNeighbors[neighborOffsetIndexReversed] = true;

					var networkMerged = MazeCellNetwork.mergeNetworks
					(
						cellCurrent.network,
						cellNeighbor.network
					);

					numberOfCellsInNetworkMerged = networkMerged.cells.length;
				}
			}
		}	

		return numberOfCellsInNetworkMerged;	
	}

	// instance methods

	Maze.prototype.cellAtPos = function(cellPos)
	{
		var cellIndex = this.indexOfCellAtPos(cellPos);
		return this.cells[cellIndex];
	}

	Maze.prototype.convertToZones = function
	(
		materialNormal, 
		cellPosOfStart, 
		materialStart, 
		cellPosOfGoal, 
		materialGoal
	)
	{
		var returnValues = [];

		var sizeInPixels = this.sizeInPixels;
		var cellSizeInPixels = this.cellSizeInPixels;

		var cellSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(2);

		var roomSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(8);

		var hallWidthMultiplier = .5;

		var cellPos = new Coords(0, 0, 0);
		var numberOfNeighbors = this.neighborOffsets.length;

		for (var y = 0; y < this.sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < this.sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cellPosInPixels = cellPos.clone().multiply
				(
					cellSizeInPixels
				);

				var cellCurrent = this.cellAtPos(cellPos);

				var zoneForNodeName = cellPos.toString();

				var faceIndicesToRemove = [ 4 ];
				var namesOfZonesAdjacent = [];

				var connectedToNeighbors = cellCurrent.connectedToNeighbors;

				for (var n = 0; n < numberOfNeighbors; n++)
				{
					if (cellCurrent.connectedToNeighbors[n] == true)
					{
						faceIndicesToRemove.push(n);
						
						var neighborOffset = this.neighborOffsets[n];
						var neighborPosInCells = cellPos.clone().add
						(
							neighborOffset
						);

						namesOfZonesAdjacent.push
						(
							neighborPosInCells.toString()
						);
						var zoneForConnectorName;
						if (n % 2 == 1)
						{
							zoneForConnectorName = 
								cellPos.toString() 
								+ neighborPosInCells.toString();
						}
						else
						{
							zoneForConnectorName = 
								neighborPosInCells.toString() 
								+ cellPos.toString();
						}
						namesOfZonesAdjacent.push(zoneForConnectorName);
					}
				}

				var mesh = MeshHelper.buildRoom
				(
					zoneForNodeName, 
					materialNormal,
					roomSizeInPixelsHalf.x,
					roomSizeInPixelsHalf.y,
					roomSizeInPixelsHalf.z,
					this.neighborOffsets,
					cellCurrent.connectedToNeighbors
				);

				var zoneForNode = new Zone
				(
					zoneForNodeName, 
					cellPosInPixels, //pos, 
					namesOfZonesAdjacent,
					// meshes
					[
						mesh
					]
				);

				returnValues.push(zoneForNode);
				returnValues[zoneForNode.name] = zoneForNode;

				for (var n = 1; n < numberOfNeighbors; n += 2)
				{
					var isConnectedToNeighbor = cellCurrent.connectedToNeighbors[n];

					if (isConnectedToNeighbor == true)
					{
						var neighborOffset = this.neighborOffsets[n];
						var neighborPosInCells = cellPos.clone().add(neighborOffset);
						var zoneForConnectorName = 
							cellPos.toString() 
							+ neighborPosInCells.toString();

						var connectorPosInPixels = cellPosInPixels.clone().add
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

						var mesh = MeshHelper.buildRoom
						(
							zoneForConnectorName, 
							materialNormal,
							connectorSizeInPixels.x,
							connectorSizeInPixels.y,
							connectorSizeInPixels.z,
							this.neighborOffsets,
							// connectedToNeighbors
							[
								(n == 1),
								(n == 1),
								(n != 1),
								(n != 1)
							]
						);

						var zoneForConnector = new Zone
						(
							zoneForConnectorName,
							connectorPosInPixels,
							// namesOfZonesAdjacent
							[
								zoneForNodeName,
								neighborPosInCells.toString(),
							],
							// meshes
							[
								mesh
							]
						);

						returnValues.push(zoneForConnector);
						returnValues[zoneForConnector.name] = zoneForConnector;
					}

				} // end for each neighbor
			}
		}

		var zoneStart = returnValues[cellPosOfStart.toString()];
		var meshStart = zoneStart.entity.meshTransformed;

		meshStart.material = materialStart;
		meshStart.recalculateDerivedValues();

		var zoneGoal = returnValues[cellPosOfGoal.toString()];
		var meshGoal = zoneGoal.entity.meshTransformed;
		meshGoal.material = materialGoal;
		meshGoal.recalculateDerivedValues();

		return returnValues;
	}

	Maze.prototype.indexOfCellAtPos = function(cellPos)
	{
		var cellIndex = cellPos.y * this.sizeInCells.x + cellPos.x;

		return cellIndex;
	}
}
