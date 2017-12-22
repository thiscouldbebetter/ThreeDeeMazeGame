
function MeshTextured(geometry, material, textureUVsForFaceVertices, vertexGroups)
{
	this.geometry = geometry;
	this.material = material;
	this.textureUVsForFaceVertices = textureUVsForFaceVertices;
	this.vertexGroups = vertexGroups;
}

{
	MeshTextured.prototype.clone = function()
	{
		return new MeshTextured
		(
			this.geometry.clone(),
			this.material,
			( this.textureUVsForFaceVertices == null ? null : this.textureUVsForFaceVertices.clone() ),
			( this.vertexGroups == null ? null : this.vertexGroups.clone() )
		);
	}

	MeshTextured.prototype.overwriteWith = function(other)
	{
		this.geometry.overwriteWith(other.geometry);
		return this;
	};

	MeshTextured.prototype.faces = function()
	{
		if (this._faces == null)
		{
			this._faces = [];
			var geometryFaces = this.geometry.faces();
			for (var i = 0; i < geometryFaces.length; i++)
			{
				var geometryFace = geometryFaces[i];
				var face = new FaceTextured(geometryFace, this.material);
				this._faces.push(face);
			}
		}

		return this._faces;
	}


	MeshTextured.prototype.textureUVsBuild = function()
	{
		var textureUVsForFaces = [];

		var textureUVsForFace = 
		[
			new Coords(0, 0), new Coords(1, 0), new Coords(1, 1), new Coords(1, 0)
		];

		var numberOfFaces = this.geometry.faceBuilders.length;
		for (var f = 0; f < numberOfFaces; f++)
		{
			textureUVsForFaces.push(textureUVsForFace);
		}

		this.textureUVsForFaceVertices = textureUVsForFaces;

		return this;
	}

	MeshTextured.prototype.transform = function(transformToApply)
	{
		this.geometry.transform(transformToApply);

		return this;
	}

	MeshTextured.prototype.transformTextureUVs = function(transformToApply)
	{
		Transform.applyTransformToCoordsArrays
		(
			transformToApply, 
			this.textureUVsForFaceVertices
		);

		return this;
	}
}
