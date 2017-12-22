
function ActivityDefn(name, perform)
{
	this.name = name;
	this.perform = perform;
}

{
	function ActivityDefn_Instances()
	{
		if (ActivityDefn.Instances == null)
		{
			ActivityDefn.Instances = this;
		}

		this.DoNothing = new ActivityDefn
		(
			"Do Nothing",
			function perform(universe, world, entity, activity)
			{
				// do nothing
			}
		);

		this.UserInputAccept = new ActivityDefn
		(
			"Accept User Input",
			function perform(universe, world, entity, activity)
			{
				var inputHelper = universe.inputHelper;
				var inputsActive = inputHelper.inputsActive;
				var actionsFromActor = entity.actions; 

				var actions = world.actions;
				var mappings = world.inputToActionMappings;

				for (var i = 0; i < inputsActive.length; i++)
				{
					var inputActive = inputsActive[i];
					var mapping = mappings[inputActive];
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
			}
		);
	}

	ActivityDefn.Instances = new ActivityDefn_Instances();
}
