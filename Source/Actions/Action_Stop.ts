
class Action_Stop extends ActionTimed
{
	constructor()
	{
		super("Stop");
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var entityLoc = entity.locatable().loc;
		entityLoc.vel.clear();
		entityLoc.accel.clear();
	}
}
