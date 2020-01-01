
function Constraint_Pose(skeletonAtRest, skeletonPosed)
{
	this.skeletonAtRest = skeletonAtRest;
	this.skeletonPosed = skeletonPosed;
}

{
	Constraint_Pose.prototype.constrain = function(universe, world, zone, entityToConstrain)
	{
		var collidable = entityToConstrain.Collidable;
		var meshAtRest = collidable.colliderAtRest;
		var meshPosed = collidable.collider;

		var transformPose = new Transform_MeshPoseWithSkeleton
		(
			meshAtRest,
			this.skeletonAtRest,
			this.skeletonPosed,
			BoneInfluence.buildManyForBonesAndVertexGroups
			(
				this.skeletonAtRest.bonesAll,
				meshAtRest.vertexGroups
			)
		);

		transformPose.transformMesh(meshPosed);
	}
}
