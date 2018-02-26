
function Action_Move(amountToMoveForwardRightDown)
{
	this.ticksToHold = 1;
	this.amountToMoveForwardRightDown = amountToMoveForwardRightDown;

	this.name = "Move" + this.amountToMoveForwardRightDown.toString();

	this.acceleration = new Coords(0, 0, 0);
	this.transformOrient = new Transform_Orient();
}

{
	Action_Move.prototype.perform = function(universe, world, zone, entity)
	{
		var entityLoc = entity.loc;
		var isEntityOnGround = entity.isGrounded(world);
		if (isEntityOnGround == true)
		{
			this.transformOrient.orientation = entityLoc.orientation;

			this.transformOrient.transformCoords
			(
				this.acceleration.overwriteWith
				(
					this.amountToMoveForwardRightDown
				)
			)

			entityLoc.accel.add
			(
				this.acceleration
			);

			var constraintAnimate = entity.constraints["Animate"];
			if (constraintAnimate != null)
			{
				var animationRun = constraintAnimate.animationRun;
				animationRun.animationDefnNameCurrent = "Walk";
			}
		}
	}
}
