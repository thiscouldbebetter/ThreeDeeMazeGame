// main

function main()
{
	var mediaLibrary = new MediaLibrary
	(
		// images
		[
			new Image("Title", "../Media/Title.png"),
		],
		// sounds
		[
			new Sound("Sound", "../Media/Sound.wav", false),
			new Sound("Music", "../Media/Music.mp3", true),
		],
		// videos
		[
			new Video("Movie", "../Media/Movie.webm"),
		],
		// fonts
		[
			new Font("Font", "../Media/Font.ttf")
		],
		// textStrings
		[]
	);

	var display = new Display3D
	(
		new Coords(320, 240, 2000),
		"Font", // fontName,
		10, // fontHeightInPixels,
		"White", // colorFore,
		"Black", // colorBack
	);

	var universe = new Universe
	(
		"ThreeDeeMaze",
		"0.0.0", // version
		new TimerHelper(20),
		display,
		mediaLibrary,
		null //world
	);

	Collision.collisionHelper = universe.collisionHelper;

	universe.initialize
	(
		function() { universe.start(); }
	);
}
