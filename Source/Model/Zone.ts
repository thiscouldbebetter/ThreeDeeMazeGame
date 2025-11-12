
class Zone2 extends PlaceBase
{
	name: string;
	pos: Coords;
	zonesAdjacentNames: string[];
	//entities: Entity[];

	entityPropertiesToUpdateNames: string[];

	constructor
	(
		name: string,
		pos: Coords,
		zonesAdjacentNames: string[],
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
		this.zonesAdjacentNames = zonesAdjacentNames;
		this._entities = entities;

		var entityForEnvironment = this.entityForEnvironment();
		var meshTransformed = Collidable.of(entityForEnvironment).collider;
		var disp = Locatable.of(entityForEnvironment).loc;
		meshTransformed.transform
		(
			Transform_Locate.fromDisposition(disp)
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
		zonesAdjacentNames: string[],
		entities: Entity[]
	): Zone2
	{
		return new Zone2(name, pos, zonesAdjacentNames, entities);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var entities = this._entities;
		for (var e = 0; e < entities.length; e++)
		{
			var entity = entities[e];
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

	entityForEnvironment(): Entity
	{
		return this._entities[0];
	}

	zonesAdjacent(place: PlaceZoned2): Zone2[]
	{
		var returnValues = [];

		var zonesAdjacentNames = this.zonesAdjacentNames;
		for (var i = 0; i < zonesAdjacentNames.length; i++)
		{
			var zonesAdjacentName = zonesAdjacentNames[i];
			var zoneAdjacent = place.zoneByName(zonesAdjacentName);
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
			(Collidable.of(this._entities[0]).collider as MeshTextured);

		universe.collisionHelper.collisionsOfEdgeAndMesh
		(
			edge, zoneMesh, collisions, null // first?
		);

		return collisions;
	}

	// Serialization.

	toStringHumanReadable(): string
	{
		var newline = "\n";

		var entities = this._entities;
		var entity0 = entities[0];
		var entity0Collidable = Collidable.of(entity0);
		var meshTextured = entity0Collidable.collider as MeshTextured;
		var mesh = meshTextured;
		var meshAsString = mesh.toStringHumanReadable();
		var tab = "\t";
		var tabTab = tab + tab;
		var newlineTabTab = newline + tabTab;
		meshAsString =
			tabTab
			+ meshAsString.split(newline).join(newlineTabTab);

		var zoneAsLines =
		[
			"Zone:",
			tab + "Name: " + this.name,
			tab + "Pos: " + this.pos.toStringXYZ(),
			tab + "Neighbors: " + this.zonesAdjacentNames.join(", "),
			tab + "Meshes:",
			meshAsString
		];

		var zoneAsString = zoneAsLines.join(newline);

		return zoneAsString;
	}

}
