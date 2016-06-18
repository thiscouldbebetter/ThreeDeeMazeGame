
function Globals()
{
}

{
	Globals.Instance = new Globals();

	Globals.prototype.initialize = function
	(
		millisecondsPerTimerTick,
		viewSizeInPixels,
		universe
	)
	{
		this.displayHelpers = 
		[	
			//new DisplayHelper2D(),
			new DisplayHelper3D(),
		]
		this.inputHelper = new InputHelper();

		for (var i = 0; i < this.displayHelpers.length; i++)
		{
			var displayHelper = this.displayHelpers[i];
			displayHelper.initialize(viewSizeInPixels);
		}
		this.inputHelper.initialize(universe.inputToActionBindings);

		this.universe = universe;
		this.universe.initialize();		

		this.timerTicksSoFar = 0;
		this.timer = setInterval
		(
			this.handleTimerTick.bind(this),
			millisecondsPerTimerTick
		);
	}

	Globals.prototype.handleTimerTick = function()
	{
		this.timerTicksSoFar++;
		this.universe.update();
	}
}
