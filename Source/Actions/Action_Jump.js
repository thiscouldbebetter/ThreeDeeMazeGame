
function Action_Jump(acceleration)
{
	this.name = "Jump";
	this.acceleration = acceleration;
}

{
	Action_Jump.prototype.perform = function(universe, world, place, entity)
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
