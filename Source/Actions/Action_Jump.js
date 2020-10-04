
class Action_Jump
{
	constructor(acceleration)
	{
		this.name = "Jump";
		this.acceleration = acceleration;
	}

	perform(universe, world, place, entity)
	{
		var entityLoc = entity.locatable.loc;
		var isEntityGrounded =
			entity.groundable.isGrounded(universe, world, place, entity);
		if (isEntityGrounded == true)
		{
			entityLoc.accel.z -= this.acceleration;
		}
		entity.animatable.animationStart("Jump");
	}
}
