// main

class Game
{
	start()
	{
		var mediaLibrary = new MediaLibrary
		(
			// images
			[
				new Image2("Opening", "../Content/Images/Opening.png"),
				new Image2("Producer", "../Content/Images/Producer.png"),
				new Image2("Title", "../Content/Images/Title.png"),
			],
			// sounds
			[
				new Sound("Sound", "../Content/Audio/Effects/Sound.wav"),
				new Sound("Music_Music", "../Content/Audio/Music/Music.mp3"),
				new Sound("Music_Producer", "../Content/Audio/Music/Music.mp3"),
				new Sound("Music_Title", "../Content/Audio/Music/Title.mp3"),
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
			Color.byName("White"), // colorFore,
			Color.byName("Black") // colorBack
		);

		var universe = new Universe
		(
			"ThreeDeeMaze",
			"0.0.0-20210502-2100", // version
			new TimerHelper(20),
			display,
			mediaLibrary,
			ControlBuilder.default(),
			WorldExtended.create
		);

		universe.initialize
		(
			() => universe.start()
		);
	}
}
