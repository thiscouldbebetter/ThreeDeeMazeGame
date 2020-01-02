
function Action_Move(amountToMoveForwardRightDown)
{
	this.ticksToHold = 1;
	this.amountToMoveForwardRightDown = amountToMoveForwardRightDown;

	this.name = "Move" + this.amountToMoveForwardRightDown.toString();

	this.acceleration = new Coords(0, 0, 0);
	this.transformOrient = new Transform_Orient();
}

{
	Action_Move.prototype.perform = function(universe, world, place, entity)
	{
		var entityLoc = entity.Locatable.loc;
		var isEntityOnGround = entity.Groundable.isGrounded(universe, world, place, entity);
		if (isEntityOnGround)
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

			entity.Animatable.animationStart("Walk");
		}
	}
}
