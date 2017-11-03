

function Collision(pos, distanceToCollision, colliders)
{
	this.pos = pos;
	this.distanceToCollision = distanceToCollision;
	this.colliders = colliders;
}

{
	// static methods

	Collision.addCollisionsOfEdgeAndMeshToList = function(edge, mesh, listToAddTo)
	{
		for (var f = 0; f < mesh.faces.length; f++)
		{
			var face = mesh.faces[f];
	
			if (face.plane.normal.dotProduct(edge.direction) < 0)
			{
				var collision = Collision.findCollisionOfEdgeAndFace
				(
					edge,
					face	
				);

				if (collision != null)
				{
					collision.colliders["Mesh"] = mesh;
					listToAddTo.push(collision);
				}
			}
		}

		return listToAddTo;
	}

	Collision.addCollisionsOfEdgeAndWorldToList = function(edge, world, listToAddTo)
	{
		for (var z = 0; z < world.zonesActive.length; z++)
		{
			var zone = world.zonesActive[z];

			Collision.addCollisionsOfEdgeAndZoneToList
			(
				edge, zone, listToAddTo
			);
		}

		return listToAddTo;
	}

	Collision.addCollisionsOfEdgeAndZoneToList = function(edge, zone, listToAddTo)
	{
		Collision.addCollisionsOfEdgeAndMeshToList
		(
			edge, zone.entity.meshTransformed, listToAddTo
		);	

		return listToAddTo;
	}

	Collision.doBoundsCollide = function(bounds0, bounds1)
	{
		var returnValue = false;

		var bounds = [ bounds0, bounds1 ];

		for (var b = 0; b < bounds.length; b++)
		{
			var boundsThis = bounds[b];
			var boundsOther = bounds[1 - b];			

			var doAllDimensionsOverlapSoFar = true;

			for (var d = 0; d < Coords.NumberOfDimensions; d++)
			{
				if 
				(
					boundsThis.max.dimension(d) < boundsOther.min.dimension(d)
					|| boundsThis.min.dimension(d) > boundsOther.max.dimension(d)
				)
				{
					doAllDimensionsOverlapSoFar = false;
					break;
				}
			}

			if (doAllDimensionsOverlapSoFar == true)
			{
				returnValue = true;
				break;
			}
		}

		return returnValue;
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
	}

	Collision.findCollisionOfEdgeAndFace = function(edge, face)
	{
		var returnValue = null;

		var collisionOfEdgeWithFacePlane = Collision.findCollisionOfEdgeAndPlane
		(
			edge,
			face.plane
		);

		if (collisionOfEdgeWithFacePlane != null)
		{
			var isWithinFace = Collision.isPosWithinFace
			(
				collisionOfEdgeWithFacePlane.pos, 
				face
			);

			if (isWithinFace == true)
			{
				returnValue = collisionOfEdgeWithFacePlane;
				returnValue.colliders["Face"] = face;
			}
		}

		return returnValue;
	}

	Collision.findCollisionOfEdgeAndPlane = function(edge, plane)
	{
		var returnValue = null;

		var distanceToCollision = 
			(
				plane.distanceFromOrigin 
				- plane.normal.dotProduct(edge.vertices[0])
			)
			/ plane.normal.dotProduct(edge.direction);

		if (distanceToCollision >= 0 && distanceToCollision <= edge.length)
		{
			var collisionPos = edge.direction.clone().multiplyScalar
			(
				distanceToCollision
			).add
			(
				edge.vertices[0]
			);

			var colliders = [];
			colliders["Edge"] = edge;
			colliders["Plane"] = plane;
	
			returnValue = new Collision
			(
				collisionPos,
				distanceToCollision,
				colliders
			);
		}

		return returnValue;
	}

	Collision.isPosWithinFace = function(posToCheck, face)
	{
		var displacementFromVertex0ToCollision = Coords.Instances.Temp;

		var isPosWithinAllEdgesOfFaceSoFar = true;

		for (var e = 0; e < face.edges.length; e++)
		{
			var edgeFromFace = face.edges[e];

			displacementFromVertex0ToCollision.overwriteWith
			(
				posToCheck
			).subtract
			(
				edgeFromFace.vertices[0]
			);		

			var displacementProjectedAlongEdgeTransverse = 
				displacementFromVertex0ToCollision.dotProduct
				(
					edgeFromFace.transverse
				);

			if (displacementProjectedAlongEdgeTransverse > 0)
			{
				isPosWithinAllEdgesOfFaceSoFar = false;
				break;
			}
		}

		return isPosWithinAllEdgesOfFaceSoFar;
	}

	Collision.findDistanceOfPositionAbovePlane = function(posToCheck, plane)
	{
		var returnValue = posToCheck.dotProduct
		(
			plane.normal
		) - plane.distanceFromOrigin;

		return returnValue;
	}
}
