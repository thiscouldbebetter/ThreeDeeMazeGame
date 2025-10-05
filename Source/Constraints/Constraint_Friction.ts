
class Constraint_Friction implements Constraint
{
	name: string;
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

		var vel = Locatable.of(entityToConstrain).loc.vel;
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
			var animatable = Animatable2.of(entityToConstrain);
			if (animatable != null)
			{
				animatable.animationStopByName("Walk");
				animatable.transformableReset();
			}
		}
		vel.z = velZ;
	}

	nameSet(value: string): Constraint
	{
		this.name = value;
		return this;
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }

}
