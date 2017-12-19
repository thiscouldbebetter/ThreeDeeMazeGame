
function Universe(name, timerHelper, world)
{
	this.name = name;
	this.timerHelper = timerHelper;
	this.world = world;
}

{
	// instance methods

	Universe.prototype.initialize = function()
	{
		this.display = new Display3D(new Coords(320, 240, 2000));
		this.inputHelper = new InputHelper();

		this.platformHelper = new PlatformHelper();
		this.platformHelper.initialize(this);

		this.display.initialize(this);
		this.inputHelper.initialize(this);

		this.world.initialize(this);

		this.timerHelper.initialize(this.update.bind(this));
	}

	Universe.prototype.update = function()
	{
		this.world.update(this);
	}
}
