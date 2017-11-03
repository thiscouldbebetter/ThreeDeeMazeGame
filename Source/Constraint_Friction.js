
function Constraint_Friction(speedMax, frictionPerTick, epsilon)
{
	this.speedMax = speedMax;
	this.frictionPerTick = frictionPerTick;
	this.epsilon = epsilon;
}

{
	Constraint_Friction.prototype.constrainEntity = function(world, entityToConstrain)
	{
		var vel = entityToConstrain.loc.vel;
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
			var animationRun = entityToConstrain.constraints["Animate"].animationRun;
			animationRun.animationDefnNameCurrent = null;
		}
		vel.z = velZ;
	}
}
