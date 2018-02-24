
function Entity(name, defn, loc)
{
	this.name = name;
	this.defn = defn;
	this.loc = loc;

	if (this.defn.mesh != null)
	{
		this.meshTransformed = this.defn.mesh.clone();
		this.collidableData = new CollidableData();
	}
}

{
	Entity.prototype.ground = function(world)
	{
		// hack

		var meshBeingStoodOn = null;

		var pos = this.loc.pos;
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
			var zoneMesh = zone.entity.meshTransformed.geometry;
			var collisions =
				//new CollisionHelper().collisionsOfEdgeAndMesh(edgeForFootprint, zoneMesh);
				Collision.addCollisionsOfEdgeAndMeshToList(edgeForFootprint, zoneMesh, []);
			if (collisions.length > 0)
			{
				var collision = collisions[0];
				var meshBelowEntity = collision.colliders["Mesh"];
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
	}

	Entity.prototype.isGrounded = function(world)
	{
		return (this.ground(world) != null);
	}


	Entity.prototype.resetMeshTransformed = function()
	{
		if (this.meshTransformed != null)
		{
			this.meshTransformed.overwriteWith
			(
				this.defn.mesh
			);
		}
	}
}
