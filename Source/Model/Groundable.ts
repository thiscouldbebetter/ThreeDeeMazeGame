
class Groundable implements EntityPropertyBase
{
	universe: Universe;
	world: World;
	place: Place;
	entity: Entity;

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

		var meshBeingStoodOn = null;

		var world = worldAsWorld as WorldExtended;

		var pos = entity.locatable().loc.pos;
		var edgeLength = 100;
		var gravityDirection = new Coords(0, 0, edgeLength);
		var edgeForFootprint = new Edge
		([
			pos.clone().subtract(gravityDirection),
			pos.clone().add(gravityDirection)
		]);
		var zone = world.zoneCurrent;
		var zonesToCheck = zone.zonesAdjacent(world);
		zonesToCheck.splice(0, 0, zone);

		var collisionHelper = universe.collisionHelper;

		for (var i = 0; i < zonesToCheck.length; i++)
		{
			var zone = zonesToCheck[i];
			var zoneEntity = zone.entities[0];
			var zoneMesh = zoneEntity.collidable().collider as MeshTextured
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

	// Clonable.
	clone(): EntityPropertyBase { return this; }
	overwriteWith(other: EntityPropertyBase): EntityPropertyBase { return this; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Groundable.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.
	equals(other: EntityPropertyBase): boolean { return false; }
}
