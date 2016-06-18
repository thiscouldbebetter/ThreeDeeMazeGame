

function Coords(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

{
	// constants

	Coords.NumberOfDimensions = 3;

	// instances

	function Coords_Instances()
	{
		if (Coords.Instances == null)
		{
			Coords.Instances = this;
		}

		this.OneZeroZero 	= new Coords(1, 0, 0);
		this.Ones 		= new Coords(1, 1, 1);
		this.ZeroZeroOne 	= new Coords(0, 0, 1);
		this.Zeroes 		= new Coords(0, 0, 0);

		this.Temp = new Coords(0, 0, 0);
	}

	Coords.Instances = new Coords_Instances();

	// instance methods

	Coords.prototype.absolute = function()
	{
		this.x = Math.abs(this.x);	
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);

		return this;
	}

	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;

		return this;
	}

	Coords.prototype.clear = function()
	{
		this.x = 0;
		this.y = 0;
		this.z = 0;

		return this;
	}

	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y, this.z);
	}

	Coords.prototype.crossProduct = function(other)
	{
		this.overwriteWithDimensions
		(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);

		return this;
	}

	Coords.prototype.dimension = function(dimensionIndex)
	{
		if (dimensionIndex == 0)
		{
			returnValue = this.x;
		}
		else if (dimensionIndex == 1)
		{
			returnValue = this.y;
		}
		else // if (dimensionIndex == 2)
		{
			returnValue = this.z;
		}

		return returnValue;
	}

	Coords.prototype.dimension_Set = function(dimensionIndex, value)
	{
		if (dimensionIndex == 0)
		{
			this.x = value;
		}
		else if (dimensionIndex == 1)
		{
			this.y = value;
		}
		else // if (dimensionIndex == 2)
		{
			this.z = value;
		}

		return returnValue;
	}

	Coords.prototype.dimensions = function()
	{
		return [ this.x, this.y, this.z ];
	}


	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		this.z /= other.z;

		return this;
	}

	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;

		return this;
	}

	Coords.prototype.dotProduct = function(other)
	{
		var returnValue = 
			this.x * other.x 
			+ this.y * other.y
			+ this.z * other.z;

		return returnValue;
	}

	Coords.prototype.equals = function(other, epsilon)
	{
		if (epsilon == null)
		{
			epsilon = 0;
		}

		var returnValue = 
		(
			(Math.abs(this.x - other.x) < epsilon)
			&& (Math.abs(this.y - other.y) < epsilon)
			&& (Math.abs(this.z - other.z) < epsilon)
		);

		return returnValue;
	}

	Coords.prototype.floor = function()
	{
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);

		return this;
	}

	Coords.prototype.isWithinRangeMinMax = function(min, max)
	{
		var returnValue =
		(
			this.x >= min.x
			&& this.y >= min.y
			&& this.z >= min.z
			&& this.x <= max.x
			&& this.y <= max.y
			&& this.z <= max.z
		);

		return returnValue;
	}

	Coords.prototype.isWithinRangeMax = function(max)
	{
		var returnValue =
		(
			this.x >= 0
			&& this.y >= 0
			&& this.z >= 0
			&& this.x <= max.x
			&& this.y <= max.y
			&& this.z <= max.z
		);

		return returnValue;
	}


	Coords.prototype.magnitude = function()
	{
		return Math.sqrt
		(
			this.x * this.x
			+ this.y * this.y
			+ this.z * this.z
		);
	}

	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;

		return this;
	}

	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	Coords.prototype.normalize = function()
	{
		return this.divideScalar(this.magnitude());
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;

		return this;
	}

	Coords.prototype.overwriteWithDimensions = function(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	Coords.prototype.productOfDimensions = function()
	{
		var returnValue =
		(
			this.x 
			* this.y
			* this.z
		);

		return returnValue;
	}

	Coords.prototype.randomize = function()
	{
		var randomizer = Randomizer.Instance;

		return this.overwriteWithDimensions
		(
			randomizer.next(),
			randomizer.next(),
			randomizer.next()
		);
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;

		return this;
	}

	Coords.prototype.sumOfDimensions = function()
	{
		var returnValue =
		(
			this.x 
			+ this.y
			+ this.z
		);

		return returnValue;
	}

	Coords.prototype.toString = function()
	{
		return "(" + this.x + "," + this.y + "," + this.z + ")";
	}

	Coords.prototype.transform = function(transformToApply)
	{
		transformToApply.applyToCoords(this);

		return this;
	}

	Coords.prototype.trimToRange = function(rangeToTrimTo)
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > rangeToTrimTo.x)
		{
			this.x = rangeToTrimTo.x;
		}

		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > rangeToTrimTo.y)
		{
			this.y = rangeToTrimTo.y;
		}

		if (this.z < 0)
		{
			this.z = 0;
		}
		else if (this.z > rangeToTrimTo.z)
		{
			this.z = rangeToTrimTo.z;
		}

		return this;
	}

}
