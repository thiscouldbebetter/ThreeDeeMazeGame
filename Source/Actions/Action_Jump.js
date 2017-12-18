
function Action_Jump(acceleration)
{
	this.name = "Jump";
	this.acceleration = acceleration;
}

{
	Action_Jump.prototype.perform = function(universe, world, entity)
	{
		var entityLoc = entity.loc;
		if (entityLoc.pos.z >= 0)
		{
			entityLoc.accel.z -= this.acceleration;
		}

		var animationRun = entity.constraints["Animate"].animationRun;
		animationRun.animationDefnNameCurrent = "Jump";
	}
}
