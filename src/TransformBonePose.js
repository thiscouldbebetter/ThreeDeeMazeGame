
function TransformBonePose(boneName, cyclesToRotateAroundAxesDownRightForward)
{
	this.boneName = boneName;
	this.cyclesToRotateAroundAxesDownRightForward = cyclesToRotateAroundAxesDownRightForward;

	this.propertyName = this.boneName;
}

{
	// instance methods

	TransformBonePose.prototype.clone = function()
	{
		return new TransformBonePose
		(
			this.boneName, 
			this.cyclesToRotateAroundAxesDownRightForward
		);
	}

	TransformBonePose.prototype.interpolateWith = function(other, fractionOfProgressTowardOther)
	{
		var cyclesToRotateAroundAxesDownRightForwardInterpolated = [];

		for (var i = 0; i < this.cyclesToRotateAroundAxesDownRightForward.length; i++)
		{
			var cyclesToRotateInterpolated = 
				(1 - fractionOfProgressTowardOther) * this.cyclesToRotateAroundAxesDownRightForward[i]
				+ fractionOfProgressTowardOther * other.cyclesToRotateAroundAxesDownRightForward[i];

			cyclesToRotateAroundAxesDownRightForwardInterpolated[i] = cyclesToRotateInterpolated;
		}

		var returnValue = new TransformBonePose
		(
			this.boneName,
			cyclesToRotateAroundAxesDownRightForwardInterpolated
		);	

		return returnValue;
	}

	TransformBonePose.prototype.transform = function(transformableToTransform)
	{
		var skeletonToTransform = transformableToTransform;

		var boneToTransform = skeletonToTransform.bonesAll[this.boneName];
		var boneOrientation = boneToTransform.orientation;	

		var axesToRotateAround = 
		[
			boneOrientation.down,
			boneOrientation.right,
			boneOrientation.forward,
		];

		var quaternionsForRotation = [];

		for (var i = 0; i < this.cyclesToRotateAroundAxesDownRightForward.length; i++)
		{
			var axisToRotateAround = axesToRotateAround[i];
			var cyclesToRotateAroundAxis = this.cyclesToRotateAroundAxesDownRightForward[i];

			if (cyclesToRotateAroundAxis != 0)
			{
				var quaternionForRotation = Quaternion.fromAxisAndCyclesToRotate
				(
					axisToRotateAround, 
					cyclesToRotateAroundAxis
				);

				quaternionsForRotation.push(quaternionForRotation);
			}
		}

		this.transform_Bone(quaternionsForRotation, boneToTransform)
	}

	TransformBonePose.prototype.transform_Bone = function(quaternionsForRotation, boneToTransform)
	{	
		var axesToTransform = boneToTransform.orientation.axes;

		for (var i = 0; i < quaternionsForRotation.length; i++)
		{
			var quaternionForRotation = quaternionsForRotation[i];
			for (var a = 0; a < axesToTransform.length; a++)
			{
				var axisToTransform = axesToTransform[a];

				quaternionForRotation.applyToCoordsAsRotation
				(
					axisToTransform		
				);
			}
		}

		for (var i = 0; i < boneToTransform.children.length; i++)
		{
			var childBone = boneToTransform.children[i];
			this.transform_Bone(quaternionsForRotation, childBone);
		}
	}
}
