// main

class Game
{
	start(): void
	{
		var soundHelper = new SoundHelperLive();

		var mediaLibrary = new MediaLibrary
		(
			"../Content/",
			// images
			[
				new Image2("Titles_Opening", "../Content/Images/Titles/Opening.png"),
				new Image2("Titles_Producer", "../Content/Images/Titles/Producer.png"),
				new Image2("Titles_Title", "../Content/Images/Titles/Title.png"),
			],
			// sounds
			[
				new SoundFromFile("Sound", "../Content/Audio/Effects/Sound.wav"),
				new SoundFromFile("Music_Music", "../Content/Audio/Music/Music.mp3"),
				new SoundFromFile("Music_Producer", "../Content/Audio/Music/Music.mp3"),
				new SoundFromFile("Music_Title", "../Content/Audio/Music/Title.mp3"),
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

		var colors = Color.Instances();

		var display = new Display3D
		(
			new Coords(320, 240, 2000),
			new FontNameAndHeight("Font", 10),
			colors.White, // colorFore,
			colors.Black // colorBack
		);

		var worldCreator = WorldCreator.fromWorldCreate
		(
			WorldExtended.create
		);

		var universe = new Universe
		(
			"ThreeDeeMaze",
			"0.0.0-20220215-0000", // version
			new TimerHelper(20),
			display,
			soundHelper,
			mediaLibrary,
			ControlBuilder.default(),
			worldCreator
		);

		universe.initialize
		(
			() => universe.start()
		);
	}
}
