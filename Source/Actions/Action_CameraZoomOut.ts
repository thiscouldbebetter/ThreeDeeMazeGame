
class Action_CameraZoomOut extends ActionTimed
{
	distanceToZoomOut: number;

	_displacementToZoomOut: Coords;

	constructor(distanceToZoomOut: number)
	{
		super("CameraZoomOut" + distanceToZoomOut);

		this.distanceToZoomOut = distanceToZoomOut;
		this.ticksToHold = 1;

		this._displacementToZoomOut =
			Coords
				.fromXYZ(-1, 0, -1)
				.normalize()
				.multiplyScalar(this.distanceToZoomOut);
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world as WorldExtended;
		var place = world.place() as PlaceZoned2;

		var entityForCamera = place.cameraEntity;
		var constraintAttach =
			Constrainable.of(entityForCamera).constraintByClassName
			(
				Constraint_Attach.name
			) as Constraint_Attach;

		constraintAttach.
			offsetForwardRightDown
			.add(this._displacementToZoomOut);
	}
}
