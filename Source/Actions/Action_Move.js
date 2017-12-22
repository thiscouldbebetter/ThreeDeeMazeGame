
function Action_Move(amountToMoveForwardRightDown)
{
	this.ticksToHold = 1;
	this.amountToMoveForwardRightDown = amountToMoveForwardRightDown;

	this.name = "Move" + this.amountToMoveForwardRightDown.toString();

	this.acceleration = new Coords(0, 0, 0);
	this.transformOrient = new Transform_Orient();
}

{
	Action_Move.prototype.perform = function(universe, world, entity)
	{
		var entityLoc = entity.loc;
		var isEntityOnGround = (entityLoc.pos.z >= 0); // hack
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
