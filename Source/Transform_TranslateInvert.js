
function Transform_TranslateInvert(displacement)
{
	this.displacement = displacement;
}

{
	Transform_TranslateInvert.prototype.applyToCoords = function(coordsToTransform)
	{
		coordsToTransform.subtract(this.displacement);
	}
}
