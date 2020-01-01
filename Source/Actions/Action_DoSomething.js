
function Action_DoSomething()
{
	this.name = "DoSomething";
}

{
	Action_DoSomething.prototype.perform = function(universe, world, zone, entity)
	{
		entity.Animatable.animationStart("DoSomething");
	}
}
