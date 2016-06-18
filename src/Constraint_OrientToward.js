
function Constraint_OrientToward(targetEntity)
{
	this.targetEntity = targetEntity;

	this.transformOrient = new Transform_Orient
	(
		Orientation.buildDefault()
	);
}

{
	Constraint_OrientToward.prototype.constrainEntity = function(world, entityToConstrain)
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
