
function Constraint_Gravity(accelerationPerTick)
{
	this.accelerationPerTick = accelerationPerTick;
}

{
	Constraint_Gravity.prototype.constrain = function(universe, world, zone, entityToConstrain)
	{
		var entityLoc = entityToConstrain.Locatable.loc;
		var isEntityGrounded = entityToConstrain.isGrounded(world);

		if (isEntityGrounded == false) // entityLoc.pos.z < -.01)
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

		entityToConstrain.ground(world);
	}
}
