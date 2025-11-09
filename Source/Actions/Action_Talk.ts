
class Action_Talk extends ActionTimed
{
	constructor()
	{
		super("Talk");
	}

	static create(): Action_Talk
	{
		return new Action_Talk();
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world as WorldExtended;
		var place = world.place() as PlaceZoned2;
		var entity = uwpe.entity;

		var playerPos = Locatable.of(entity).loc.pos;
		var entitiesAll = place.entitiesAll();
		var entitiesWithTalkerProperty =
			entitiesAll.filter(x => Talker.of(x) != null);
		var entityTalkerNearestSoFar = null;
		var entityTalkerNearestSoFarDistance = null;
		var entityTalkerDisplacement = Coords.create();
		var entityTalkerDistanceMax = 1000;

		for (var i = 0; i < entitiesWithTalkerProperty.length; i++)
		{
			var entity = entitiesWithTalkerProperty[i];
			var entityPos = Locatable.of(entity).pos();
			var entityTalkerDistance =
				entityTalkerDisplacement
					.overwriteWith(entityPos)
					.subtract(playerPos)
					.magnitude();
			if
			(
				entityTalkerDistance < entityTalkerDistanceMax
				&&
				(
					entityTalkerNearestSoFarDistance == null
					|| entityTalkerDistance < entityTalkerNearestSoFarDistance
				)
			)
			{
				entityTalkerNearestSoFarDistance = entityTalkerDistance;
				entityTalkerNearestSoFar = entity;
			}
		}

		if (entityTalkerNearestSoFar != null)
		{
			var talker = Talker.of(entityTalkerNearestSoFar);

			talker.talk(uwpe);
		}
	}
}
