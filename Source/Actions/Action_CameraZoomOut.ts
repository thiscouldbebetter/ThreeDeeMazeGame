
class Action_CameraZoomOut extends ActionTimed
{
	distanceToZoomOut: number;

	constructor(distanceToZoomOut: number)
	{
		super("CameraZoomOut" + distanceToZoomOut);

		this.distanceToZoomOut = distanceToZoomOut;
		this.ticksToHold = 1;
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world as WorldExtended;

		var entityForCamera = world.cameraEntity;
		var constraintAttach =
			Constrainable.of(entityForCamera).constraintByClassName
			(
				Constraint_Attach.name
			) as Constraint_Attach;
		constraintAttach.offsetForwardRightDown.add
		(
			new Coords(-1, 0, -1).normalize().multiplyScalar
			(
				this.distanceToZoomOut
			)
		);
	}
}
