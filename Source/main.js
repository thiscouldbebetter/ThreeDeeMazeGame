// main

function main()
{
	var mediaLibrary = new MediaLibrary
	(
		// images
		[
			new Image2("Opening", "../Content/Images/Opening.png"),
			new Image2("Title", "../Content/Images/Title.png"),
		],
		// sounds
		[
			new Sound("Sound", "../Content/Audio/Effects/Sound.wav", false),
			new Sound("Music_Music", "../Content/Audio/Music/Music.mp3", true),
			new Sound("Music_Title", "../Content/Audio/Music/Title.mp3", true),
		],
		// videos
		[
			new Video("Movie", "../Content/Video/Movie.webm"),
		],
		// fonts
		[
			new Font("Font", "../Content/Fonts/Font.ttf")
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
		ControlStyle.Instances().Default,
		null //world
	);

	universe.initialize
	(
		function() { universe.start(); }
	);
}
