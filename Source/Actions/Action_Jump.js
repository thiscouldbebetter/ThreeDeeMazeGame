
function Action_Jump(acceleration)
{
	this.name = "Jump";
	this.acceleration = acceleration;
}

{
	Action_Jump.prototype.perform = function(universe, world, place, entity)
	{
		var entityLoc = entity.Locatable.loc;
		var isEntityGrounded = entity.Groundable.isGrounded(universe, world, place, entity);
		if (isEntityGrounded == true)
		{
			entityLoc.accel.z -= this.acceleration;
		}
		entity.Animatable.animationStart("Jump");
	}
}
