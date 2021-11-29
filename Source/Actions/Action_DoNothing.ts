
class Action_DoNothing extends ActionTimed
{
	constructor()
	{
		super("DoNothing");
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}
}
