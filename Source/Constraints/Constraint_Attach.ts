
class Constraint_Attach implements Constraint
{
	entityAttachedTo: Entity;
	offsetForwardRightDown: Coords;
	name: string;

	transformOrient: Transform_Orient;

	constructor(entityAttachedTo: Entity, offsetForwardRightDown: Coords)
	{
		this.entityAttachedTo = entityAttachedTo;
		this.offsetForwardRightDown = offsetForwardRightDown;

		this.transformOrient = new Transform_Orient
		(
			Locatable.of(this.entityAttachedTo).loc.orientation
		);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToConstrain = uwpe.entity;

		this.transformOrient.transformCoords
		(
			Locatable.of(entityToConstrain).loc.pos.overwriteWith
			(
				this.offsetForwardRightDown
			)
		).add
		(
			Locatable.of(this.entityAttachedTo).loc.pos
		);
	}

	nameSet(value: string): Constraint
	{
		this.name = value;
		return this;
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }
}
