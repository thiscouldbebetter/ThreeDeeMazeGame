
class Action_DoSomething extends ActionTimed
{
	constructor()
	{
		super("DoSomething");
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var entity = uwpe.entity;

		var animatable = entity.animatable();
		animatable.animationStartByName("DoSomething", world);
	}
}
