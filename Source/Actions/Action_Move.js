
class Action_Move
{
	constructor(amountToMoveForwardRightDown)
	{
		this.ticksToHold = 1;
		this.amountToMoveForwardRightDown = amountToMoveForwardRightDown;

		this.name = "Move" + this.amountToMoveForwardRightDown.toString();

		this.acceleration = new Coords(0, 0, 0);
		this.transformOrient = new Transform_Orient();
	}

	perform(universe, world, place, entity)
	{
		var entityLoc = entity.locatable.loc;
		var isEntityOnGround =
			entity.groundable.isGrounded(universe, world, place, entity);
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

			entity.animatable.animationStart("Walk");
		}
	}
}
