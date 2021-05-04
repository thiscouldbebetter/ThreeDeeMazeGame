class ActivityInstances
{
	static doNothing
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		// Do nothing.
	}

	static userInputAcceptPerform
	(
		universe: Universe, worldAsWorld: World, place: Place, entity: Entity
	): void
	{
		var world = worldAsWorld as WorldExtended;

		var inputHelper = universe.inputHelper;
		var inputsActive = inputHelper.inputsPressed; //Active;
		var actionsFromActor = entity.actor().actions;

		var actionsByName = world.actionsByName;
		var mappingsByInputName = world.actionToInputsMappingsByInputName;

		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];

			var mapping = mappingsByInputName.get(inputActive.name);
			if (mapping != null)
			{
				var actionName = mapping.actionName;
				var action = actionsByName.get(actionName) as ActionTimed;
				var ticksToHold =
				(
					action.ticksToHold == null
					? action.ticksSoFar // hold forever
					: action.ticksToHold
				);

				// fix
				if (action.ticksSoFar == null || action.ticksSoFar <= ticksToHold)
				{
					actionsFromActor.push(action);
				}
			}
		}
	}
}


