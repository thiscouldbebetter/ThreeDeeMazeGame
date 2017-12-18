
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
		//universe.display = new Display([viewSizeInPixels]);
		universe.display = new Display3D(viewSizeInPixels);
		universe.inputHelper = new InputHelper();

		universe.platformHelper = new PlatformHelper();
		universe.platformHelper.initialize(universe);

		universe.display.initialize(universe);
		universe.inputHelper.initialize(universe);

		this.universe = universe;
		this.universe.initialize();		

		this.timer = setInterval
		(
			this.handleTimerTick.bind(this),
			millisecondsPerTimerTick
		);
	}

	Globals.prototype.handleTimerTick = function()
	{
		this.universe.update();
	}
}
