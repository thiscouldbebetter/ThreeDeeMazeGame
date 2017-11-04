
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
			new DisplayHelper2D(viewSizeInPixels),
			new DisplayHelper3D(viewSizeInPixels),
		]
		this.inputHelper = new InputHelper();

		for (var i = 0; i < this.displayHelpers.length; i++)
		{
			var displayHelper = this.displayHelpers[i];
			displayHelper.initialize();
		}
		this.platformHelper = new PlatformHelper();
		this.platformHelper.initialize(this.displayHelpers[0]);		
		this.inputHelper.initialize();

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
