
class Action_DoSomething
{
	constructor()
	{
		this.name = "DoSomething";
	}

	perform(universe, world, zone, entity)
	{
		entity.animatable.animationStart("DoSomething");
	}
}
