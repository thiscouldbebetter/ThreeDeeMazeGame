
function Action_DoSomething()
{
	this.name = "DoSomething";
}

{
	Action_DoSomething.prototype.perform = function(world, entity)
	{
		var animationRun = entity.constraints["Animate"].animationRun;
		animationRun.animationDefnNameCurrent = "DoSomething";
	}
}
