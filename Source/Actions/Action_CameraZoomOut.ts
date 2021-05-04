
class Action_CameraZoomOut extends ActionTimed
{
	distanceToZoomOut: number;

	constructor(distanceToZoomOut: number)
	{
		super("CameraZoomOut" + distanceToZoomOut);

		this.distanceToZoomOut = distanceToZoomOut;
		this.ticksToHold = 1;
	}

	perform
	(
		universe: Universe, worldAsWorld: World, zone: Zone, entity: Entity
	): void
	{
		var world = world as WorldExtended;

		var entityForCamera = world.cameraEntity;
		var constraintAttach =
			entityForCamera.constrainable().constraintByClassName
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
