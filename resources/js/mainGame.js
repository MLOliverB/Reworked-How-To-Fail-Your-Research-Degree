// @ts-check
import MainMenu from "./scenes/MainMenu.js";
import Credits from "./scenes/Credits.js";
import Options from "./scenes/Options.js";

const config= {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: '#a9e3ff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1,
    },
    scene: [MainMenu, Credits, Options],
}

const game = new Phaser.Game(config);