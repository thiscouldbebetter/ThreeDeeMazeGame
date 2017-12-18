// main

function main()
{
	new Color_Instances();		

	var mazeSizeInCells = new Coords(4, 4, 1);
	//var mazeSizeInCells = new Coords(2, 1, 1);

	//var inputs = new Input_Instances();

	var amountToMoveForward = .4;
	var amountToMoveBackward = amountToMoveForward / 2;
	var amountToYaw = 0.1;
	var amountToStrafe = .1;

	var actions = 
	[
		new Action_Turn(new Coords(amountToYaw, 0, 0)),
		new Action_DoSomething(),
		new Action_Move(new Coords(0, amountToStrafe, 0)),
		new Action_Turn(new Coords(0 - amountToYaw, 0, 0)),
		new Action_Move(new Coords(-amountToMoveBackward, 0, 0)),
		new Action_Move(new Coords(amountToMoveForward, 0, 0)),
		new Action_Stop(),
		new Action_Move(new Coords(0, 0 - amountToStrafe, 0)),
		new Action_Jump(.6),
	]
	
	var inputToActionMappings = 
	[
		new InputToActionMapping( "_a", actions[0].name ),
		new InputToActionMapping( "_e", actions[1].name ),
		new InputToActionMapping( "_c", actions[2].name ),
		new InputToActionMapping( "_d", actions[3].name ),
		new InputToActionMapping( "_s", actions[4].name ),
		new InputToActionMapping( "_w", actions[5].name ),
		new InputToActionMapping( "_x", actions[6].name ),
		new InputToActionMapping( "_z", actions[7].name ),
		new InputToActionMapping( "_ ", actions[8].name ),
	]

	var universe0 = Universe.buildRandom
	(
		mazeSizeInCells,
		new Coords(80, 80, 40), // mazeCellSizeInPixels
		actions,
		inputToActionMappings
	);

	Globals.Instance.initialize
	(
		50, // millisecondsPerTick
		new Coords(320, 240, 2000), // viewSizeInPixels
		//new Coords(640, 480, 2000), // viewSizeInPixels
		universe0
	);
}
