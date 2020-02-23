function ActivityInstances()
{
	this.DoNothing = function perform(universe, world, zone, entity, activity)
	{
		// do nothing
	};

	this.UserInputAccept = function perform(universe, world, zone, entity, activity)
	{
		var inputHelper = universe.inputHelper;
		var inputsActive = inputHelper.inputsPressed; //Active;
		var actionsFromActor = entity.actor.actions;

		var actions = world.actions;
		var mappings = world.actionToInputsMappings;

		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];

			var mapping = mappings[inputActive.name];
			if (mapping != null)
			{
				var actionName = mapping.actionName;
				var action = actions[actionName];
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
	};
}


