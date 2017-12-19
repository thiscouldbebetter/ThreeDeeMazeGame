// main

function main()
{
	new Color_Instances();		

	var mazeSizeInCells = new Coords(4, 4, 1);
	var mazeCellSizeInPixels = new Coords(80, 80, 40);
	
	var world = World.buildRandom
	(
		mazeSizeInCells,
		mazeCellSizeInPixels
	);

	var universe = new Universe
	(
		"ThreeDeeMaze",
		new TimerHelper(20),
		world
	);

	universe.initialize();
}
