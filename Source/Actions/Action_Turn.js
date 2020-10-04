
class Action_Turn
{
	constructor(amountToTurnRightAndDown)
	{
		this.ticksToHold = 1;
		this.amountToTurnRightAndDown = amountToTurnRightAndDown;

		this.name = "Turn" + this.amountToTurnRightAndDown.toString();

		this.orientationTemp = Orientation.Instances().ForwardXDownZ.clone();
	}

	perform(universe, world, zone, entity)
	{
		var entityOrientation = entity.locatable.loc.orientation;
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
