
class Action_DoSomething extends ActionTimed
{
	constructor()
	{
		super("DoSomething");
	}

	perform
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		var animatable = entity.animatable();
		animatable.animationStartByName("DoSomething", world);
	}
}
