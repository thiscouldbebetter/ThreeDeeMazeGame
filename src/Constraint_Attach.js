
function Constraint_Attach(entityAttachedTo, offsetForwardRightDown)
{
	this.name = "Attach";
	this.entityAttachedTo = entityAttachedTo;
	this.offsetForwardRightDown = offsetForwardRightDown;

	this.transformOrient = new Transform_Orient
	(
		this.entityAttachedTo.loc.orientation
	);
}

{
	Constraint_Attach.prototype.constrainEntity = function(world, entityToConstrain)
	{
		entityToConstrain.loc.pos.overwriteWith
		(
			this.offsetForwardRightDown
		).transform
		(
			this.transformOrient
		).add
		(
			this.entityAttachedTo.loc.pos
		);
	}
}
