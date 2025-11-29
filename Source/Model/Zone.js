"use strict";
class Zone2 extends PlaceBase {
    constructor(name, pos, zonesAdjacentNames, entities) {
        super(name, null, // defnName
        null, // parentName
        null, // size
        entities);
        this.pos = pos;
        this.zonesAdjacentNames = zonesAdjacentNames;
        this._entities = entities;
        var entityForEnvironment = this.entityForEnvironment();
        var meshTransformed = Collidable.of(entityForEnvironment).collider;
        var disp = Locatable.of(entityForEnvironment).loc;
        meshTransformed.transform(Transform_Locate.fromDisposition(disp));
        this.entityPropertiesToUpdateNames =
            [
                Actor.name,
                Animatable2.name,
                Constrainable.name
                // Locatable.name // Activating this causes constraints to fail.
            ];
    }
    static fromNamePosNeighborNamesAndEntities(name, pos, zonesAdjacentNames, entities) {
        return new Zone2(name, pos, zonesAdjacentNames, entities);
    }
    updateForTimerTick(uwpe) {
        var entities = this._entities;
        for (var e = 0; e < entities.length; e++) {
            var entity = entities[e];
            uwpe.entitySet(entity);
            for (var p = 0; p < this.entityPropertiesToUpdateNames.length; p++) {
                var propertyName = this.entityPropertiesToUpdateNames[p];
                var property = entity.propertyByName(propertyName);
                if (property != null) {
                    property.updateForTimerTick(uwpe);
                }
            }
        }
    }
    entityForEnvironment() {
        return this._entities[0];
    }
    zonesAdjacent(place) {
        var returnValues = [];
        var zonesAdjacentNames = this.zonesAdjacentNames;
        for (var i = 0; i < zonesAdjacentNames.length; i++) {
            var zonesAdjacentName = zonesAdjacentNames[i];
            var zoneAdjacent = place.zoneByName(zonesAdjacentName);
            returnValues.push(zoneAdjacent);
        }
        return returnValues;
    }
    // collisions
    collisionsWithEdge(universe, edge, collisions) {
        if (collisions == null) {
            collisions = [];
        }
        var zoneMesh = Collidable.of(this._entities[0]).collider;
        universe.collisionHelper.collisionsOfEdgeAndMesh(edge, zoneMesh, collisions, null // first?
        );
        return collisions;
    }
    // Serialization.
    toStringHumanReadable() {
        var newline = "\n";
        var entities = this._entities;
        var entity0 = entities[0];
        var entity0Collidable = Collidable.of(entity0);
        var meshTextured = entity0Collidable.collider;
        var mesh = meshTextured;
        var meshAsString = mesh.toStringHumanReadable();
        var tab = "\t";
        var tabTab = tab + tab;
        var newlineTabTab = newline + tabTab;
        meshAsString =
            tabTab
                + meshAsString.split(newline).join(newlineTabTab);
        var zoneAsLines = [
            "Zone:",
            tab + "Name: " + this.name,
            tab + "Pos: " + this.pos.toStringXxYxZ(),
            tab + "Neighbors: " + this.zonesAdjacentNames.join(", "),
            tab + "Meshes:",
            meshAsString
        ];
        var zoneAsString = zoneAsLines.join(newline);
        return zoneAsString;
    }
}
