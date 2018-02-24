
function Action_Jump(acceleration)
{
	this.name = "Jump";
	this.acceleration = acceleration;
}

{
	Action_Jump.prototype.perform = function(universe, world, entity)
	{
		var entityLoc = entity.loc;
		//var isEntityGrounded = (entityLoc.pos.z >= -.01);
		var isEntityGrounded = entity.isGrounded(world);
		if (isEntityGrounded == true)
		{
			entityLoc.accel.z -= this.acceleration;
		}

		var animationRun = entity.constraints["Animate"].animationRun;
		animationRun.animationDefnNameCurrent = "Jump";
	}
}
