
function Constraint_Attach(entityAttachedTo, offsetForwardRightDown)
{
	this.name = "Attach";
	this.entityAttachedTo = entityAttachedTo;
	this.offsetForwardRightDown = offsetForwardRightDown;

	this.transformOrient = new Transform_Orient
	(
		this.entityAttachedTo.Locatable.loc.orientation
	);
}

{
	Constraint_Attach.prototype.constrain = function(universe, world, zone, entityToConstrain)
	{
		this.transformOrient.transformCoords
		(
			entityToConstrain.Locatable.loc.pos.overwriteWith
			(
				this.offsetForwardRightDown
			)
		).add
		(
			this.entityAttachedTo.Locatable.loc.pos
		);
	}
}
