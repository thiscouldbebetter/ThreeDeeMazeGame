
function Constraint_Movable()
{
	this.transformLocate = new Transform_Locate();
}

{
	Constraint_Movable.prototype.constrainEntity = function(world, zone, entityToConstrain)
	{
		var entityLoc = entityToConstrain.loc;
		var entityPos = entityLoc.pos;
		var entityVel = entityLoc.vel;
		var entityAccel = entityLoc.accel;

		entityVel.add(entityAccel);
		entityAccel.clear();
		entityPos.add(entityVel);

		if (entityToConstrain.meshTransformed != null)
		{
			var mesh = entityToConstrain.meshTransformed.geometry;
			this.transformLocate.loc = entityLoc;
			mesh.transform(this.transformLocate);
		}
	}
}
