"use strict";
class Zone2 extends PlaceBase {
    constructor(name, pos, namesOfZonesAdjacent, entities) {
        super(name, null, // defnName
        null, // parentName
        null, // size
        entities);
        this.pos = pos;
        this.namesOfZonesAdjacent = namesOfZonesAdjacent;
        this.entities = entities;
        var entity = this.entities[0];
        var meshTransformed = Collidable.of(entity).collider;
        meshTransformed.transform(new Transform_Locate(Locatable.of(entity).loc));
        this.entityPropertiesToUpdateNames =
            [
                Actor.name,
                Animatable2.name,
                Constrainable.name
                // Locatable.name // Activating this causes constraints to fail.
            ];
    }
    static fromNamePosNeighborNamesAndEntities(name, pos, namesOfZonesAdjacent, entities) {
        return new Zone2(name, pos, namesOfZonesAdjacent, entities);
    }
    updateForTimerTick(uwpe) {
        for (var e = 0; e < this.entities.length; e++) {
            var entity = this.entities[e];
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
    zonesAdjacent(place) {
        var returnValues = [];
        var namesOfZonesAdjacent = this.namesOfZonesAdjacent;
        for (var i = 0; i < namesOfZonesAdjacent.length; i++) {
            var nameOfZoneAdjacent = namesOfZonesAdjacent[i];
            var zoneAdjacent = place.zoneByName(nameOfZoneAdjacent);
            returnValues.push(zoneAdjacent);
        }
        return returnValues;
    }
    // collisions
    collisionsWithEdge(universe, edge, collisions) {
        if (collisions == null) {
            collisions = [];
        }
        var zoneMesh = Collidable.of(this.entities[0]).collider.geometry;
        universe.collisionHelper.collisionsOfEdgeAndMesh(edge, zoneMesh, collisions, null // first?
        );
        return collisions;
    }
}
