
function Constraint_OrientToward(targetEntity)
{
	this.targetEntity = targetEntity;

	this.transformOrient = new Transform_Orient
	(
		Orientation.Instances().ForwardXDownZ.clone()
	);
}

{
	Constraint_OrientToward.prototype.constrain = function(universe, world, zone, entityToConstrain)
	{
		var entityToConstrainLoc = entityToConstrain.Locatable.loc;
		var targetLoc = this.targetEntity.Locatable.loc;
		var entityOrientationForward = targetLoc.pos.clone().subtract
		(
			entityToConstrainLoc.pos
		).normalize();

		entityToConstrainLoc.orientation.overwriteWith
		(
			new Orientation
			(
				entityOrientationForward,
				targetLoc.orientation.down
			)
		);
	}
}
