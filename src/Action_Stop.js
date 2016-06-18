
function Action_Stop()
{
	this.name = "Stop";
}

{
	Action_Stop.prototype.perform = function(world, entity)
	{
		var entityLoc = entity.loc;
		entityLoc.vel.clear();
		entityLoc.accel.clear();
	}
}
