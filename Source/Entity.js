
function Entity(name, defn, loc)
{
	this.name = name;
	this.defn = defn;
	this.loc = loc;

	if (this.defn.mesh != null)
	{
		this.meshTransformed = this.defn.mesh.clone();
		this.collidableData = new CollidableData();
	}
}

{
	Entity.prototype.resetMeshTransformed = function()
	{
		if (this.meshTransformed != null)
		{
			this.meshTransformed.overwriteWith
			(
				this.defn.mesh
			);
		}
	}
}
