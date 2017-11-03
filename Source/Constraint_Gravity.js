
function Constraint_Gravity(accelerationPerTick)
{
	this.accelerationPerTick = accelerationPerTick;
}

{
	Constraint_Gravity.prototype.constrainEntity = function(world, entityToConstrain)
	{
		var entityLoc = entityToConstrain.loc;

		if (entityLoc.pos.z < 0)
		{
			entityLoc.accel.z += this.accelerationPerTick;
		}
		else
		{
			entityLoc.vel.z = 0;
			entityLoc.pos.z = 0;

			var animationRun = entityToConstrain.constraints["Animate"].animationRun;
			if (animationRun.animationDefnNameCurrent == "Jump")
			{
				animationRun.animationDefnNameCurrent = "Walk";
			}
		}
	}
}
