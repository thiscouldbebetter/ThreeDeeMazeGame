
class PlaceBuilder
{
	static actionsCreate(): Action[]
	{
		var amountToMoveForward = .4;
		var amountToMoveBackward = amountToMoveForward / 2;
		var amountToYaw = 0.1;
		var amountToStrafe = .1;

		var actions =
		[
			Action_Turn.fromAmountToTurnRightAndDown(Coords.fromXY(0 - amountToYaw, 0)), // 0 - a - turn right
			new Action_DoSomething(), // 1
			Action_Move.fromAmountToMoveForwardRightDown(Coords.fromXY(0, amountToStrafe)), // 2
			Action_Turn.fromAmountToTurnRightAndDown(Coords.fromXY(amountToYaw, 0)), // 3
			Action_Move.fromAmountToMoveForwardRightDown(Coords.fromXY(-amountToMoveBackward, 0)), // 4
			Action_Move.fromAmountToMoveForwardRightDown(Coords.fromXY(amountToMoveForward, 0)), // 5
			new Action_Stop(), // 6
			Action_Move.fromAmountToMoveForwardRightDown(Coords.fromXY(0, 0 - amountToStrafe)), // 7
			new Action_Jump(.6), // 8
			Action_Talk.create() // 9
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
			atim(actions[8], inputs.Space),
			atim(actions[9], inputs.t)
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

	static placeMazeBuildRandom
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

		var zones = this.zonesBuildForMazeMaterialsStartAndGoalPositions
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
			this.entityBuildPlayer
			(
				maze, nameOfZoneStart, cellPosOfStart, meshMover
			);

		var entityForMoverOther =
			this.entityBuildMoverOther
			(
				maze, nameOfZoneStart, cellPosOfStart, meshMover
			);

		var entityForChest =
			this.entityBuildChest
			(
				maze,
				nameOfZoneStart,
				cellPosOfStart,
				materialsByName.get("Chest"),
				moverHeight
			);

		var entityForDoor =
			this.entityBuildDoor
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

	static entityBuildPlayer
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

	static entityBuildMoverOther
	(
		maze: Maze,
		nameOfZoneStart: string,
		cellPosOfStart: Coords,
		meshDefnMover: MeshTextured
	): Entity
	{
		var pos =
			cellPosOfStart
				.clone()
				.add
				(
					Coords
						.fromXYZ(1, 1, 0)
						.multiplyScalar(.1)
				)
				.multiply(maze.cellSizeInPixels);

		var loc = Disposition.fromPosOrientationAndPlaceName
		(
			pos,

			Orientation.fromForward
			(
				Coords.fromXY(0, 1)
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
		var talker = Talker.fromConversationDefnName("Talk_Conversation_psv");

		var entityForMoverOther = Entity.fromNameAndProperties
		(
			"MoverOther",
			[
				collidable,
				drawable,
				groundable,
				locatable,
				movable,
				talker
			]
		);

		return entityForMoverOther;
	}

	static entityBuildChest
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

	static entityBuildDoor
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

	static zonesBuildForMazeMaterialsStartAndGoalPositions
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
		var zones = new Array<Zone2>();

		var cellSizeInPixels = maze.cellSizeInPixels;
		var sizeInCells = maze.sizeInCells;

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
				else if (cellPos.equals(cellPosOfGoal) )
				{
					materialForRoomFloor =  materialGoal;
				}
				else
				{
					materialForRoomFloor = materialFloor;
				}

				this.zonesBuild_Cell
				(
					maze, cellPos, cellPosInPixels, cellSizeInPixels,
					materialWall, materialForRoomFloor, materialFloor,
					zones
				);
			}
		}

		return zones;
	}

	static zonesBuild_Cell
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

		var roomSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(8);
		var meshBuilder = new MeshBuilder();

		cellPosInPixels.overwriteWith(cellPos).multiply
		(
			cellSizeInPixels
		);

		var cellCurrent = maze.cellAtPos(cellPos);

		var zoneForNodeName = cellPos.toString();

		var tuple = this.zonesBuild_Cell_Neighbors
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
		var visual = VisualTransform.fromTransformAndChild
		(
			Transform_Multiple.fromChildren
			([
				new Transform_Overwrite(mesh),
				Transform_Orient.fromOrientation(loc.orientation),
				Transform_Translate.fromDisplacement(loc.pos)
			]),
			new VisualMesh(mesh.clone())
		);
		var zoneEntity = Entity.fromNameAndProperties
		(
			this.name,
			[
				Collidable.fromCollider(mesh),
				Drawable.fromVisual(visual),
				Locatable.fromDisposition(loc)
			]
		);

		var zoneForNode = Zone2.fromNamePosNeighborNamesAndEntities
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

	static zonesBuild_Cell_Neighbors
	(
		maze: Maze,
		cellPos: Coords,
		cellCurrent: any,
		materialWall: Material,
		materialFloor: Material
	): any[][]
	{
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
						Coords.fromXYZ
						(
							cellSizeInPixelsHalf.x,
							cellSizeInPixelsHalf.y,
							0
						).multiply
						(
							neighborOffset
						)
					);

					var connectorSizeInPixels = Coords.fromXYZ
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
					var visual = VisualTransform.fromTransformAndChild
					(
						Transform_Multiple.fromChildren
						([
							new Transform_Overwrite(mesh),
							new Transform_Orient(loc.orientation),
							new Transform_Translate(loc.pos)
						]),
						VisualMesh.fromMesh(mesh.clone() )
					);
					var zoneEntity = Entity.fromNameAndProperties
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

}