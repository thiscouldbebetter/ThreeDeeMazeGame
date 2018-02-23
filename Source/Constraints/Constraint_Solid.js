
function Constraint_Solid()
{
	// Helper variables.

	this._collisions = [];
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

		var collisions = this._collisions;

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
				[ entityPos, entityPosNext ]
			);

			if (edgeForMovement.length() == 0)
			{
				break;
			}
			else
			{
				collisions.length = 0;

				Collision.addCollisionsOfEdgeAndWorldToList
				(
					edgeForMovement,
					world,
					collisions
				);

				if (collisions.length == 0)
				{
					break;
				}
				else
				{
					var collisionClosest = Collision.findClosest(collisions);
					var faceCollidedWith = collisionClosest.colliders["Face"];

					var planeCollidedWith = faceCollidedWith.plane();
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
