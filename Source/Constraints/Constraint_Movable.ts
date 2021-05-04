
class Constraint_Movable implements Constraint
{
	transformLocate: Transform_Locate;

	constructor()
	{
		this.transformLocate = new Transform_Locate(null);
	}

	constrain
	(
		universe: Universe, world: World, place: Place, entityToConstrain: Entity
	): void
	{
		var entityLoc = entityToConstrain.locatable().loc;
		var entityPos = entityLoc.pos;
		var entityVel = entityLoc.vel;
		var entityAccel = entityLoc.accel;

		entityVel.add(entityAccel);
		entityAccel.clear();
		entityPos.add(entityVel);

		var collidable = entityToConstrain.collidable();
		if (collidable != null)
		{
			var meshTransformed = collidable.collider as MeshTextured;
			var mesh = meshTransformed.geometry;
			this.transformLocate.loc = entityLoc;
			mesh.transform(this.transformLocate);
		}
	};
}
