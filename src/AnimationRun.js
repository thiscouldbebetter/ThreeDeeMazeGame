
function AnimationRun(animationDefnGroup, transformableAtRest, transformable)
{
	this.animationDefnGroup = animationDefnGroup;	
	this.animationDefnNameCurrent = null;
	this.transformableAtRest = transformableAtRest;
	this.transformable = transformable;
}

{
	AnimationRun.prototype.animationDefnCurrent = function()
	{
		var returnValue = null;

		if (this.animationDefnNameCurrent != null)
		{
			var animationDefns = this.animationDefnGroup.animationDefns;
			returnValue = animationDefns[this.animationDefnNameCurrent];
		}

		return returnValue;
	}

	AnimationRun.prototype.frameCurrent = function()
	{	
		var returnValue = null;

		var animationDefn = this.animationDefnCurrent();

		var framesSinceBeginningOfCycle = 
			Globals.Instance.timerTicksSoFar 
			% animationDefn.numberOfFramesTotal;

		var i;

		var keyframes = animationDefn.keyframes;
		for (i = keyframes.length - 1; i >= 0; i--)
		{
			keyframe = keyframes[i];

			if (keyframe.frameIndex <= framesSinceBeginningOfCycle)
			{
				break;
			}
		}
		
		var keyframe = keyframes[i];
		var framesSinceKeyframe = framesSinceBeginningOfCycle - keyframe.frameIndex;

		var keyframeNext = keyframes[i + 1];
		var numberOfFrames = keyframeNext.frameIndex - keyframe.frameIndex;
		var fractionOfProgressFromKeyframeToNext = framesSinceKeyframe / numberOfFrames;

		returnValue = keyframe.interpolateWith
		(
			keyframeNext, 
			fractionOfProgressFromKeyframeToNext
		);

		return returnValue;
	}

	AnimationRun.prototype.updateForTimerTick = function()
	{
		this.transformable.overwriteWith(this.transformableAtRest);
	
		if (this.animationDefnNameCurrent != null)
		{
			var frameCurrent = this.frameCurrent();

			var transforms = frameCurrent.transforms;

			for (var i = 0; i < transforms.length; i++)
			{
				var transformToApply = transforms[i];
				transformToApply.transform(this.transformable);
			}
		}
	}
}
