
class Action_DoNothing extends ActionTimed
{
	constructor()
	{
		super("DoNothing");
	}

	perform
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		// Do nothing.
	}
}
