
class Constraint_OrientToward implements Constraint
{
	name: string;

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

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToConstrain = uwpe.entity;

		var entityToConstrainLoc = Locatable.of(entityToConstrain).loc;
		var targetLoc = Locatable.of(this.targetEntity).loc;
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

	nameSet(value: string): Constraint
	{
		this.name = value;
		return this;
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }

}
