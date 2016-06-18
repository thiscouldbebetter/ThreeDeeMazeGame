
function AnimationDefnGroup(name, animationDefns)
{
	this.name = name;
	this.animationDefns = animationDefns;
	this.animationDefns.addLookups("name");
}
