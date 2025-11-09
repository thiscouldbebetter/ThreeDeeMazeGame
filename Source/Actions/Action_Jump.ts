
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
		var world = uwpe.world as WorldExtended;
		var place = world.place();
		var entity = uwpe.entity;

		var entityLoc = Locatable.of(entity).loc;
		var isEntityGrounded =
			Groundable.fromEntity(entity).isGrounded(universe, world, place, entity);
		if (isEntityGrounded)
		{
			entityLoc.accel.z -= this.acceleration;
		}
		var animatable = Animatable2.of(entity);
		animatable.animationStartByName("Jump", world);
	}
}
