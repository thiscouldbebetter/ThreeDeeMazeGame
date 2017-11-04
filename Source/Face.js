
function Face(vertices, material)
{
	this.vertices = vertices;
	this.material = material;
	this.bounds = new Bounds(new Coords(0, 0, 0), new Coords(0, 0, 0));

	this.plane = new Plane
	(
		new Coords(), 
		new Coords()
	).fromPoints
	(
		this.vertices[0],
		this.vertices[1],
		this.vertices[2]
	);

	this.edges = [];

	for (var i = 0; i < this.vertices.length; i++)
	{
		var iNext = i + 1;
		if (iNext >= this.vertices.length)
		{
			iNext = 0;
		}

		var vertex = this.vertices[i];
		var vertexNext = this.vertices[iNext];

		var edge = new Edge
		(
			[vertex, vertexNext]
		);

		this.edges.push(edge);
	}

	this.bounds.ofPoints(this.vertices);
}

{
	Face.prototype.recalculateDerivedValues = function()
	{
		this.plane.fromPoints
		(
			this.vertices[0],
			this.vertices[1],
			this.vertices[2]
		);

		this.bounds.ofPoints(this.vertices);
	}
}
