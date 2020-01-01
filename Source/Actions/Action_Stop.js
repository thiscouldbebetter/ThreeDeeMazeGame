
function Action_Stop()
{
	this.name = "Stop";
}

{
	Action_Stop.prototype.perform = function(universe, world, zone, entity)
	{
		var entityLoc = entity.Locatable.loc;
		entityLoc.vel.clear();
		entityLoc.accel.clear();
	}
}
