

function Transform_Translate(displacement)
{
	this.displacement = displacement;
}

{
	Transform_Translate.prototype.applyToCoords = function(coordsToTransform)
	{
		coordsToTransform.add(this.displacement);
	}
}
