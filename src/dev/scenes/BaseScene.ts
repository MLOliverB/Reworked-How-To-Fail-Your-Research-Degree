import { GameData } from "../GameData";

export class BaseScene extends Phaser.Scene {
    gameData: GameData;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(gameData: GameData, config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.gameData = gameData;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.events.on('shutdown', this.shutdown, this);
    }

    shutdown() {
        // Clear keyboard events, otherwise they'll stack up when re-run
        this.input.keyboard.shutdown();
    }
}