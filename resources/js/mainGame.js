// @ts-check
import MainMenu from "./scenes/MainMenu.js";
import Credits from "./scenes/Credits.js";
import GameData from "./GameData.js";

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
    scene: [MainMenu, Credits],
}

const gameData = new GameData(() => { let game = new Phaser.Game(config);
                                      gameData.game = game;
                                    });