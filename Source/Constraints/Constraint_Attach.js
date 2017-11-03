
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
		this.transformOrient.applyToCoords
		(
			entityToConstrain.loc.pos.overwriteWith
			(
				this.offsetForwardRightDown
			)
		).add
		(
			this.entityAttachedTo.loc.pos
		);
	}
}
