
function Action_Turn(amountToTurnRightAndDown)
{
	this.ticksToHold = 1;
	this.amountToTurnRightAndDown = amountToTurnRightAndDown;

	this.name = "Turn" + this.amountToTurnRightAndDown.toString();

	this.orientationTemp = Orientation.buildDefault();
}

{
	Action_Turn.prototype.perform = function(world, entity)
	{
		var entityOrientation = entity.loc.orientation;
		this.orientationTemp.overwriteWith(entityOrientation);

		entityOrientation.overwriteWith
		(
			new Orientation
			(
				this.orientationTemp.forward.add
				(
					this.orientationTemp.right.multiplyScalar
					(	
						this.amountToTurnRightAndDown.x	
					)
				),
				entityOrientation.down
			)
		)

		// todo - Down.
	}
}