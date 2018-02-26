
function Constraint_Pose(skeletonAtRest, skeletonPosed)
{
	this.skeletonAtRest = skeletonAtRest;
	this.skeletonPosed = skeletonPosed;
}

{
	Constraint_Pose.prototype.constrainEntity = function(world, zone, entityToConstrain)
	{
		var meshAtRest = entityToConstrain.defn.mesh;
		var meshPosed = entityToConstrain.meshTransformed;

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
