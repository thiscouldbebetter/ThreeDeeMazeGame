
class Action_Stop extends ActionTimed
{
	constructor()
	{
		super("Stop");
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var entityLoc = Locatable.of(entity).loc;
		entityLoc.vel.clear();
		entityLoc.accel.clear();
	}
}
