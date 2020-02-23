
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
		var entityToConstrainLoc = entityToConstrain.locatable.loc;
		var targetLoc = this.targetEntity.locatable.loc;
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
