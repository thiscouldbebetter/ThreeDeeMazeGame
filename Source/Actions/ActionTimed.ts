
class ActionTimed extends Action
{
	ticksToHold: number;
	ticksSoFar: number;

	constructor(name: string)
	{
		super(name, null);
	}
}
