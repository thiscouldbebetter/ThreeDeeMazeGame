
class Constraint_Attach implements Constraint
{
	entityAttachedTo: Entity;
	offsetForwardRightDown: Coords;

	transformOrient: Transform_Orient;

	constructor(entityAttachedTo: Entity, offsetForwardRightDown: Coords)
	{
		this.entityAttachedTo = entityAttachedTo;
		this.offsetForwardRightDown = offsetForwardRightDown;

		this.transformOrient = new Transform_Orient
		(
			this.entityAttachedTo.locatable().loc.orientation
		);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToConstrain = uwpe.entity;

		this.transformOrient.transformCoords
		(
			entityToConstrain.locatable().loc.pos.overwriteWith
			(
				this.offsetForwardRightDown
			)
		).add
		(
			this.entityAttachedTo.locatable().loc.pos
		);
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }
}
