
function Zone(name, pos, namesOfZonesAdjacent, meshes)
{
	this.name = name;
	this.namesOfZonesAdjacent = namesOfZonesAdjacent;
	this.entity = new Entity
	(
		this.name,
		new EntityDefn
		(
			this.name,
			true, // isDrawable
			false, // isMovable
			meshes[0] // hack
		),
		new Location
		(
			this.name, 
			pos,
			new Orientation
			(
				new Coords(1, 0, 0),
				new Coords(0, 0, 1)
			)
		)
	);	
}
{
	Zone.prototype.finalize = function()
	{
		// todo
	}

	Zone.prototype.initialize = function()
	{
		this.entity.resetMeshTransformed();
	
		this.entity.meshTransformed.transform
		(
			new Transform_Locate(this.entity.loc)
		);
	}

	Zone.prototype.update = function()
	{
		//var displayHelper = Globals.Instance.displayHelper;
		//displayHelper.drawMesh(this.entity.meshTransformed);
	}
}
