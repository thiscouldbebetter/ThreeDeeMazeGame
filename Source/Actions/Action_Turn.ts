
class Action_Turn extends ActionTimed
{
	amountToTurnRightAndDown: Coords;

	orientationTemp: Orientation;

	constructor(amountToTurnRightAndDown: Coords)
	{
		super("Turn" + amountToTurnRightAndDown.toString());

		this.ticksToHold = 1;
		this.amountToTurnRightAndDown = amountToTurnRightAndDown;

		this.orientationTemp = Orientation.Instances().ForwardXDownZ.clone();
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var entityOrientation = entity.locatable().loc.orientation;
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
