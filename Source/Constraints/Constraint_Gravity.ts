
class Constraint_Gravity2 implements Constraint
{
	accelerationPerTick: number;

	name: string;

	constructor(accelerationPerTick: number)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var world = uwpe.world;
		var place = uwpe.place;
		var entityToConstrain = uwpe.entity;

		var entityLoc = Locatable.of(entityToConstrain).loc;
		var isEntityGrounded =
			Groundable.fromEntity(entityToConstrain).isGrounded(universe, world, place, entityToConstrain);

		if (isEntityGrounded == false)
		{
			entityLoc.accel.z += this.accelerationPerTick;
		}
		else
		{
			entityLoc.vel.z = 0;
			entityLoc.pos.z = -.01;

			var animatable = Animatable2.of(entityToConstrain);
			if (animatable != null)
			{
				if (animatable.animationsRunningNames().indexOf("Jump") >= 0)
				{
					animatable.animationStartByName("Walk", world);
				}
			}
		}

		Groundable.fromEntity(entityToConstrain).ground
		(
			universe, world, place, entityToConstrain
		);
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
