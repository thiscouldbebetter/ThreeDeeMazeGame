
class Groundable extends EntityPropertyBase<Groundable>
{
	static create(): Groundable
	{
		return new Groundable();
	}

	static fromEntity(entity: Entity): Groundable
	{
		return entity.propertyByName(Groundable.name) as Groundable;
	}

	ground
	(
		universe: Universe, worldAsWorld: World, place: Place, entity: Entity
	): Mesh
	{
		// hack

		var placeAsPlaceZoned = place as PlaceZoned2;

		var meshBeingStoodOn = null;

		var pos = Locatable.of(entity).loc.pos;
		var edgeLength = 100;
		var gravityDirection = Coords.fromXYZ(0, 0, edgeLength);
		var edgeForFootprint = new Edge
		([
			pos.clone().subtract(gravityDirection),
			pos.clone().add(gravityDirection)
		]);
		var zone = placeAsPlaceZoned.zoneCurrent;
		var zonesToCheck = zone.zonesAdjacent(placeAsPlaceZoned);
		zonesToCheck.splice(0, 0, zone);

		var collisionHelper = universe.collisionHelper;

		for (var i = 0; i < zonesToCheck.length; i++)
		{
			var zone = zonesToCheck[i];
			var zoneEntity = zone.entities[0];
			var zoneMesh = Collidable.of(zoneEntity).collider as MeshTextured
			var collisions = collisionHelper.collisionsOfEdgeAndMesh
			(
				edgeForFootprint, zoneMesh.geometry,
				null, null // ?
			);
			if (collisions.some( (x: Collision) => x.isActive))
			{
				var collision = collisions[0];
				if (collision.distanceToCollision <= edgeLength)
				{
					var meshBelowEntity =
						collision.collidersByName.get(Mesh.name) as Mesh;
					meshBeingStoodOn = meshBelowEntity;
					var collisionPos = collision.pos;
					pos.overwriteWith(collisionPos).subtract(new Coords(0, 0, .01));
					break;
				}
			}
		}

		return meshBeingStoodOn;
	}

	isGrounded
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): boolean
	{
		return (this.ground(universe, world, place, entity) != null);
	}
}
