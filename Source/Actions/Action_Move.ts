
class Action_Move extends ActionTimed
{
	name: string;
	amountToMoveForwardRightDown: Coords;

	acceleration: Coords;
	transformOrient: Transform_Orient;

	constructor(amountToMoveForwardRightDown: Coords)
	{
		super("Move" + amountToMoveForwardRightDown.toString());

		this.ticksToHold = 1;
		this.amountToMoveForwardRightDown = amountToMoveForwardRightDown;

		this.acceleration = Coords.create();
		this.transformOrient = new Transform_Orient(null);
	}

	perform
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		var entityLoc = entity.locatable().loc;
		var isEntityOnGround =
			Groundable.fromEntity(entity).isGrounded(universe, world, place, entity);
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

			var animatable = entity.animatable();
			animatable.animationStartByName("Walk", world);
		}
	}
}
