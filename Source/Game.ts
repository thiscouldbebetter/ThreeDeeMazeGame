// main

class Game
{
	configuration: Configuration;

	constructor(configuration: Configuration)
	{
		this.configuration = configuration;
	}

	static create(): Game
	{
		var configuration = Configuration.Instance();
		return new Game(configuration);
	}

	static fromConfiguration(configuration: Configuration): Game
	{
		return new Game(configuration);
	}

	start(): void
	{
		var contentDirectoryPath = this.configuration.contentDirectoryPath;
		var manifestFileName = "Manifest.txt";
		MediaLibrary.mediaFilePathsReadFromContentDirectoryPathAndManifestFileNameThen
		(
			contentDirectoryPath,
			manifestFileName,
			this.start_MediaFilePathsLoaded
		);
	}

	start_MediaFilePathsLoaded(mediaFilePaths: string[]): void
	{
		var colors = Color.Instances();

		var display = new Display3D
		(
			Coords.fromXYZ(320, 240, 2000),
			new FontNameAndHeight("Font", 10),
			colors.White, // colorFore,
			colors.Black // colorBack
		);

		var soundHelper = new SoundHelperLive();

		var mediaLibrary = MediaLibrary.fromMediaFilePaths(mediaFilePaths)

		var controlBuilder = ControlBuilder.default();

		var profileHelper = ProfileHelper.maximal();

		var worldCreator = WorldCreator.fromWorldCreate
		(
			WorldExtended.create
		);

		var universe = new Universe
		(
			"ThreeDeeMaze",
			"0.0.0-20251108-0000", // version
			TimerHelper.fromTicksPerSecond(20),
			display,
			soundHelper,
			mediaLibrary,
			controlBuilder,
			profileHelper,
			worldCreator
		);

		universe.initialize
		(
			() => universe.start()
		);
	}
}
