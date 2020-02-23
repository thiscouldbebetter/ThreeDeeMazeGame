
function Constraint_Attach(entityAttachedTo, offsetForwardRightDown)
{
	this.name = "Attach";
	this.entityAttachedTo = entityAttachedTo;
	this.offsetForwardRightDown = offsetForwardRightDown;

	this.transformOrient = new Transform_Orient
	(
		this.entityAttachedTo.locatable.loc.orientation
	);
}

{
	Constraint_Attach.prototype.constrain = function(universe, world, zone, entityToConstrain)
	{
		this.transformOrient.transformCoords
		(
			entityToConstrain.locatable.loc.pos.overwriteWith
			(
				this.offsetForwardRightDown
			)
		).add
		(
			this.entityAttachedTo.locatable.loc.pos
		);
	}
}
