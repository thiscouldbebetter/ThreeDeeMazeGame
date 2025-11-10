"use strict";
class PlaceBuilder {
    static actionsCreate() {
        var amountToMoveForward = .4;
        var amountToMoveBackward = amountToMoveForward / 2;
        var amountToYaw = 0.1;
        var amountToStrafe = .1;
        var actions = [
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
    static actionToInputsMappingsCreate(actions) {
        var atim = (action, input) => ActionToInputsMapping.fromActionNameAndInputName(action.name, input.name);
        var inputs = Input.Instances();
        var actionToInputsMappings = [
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
    static entityBuildPlayer(maze, nameOfZoneStart, cellPosOfStart, mesh) {
        var loc = Disposition.fromPosOrientationAndPlaceName(cellPosOfStart.clone().multiply(maze.cellSizeInPixels).add(Coords.fromXYZ(0, 0, -10)), Orientation.fromForwardAndDown(Coords.fromXYZ(0, 1, 0), Coords.fromXYZ(0, 0, 1)), nameOfZoneStart // venue
        );
        var locatable = Locatable.fromDisposition(loc);
        var visual = VisualMesh.fromMesh(mesh.clone());
        var skeletonAtRest = SkeletonHelper.biped(6 // hack - figureHeightInPixels
        );
        var transformPose = Transform_MeshPoseWithSkeleton.fromMeshSkeletonAndBoneInfluences(mesh, skeletonAtRest, BoneInfluence.buildManyForBonesAndVertexGroups(skeletonAtRest.bonesAll, mesh.vertexGroups));
        visual = VisualTransform.fromTransformAndChild(Transform_Multiple.fromChildren([
            //new Transform_Overwrite(mesh),
            transformPose,
            new Transform_Orient2(loc.orientation), // hack
            Transform_Translate.fromDisplacement(loc.pos),
        ]), visual);
        var drawable = Drawable.fromVisual(visual);
        var animationDefnGroupBiped = SkeletonHelper.bipedAnimationDefnGroup();
        var skeletonPosed = transformPose.skeletonPosed;
        var animatable = new Animatable2(animationDefnGroupBiped, skeletonAtRest, skeletonPosed);
        var activity = Activity.fromDefnName("UserInputAccept");
        var actor = Actor.fromActivity(activity);
        var collidable = Collidable.fromCollider(mesh);
        var groundable = new Groundable();
        var movable = Movable.default();
        var entityForPlayer = Entity.fromNameAndProperties("Player", [
            actor,
            animatable, // hack
            collidable,
            drawable,
            groundable,
            locatable,
            movable
        ]);
        return entityForPlayer;
    }
    static entityBuildMoverOther(maze, nameOfZoneStart, cellPosOfStart, meshDefnMover) {
        var pos = cellPosOfStart
            .clone()
            .add(Coords
            .fromXYZ(1, 1, 0)
            .multiplyScalar(.1))
            .multiply(maze.cellSizeInPixels);
        var loc = Disposition.fromPosOrientationAndPlaceName(pos, Orientation.fromForward(Coords.fromXY(0, 1)), nameOfZoneStart // venue
        );
        var locatable = Locatable.fromDisposition(loc);
        var mesh = meshDefnMover;
        var visual = VisualTransform.fromTransformAndChild(Transform_Multiple.fromChildren([
            new Transform_Overwrite(mesh),
            Transform_Orient.fromOrientation(loc.orientation),
            Transform_Translate.fromDisplacement(loc.pos)
        ]), VisualMesh.fromMesh(mesh.clone()));
        var collidable = Collidable.fromCollider(mesh);
        var drawable = Drawable.fromVisual(visual);
        var groundable = new Groundable();
        var movable = Movable.default();
        var talker = Talker.fromConversationDefnName("Talk_Conversation_psv");
        var entityForMoverOther = Entity.fromNameAndProperties("MoverOther", [
            collidable,
            drawable,
            groundable,
            locatable,
            movable,
            talker
        ]);
        return entityForMoverOther;
    }
    static entityBuildChest(maze, nameOfZoneStart, cellPosOfStart, material, moverHeight) {
        var chestHeight = moverHeight / 4;
        var meshBuilder = MeshBuilder.Instance();
        var mesh = meshBuilder.box(material, Coords.fromXYZ(2, 1, 1).multiplyScalar(chestHeight), // size
        Coords.fromXYZ(0, 0, -1).multiplyScalar(chestHeight) // pos
        ).faceTexturesBuild();
        var loc = Disposition.fromPosOrientationAndPlaceName(cellPosOfStart.clone().add(Coords.fromXYZ(1, -1, 0).multiplyScalar(.05)).multiply(maze.cellSizeInPixels), Orientation.fromForwardAndDown(Coords.fromXYZ(1, -1, 0), Coords.fromXYZ(0, 0, 1)), nameOfZoneStart // venue
        );
        var locatable = Locatable.fromDisposition(loc);
        var visual = VisualTransform.fromTransformAndChild(Transform_Multiple.fromChildren([
            new Transform_Overwrite(mesh),
            Transform_Orient.fromOrientation(loc.orientation),
            Transform_Translate.fromDisplacement(loc.pos)
        ]), VisualMesh.fromMesh(mesh.clone()));
        var collidable = Collidable.fromCollider(mesh);
        var drawable = Drawable.fromVisual(visual);
        var groundable = new Groundable();
        var entityForChest = Entity.fromNameAndProperties("Chest", [
            collidable,
            drawable,
            groundable,
            locatable
        ]);
        return entityForChest;
    }
    static entityBuildDoor(maze, nameOfZoneStart, cellPosOfStart, materialDoor, moverHeight) {
        var doorHeight = moverHeight / 2 * 1.33; // ?
        var meshBuilder = MeshBuilder.Instance();
        var doorSize = Coords.fromXYZ(.67, .05, 1).multiplyScalar(doorHeight);
        var doorPos = Coords.fromXYZ(0, 0, -1).multiplyScalar(doorHeight);
        var mesh = meshBuilder.box(materialDoor, doorSize, // size - ?
        doorPos // pos
        ).faceTexturesBuild();
        var loc = Disposition.fromPosOrientationAndPlaceName(cellPosOfStart.clone().add(Coords.fromXYZ(0, -1, 0).multiplyScalar(.125)).multiply(maze.cellSizeInPixels), Orientation.fromForwardAndDown(Coords.fromXYZ(1, 0, 0), Coords.fromXYZ(0, 0, 1)), nameOfZoneStart // venue
        );
        var locatable = Locatable.fromDisposition(loc);
        var visual = VisualTransform.fromTransformAndChild(Transform_Multiple.fromChildren([
            new Transform_Overwrite(mesh),
            Transform_Orient.fromOrientation(loc.orientation),
            Transform_Translate.fromDisplacement(loc.pos)
        ]), VisualMesh.fromMesh(mesh.clone()));
        var collidable = Collidable.fromCollider(mesh);
        var drawable = Drawable.fromVisual(visual);
        var groundable = new Groundable();
        var entityForDoor = Entity.fromNameAndProperties("Door", [
            collidable,
            drawable,
            groundable,
            locatable
        ]);
        return entityForDoor;
    }
    static materialsCreate() {
        var colors = Color.Instances();
        var colorBlue = colors.BlueDark;
        var colorGray = colors.Gray;
        var colorGrayDark = colors.GrayDark;
        var colorGreen = colors.GreenDark;
        var colorRed = colors.RedDark;
        var imageBuilder = new ImageBuilder(colors._All);
        var textures = [
            Texture.fromNameAndImage("Chest", imageBuilder.squareOfColorWithInsetBorderOfColor(colorGray, colorRed)),
            Texture.fromNameAndImage("Door", imageBuilder.squareOfColorWithInsetBorderOfColor(colorGray, colorBlue)),
            Texture.fromNameAndImage("Floor", imageBuilder.squareOfColorWithInsetBorderOfColor(colorGray, colorGrayDark)),
            Texture.fromNameAndImage("Goal", imageBuilder.squareOfColorWithInsetBorderOfColor(colorGray, colorGreen)),
            Texture.fromNameAndImage("Mover", imageBuilder.squareOfColor(colorGray)),
            Texture.fromNameAndImage("Start", imageBuilder.squareOfColorWithInsetBorderOfColor(colorGray, colorRed)),
            Texture.fromNameAndImage("Wall", imageBuilder.wallMasonryWithColorsForBlocksAndMortar(colors.Gray, colors.GrayDark)),
        ];
        var materials = textures.map(x => Material.fromTexture(x));
        return materials;
    }
    static placeMazeBuildRandom(mazeSizeInCells, mazeCellSizeInPixels, randomizer, materialsByName) {
        var maze = new Maze(mazeCellSizeInPixels, mazeSizeInCells, 
        // neighborOffsets
        [
            Coords.fromXY(-1, 0), // west
            Coords.fromXY(1, 0), // east
            Coords.fromXY(0, -1), // north
            Coords.fromXY(0, 1), // south
        ]).generateRandom(randomizer);
        var meshBuilder = MeshBuilder.Instance();
        var ceilingHeight = maze.cellSizeInPixels.z;
        var moverHeight = ceilingHeight / 7;
        var meshMover = meshBuilder.biped(materialsByName.get("Mover"), moverHeight).faceTexturesBuild();
        var cellPosOfStart = Coords
            .create()
            .randomize(randomizer)
            .multiply(maze.sizeInCells)
            .floor();
        var cellPosOfGoal = null;
        var distanceOrthogonalFromStartToGoalMin = maze.sizeInCells.x / 2;
        var distanceOrthogonalFromStartToGoal = 0;
        // hack - The time this will take is nondeterministic.
        while (distanceOrthogonalFromStartToGoal < distanceOrthogonalFromStartToGoalMin) {
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
        var zones = this.zonesBuildForMazeMaterialsStartAndGoalPositions(maze, materialsByName.get("Wall"), materialsByName.get("Floor"), cellPosOfStart, materialsByName.get("Start"), cellPosOfGoal, materialsByName.get("Goal"));
        var nameOfZoneStart = cellPosOfStart.toString();
        var zonesByName = ArrayHelper.addLookupsByName(zones);
        var zoneStart = zonesByName.get(nameOfZoneStart);
        var entityForPlayer = this.entityBuildPlayer(maze, nameOfZoneStart, cellPosOfStart, meshMover);
        var entityForMoverOther = this.entityBuildMoverOther(maze, nameOfZoneStart, cellPosOfStart, meshMover);
        var entityForChest = this.entityBuildChest(maze, nameOfZoneStart, cellPosOfStart, materialsByName.get("Chest"), moverHeight);
        var entityForDoor = this.entityBuildDoor(maze, nameOfZoneStart, cellPosOfStart, materialsByName.get("Door"), moverHeight);
        ArrayHelper.addMany(zoneStart.entities, [
            entityForPlayer,
            entityForMoverOther,
            entityForChest,
            entityForDoor,
        ]);
        var place = new PlaceZoned2(maze.sizeInPixels, zones, entityForPlayer);
        return place;
    }
    static zonesBuildForMazeMaterialsStartAndGoalPositions(maze, materialWall, materialFloor, cellPosOfStart, materialStart, cellPosOfGoal, materialGoal) {
        var zones = new Array();
        var cellSizeInPixels = maze.cellSizeInPixels;
        var sizeInCells = maze.sizeInCells;
        var cellPos = Coords.create();
        var cellPosInPixels = Coords.create();
        for (var y = 0; y < sizeInCells.y; y++) {
            cellPos.y = y;
            for (var x = 0; x < sizeInCells.x; x++) {
                cellPos.x = x;
                var materialForRoomFloor;
                if (cellPos.equals(cellPosOfStart)) {
                    materialForRoomFloor = materialStart;
                }
                else if (cellPos.equals(cellPosOfGoal)) {
                    materialForRoomFloor = materialGoal;
                }
                else {
                    materialForRoomFloor = materialFloor;
                }
                this.zonesBuild_Cell(maze, cellPos, cellPosInPixels, cellSizeInPixels, materialWall, materialForRoomFloor, materialFloor, zones);
            }
        }
        return zones;
    }
    static zonesBuild_Cell(maze, cellPos, cellPosInPixels, cellSizeInPixels, materialWall, materialRoomFloor, materialConnectorFloor, zonesSoFar) {
        var roomSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(8);
        var meshBuilder = MeshBuilder.Instance();
        cellPosInPixels.overwriteWith(cellPos).multiply(cellSizeInPixels);
        var cellCurrent = maze.cellAtPos(cellPos);
        var mesh = meshBuilder.room(roomSizeInPixelsHalf, maze.neighborOffsets, cellCurrent.connectedToNeighbors, materialWall, materialRoomFloor, null, null // ?
        );
        var zoneForNodeName = cellPos.toString();
        var tuple = this.zonesBuild_Cell_Neighbors(maze, cellPos, cellCurrent, materialWall, materialConnectorFloor);
        var zonesForConnectorsToNeighbors = tuple[0];
        var zonesAdjacentNames = tuple[1];
        var loc = Disposition.fromPos(cellPosInPixels.clone());
        var visual = VisualMesh.fromMesh(mesh.clone());
        visual = VisualTransform.fromTransformAndChild(Transform_Multiple.fromChildren([
            new Transform_Overwrite(mesh),
            Transform_Orient.fromOrientation(loc.orientation),
            Transform_Translate.fromDisplacement(loc.pos)
        ]), visual);
        var zoneEntity = Entity.fromNameAndProperties(this.name, [
            Collidable.fromCollider(mesh),
            Drawable.fromVisual(visual),
            Locatable.fromDisposition(loc)
        ]);
        var zoneForNode = Zone2.fromNamePosNeighborNamesAndEntities(zoneForNodeName, cellPosInPixels.clone(), //pos,
        zonesAdjacentNames, [zoneEntity]);
        zonesSoFar.push(zoneForNode);
        for (var i = 0; i < zonesForConnectorsToNeighbors.length; i++) {
            var zoneForConnector = zonesForConnectorsToNeighbors[i];
            zonesSoFar.push(zoneForConnector);
        }
    }
    static zonesBuild_Cell_Neighbors(maze, cellPos, cellCurrent, materialWall, materialFloor) {
        var zonesForConnectorsToNeighbors = [];
        var zonesAdjacentNames = [];
        var numberOfNeighbors = maze.neighborOffsets.length;
        for (var n = 0; n < numberOfNeighbors; n++) {
            var isCellCurrentConnectedToNeighbor = cellCurrent.connectedToNeighbors[n];
            if (isCellCurrentConnectedToNeighbor) {
                var conectorNameAndZone = this.zonesBuild_Cell_Neighbors_N(maze, cellPos, cellCurrent, materialWall, materialFloor, n);
                var connectorName = conectorNameAndZone[0];
                var connectorZone = conectorNameAndZone[1];
                zonesAdjacentNames.push(connectorName);
                if (connectorZone != null) {
                    zonesForConnectorsToNeighbors.push(connectorZone);
                }
            }
        }
        return [zonesForConnectorsToNeighbors, zonesAdjacentNames];
    }
    static zonesBuild_Cell_Neighbors_N(maze, cellPos, cellCurrent, materialWall, materialFloor, n) {
        var zoneForConnector = null;
        var zoneForNodeName = cellPos.toString();
        var neighborOffsets = maze.neighborOffsets;
        var cellSizeInPixels = maze.cellSizeInPixels;
        var cellSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(2);
        var roomSizeInPixelsHalf = cellSizeInPixels.clone().divideScalar(8);
        var hallWidthMultiplier = 0.5;
        var neighborOffset = neighborOffsets[n];
        var neighborPosInCells = cellPos
            .clone()
            .add(neighborOffset);
        var zoneNeighborName = neighborPosInCells.toString();
        var neighborIsOdd = (n % 2) == 1;
        var zoneConnectorName = neighborIsOdd
            ? zoneForNodeName + zoneNeighborName
            : zoneNeighborName + zoneForNodeName;
        // Only create connectors for neighbors south and east,
        // because north and west are handled by another node.
        if (neighborIsOdd) {
            var neighborOffset = neighborOffsets[n];
            var neighborPosInCells = cellPos
                .clone()
                .add(neighborOffset);
            var connectorOffset = Coords
                .fromXY(cellSizeInPixelsHalf.x, cellSizeInPixelsHalf.y)
                .multiply(neighborOffset);
            var connectorPosInPixels = cellPos
                .clone()
                .multiply(cellSizeInPixels)
                .clone()
                .add(connectorOffset);
            var connectorSizeInPixels = Coords.fromXYZ((n == 1
                ? (cellSizeInPixelsHalf.x - roomSizeInPixelsHalf.x)
                : (roomSizeInPixelsHalf.x * hallWidthMultiplier)), (n == 3 ?
                (cellSizeInPixelsHalf.y - roomSizeInPixelsHalf.y)
                : (roomSizeInPixelsHalf.y * hallWidthMultiplier)), roomSizeInPixelsHalf.z);
            var meshBuilder = MeshBuilder.Instance();
            var mesh = meshBuilder.room(connectorSizeInPixels, neighborOffsets, 
            // connectedToNeighbors
            [
                (n == 1), (n == 1), (n != 1), (n != 1)
            ], materialWall, materialFloor, 1 / hallWidthMultiplier, // doorwayWidthScaleFactor
            .1 // wallThickness
            );
            var loc = Disposition.fromPos(connectorPosInPixels.clone());
            var visual = VisualTransform.fromTransformAndChild(Transform_Multiple.fromChildren([
                new Transform_Overwrite(mesh),
                Transform_Orient.fromOrientation(loc.orientation),
                Transform_Translate.fromDisplacement(loc.pos)
            ]), VisualMesh.fromMesh(mesh.clone()));
            var zoneEntity = Entity.fromNameAndProperties(zoneConnectorName, [
                Collidable.fromCollider(mesh),
                Drawable.fromVisual(visual),
                Locatable.fromDisposition(loc)
            ]);
            zoneForConnector = Zone2.fromNamePosNeighborNamesAndEntities(zoneConnectorName, connectorPosInPixels, [zoneForNodeName, zoneNeighborName], [zoneEntity]);
        }
        return [zoneConnectorName, zoneForConnector];
    }
}
