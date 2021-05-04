
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

	constrain
	(
		universe: Universe, world: World, place: Place, entityToConstrain: Entity
	): void
	{
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
}
