
function Constraint_Solid()
{
	this.collisions = [];
}

{
	Constraint_Solid.prototype.constrainEntity = function
	(
		world, entityToConstrain
	)
	{
		var entityLoc = entityToConstrain.loc;
		var entityPos = entityLoc.pos;
		var entityVel = entityLoc.vel;
		var entityAccel = entityLoc.accel;

		while (true)
		{
			var entityPosNext = entityPos.clone().add
			(
				entityVel
			).add
			(
				entityAccel
			)

			var edgeForMovement = new Edge
			(
				null, // face
				[ entityPos, entityPosNext ]
			);
	
			if (edgeForMovement.length == 0)
			{
				break;
			}
			else
			{
				this.collisions.length = 0;
	
				Collision.addCollisionsOfEdgeAndWorldToList
				(
					edgeForMovement, 
					world,
					this.collisions
				);
	
				if (this.collisions.length == 0)
				{
					break;
				}
				else
				{
					var collisionClosest = Collision.findClosest(this.collisions);
					var faceCollidedWith = collisionClosest.colliders["Face"];
	
					var planeCollidedWith = faceCollidedWith.plane;
					var planeNormal = planeCollidedWith.normal;
				
					entityPos.overwriteWith
					(
						collisionClosest.pos
					);

					entityVel.subtract
					(
						planeNormal.clone().multiplyScalar
						(
							entityVel.dotProduct(planeNormal)
						)
					);
					entityAccel.subtract
					(
						planeNormal.clone().multiplyScalar
						(
							entityAccel.dotProduct(planeNormal)
						)
					);
				}		

			} // end if (edgeForMovement.length > 0)

		} // end while (true)

	} // end method
}
