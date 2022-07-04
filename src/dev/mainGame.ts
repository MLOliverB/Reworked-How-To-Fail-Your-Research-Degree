import Phaser from "phaser";
import { COLOURS, GAME_HEIGHT, GAME_WIDTH, version } from "./constants";
import { GameData } from "./GameData";
import { Credits } from "./scenes/Credits";
import { MainMenu } from "./scenes/MainMenu";
import { Options } from "./scenes/Options";

const gameData = new GameData();

const config= {
    type: Phaser.AUTO,
    title: "How To Fail Your Research Degree - Local Multiplayer",
    version: version,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: COLOURS.background,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1,
    },
    scene: [new MainMenu(gameData), new Credits(gameData), new Options(gameData)],
}

const game = new Phaser.Game(config);
gameData.game = game;