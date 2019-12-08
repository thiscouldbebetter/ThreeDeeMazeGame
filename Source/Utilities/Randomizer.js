
function Randomizer(seed)
{
	if (seed == null)
	{
		seed = Math.random();
	}
	this.current = seed;
}

{
	// Pass a value to Randomizer() to test with a known maze.
	Randomizer.Instance = new Randomizer();

	Randomizer.prototype.next = function()
	{
		// hack - Not very random.
		this.current = Math.sin(this.current) * 10000;
		this.current -= Math.floor(this.current);
		return this.current;
	}
}
