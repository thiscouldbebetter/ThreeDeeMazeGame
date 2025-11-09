"use strict";
// main
class Game {
    constructor(configuration) {
        this.configuration = configuration;
    }
    static create() {
        var configuration = Configuration.Instance();
        return new Game(configuration);
    }
    static fromConfiguration(configuration) {
        return new Game(configuration);
    }
    start() {
        var contentDirectoryPath = this.configuration.contentDirectoryPath;
        var manifestFileName = "Manifest.txt";
        MediaLibrary.mediaFilePathsReadFromContentDirectoryPathAndManifestFileNameThen(contentDirectoryPath, manifestFileName, this.start_MediaFilePathsLoaded);
    }
    start_MediaFilePathsLoaded(mediaFilePaths) {
        var displaySize = Coords.fromXY(
        // 320, 240
        400, 300);
        displaySize.z = displaySize.x * 6; // Formerly 320x240x2000.
        var display = Display3D.fromViewSizeInPixels(displaySize);
        var mediaLibrary = MediaLibrary.fromMediaFilePaths(mediaFilePaths);
        var worldCreator = WorldCreator.fromWorldCreate(WorldExtended.create);
        var universe = Universe.fromNameDisplayMediaLibraryAndWorldCreator("ThreeDeeMaze", display, mediaLibrary, worldCreator);
        universe.initialize(() => universe.start());
    }
}
