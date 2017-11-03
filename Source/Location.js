
function Location(zoneName, pos, orientation)
{
	this.zoneName = zoneName;
	this.pos = pos;
	this.orientation = orientation;

	this.vel = new Coords(0, 0, 0);
	this.accel = new Coords(0, 0, 0);
}

{
	Location.prototype.clone = function(other)
	{
		return new Location(this.zoneName, this.pos.clone(), this.orientation.clone());
	}

	Location.prototype.overwriteWith = function(other)
	{
		this.zoneName = other.zoneName;
		this.pos.overwriteWith(other.pos);
		this.orientation.overwriteWith(other.orientation);
	}
}
