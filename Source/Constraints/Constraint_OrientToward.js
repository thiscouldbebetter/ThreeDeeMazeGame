
function Constraint_OrientToward(targetEntity)
{
	this.targetEntity = targetEntity;

	this.transformOrient = new Transform_Orient
	(
		Orientation.Instances.ForwardXDownZ.clone()
	);
}

{
	Constraint_OrientToward.prototype.constrainEntity = function(world, zone, entityToConstrain)
	{
		var entityOrientationForward = this.targetEntity.loc.pos.clone().subtract
		(
			entityToConstrain.loc.pos
		).normalize();

		entityToConstrain.loc.orientation.overwriteWith
		(
			new Orientation
			(
				entityOrientationForward,
				this.targetEntity.loc.orientation.down
			)
		);
	}
}
