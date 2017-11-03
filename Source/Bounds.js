
function Bounds(min, max)
{
	this.min = min;
	this.max = max;
}

{
	Bounds.prototype.containsPos = function(posToCheck)
	{
		return posToCheck.isInRangeMinMax(this.min, this.max);
	}

	Bounds.prototype.minAndMax = function()
	{
		return [ this.min, this.max ];
	}

	Bounds.prototype.setFromPositions = function(positions)
	{
		this.min = positions[0].clone();
		this.max = positions[0].clone();

		for (var i = 1; i < positions.length; i++)
		{
			var pos = positions[i];

			for (var d = 0; d < Coords.NumberOfDimensions; d++)
			{
				var posDimension = pos.dimension(d);
				if (posDimension < this.min.dimension(d))
				{
					this.min.dimension(d, posDimension);
				}
				if (posDimension > this.max.dimension(d))
				{
					this.max.dimension(d, posDimension);
				}				
			}
		}
	}
}
