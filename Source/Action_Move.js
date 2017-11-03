
function Action_Move(amountToMoveForwardRightDown)
{
	this.amountToMoveForwardRightDown = amountToMoveForwardRightDown;

	this.name = "Move" + this.amountToMoveForwardRightDown.toString();

	this.acceleration = new Coords(0, 0, 0);
	this.transformOrient = new Transform_Orient();
}

{
	Action_Move.prototype.perform = function(world, entity)
	{
		var entityLoc = entity.loc;
		var isEntityOnGround = (entityLoc.pos.z >= 0); // hack
		if (isEntityOnGround == true)
		{
			this.transformOrient.orientation = entityLoc.orientation;

			this.acceleration.overwriteWith
			(
				this.amountToMoveForwardRightDown
			).transform
			(
				this.transformOrient
			)
	
			entityLoc.accel.add
			(
				this.acceleration
			);
	
			var animationRun = entity.constraints["Animate"].animationRun;
			animationRun.animationDefnNameCurrent = "Walk";
		}
	}
}
