
function Transform_Scale(scaleFactors)
{
	this.scaleFactors = scaleFactors;
}

{
	Transform_Scale.prototype.applyToCoords = function(coordsToTransform)
	{
		coordsToTransform.multiply(this.scaleFactors);
	}
}
