
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
		this.vertices[0].pos,
		this.vertices[1].pos,
		this.vertices[2].pos
	);

	this.edges = [];

	for (var i = 0; i < this.vertices.length; i++)
	{
		var iNext = i + 1;
		if (iNext >= this.vertices.length)
		{
			iNext = 0;
		}

		var vertexPos = this.vertices[i].pos;
		var vertexPosNext = this.vertices[iNext].pos;

		var edge = new Edge
		(
			this,
			[vertexPos, vertexPosNext]
		);

		this.edges.push(edge);
	}

	var vertexPositions = Vertex.addPositionsOfManyToList(this.vertices, []);

	this.bounds.setFromPositions(vertexPositions);
}

{
	Face.prototype.recalculateDerivedValues = function()
	{
		this.plane.fromPoints
		(
			this.vertices[0].pos,
			this.vertices[1].pos,
			this.vertices[2].pos
		);

		for (var i = 0; i < this.edges.length; i++)
		{
			var edge = this.edges[i];

			edge.recalculateDerivedValues();	
		}

		var vertexPositions = Vertex.addPositionsOfManyToList(this.vertices, []);
		this.bounds.setFromPositions(vertexPositions);

	}
}
