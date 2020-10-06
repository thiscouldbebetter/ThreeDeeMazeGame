
class Action_DoSomething
{
	constructor()
	{
		this.name = "DoSomething";
	}

	perform(universe, world, zone, entity)
	{
		var animatable = entity.animatable();
		animatable.animationStartByName("DoSomething", world);
	}
}
