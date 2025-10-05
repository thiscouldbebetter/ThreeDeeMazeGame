
class Constraint_Movable2 implements Constraint
{
	name: string;
	transformLocate: Transform_Locate;

	constructor()
	{
		this.transformLocate = new Transform_Locate(null);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToConstrain = uwpe.entity;

		var entityLoc = Locatable.of(entityToConstrain).loc;
		var entityPos = entityLoc.pos;
		var entityVel = entityLoc.vel;
		var entityAccel = entityLoc.accel;

		entityVel.add(entityAccel);
		entityAccel.clear();
		entityPos.add(entityVel);

		var collidable = Collidable.of(entityToConstrain);
		if (collidable != null)
		{
			var meshTransformed = collidable.collider as MeshTextured;
			var mesh = meshTransformed.geometry;
			this.transformLocate.loc = entityLoc;
			mesh.transform(this.transformLocate);
		}
	};

	nameSet(value: string): Constraint
	{
		this.name = value;
		return this;
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }

}
