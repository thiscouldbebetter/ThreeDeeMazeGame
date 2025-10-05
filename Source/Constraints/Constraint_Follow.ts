
class Constraint_Follow implements Constraint
{
	name: string;
	entityToFollow: Entity
	distanceToKeep: number;

	constructor(entityToFollow: Entity, distanceToKeep: number)
	{
		this.name = "Follow";
		this.entityToFollow = entityToFollow;
		this.distanceToKeep = distanceToKeep;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToConstrain = uwpe.entity;

		var entityToConstrainLoc = Locatable.of(entityToConstrain).loc;
		var entityToConstrainPos = entityToConstrainLoc.pos;
		var entityToFollowLoc = Locatable.of(this.entityToFollow).loc;
		var entityToFollowPos = entityToFollowLoc.pos;

		var displacementToLeader = entityToFollowPos.clone().subtract(entityToConstrainPos);
		displacementToLeader.z = 0; // hack - XY only
		var distanceToLeader = displacementToLeader.magnitude();
		var directionToLeader = displacementToLeader.clone().divideScalar(distanceToLeader);

		var deviation = distanceToLeader - this.distanceToKeep;

		if (deviation > 0)
		{
			var deviationFractional = deviation / this.distanceToKeep;

			var thrustBase = this.distanceToKeep / 2; // hack
			var thrustToApply = deviationFractional * thrustBase;
			entityToConstrainPos.add
			(
				directionToLeader.clone().multiplyScalar(thrustToApply)
			)
		}
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
