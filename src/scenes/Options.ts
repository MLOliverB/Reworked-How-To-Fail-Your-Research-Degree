import { CenterMenuButton } from "../elements/buttons.js";
import { colours } from "../theme/colours.js";
import { fonts } from "../theme/fonts.js";
import GameData from "../GameData.js";
import BaseScene from "./BaseScene.js";

export default class Options extends BaseScene {
    roundLengthIndex: number;
    totalEventCardsIndex: number;
    totalWorkLateTilesIndex: number;
    buttonRoundLength!: CenterMenuButton;
    buttonEventCards!: CenterMenuButton;
    buttonWorkLate!: CenterMenuButton;

    constructor(gameData: GameData) {
        super(gameData, {key: "Options"});

        this.roundLengthIndex = gameData._defaultRoundLengthIndex;
        this.totalEventCardsIndex = gameData._defaultEventCardsPerRoundIndex;
        this.totalWorkLateTilesIndex = gameData._defaultWorkLateTilesPerTeamIndex;
    }

    create() {
        super.create();

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.background);
        this.add.rectangle(this.x, this.y*0.2, this.width*0.2, this.height*0.15, colours.toolbar);
        this.add.text(this.x, this.y*0.2, "Options", fonts.h2).setOrigin(0.5);

        new CenterMenuButton(this, 1.75, "Back to Main Menu", fonts.h3, () => { this.scene.start("MainMenu") });

        let gameData = this.gameData;

        

        this.add.text(this.x, this.y*0.5, "Round Length:", fonts.h3).setOrigin(0.5);
        this.buttonRoundLength = new  CenterMenuButton(this, 0.65, gameData._roundLengthValues[this.roundLengthIndex] + " seconds", fonts.h3Light, () => {
            this.roundLengthIndex++;
            if (this.roundLengthIndex >= gameData._roundLengthValues.length) this.roundLengthIndex = 0;
            this.buttonRoundLength.buttonText.setText(gameData._roundLengthValues[this.roundLengthIndex] + " seconds");
        });

        this.add.text(this.x, this.y*0.85, "Event Cards Per Round:", fonts.h3).setOrigin(0.5);
        this.buttonEventCards = new  CenterMenuButton(this, 1.0, `${gameData._eventCardsPerRoundValues[this.totalEventCardsIndex]}`, fonts.h3Light, () => {
            this.totalEventCardsIndex++;
            if (this.totalEventCardsIndex >= gameData._eventCardsPerRoundValues.length) this.totalEventCardsIndex = 0;
            this.buttonEventCards.buttonText.setText(`${gameData._eventCardsPerRoundValues[this.totalEventCardsIndex]}`);
        });

        this.add.text(this.x, this.y*1.2, "Work Late Tiles Per Team:", fonts.h3).setOrigin(0.5);
        this.buttonWorkLate = new  CenterMenuButton(this, 1.35, `${gameData._workLateTilesPerTeamValues[this.totalWorkLateTilesIndex]}`, fonts.h3Light, () => {
            this.totalWorkLateTilesIndex++;
            if (this.totalWorkLateTilesIndex >= gameData._workLateTilesPerTeamValues.length) this.totalWorkLateTilesIndex = 0;
            this.buttonWorkLate.buttonText.setText(`${gameData._workLateTilesPerTeamValues[this.totalWorkLateTilesIndex]}`);
        });
    }
}