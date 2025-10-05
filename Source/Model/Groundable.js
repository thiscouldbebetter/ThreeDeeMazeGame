"use strict";
class Groundable extends EntityPropertyBase {
    static fromEntity(entity) {
        return entity.propertyByName(Groundable.name);
    }
    ground(universe, worldAsWorld, place, entity) {
        // hack
        var meshBeingStoodOn = null;
        var world = worldAsWorld;
        var pos = Locatable.of(entity).loc.pos;
        var edgeLength = 100;
        var gravityDirection = new Coords(0, 0, edgeLength);
        var edgeForFootprint = new Edge([
            pos.clone().subtract(gravityDirection),
            pos.clone().add(gravityDirection)
        ]);
        var zone = world.zoneCurrent;
        var zonesToCheck = zone.zonesAdjacent(world);
        zonesToCheck.splice(0, 0, zone);
        var collisionHelper = universe.collisionHelper;
        for (var i = 0; i < zonesToCheck.length; i++) {
            var zone = zonesToCheck[i];
            var zoneEntity = zone.entities[0];
            var zoneMesh = Collidable.of(zoneEntity).collider;
            var collisions = collisionHelper.collisionsOfEdgeAndMesh(edgeForFootprint, zoneMesh.geometry, null, null // ?
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
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    propertyName() { return Groundable.name; }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
