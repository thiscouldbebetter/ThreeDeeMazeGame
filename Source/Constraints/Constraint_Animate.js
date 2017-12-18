
function Constraint_Animate(transformableAtRest, transformableTransformed, animationDefnGroup)
{
	this.name = "Animate";
	this.transformableAtRest = transformableAtRest;
	this.transformableTransformed = transformableTransformed;
	this.animationDefnGroup = animationDefnGroup;

	this.animationRun = new AnimationRun
	(
		this.animationDefnGroup,
		this.transformableAtRest,
		this.transformableTransformed
	);
}

{
	Constraint_Animate.prototype.constrainEntity = function(world, entityToConstrain)
	{
		this.animationRun.updateForTimerTick(world);
	}
}
