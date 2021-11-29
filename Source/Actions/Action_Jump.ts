
class Action_Jump extends ActionTimed
{
	name: string;
	acceleration: number;

	constructor(acceleration: number)
	{
		super("Jump");
		this.acceleration = acceleration;
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var world = uwpe.world;
		var place = uwpe.place;
		var entity = uwpe.entity;

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
