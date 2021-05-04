
class Constraint_OrientToward implements Constraint
{
	targetEntity: Entity;

	transformOrient: Transform_Orient;

	constructor(targetEntity: Entity)
	{
		this.targetEntity = targetEntity;

		this.transformOrient = new Transform_Orient
		(
			Orientation.Instances().ForwardXDownZ.clone()
		);
	}

	constrain
	(
		universe: Universe, world: World, place: Place, entityToConstrain: Entity
	): void
	{
		var entityToConstrainLoc = entityToConstrain.locatable().loc;
		var targetLoc = this.targetEntity.locatable().loc;
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
