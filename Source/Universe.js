
function Universe(name, timerHelper, display, mediaLibrary, world)
{
	this.name = name;
	this.timerHelper = timerHelper;
	this.display = display;
	this.mediaLibrary = mediaLibrary;
	this.world = world;
}

{
	// instance methods

	Universe.prototype.initialize = function()
	{
		this.platformHelper = new PlatformHelper();
		this.platformHelper.initialize(this);

		this.inputHelper = new InputHelper();

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
