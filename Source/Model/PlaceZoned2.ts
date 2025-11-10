
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
					entityPos.clone().add(new Coords(0, 0, 100))
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
			var entities = zone.entities;

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
			this.zonesActive.map(x => x.entities);
		var entitiesForZonesActive =
			ArrayHelper.flattenArrayOfArrays(entityArraysForZonesActive);
		return entitiesForZonesActive;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.meshesToDraw = [];

		// todo - hack
		var zoneStart;
		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			var zoneEntity = zone.entities[0];
			var zoneMesh = Collidable.of(zoneEntity).collider as MeshTextured;
			if (zoneMesh.materials[1].name == "Start")
			{
				zoneStart = zone;
				break;
			}
		}

		this.zoneNext = zoneStart;
		this.zonesActive = [];

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
			var entities = zone.entities;

			for (var i = 1; i < entities.length; i++)
			{
				var entity = entities[i];

				entity.propertyAdd(constrainable);
			}
		}

		var universe = uwpe.universe;
		var viewSizeInPixels = universe.display.sizeInPixels.clone();
		var focalLength = viewSizeInPixels.z / 16;
		var followDivisor = 16;
		var offsetOfCameraFromPlayer = Coords.fromXYZ
		(
			0 - focalLength,
			0,
			0 - focalLength
		).divideScalar(followDivisor);

		var loc = Disposition.fromPosOrientationAndPlaceName
		(
			Locatable.of(this.zoneNext.entities[0] ).loc.pos.clone().add
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

		var locatable = Locatable.fromDisposition(loc);
		var cameraEntity = Entity.fromNameAndProperties
		(
			"Camera",
			[
				Constrainable.fromConstraints
				([
					new Constraint_Follow(this.entityForPlayer, focalLength / followDivisor),
					new Constraint_OrientToward(this.entityForPlayer),
				]),
				locatable,
				new Groundable()
			]
		);

		this.camera = Camera.fromViewSizeFocalLengthAndDisposition
		(
			viewSizeInPixels,
			focalLength,
			Locatable.of(cameraEntity).loc
		);

		zoneStart.entities.push(cameraEntity);

		this.cameraEntity = cameraEntity;
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var world = uwpe.world as WorldExtended;

		if (this.zoneNext != null)
		{
			var zoneNextEntity = this.zoneNext.entities[0];
			var zoneNextMesh =
				Collidable.of(zoneNextEntity).collider as MeshTextured;
			if (zoneNextMesh.materials[0].name == "Goal")
			{
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
				var zoneActiveEntity = zoneActive.entities[0];
				var zoneMesh = Collidable.of(zoneActiveEntity).collider as MeshTextured;
				var facesForZone = zoneMesh.faces();
				ArrayHelper.append(facesForZonesActive, facesForZone);
			}

			this.spacePartitioningTreeForZonesActive =
				SpacePartitioningTree.fromFaces(facesForZonesActive);

			this.zoneNext = null;
		}

		for (var z = 0; z < this.zonesActive.length; z++)
		{
			var zoneActive = this.zonesActive[z];
			zoneActive.updateForTimerTick(uwpe);
		}

		this.draw(universe);

		var zoneCurrentEntity = this.zoneCurrent.entities[0];
		var zoneCurrentMesh =
			Collidable.of(zoneCurrentEntity).collider as MeshTextured;
		var zoneCurrentBounds =
			zoneCurrentMesh.geometry.box();

		var playerIsInZoneCurrent = zoneCurrentBounds.containsPoint
		(
			Locatable.of(this.entityForPlayer).loc.pos
		);

		if (playerIsInZoneCurrent == false)
		{
			for (var z = 0; z < this.zonesActive.length; z++)
			{
				var zoneActive = this.zonesActive[z];
				var zoneActiveEntity = zoneActive.entities[0];
				var zoneActiveMesh =
					Collidable.of(zoneActiveEntity).collider as MeshTextured;
				var zoneActiveBounds = zoneActiveMesh.geometry.box();
				var isPlayerInZoneActive = zoneActiveBounds.containsPoint
				(
					Locatable.of(this.entityForPlayer).loc.pos
				);

				if (isPlayerInZoneActive)
				{
					var zoneCurrentEntities = this.zoneCurrent.entities;
					ArrayHelper.remove(zoneCurrentEntities, this.entityForPlayer);
					ArrayHelper.remove(zoneCurrentEntities, this.cameraEntity);

					this.zoneNext = zoneActive;
					var zoneNextEntities = this.zoneNext.entities;
					zoneNextEntities.push(this.entityForPlayer);
					zoneNextEntities.push(this.cameraEntity);

					break;
				}
			}
		}
	}

	zoneByName(name: string): Zone2
	{
		return this._zonesByName.get(name);
	}
}
