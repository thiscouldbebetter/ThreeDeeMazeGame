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
        var colors = Color.Instances();
        var display = new Display3D(Coords.fromXYZ(320, 240, 2000), new FontNameAndHeight("Font", 10), colors.White, // colorFore,
        colors.Black // colorBack
        );
        var soundHelper = new SoundHelperLive();
        var mediaLibrary = MediaLibrary.fromMediaFilePaths(mediaFilePaths);
        var controlBuilder = ControlBuilder.default();
        var profileHelper = ProfileHelper.maximal();
        var worldCreator = WorldCreator.fromWorldCreate(WorldExtended.create);
        var universe = new Universe("ThreeDeeMaze", "0.0.0-20251108-0000", // version
        TimerHelper.fromTicksPerSecond(20), display, soundHelper, mediaLibrary, controlBuilder, profileHelper, worldCreator);
        universe.initialize(() => universe.start());
    }
}
