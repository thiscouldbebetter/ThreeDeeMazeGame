
class Action_Stop
{
	constructor()
	{
		this.name = "Stop";
	}

	perform(universe, world, zone, entity)
	{
		var entityLoc = entity.locatable().loc;
		entityLoc.vel.clear();
		entityLoc.accel.clear();
	}
}
