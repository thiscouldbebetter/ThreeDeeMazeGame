
function Constraint_Movable()
{
	// todo
}

{
	Constraint_Movable.prototype.constrainEntity = function(world, entityToConstrain)
	{
		var entityLoc = entityToConstrain.loc;
		var entityPos = entityLoc.pos;
		var entityVel = entityLoc.vel;
		var entityAccel = entityLoc.accel;

		entityVel.add(entityAccel);
		entityAccel.clear();
		entityPos.add(entityVel);

		var transformLocate = new Transform_Locate(entityLoc);
		entityToConstrain.meshTransformed.transform(transformLocate);
		entityToConstrain.meshTransformed.recalculateDerivedValues();
	}
}
