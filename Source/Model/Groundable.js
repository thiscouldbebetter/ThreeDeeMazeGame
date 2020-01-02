function Groundable()
{
	// Do nothing.
}
{
	Groundable.prototype.ground = function(universe, world, place, entity)
	{
		// hack

		var meshBeingStoodOn = null;

		var pos = entity.Locatable.loc.pos;
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
		for (var i = 0; i < zonesToCheck.length; i++)
		{
			var zone = zonesToCheck[i];
			var zoneEntity = zone.entities[0];
			var zoneMesh = zoneEntity.Collidable.collider.geometry;
			var collisions =
				universe.collisionHelper.collisionsOfEdgeAndMesh(edgeForFootprint, zoneMesh);
			if (collisions.some(x => x.isActive))
			{
				var collision = collisions[0];
				var meshBelowEntity = collision.colliders.Mesh;
				if (collision.distanceToCollision <= edgeLength)
				{
					meshBeingStoodOn = meshBelowEntity;
					var collisionPos = collision.pos;
					pos.overwriteWith(collisionPos).subtract(new Coords(0, 0, .01));
					break;
				}
			}
		}

		return meshBeingStoodOn;
	};

	Groundable.prototype.isGrounded = function(universe, world, place, entity)
	{
		return (this.ground(universe, world, place, entity) != null);
	};
}
