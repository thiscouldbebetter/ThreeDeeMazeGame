
class Action_Jump extends ActionTimed
{
	name: string;
	acceleration: number;

	constructor(acceleration: number)
	{
		super("Jump");
		this.acceleration = acceleration;
	}

	perform
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		var entityLoc = entity.locatable().loc;
		var isEntityGrounded =
			Groundable.fromEntity(entity).isGrounded(universe, world, place, entity);
		if (isEntityGrounded)
		{
			entityLoc.accel.z -= this.acceleration;
		}
		var animatable = entity.animatable();
		animatable.animationStartByName("Jump", world);
	}
}
