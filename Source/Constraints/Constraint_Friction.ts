
class Constraint_Friction implements Constraint
{
	speedMax: number;
	frictionPerTick: number;
	epsilon: number;

	constructor(speedMax: number, frictionPerTick: number, epsilon: number)
	{
		this.speedMax = speedMax;
		this.frictionPerTick = frictionPerTick;
		this.epsilon = epsilon;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToConstrain = uwpe.entity;

		var vel = entityToConstrain.locatable().loc.vel;
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
			var animatable = entityToConstrain.animatable();
			if (animatable != null)
			{
				animatable.animationStopByName("Walk");
				animatable.transformableReset();
			}
		}
		vel.z = velZ;
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }

}
