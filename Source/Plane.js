
function Plane(normal, distanceFromOrigin)
{
	this.normal = normal;
	this.distanceFromOrigin = distanceFromOrigin;
}

{
	// static variables
	Plane.DisplacementFromPoint0To1 = new Coords(0, 0, 0);

	// instance methods

	Plane.prototype.equals = function(other)
	{
		var returnValue = 
		(
			this.normal.equals(other.normal) 
			&& this.distanceFromOrigin == other.distanceFromOrigin
		);

		return returnValue;
	}

	Plane.prototype.fromPoints = function(point0, point1, point2)
	{
		var displacementFromPoint0To1 = Plane.DisplacementFromPoint0To1;
		displacementFromPoint0To1.overwriteWith
		(
			point1
		).subtract
		(
			point0
		);

		var displacementFromPoint0To2 = point2.clone().subtract(point0);

		this.normal.overwriteWith
		(
			displacementFromPoint0To1
		).crossProduct
		(
			displacementFromPoint0To2
		).normalize();

		this.distanceFromOrigin = this.normal.dotProduct
		(
			point0
		);

		return this;
	}

}
