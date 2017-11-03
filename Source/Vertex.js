
function Vertex(pos)
{
	this.pos = pos;
}

{
	// static methods

	Vertex.addPositionsOfManyToList = function(vertices, listToAddTo)
	{
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[i];
			var vertexPos = vertex.pos;
			listToAddTo.push(vertexPos);
		}

		return listToAddTo;
	}

	Vertex.buildManyFromPositions = function(positions)
	{
		var returnValues = [];

		for (var i = 0; i < positions.length; i++)
		{
			var pos = positions[i];
			var vertex = new Vertex(pos);
			returnValues.push(vertex);
		}

		return returnValues;
	}

	// cloneable

	Vertex.prototype.clone = function()
	{
		return new Vertex(this.pos.clone());
	}

	Vertex.prototype.overwriteWith = function(other)
	{
		this.pos.overwriteWith(other.pos);
	}
}
