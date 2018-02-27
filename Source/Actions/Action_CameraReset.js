
function Action_CameraReset()
{
	this.name = "CameraReset";
}

{
	Action_CameraReset.prototype.perform = function(universe, world, zone, entity)
	{
		var camera = world.cameraEntity;
		var cameraLoc = camera.loc;
		var cameraPos = cameraLoc.pos;
		var cameraZ = cameraPos.z;

		var player = world.entityForPlayer;
		var playerLoc = player.loc;

		cameraLoc.overwriteWith(playerLoc);
		cameraPos.add
		(
			playerLoc.orientation.forward.clone().multiplyScalar(10)
		);
		cameraPos.z = cameraZ;
	}
}
