"use strict";
// main
class Game {
    start() {
        var soundHelper = new SoundHelperLive();
        var mediaLibrary = new MediaLibrary("../Content/", 
        // images
        [
            new Image2("Opening", "../Content/Images/Opening.png"),
            new Image2("Producer", "../Content/Images/Producer.png"),
            new Image2("Title", "../Content/Images/Title.png"),
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
        []);
        var display = new Display3D(new Coords(320, 240, 2000), "Font", // fontName,
        10, // fontHeightInPixels,
        Color.byName("White"), // colorFore,
        Color.byName("Black") // colorBack
        );
        var worldCreator = WorldCreator.fromWorldCreate(WorldExtended.create);
        var universe = new Universe("ThreeDeeMaze", "0.0.0-20220215-0000", // version
        new TimerHelper(20), display, soundHelper, mediaLibrary, ControlBuilder.default(), worldCreator);
        universe.initialize(() => universe.start());
    }
}
