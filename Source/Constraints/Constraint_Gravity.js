
class Constraint_Gravity
{
	constructor(accelerationPerTick)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain(universe, world, place, entityToConstrain)
	{
		var entityLoc = entityToConstrain.locatable.loc;
		var isEntityGrounded =
			entityToConstrain.groundable.isGrounded(universe, world, place, entityToConstrain);

		if (isEntityGrounded == false)
		{
			entityLoc.accel.z += this.accelerationPerTick;
		}
		else
		{
			entityLoc.vel.z = 0;
			entityLoc.pos.z = -.01;

			var animatable = entityToConstrain.animatable;
			if (animatable != null)
			{
				if (animatable.animationDefnNameCurrent == "Jump")
				{
					animatable.animationStart("Walk");
				}
			}
		}

		entityToConstrain.groundable.ground
		(
			universe, world, place, entityToConstrain
		);
	}
}
