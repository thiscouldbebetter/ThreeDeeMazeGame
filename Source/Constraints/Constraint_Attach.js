
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
	Constraint_Attach.prototype.constrainEntity = function(world, zone, entityToConstrain)
	{
		this.transformOrient.transformCoords
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
