

function Collision(pos, distanceToCollision, colliders)
{
	this.pos = pos || new Coords();
	this.distanceToCollision = distanceToCollision;
	this.colliders = colliders || [];
}

{
	// static methods

	Collision.addCollisionsOfEdgeAndMeshToList = function(edge, mesh, listToAddTo)
	{
		var edgeDirection = edge.direction();
		var meshFaces = mesh.faces();
		for (var f = 0; f < meshFaces.length; f++)
		{
			var face = meshFaces[f];
			var facePlane = face.plane();
			var faceNormal = facePlane.normal;
			var faceDotEdge = faceNormal.dotProduct(edgeDirection);

			if (faceDotEdge < 0)
			{
				var collision =
					Collision.collisionHelper.collisionOfEdgeAndFace(edge, face);

				if (collision != null && collision.isActive)
				{
					collision.colliders.push(mesh);
					collision.colliders.Mesh = mesh;
					listToAddTo.push(collision);
				}
			}
		}

		return listToAddTo;
	}

	Collision.findClosest = function(collisionsToCheck)
	{
		var collisionClosest = collisionsToCheck[0];

		for (var i = 1; i < collisionsToCheck.length; i++)
		{
			var collision = collisionsToCheck[i];
			if (collision.distanceToCollision < collisionClosest.distanceToCollision)
			{
				collisionClosest = collision;
			}
		}

		return collisionClosest;
	};
}
