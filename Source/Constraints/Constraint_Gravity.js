
function Constraint_Gravity(accelerationPerTick)
{
	this.accelerationPerTick = accelerationPerTick;
}

{
	Constraint_Gravity.prototype.constrainEntity = function(world, entityToConstrain)
	{
		var entityLoc = entityToConstrain.loc;
		var isEntityGrounded = entityToConstrain.isGrounded(world);

		if (isEntityGrounded == false) // entityLoc.pos.z < -.01)
		{
			entityLoc.accel.z += this.accelerationPerTick;
		}
		else
		{
			entityLoc.vel.z = 0;
			entityLoc.pos.z = -.01;

			var constraintAnimate = entityToConstrain.constraints["Animate"];
			if (constraintAnimate != null)
			{
				var animationRun = constraintAnimate.animationRun;
				if (animationRun.animationDefnNameCurrent == "Jump")
				{
					animationRun.animationDefnNameCurrent = "Walk";
				}
			}
		}

		entityToConstrain.ground(world);
	}
}
