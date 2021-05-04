
class Action_Stop extends ActionTimed
{
	constructor()
	{
		super("Stop");
	}

	perform
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		var entityLoc = entity.locatable().loc;
		entityLoc.vel.clear();
		entityLoc.accel.clear();
	}
}
