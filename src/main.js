// main

function main()
{
	new Color_Instances();		

	var mazeSizeInCells = new Coords(4, 4, 1);
	//var mazeSizeInCells = new Coords(2, 1, 1);

	var inputs = new Input_Instances();

	var amountToMoveForward = .4;
	var amountToMoveBackward = amountToMoveForward / 2;
	var amountToYaw = 0.1;
	var amountToStrafe = .1;

	var inputToActionBindings = 
	[
		new InputToActionBinding( inputs.A, new Action_Turn(new Coords(amountToYaw, 0, 0)) ),
		new InputToActionBinding( inputs.E, new Action_DoSomething() ),
		new InputToActionBinding( inputs.C, new Action_Move(new Coords(0, amountToStrafe, 0)) ),
		new InputToActionBinding( inputs.D, new Action_Turn(new Coords(0 - amountToYaw, 0, 0)) ),
		//new InputToActionBinding( inputs.F, new Action_CameraZoomOut(-1) ),
		//new InputToActionBinding( inputs.R, new Action_CameraZoomOut(1) ),
		new InputToActionBinding( inputs.S, new Action_Move(new Coords(-amountToMoveBackward, 0, 0)) ),
		new InputToActionBinding( inputs.W, new Action_Move(new Coords(amountToMoveForward, 0, 0)) ),
		new InputToActionBinding( inputs.X, new Action_Stop() ),
		new InputToActionBinding( inputs.Z, new Action_Move(new Coords(0, 0 - amountToStrafe, 0)) ),
		new InputToActionBinding( inputs.MouseButton, new Action_DoNothing() ),
		new InputToActionBinding( inputs.Space, new Action_Jump(.6) ),
	];

	var universe0 = Universe.buildRandom
	(
		mazeSizeInCells,
		new Coords(80, 80, 40), // mazeCellSizeInPixels
		inputToActionBindings
	);

	Globals.Instance.initialize
	(
		50, // millisecondsPerTick
		new Coords(320, 240, 2000), // viewSizeInPixels
		//new Coords(640, 480, 2000), // viewSizeInPixels
		universe0
	);
}
