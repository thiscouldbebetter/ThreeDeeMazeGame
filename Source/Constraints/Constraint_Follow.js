
function Constraint_Follow(entityToFollow, distanceToKeep)
{
	this.name = "Follow";
	this.entityToFollow = entityToFollow;
	this.distanceToKeep = distanceToKeep;
}

{
	Constraint_Follow.prototype.constrainEntity = function(world, entityToConstrain)
	{
		var entityToConstrainLoc = entityToConstrain.loc;
		var entityToConstrainPos = entityToConstrainLoc.pos;
		var entityToFollowLoc = this.entityToFollow.loc;
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
}
