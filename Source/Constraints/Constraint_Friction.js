
function Constraint_Friction(speedMax, frictionPerTick, epsilon)
{
	this.speedMax = speedMax;
	this.frictionPerTick = frictionPerTick;
	this.epsilon = epsilon;
}

{
	Constraint_Friction.prototype.constrain = function(universe, world, zone, entityToConstrain)
	{
		var vel = entityToConstrain.Locatable.loc.vel;
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
			var animatable = entityToConstrain.Animatable;
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
