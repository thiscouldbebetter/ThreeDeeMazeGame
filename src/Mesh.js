
function Mesh
(
	name, 
	material,
	vertices, 
	vertexIndicesForFaces,
	textureUVsForFaceVertices,
	vertexGroups
)
{
	this.name = name;
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
	var vertexPositions = Vertex.addPositionsOfManyToList(this.vertices, []);
	this.bounds.setFromPositions(vertexPositions);
}

{
	// constants

	Mesh.VerticesInATriangle = 3;

	Mesh.prototype.clone = function()
	{
		return new Mesh
		(
			this.name,
			this.material,
			Cloneable.cloneMany(this.vertices),
			this.vertexIndicesForFaces,
			Cloneable.cloneMany(this.textureUVsForFaceVertices),
			Cloneable.cloneMany(this.vertexGroups)
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

		var vertexPositions = Vertex.addPositionsOfManyToList(this.vertices, []);
		this.bounds.setFromPositions(vertexPositions);

		return this;
	}

	Mesh.prototype.transform = function(transformToApply)
	{
		var vertexPositions = Vertex.addPositionsOfManyToList(this.vertices, []);

		Transform.applyTransformToCoordsMany
		(
			transformToApply, 
			vertexPositions
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
