
function Polar(azimuth, elevation, radius)
{
	// values in radians

	this.azimuth = azimuth;
	this.elevation = elevation;
	this.radius = radius;
}

{
	// static methods

	Polar.fromCoords = function(coordsToConvert)
	{
		var azimuth = Math.atan2(coordsToConvert.y, coordsToConvert.x);
		if (azimuth < 0)
		{
			azimuth += Constants.Tau;
		}

		var radius = coordsToConvert.magnitude();

		var elevation = Math.asin(coordsToConvert.z / radius);

		var returnValue = new Polar
		(
			azimuth,
			elevation,
			radius
		);

		return returnValue;
	}

	// instance methods

	Polar.prototype.randomize = function()
	{
		this.azimuth = randomizer.next() * Constants.Tau;
		this.elevation = randomizer.next() * Constants.Tau;
		this.radius = randomzier.next();
	}

	Polar.prototype.toCoords = function()
	{
		var cosineOfElevation = Math.cos(this.elevation);

		var returnValue = new Coords
		(
			Math.cos(this.azimuth) * cosineOfElevation,
			Math.sin(this.azimuth) * cosineOfElevation,
			Math.sin(this.elevation)
		).multiplyScalar(this.radius);

		return returnValue;
	}
}
