
class Constraint_Gravity implements Constraint
{
	accelerationPerTick: number;

	constructor(accelerationPerTick: number)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain
	(
		universe: Universe, world: World, place: Place, entityToConstrain: Entity
	): void
	{
		var entityLoc = entityToConstrain.locatable().loc;
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

			var animatable = entityToConstrain.animatable();
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
}
