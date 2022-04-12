import MainMenu from "./scenes/MainMenu.js";
import Credits from "./scenes/Credits.js";
import GameData from "./GameData.js";
import Options from "./scenes/Options.js";

const version = "0.1.0";

const gameData = new GameData();

const config= {
    type: Phaser.AUTO,
    title: "How To Fail Your Research Degree",
    version: version,
    width: 1920,
    height: 1080,
    backgroundColor: '#a9e3ff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1,
    },
    scene: [new MainMenu(gameData), new Credits(gameData), new Options(gameData)],
}

const game = new Phaser.Game(config);
gameData._gameLoaded();

export { version };