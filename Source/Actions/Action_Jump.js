
function Action_Jump(acceleration)
{
	this.name = "Jump";
	this.acceleration = acceleration;
}

{
	Action_Jump.prototype.perform = function(universe, world, zone, entity)
	{
		var entityLoc = entity.Locatable.loc;
		var isEntityGrounded = entity.isGrounded(world);
		if (isEntityGrounded == true)
		{
			entityLoc.accel.z -= this.acceleration;
		}

		var animationRun = entity.constraints["Animate"].animationRun;
		animationRun.animationDefnNameCurrent = "Jump";
	}
}
