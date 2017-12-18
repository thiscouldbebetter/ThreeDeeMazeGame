
function Mesh
(
	material,
	vertices, 
	vertexIndicesForFaces,
	textureUVsForFaceVertices,
	vertexGroups
)
{
	this.material = material;
	this.vertices = vertices;
	this.vertexIndicesForFaces = vertexIndicesForFaces;
	this.textureUVsForFaceVertices = textureUVsForFaceVertices;
	this.vertexGroups = vertexGroups;

	this.faces = [];

	var numberOfFaces = this.vertexIndicesForFaces.length;

	for (var f = 0; f < numberOfFaces; f++)
	{
		var vertexIndicesForFace = this.vertexIndicesForFaces[f];

		var numberOfVerticesInFace = vertexIndicesForFace.length;

		var verticesForFace = [];
		
		for (var vi = 0; vi < numberOfVerticesInFace; vi++)
		{
			var vertexIndex = vertexIndicesForFace[vi];
			var vertex = this.vertices[vertexIndex];

			verticesForFace.push(vertex);
		}

		var face = new Face(verticesForFace, this.material);

		this.faces.push(face);
	}

	this.bounds = new Bounds(new Coords(0, 0, 0), new Coords(0, 0, 0));
	this.bounds.ofPoints(this.vertices);
}

{
	// constants

	Mesh.VerticesInATriangle = 3;

	Mesh.prototype.clone = function()
	{
		return new Mesh
		(
			this.material,
			this.vertices.clone(),
			this.vertexIndicesForFaces,
			this.textureUVsForFaceVertices.clone(),
			this.vertexGroups.clone()
		);
	}

	Mesh.prototype.overwriteWith = function(other)
	{
		for (var i = 0; i < this.vertices.length; i++)
		{
			this.vertices[i].overwriteWith
			(
				other.vertices[i]
			);
		}

		return this;
	};

	Mesh.prototype.recalculateDerivedValues = function()
	{
		var numberOfFaces = this.faces.length;

		for (var f = 0; f < numberOfFaces; f++)
		{
			var face = this.faces[f];
			face.material = this.material;
			face.recalculateDerivedValues();
		}

		this.bounds.ofPoints(this.vertices);

		return this;
	}

	Mesh.prototype.transform = function(transformToApply)
	{
		Transform.applyTransformToCoordsMany
		(
			transformToApply, 
			this.vertices
		);

		this.recalculateDerivedValues();

		return this;
	}

	Mesh.prototype.transformTextureUVs = function(transformToApply)
	{
		Transform.applyTransformToCoordsArrays
		(
			transformToApply, 
			this.textureUVsForFaceVertices
		);

		return this;
	}
}
