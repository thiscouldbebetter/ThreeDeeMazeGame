"use strict";
class Constraint_Solid {
    constructor() {
        // Helper variables.
        this._collisions = [];
    }
    constrain(uwpe) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var place = world.place2;
        var entityToConstrain = uwpe.entity;
        var entityLoc = Locatable.of(entityToConstrain).loc;
        var entityPos = entityLoc.pos;
        var entityVel = entityLoc.vel;
        var entityAccel = entityLoc.accel;
        var collisions = this._collisions;
        while (true) {
            var entityPosNext = entityPos.clone().add(entityVel).add(entityAccel);
            var edgeForMovement = new Edge([entityPos, entityPosNext]);
            if (edgeForMovement.length() == 0) {
                break;
            }
            else {
                collisions.length = 0;
                collisions = place.collisionsWithEdge(universe, edgeForMovement, collisions);
                if (collisions.some((x) => x.isActive) == false) {
                    break;
                }
                else {
                    var collisionClosest = universe.collisionHelper.collisionActiveClosest(collisions);
                    var faceCollidedWith = collisionClosest.collidersByName.get(Face.name);
                    var planeCollidedWith = faceCollidedWith.plane();
                    var planeNormal = planeCollidedWith.normal;
                    entityPos.overwriteWith(collisionClosest.pos);
                    entityVel.subtract(planeNormal.clone().multiplyScalar(entityVel.dotProduct(planeNormal)));
                    entityAccel.subtract(planeNormal.clone().multiplyScalar(entityAccel.dotProduct(planeNormal)));
                }
            } // end if (edgeForMovement.length > 0)
        } // end while (true)
    } // end method
    nameSet(value) {
        this.name = value;
        return this;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
