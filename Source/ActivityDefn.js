
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
			function(world, entity, activity)
			{
				// do nothing
			}
		);

		this.UserInputAccept = new ActivityDefn
		(
			"Accept User Input",
			function(world, entity, activity)
			{
				var inputHelper = Globals.Instance.inputHelper;
				var actionsFromInput = inputHelper.actionsForInputsPressed;
				var actionsFromActor = entity.actions; 

				for (var a = 0; a < actionsFromInput.length; a++)
				{
					var action = actionsFromInput[a];
					var ticksToHold = 
					(
						action.ticksToHold == null 
						? action.ticksSoFar // hold forever
						: action.ticksToHold
					);

					if (action.ticksSoFar <= ticksToHold)
					{
						actionsFromActor.push(action);
					}
				}

			}
		);
	}

	ActivityDefn.Instances = new ActivityDefn_Instances();
}
