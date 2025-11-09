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
		var displaySize = Coords.fromXY
		(
			// 320, 240
			400, 300
		);
		displaySize.z = displaySize.x * 6; // Formerly 320x240x2000.
		var display = Display3D.fromViewSizeInPixels(displaySize);

		var mediaLibrary = MediaLibrary.fromMediaFilePaths(mediaFilePaths);

		var worldCreator = WorldCreator.fromWorldCreate
		(
			WorldExtended.create
		);

		var universe = Universe.fromNameDisplayMediaLibraryAndWorldCreator
		(
			"ThreeDeeMaze",
			display,
			mediaLibrary,
			worldCreator
		);

		universe.initialize
		(
			() => universe.start()
		);
	}
}
