import Phaser from "phaser";
import { version } from "./constants";
import { GameData } from "./GameData";
import { Credits } from "./scenes/Credits";
import { MainMenu } from "./scenes/MainMenu";
import { Options } from "./scenes/Options";

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