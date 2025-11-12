
class PlaceZoned2 extends PlaceBase
{
	zones: Zone2[];

	zoneCurrent: Zone2;
	zoneNext: Zone2;
	zonesActive: Zone2[];
	_zonesByName: Map<string, Zone2>;

	meshesToDraw: Mesh[];
	spacePartitioningTreeForZonesActive: SpacePartitioningTree;

	entityForPlayer: Entity;

	camera: Camera;
	cameraEntity: Entity;

	constructor
	(
		sizeInPixels: Coords,
		zones: Zone2[],
		entityForPlayer: Entity
	)
	{
		super
		(
			PlaceZoned2.name,
			null, // defnName
			null, // parentName
			sizeInPixels,
			[] // entities
		);

		this.zones = zones;
		this.entityForPlayer = entityForPlayer;

		this._zonesByName = ArrayHelper.addLookupsByName(this.zones);
	}

	static fromSizeZonesAndEntityForPlayer
	(
		sizeInPixels: Coords,
		zones: Zone2[],
		entityForPlayer: Entity
	): PlaceZoned2
	{
		return new PlaceZoned2(sizeInPixels, zones, entityForPlayer);
	}

	collisionsWithEdge
	(
		universe: Universe,
		edge: Edge,
		collisions: Collision[]
	): Collision[]
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var zonesActive = this.zonesActive;
		for (var z = 0; z < zonesActive.length; z++)
		{
			var zone = zonesActive[z];

			zone.collisionsWithEdge
			(
				universe, edge, collisions
			);
		}

		return collisions;
	}

	draw(universe: Universe): void
	{
		var display = universe.display;
		var displayTypeName = display.constructor.name;
		if (displayTypeName == Display2D.name)
		{
			this.draw2d(universe);
		}
		else if (displayTypeName == Display3D.name)
		{
			this.draw3d(universe);
		}
	}

	draw2d(universe: Universe): void
	{
		var display = universe.display as Display2D;
		var facesToDraw = new Array<FaceTextured>();

		var cameraPos = Locatable.of(this.cameraEntity).loc.pos;

		var spacePartitioningTreeRoot =
			this.spacePartitioningTreeForZonesActive.nodeRoot;

		spacePartitioningTreeRoot.addFacesBackToFrontForCameraPosToList
		(
			cameraPos, facesToDraw
		);

		var entities = this._entities;
		var collisionHelper = universe.collisionHelper;
		for (var b = 0; b < entities.length; b++)
		{
			var entity = entities[b];

			if (Drawable.of(entity) != null && Movable.of(entity) != null)
			{
				// hack
				// Find the floor the mover is standing on,
				// and draw the mover immediately after that floor.

				var entityPos = Locatable.of(entity).loc.pos;
				var edgeForFootprint = new Edge
				([
					entityPos,
					entityPos
						.clone()
						.add(Coords.fromXYZ(0, 0, 100) )
				]);

				for (var g = facesToDraw.length - 1; g >= 0; g--)
				{
					var face = facesToDraw[g];
					var collisionForFootprint =
						collisionHelper.collisionOfEdgeAndFace
						(
							edgeForFootprint, face.geometry, Collision.create()
						);

					var isEntityStandingOnFace =
					(
						collisionForFootprint != null
						&& collisionForFootprint.isActive
					);

					if (isEntityStandingOnFace)
					{
						var moverMesh = Collidable.of(entity).collider as MeshTextured;
						var moverFaces = moverMesh.faces();
						for (var f = 0; f < moverFaces.length; f++)
						{
							var moverFace = moverFaces[f];
							facesToDraw.splice
							(
								g + 1, 0, moverFace
							)
						}
						break;
					}

				}
			}
		}

		display.drawBackground();
		DisplayHelper.drawFacesForCamera(display, facesToDraw, this.cameraEntity);

		var fontHeight = 10;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var world = universe.world as WorldExtended;
		display.drawTextWithFontAtPos
		(
			world.name,
			font,
			Coords.fromXY(0, 1).multiplyScalar(fontHeight)
		);
		display.drawTextWithFontAtPos
		(
			"" + world.secondsElapsed(),
			font,
			Coords.fromXY(0, 2).multiplyScalar(fontHeight)
		);
	}

	draw3d(universe: Universe): void
	{
		var uwpe =
			UniverseWorldPlaceEntities.fromUniverse(universe);

		var display = universe.display as Display3D;
		display.clear();
		display.drawBackground();

		display.cameraSet(this.camera);

		display.lightingSet(null); // todo

		for (var z = 0; z < this.zonesActive.length; z++)
		{
			var zone = this.zonesActive[z];
			uwpe.placeSet(zone);
			var entities = zone.entitiesAll();

			for (var b = 0; b < entities.length; b++)
			{
				var entity = entities[b];
				uwpe.entitySet(entity);
				var drawable = Drawable.of(entity);
				if (drawable != null)
				{
					var entityVisual = drawable.visual;
					entityVisual.draw(uwpe, display);
				}
			}
		}

		display.flush();
	}

	entitiesAll(): Entity[]
	{
		var entityArraysForZonesActive =
			this.zonesActive.map(x => x.entitiesAll() );
		var entitiesForZonesActive: Entity[] =
			ArrayHelper.flattenArrayOfArrays(entityArraysForZonesActive);
		return entitiesForZonesActive;
	}

	entitySpawn(uwpe: UniverseWorldPlaceEntities): void
	{
		super.entitySpawn(uwpe);
		var entityToSpawn = uwpe.entity;
		var entityToSpawnLocatable = Locatable.of(entityToSpawn);
		if (entityToSpawnLocatable != null)
		{
			var entityToSpawnPos = entityToSpawnLocatable.loc.pos;
			var zoneContainingEntityPos =
				this.zoneContainingPos(entityToSpawnPos);
			zoneContainingEntityPos.entitySpawn(uwpe);
		}
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.meshesToDraw = [];

		var zoneStart = this.initialize_1_ZoneStart();

		this.zoneNextSet(zoneStart);
		this.zonesActive = [];

		this.initialize_2_Constraints();

		var cameraEntity =
			this.initialize_3_Camera(uwpe.universe.display.sizeInPixels);

		zoneStart.entitiesAll().push(cameraEntity);

		this.cameraEntity = cameraEntity;
		this.camera = Camera.of(this.cameraEntity);
	}

	initialize_1_ZoneStart(): Zone2
	{
		var zoneStart;

		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			var zoneEntity = zone.entityForEnvironment();
			var zoneMesh = Collidable.of(zoneEntity).collider as MeshTextured;
			if (zoneMesh.materials[1].name == "Start")
			{
				zoneStart = zone;
				break;
			}
		}

		return zoneStart;
	}

	initialize_2_Constraints(): void
	{
		var constraintsCommon =
		[
			new Constraint_Gravity2(.1),
			new Constraint_Solid(),
			new Constraint_Friction(1, .5, .01),
			new Constraint_Movable2(),
		];

		var constrainable = Constrainable.fromConstraints(constraintsCommon);
		for (var z = 0; z < this.zones.length; z++)
		{
			var zone = this.zones[z];
			var entities = zone.entitiesAll();

			for (var i = 1; i < entities.length; i++)
			{
				var entity = entities[i];

				entity.propertyAdd(constrainable);
			}
		}
	}

	initialize_3_Camera(viewSizeInPixels: Coords): Entity
	{
		var focalLength = viewSizeInPixels.z / 16;
		var followDivisor = 16;
		var offsetOfCameraFromPlayer = Coords.fromXYZ
		(
			0 - focalLength,
			0,
			0 - focalLength
		).divideScalar(followDivisor);

		var playerPos = Locatable.of(this.zoneNext.entityForEnvironment() ).loc.pos;

		var cameraLoc = Disposition.fromPosOrientationAndPlaceName
		(
			playerPos.clone().add
			(
				offsetOfCameraFromPlayer
			),

			Orientation.fromForwardAndDown
			(
				Coords.fromXYZ(1, 0, 1), // forward
				Coords.fromXYZ(0, 0, 1) // down
			),

			this.zoneNext.name
		);

		var cameraLocatable = Locatable.fromDisposition(cameraLoc);
		var cameraEntity = Entity.fromNameAndProperties
		(
			"Camera",
			[
				Constrainable.fromConstraints
				([
					new Constraint_Follow(this.entityForPlayer, focalLength / followDivisor),
					new Constraint_OrientToward(this.entityForPlayer),
				]),
				cameraLocatable,
				new Groundable()
			]
		);

		var camera = Camera.fromViewSizeFocalLengthAndDisposition
		(
			viewSizeInPixels.clone(),
			focalLength,
			cameraLoc
		);

		cameraEntity.propertyAdd(camera);

		return cameraEntity;
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		super.updateForTimerTick(uwpe);

		var universe = uwpe.universe;

		if (this.zoneNext != null)
		{
			this.updateForTimerTick_1_ZoneNextNotNull(uwpe);
		}

		this.zonesActive.forEach(x => x.updateForTimerTick(uwpe) );

		this.draw(universe);

		var playerIsInZoneCurrent = this.updateForTimerTick_2_DetermineIfPlayerIsInZoneCurrent();

		if (playerIsInZoneCurrent == false)
		{
			this.updateForTimerTick_3_PlayerNotInZoneCurrent();
		}
	}

	updateForTimerTick_1_ZoneNextNotNull(uwpe: UniverseWorldPlaceEntities): void
	{
		var zoneNextEntity = this.zoneNext.entityForEnvironment();
		var zoneNextMesh =
			Collidable.of(zoneNextEntity).collider as MeshTextured;
		var zoneNextIsGoal =
			zoneNextMesh.materials.some(x => x.name == "Goal");
		if (zoneNextIsGoal)
		{
			var world = uwpe.world as WorldExtended;

			var messageWin =
				"You reached the goal in "
				+ world.secondsElapsed()
				+ " seconds!  Press refresh for a new maze.";

			alert(messageWin);
		}

		this.zoneCurrent = this.zoneNext;

		this.zonesActive.length = 0;

		this.zonesActive.push(this.zoneCurrent);

		var zonesAdjacent = this.zoneCurrent.zonesAdjacent(this);
		for (var i = 0; i < zonesAdjacent.length; i++)
		{
			var zoneAdjacent = zonesAdjacent[i];
			this.zonesActive.push(zoneAdjacent);
		}

		var facesForZonesActive = new Array<FaceTextured>();

		for (var i = 0; i < this.zonesActive.length; i++)
		{
			var zoneActive = this.zonesActive[i];
			var zoneActiveEntity = zoneActive.entityForEnvironment();
			var zoneMesh = Collidable.of(zoneActiveEntity).collider as MeshTextured;
			var facesForZone = zoneMesh.faces();
			ArrayHelper.append(facesForZonesActive, facesForZone);
		}

		this.spacePartitioningTreeForZonesActive =
			SpacePartitioningTree.fromFaces(facesForZonesActive);

		this.zoneNextSet(null);
	}

	updateForTimerTick_2_DetermineIfPlayerIsInZoneCurrent(): boolean
	{
		var zoneCurrentEntity = this.zoneCurrent.entityForEnvironment();
		var zoneCurrentMesh =
			Collidable.of(zoneCurrentEntity).collider as MeshTextured;
		var zoneCurrentBounds =
			zoneCurrentMesh.geometry.box();

		var playerPos = Locatable.of(this.entityForPlayer).loc.pos;
		var playerIsInZoneCurrent = zoneCurrentBounds.containsPoint(playerPos);

		return playerIsInZoneCurrent;
	}

	updateForTimerTick_3_PlayerNotInZoneCurrent(): void
	{
		var playerPos =
			Locatable.of(this.entityForPlayer).loc.pos;

		var zoneContainingPos =
			this.zoneContainingPos(playerPos);

		if (zoneContainingPos != null)
		{
			var zoneCurrentEntities =
				this.zoneCurrent.entitiesAll();
			ArrayHelper.remove(zoneCurrentEntities, this.entityForPlayer);
			ArrayHelper.remove(zoneCurrentEntities, this.cameraEntity);

			this.zoneNextSet(zoneContainingPos);

			var zoneNextEntities =
				this.zoneNext.entitiesAll();
			zoneNextEntities.push(this.entityForPlayer);
			zoneNextEntities.push(this.cameraEntity);
		}
	}

	zoneContainingPos(posToCheck: Coords): Zone2
	{
		var zoneContainingPos: Zone2 = null;

		for (var i = 0; i < 2; i++)
		{
			var zonesToCheck =
				i == 0
				? this.zonesActive // Prioritize active zones.
				: this.zones.filter(x => this.zonesActive.indexOf(x) == -1);

			for (var z = 0; z < zonesToCheck.length; z++)
			{
				var zone = zonesToCheck[z];
				var zoneActiveEntity = zone.entityForEnvironment();
				var zoneActiveMesh =
					Collidable.of(zoneActiveEntity).collider as MeshTextured;
				var zoneActiveBounds =
					zoneActiveMesh.geometry.box();
				var zoneContainsPos =
					zoneActiveBounds.containsPoint(posToCheck);

				if (zoneContainsPos)
				{
					zoneContainingPos = zone;
					break;
				}
			}
		}

		return zoneContainingPos;
	}

	zoneByName(name: string): Zone2
	{
		return this._zonesByName.get(name);
	}

	zoneNextSet(value: Zone2): PlaceZoned2
	{
		this.zoneNext = value;
		return this;
	}

	// Serialization.

	toStringHumanReadable(): string
	{
		var newline = "\n";
		var tab = "\t";
		var blankLine = newline + newline;

		var zonesAsStrings =
			this.zones.map(x => x.toStringHumanReadable() );

		var tabTab = tab + tab;
		var newlineTabTab = newline + tabTab;

		var zonesAsStringsIndented =
			zonesAsStrings
				.map(x => newlineTabTab + x.split(newline).join(newlineTabTab) );

		var zonesAsString =
				zonesAsStringsIndented.join(blankLine);

		var placeAsLines =
		[
			"PlaceZoned:",
			tab + "Name: " + this.name,
			tab + "Size: " + this.size().toStringXYZ(),
			tab + "Zones: ",
			zonesAsString
		];

		var placeAsString = placeAsLines.join(newline);

		return placeAsString;
	}
}
