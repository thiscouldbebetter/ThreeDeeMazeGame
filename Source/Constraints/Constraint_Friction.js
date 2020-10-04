
class Constraint_Friction
{
	constructor(speedMax, frictionPerTick, epsilon)
	{
		this.speedMax = speedMax;
		this.frictionPerTick = frictionPerTick;
		this.epsilon = epsilon;
	}

	constrain(universe, world, zone, entityToConstrain)
	{
		var vel = entityToConstrain.locatable.loc.vel;
		var velZ = vel.z;
		var speed = vel.magnitude();
		if (speed > this.speedMax)
		{
			vel.normalize().multiplyScalar(this.speedMax);
		}
		else if (speed > this.epsilon)
		{
			vel.multiplyScalar(1 - this.frictionPerTick);
		}
		else
		{
			vel.clear();
			var animatable = entityToConstrain.animatable;
			if (animatable != null)
			{
				if (animatable.animationDefnNameCurrent == "Walk")
				{
					animatable.animationDefnNameCurrent = null;
				}
			}
		}
		vel.z = velZ;
	}
}
