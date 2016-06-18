
function Orientation(forward, down, right)
{
	this.forward = forward.clone().normalize();
	this.down = down.clone().normalize();
	if (right == null)
	{
		this.right = this.down.clone().crossProduct(this.forward);
	}
	else
	{
		this.right = right.clone();	
	}
	this.right.normalize();

	this.axes = [this.forward, this.right, this.down];

	this.orthogonalizeAxes();
}

{
	// static methods

	Orientation.buildDefault = function()
	{
		return new Orientation
		(
			new Coords(1, 0, 0),
			new Coords(0, 0, 1)
		);
	}

	// instance methods

	Orientation.prototype.equals = function(other, epsilon)
	{
		var returnValue = true;

		for (var i = 0; i < this.axes.length; i++)
		{
			var axisFromThis = this.axes[i];
			var axisFromOther = other.axes[i];
			if (axisFromThis.equals(axisFromOther, epsilon) == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	Orientation.prototype.toString = function()
	{
		return this.axes.toString();
	}

	// cloneable

	Orientation.prototype.clone = function()
	{
		return new Orientation
		(
			this.forward,
			this.down,
			this.right
		);
	}

	Orientation.prototype.overwriteWith = function(other)
	{
		this.forward.overwriteWith(other.forward);
		this.right.overwriteWith(other.right);
		this.down.overwriteWith(other.down);
	}

	Orientation.prototype.orthogonalizeAxes = function()
	{
		// This either causes or exposes a grave problem
		// somewhere in the Orientation math.

		this.down.overwriteWith(this.forward).crossProduct(this.right);
		//this.down.overwriteWith(this.right).crossProduct(this.forward);
		this.down.normalize();

		return this;
	}

	// transformable

	Orientation.prototype.transform = function(transformToApply)
	{
		for (var i = 0; i < this.axes.length; i++)
		{
			var axis = this.axes[i];
			transformToApply.applyToCoords(axis);
		}
	}
}
