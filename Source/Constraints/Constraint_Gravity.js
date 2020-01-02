
function Constraint_Gravity(accelerationPerTick)
{
	this.accelerationPerTick = accelerationPerTick;
}

{
	Constraint_Gravity.prototype.constrain = function(universe, world, place, entityToConstrain)
	{
		var entityLoc = entityToConstrain.Locatable.loc;
		var isEntityGrounded = entityToConstrain.Groundable.isGrounded(universe, world, place, entityToConstrain);

		if (isEntityGrounded == false)
		{
			entityLoc.accel.z += this.accelerationPerTick;
		}
		else
		{
			entityLoc.vel.z = 0;
			entityLoc.pos.z = -.01;

			var animatable = entityToConstrain.Animatable;
			if (animatable != null)
			{
				if (animatable.animationDefnNameCurrent == "Jump")
				{
					animatable.animationStart("Walk");
				}
			}
		}

		entityToConstrain.Groundable.ground(universe, world, place, entityToConstrain);
	}
}
