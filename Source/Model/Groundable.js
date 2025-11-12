"use strict";
class Groundable extends EntityPropertyBase {
    static create() {
        return new Groundable();
    }
    static fromEntity(entity) {
        return entity.propertyByName(Groundable.name);
    }
    ground(universe, worldAsWorld, place, entity) {
        // hack
        var placeAsPlaceZoned = place;
        var meshBeingStoodOn = null;
        var pos = Locatable.of(entity).loc.pos;
        var edgeLength = 100;
        var gravityDirection = Coords.fromXYZ(0, 0, edgeLength);
        var edgeForFootprint = new Edge([
            pos.clone().subtract(gravityDirection),
            pos.clone().add(gravityDirection)
        ]);
        var zone = placeAsPlaceZoned.zoneCurrent;
        var zonesToCheck = zone.zonesAdjacent(placeAsPlaceZoned);
        zonesToCheck.splice(0, 0, zone);
        var collisionHelper = universe.collisionHelper;
        for (var i = 0; i < zonesToCheck.length; i++) {
            var zone = zonesToCheck[i];
            var zoneEntity = zone.entityForEnvironment();
            var zoneMesh = Collidable.of(zoneEntity).collider;
            var collisions = collisionHelper.collisionsOfEdgeAndMesh(edgeForFootprint, zoneMesh, null, null // ?
            );
            if (collisions.some((x) => x.isActive)) {
                var collision = collisions[0];
                if (collision.distanceToCollision <= edgeLength) {
                    var meshBelowEntity = collision.collidersByName.get(Mesh.name);
                    meshBeingStoodOn = meshBelowEntity;
                    var collisionPos = collision.pos;
                    pos.overwriteWith(collisionPos).subtract(new Coords(0, 0, .01));
                    break;
                }
            }
        }
        return meshBeingStoodOn;
    }
    isGrounded(universe, world, place, entity) {
        return (this.ground(universe, world, place, entity) != null);
    }
}
