
function Edge(face, vertices)
{
	this.face = face;
	this.vertices = vertices;
	
	this.displacement = new Coords(0, 0, 0);
	this.direction = new Coords(0, 0, 0);
	this.transverse = new Coords(0, 0, 0);

	this.recalculateDerivedValues();
}

{
	Edge.prototype.recalculateDerivedValues = function()
	{
		this.displacement.overwriteWith
		(
			this.vertices[1]
		).subtract
		(
			this.vertices[0]
		);

		this.length = this.displacement.magnitude();

		this.direction.overwriteWith
		(
			this.displacement
		).divideScalar
		(
			this.length
		);

		if (this.face != null)
		{
			this.transverse.overwriteWith
			(
				this.direction
			).crossProduct
			(
				this.face.plane.normal
			);
		}
	}
}
