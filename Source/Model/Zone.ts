
class Zone2 extends PlaceBase
{
	name: string;
	pos: Coords;
	namesOfZonesAdjacent: string[];
	entities: Entity[];

	entityPropertiesToUpdateNames: string[];

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

		this.entityPropertiesToUpdateNames = 
		[
			Actor.name,
			Animatable2.name,
			Constrainable.name
			// Locatable.name // Activating this causes constraints to fail.
		];
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
		for (var e = 0; e < this.entities.length; e++)
		{
			var entity = this.entities[e];
			uwpe.entitySet(entity);

			for (var p = 0; p < this.entityPropertiesToUpdateNames.length; p++)
			{
				var propertyName = this.entityPropertiesToUpdateNames[p];
				var property = entity.propertyByName(propertyName);
				if (property != null)
				{
					property.updateForTimerTick(uwpe);
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
