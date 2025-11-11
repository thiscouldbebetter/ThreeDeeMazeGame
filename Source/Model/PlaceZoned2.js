"use strict";
class PlaceZoned2 extends PlaceBase {
    constructor(sizeInPixels, zones, entityForPlayer) {
        super(PlaceZoned2.name, null, // defnName
        null, // parentName
        sizeInPixels, [] // entities
        );
        this.zones = zones;
        this.entityForPlayer = entityForPlayer;
        this._zonesByName = ArrayHelper.addLookupsByName(this.zones);
    }
    collisionsWithEdge(universe, edge, collisions) {
        if (collisions == null) {
            collisions = [];
        }
        var zonesActive = this.zonesActive;
        for (var z = 0; z < zonesActive.length; z++) {
            var zone = zonesActive[z];
            zone.collisionsWithEdge(universe, edge, collisions);
        }
        return collisions;
    }
    draw(universe) {
        var display = universe.display;
        var displayTypeName = display.constructor.name;
        if (displayTypeName == Display2D.name) {
            this.draw2d(universe);
        }
        else if (displayTypeName == Display3D.name) {
            this.draw3d(universe);
        }
    }
    draw2d(universe) {
        var display = universe.display;
        var facesToDraw = new Array();
        var cameraPos = Locatable.of(this.cameraEntity).loc.pos;
        var spacePartitioningTreeRoot = this.spacePartitioningTreeForZonesActive.nodeRoot;
        spacePartitioningTreeRoot.addFacesBackToFrontForCameraPosToList(cameraPos, facesToDraw);
        var entities = this._entities;
        var collisionHelper = universe.collisionHelper;
        for (var b = 0; b < entities.length; b++) {
            var entity = entities[b];
            if (Drawable.of(entity) != null && Movable.of(entity) != null) {
                // hack
                // Find the floor the mover is standing on,
                // and draw the mover immediately after that floor.
                var entityPos = Locatable.of(entity).loc.pos;
                var edgeForFootprint = new Edge([
                    entityPos,
                    entityPos.clone().add(new Coords(0, 0, 100))
                ]);
                for (var g = facesToDraw.length - 1; g >= 0; g--) {
                    var face = facesToDraw[g];
                    var collisionForFootprint = collisionHelper.collisionOfEdgeAndFace(edgeForFootprint, face.geometry, Collision.create());
                    var isEntityStandingOnFace = (collisionForFootprint != null
                        && collisionForFootprint.isActive);
                    if (isEntityStandingOnFace) {
                        var moverMesh = Collidable.of(entity).collider;
                        var moverFaces = moverMesh.faces();
                        for (var f = 0; f < moverFaces.length; f++) {
                            var moverFace = moverFaces[f];
                            facesToDraw.splice(g + 1, 0, moverFace);
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
        var world = universe.world;
        display.drawTextWithFontAtPos(world.name, font, Coords.fromXY(0, 1).multiplyScalar(fontHeight));
        display.drawTextWithFontAtPos("" + world.secondsElapsed(), font, Coords.fromXY(0, 2).multiplyScalar(fontHeight));
    }
    draw3d(universe) {
        var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
        var display = universe.display;
        display.clear();
        display.drawBackground();
        display.cameraSet(this.camera);
        display.lightingSet(null); // todo
        for (var z = 0; z < this.zonesActive.length; z++) {
            var zone = this.zonesActive[z];
            uwpe.placeSet(zone);
            var entities = zone.entities;
            for (var b = 0; b < entities.length; b++) {
                var entity = entities[b];
                uwpe.entitySet(entity);
                var drawable = Drawable.of(entity);
                if (drawable != null) {
                    var entityVisual = drawable.visual;
                    entityVisual.draw(uwpe, display);
                }
            }
        }
        display.flush();
    }
    entitiesAll() {
        var entityArraysForZonesActive = this.zonesActive.map(x => x.entities);
        var entitiesForZonesActive = ArrayHelper.flattenArrayOfArrays(entityArraysForZonesActive);
        return entitiesForZonesActive;
    }
    initialize(uwpe) {
        this.meshesToDraw = [];
        var zoneStart = this.initialize_1_ZoneStart();
        this.zoneNext = zoneStart;
        this.zonesActive = [];
        this.initialize_2_Constraints();
        var cameraEntity = this.initialize_3_Camera(uwpe.universe.display.sizeInPixels);
        zoneStart.entities.push(cameraEntity);
        this.cameraEntity = cameraEntity;
        this.camera = Camera.of(this.cameraEntity);
    }
    initialize_1_ZoneStart() {
        var zoneStart;
        for (var i = 0; i < this.zones.length; i++) {
            var zone = this.zones[i];
            var zoneEntity = zone.entities[0];
            var zoneMesh = Collidable.of(zoneEntity).collider;
            if (zoneMesh.materials[1].name == "Start") {
                zoneStart = zone;
                break;
            }
        }
        return zoneStart;
    }
    initialize_2_Constraints() {
        var constraintsCommon = [
            new Constraint_Gravity2(.1),
            new Constraint_Solid(),
            new Constraint_Friction(1, .5, .01),
            new Constraint_Movable2(),
        ];
        var constrainable = Constrainable.fromConstraints(constraintsCommon);
        for (var z = 0; z < this.zones.length; z++) {
            var zone = this.zones[z];
            var entities = zone.entities;
            for (var i = 1; i < entities.length; i++) {
                var entity = entities[i];
                entity.propertyAdd(constrainable);
            }
        }
    }
    initialize_3_Camera(viewSizeInPixels) {
        var focalLength = viewSizeInPixels.z / 16;
        var followDivisor = 16;
        var offsetOfCameraFromPlayer = Coords.fromXYZ(0 - focalLength, 0, 0 - focalLength).divideScalar(followDivisor);
        var playerPos = Locatable.of(this.zoneNext.entities[0]).loc.pos;
        var cameraLoc = Disposition.fromPosOrientationAndPlaceName(playerPos.clone().add(offsetOfCameraFromPlayer), Orientation.fromForwardAndDown(Coords.fromXYZ(1, 0, 1), // forward
        Coords.fromXYZ(0, 0, 1) // down
        ), this.zoneNext.name);
        var cameraLocatable = Locatable.fromDisposition(cameraLoc);
        var cameraEntity = Entity.fromNameAndProperties("Camera", [
            Constrainable.fromConstraints([
                new Constraint_Follow(this.entityForPlayer, focalLength / followDivisor),
                new Constraint_OrientToward(this.entityForPlayer),
            ]),
            cameraLocatable,
            new Groundable()
        ]);
        var camera = Camera.fromViewSizeFocalLengthAndDisposition(viewSizeInPixels.clone(), focalLength, cameraLoc);
        cameraEntity.propertyAdd(camera);
        return cameraEntity;
    }
    updateForTimerTick(uwpe) {
        var universe = uwpe.universe;
        if (this.zoneNext != null) {
            this.updateForTimerTick_1_ZoneNextNotNull(uwpe);
        }
        this.zonesActive.forEach(x => x.updateForTimerTick(uwpe));
        this.draw(universe);
        var playerIsInZoneCurrent = this.updateForTimerTick_2_DetermineIfPlayerIsInZoneCurrent();
        if (playerIsInZoneCurrent == false) {
            this.updateForTimerTick_3_PlayerNotInZoneCurrent();
        }
    }
    updateForTimerTick_1_ZoneNextNotNull(uwpe) {
        var zoneNextEntity = this.zoneNext.entities[0];
        var zoneNextMesh = Collidable.of(zoneNextEntity).collider;
        var zoneNextIsGoal = zoneNextMesh.materials.some(x => x.name == "Goal");
        if (zoneNextIsGoal) {
            var world = uwpe.world;
            var messageWin = "You reached the goal in "
                + world.secondsElapsed()
                + " seconds!  Press refresh for a new maze.";
            alert(messageWin);
        }
        this.zoneCurrent = this.zoneNext;
        this.zonesActive.length = 0;
        this.zonesActive.push(this.zoneCurrent);
        var zonesAdjacent = this.zoneCurrent.zonesAdjacent(this);
        for (var i = 0; i < zonesAdjacent.length; i++) {
            var zoneAdjacent = zonesAdjacent[i];
            this.zonesActive.push(zoneAdjacent);
        }
        var facesForZonesActive = new Array();
        for (var i = 0; i < this.zonesActive.length; i++) {
            var zoneActive = this.zonesActive[i];
            var zoneActiveEntity = zoneActive.entities[0];
            var zoneMesh = Collidable.of(zoneActiveEntity).collider;
            var facesForZone = zoneMesh.faces();
            ArrayHelper.append(facesForZonesActive, facesForZone);
        }
        this.spacePartitioningTreeForZonesActive =
            SpacePartitioningTree.fromFaces(facesForZonesActive);
        this.zoneNext = null;
    }
    updateForTimerTick_2_DetermineIfPlayerIsInZoneCurrent() {
        var zoneCurrentEntity = this.zoneCurrent.entities[0];
        var zoneCurrentMesh = Collidable.of(zoneCurrentEntity).collider;
        var zoneCurrentBounds = zoneCurrentMesh.geometry.box();
        var playerPos = Locatable.of(this.entityForPlayer).loc.pos;
        var playerIsInZoneCurrent = zoneCurrentBounds.containsPoint(playerPos);
        return playerIsInZoneCurrent;
    }
    updateForTimerTick_3_PlayerNotInZoneCurrent() {
        for (var z = 0; z < this.zonesActive.length; z++) {
            var zoneActive = this.zonesActive[z];
            var zoneActiveEntity = zoneActive.entities[0];
            var zoneActiveMesh = Collidable.of(zoneActiveEntity).collider;
            var zoneActiveBounds = zoneActiveMesh.geometry.box();
            var isPlayerInZoneActive = zoneActiveBounds.containsPoint(Locatable.of(this.entityForPlayer).loc.pos);
            if (isPlayerInZoneActive) {
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
    zoneByName(name) {
        return this._zonesByName.get(name);
    }
}
