import { CenterMenuButton } from "../elements/buttons.js";
import { colours } from "../theme/colours.js";
import { fonts } from "../theme/fonts.js";
import GameData from "../GameData.js";

export default class Options extends Phaser.Scene {
    gameData: GameData;
    x: number;
    y: number;
    width: number;
    height: number;
    roundLengthIndex: number;
    totalEventCardsIndex: number;
    totalWorkLateTilesIndex: number;
    buttonRoundLength: CenterMenuButton;
    buttonEventCards: CenterMenuButton;
    buttonWorkLate: CenterMenuButton;

    constructor(gameData: GameData) {
        super({key: "Options"});
        this.gameData = gameData;
    }

    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background"));
        this.add.rectangle(this.x, this.y*0.2, this.width*0.2, this.height*0.15, colours.get("toolbar"));
        this.add.text(this.x, this.y*0.2, "Options", fonts.get("h2")).setOrigin(0.5);

        new CenterMenuButton(this, 1.75, "Back to Main Menu", fonts.get("h3"), () => { this.scene.start("MainMenu") });

        let gameData = this.gameData;

        this.roundLengthIndex = gameData._defaultRoundLengthIndex;
        this.totalEventCardsIndex = gameData._defaultEventCardsPerRoundIndex;
        this.totalWorkLateTilesIndex = gameData._defaultWorkLateTilesPerTeamIndex;

        this.add.text(this.x, this.y*0.5, "Round Length:", fonts.get("h3")).setOrigin(0.5);
        this.buttonRoundLength = new  CenterMenuButton(this, 0.65, gameData._roundLengthValues[this.roundLengthIndex] + " seconds", fonts.get("h3Light"), () => {
            this.roundLengthIndex++;
            if (this.roundLengthIndex >= gameData._roundLengthValues.length) this.roundLengthIndex = 0;
            this.buttonRoundLength.buttonText.setText(gameData._roundLengthValues[this.roundLengthIndex] + " seconds");
        });

        this.add.text(this.x, this.y*0.85, "Event Cards Per Round:", fonts.get("h3")).setOrigin(0.5);
        // @ts-ignore
        this.buttonEventCards = new  CenterMenuButton(this, 1.0, gameData._eventCardsPerRoundValues[this.totalEventCardsIndex], fonts.get("h3Light"), () => {
            this.totalEventCardsIndex++;
            if (this.totalEventCardsIndex >= gameData._eventCardsPerRoundValues.length) this.totalEventCardsIndex = 0;
            // @ts-ignore
            this.buttonEventCards.buttonText.setText(gameData._eventCardsPerRoundValues[this.totalEventCardsIndex]);
        });

        this.add.text(this.x, this.y*1.2, "Work Late Tiles Per Team:", fonts.get("h3")).setOrigin(0.5);
        // @ts-ignore
        this.buttonWorkLate = new  CenterMenuButton(this, 1.35, gameData._workLateTilesPerTeamValues[this.totalWorkLateTilesIndex], fonts.get("h3Light"), () => {
            this.totalWorkLateTilesIndex++;
            if (this.totalWorkLateTilesIndex >= gameData._workLateTilesPerTeamValues.length) this.totalWorkLateTilesIndex = 0;
            // @ts-ignore
            this.buttonWorkLate.buttonText.setText(gameData._workLateTilesPerTeamValues[this.totalWorkLateTilesIndex]);
        });
    }
}