
class Zone2 extends PlaceBase
{
	name: string;
	pos: Coords;
	namesOfZonesAdjacent: string[];
	entities: Entity[];

	constructor
	(
		name: string,
		pos: Coords,
		namesOfZonesAdjacent: string[],
		entities: Entity[]
	)
	{
		super
		(
			name,
			null, // defnName
			null, // parentName
			null, // size
			entities
		);
		this.pos = pos;
		this.namesOfZonesAdjacent = namesOfZonesAdjacent;
		this.entities = entities;

		var entity = this.entities[0];
		var meshTransformed = Collidable.of(entity).collider;
		meshTransformed.transform
		(
			new Transform_Locate(Locatable.of(entity).loc)
		);
	}

	static fromNamePosNeighborNamesAndEntities
	(
		name: string,
		pos: Coords,
		namesOfZonesAdjacent: string[],
		entities: Entity[]
	): Zone2
	{
		return new Zone2(name, pos, namesOfZonesAdjacent, entities);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var b = 0; b < this.entities.length; b++)
		{
			var entity = this.entities[b];
			uwpe.entitySet(entity);

			var actor = Actor.of(entity);
			if (actor != null)
			{
				var activity = actor.activity;
				if (activity != null)
				{
					activity.perform(uwpe);
				}

				var actions = actor.actions;
				if (actions != null)
				{
					for (var a = 0; a < actions.length; a++)
					{
						var action = actions[a];
						action.perform(uwpe);
					}

					actions.length = 0;
				}
			}

			var entityAnimatable = Animatable2.of(entity);
			if (entityAnimatable != null)
			{
				entityAnimatable.updateForTimerTick(uwpe);
			}

			var entityConstrainable = Constrainable.of(entity);

			if (entityConstrainable != null)
			{
				var entityConstraints = entityConstrainable.constraints;
				for (var c = 0; c < entityConstraints.length; c++)
				{
					var constraint = entityConstraints[c];
					constraint.constrain(uwpe);
				}
			}
		}
	}

	zonesAdjacent(place: PlaceZoned2): Zone2[]
	{
		var returnValues = [];

		var namesOfZonesAdjacent = this.namesOfZonesAdjacent;
		for (var i = 0; i < namesOfZonesAdjacent.length; i++)
		{
			var nameOfZoneAdjacent = namesOfZonesAdjacent[i];
			var zoneAdjacent = place.zoneByName(nameOfZoneAdjacent);
			returnValues.push(zoneAdjacent);
		}

		return returnValues;
	}

	// collisions

	collisionsWithEdge
	(
		universe: Universe, edge: Edge, collisions: Collision[]
	): Collision[]
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var zoneMesh =
			(Collidable.of(this.entities[0]).collider as MeshTextured).geometry;

		universe.collisionHelper.collisionsOfEdgeAndMesh
		(
			edge, zoneMesh, collisions, null // first?
		);

		return collisions;
	}
}
