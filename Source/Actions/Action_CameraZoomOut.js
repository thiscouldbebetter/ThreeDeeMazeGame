
function Action_CameraZoomOut(distanceToZoomOut)
{
	this.ticksToHold = 1;
	this.distanceToZoomOut = distanceToZoomOut;

	this.name = "CameraZoomOut" + this.distanceToZoomOut;
}

{
	Action_CameraZoomOut.prototype.perform = function(universe, world, zone, entity)
	{
		var entityForCamera = world.cameraEntity;
		var constraintAttach = entityForCamera.constraints["Attach"];
		constraintAttach.offsetForwardRightDown.add
		(
			new Coords(-1, 0, -1).normalize().multiplyScalar
			(
				this.distanceToZoomOut
			)
		);
	}
}
