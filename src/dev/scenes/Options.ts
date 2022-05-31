import { COLOURS, FONTS } from "../constants";
import { CenterMenuButton } from "../elements/buttons";
import { GameData } from "../GameData";
import { BaseScene } from "./BaseScene";

export class Options extends BaseScene {
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

        this.add.rectangle(this.x, this.y, this.width, this.height, COLOURS.background);
        this.add.rectangle(this.x, this.y*0.2, this.width*0.2, this.height*0.15, COLOURS.toolbar);
        this.add.text(this.x, this.y*0.2, "Options", FONTS.h2).setOrigin(0.5);

        new CenterMenuButton(this, 1.75, "Back to Main Menu", FONTS.h3, () => { this.scene.start("MainMenu") });

        let gameData = this.gameData;

        

        this.add.text(this.x, this.y*0.5, "Round Length:", FONTS.h3).setOrigin(0.5);
        this.buttonRoundLength = new  CenterMenuButton(this, 0.65, gameData._roundLengthValues[this.roundLengthIndex] + " seconds", FONTS.h3Light, () => {
            this.roundLengthIndex++;
            if (this.roundLengthIndex >= gameData._roundLengthValues.length) this.roundLengthIndex = 0;
            this.buttonRoundLength.buttonText.setText(gameData._roundLengthValues[this.roundLengthIndex] + " seconds");
        });

        this.add.text(this.x, this.y*0.85, "Event Cards Per Round:", FONTS.h3).setOrigin(0.5);
        this.buttonEventCards = new  CenterMenuButton(this, 1.0, `${gameData._eventCardsPerRoundValues[this.totalEventCardsIndex]}`, FONTS.h3Light, () => {
            this.totalEventCardsIndex++;
            if (this.totalEventCardsIndex >= gameData._eventCardsPerRoundValues.length) this.totalEventCardsIndex = 0;
            this.buttonEventCards.buttonText.setText(`${gameData._eventCardsPerRoundValues[this.totalEventCardsIndex]}`);
        });

        this.add.text(this.x, this.y*1.2, "Work Late Tiles Per Team:", FONTS.h3).setOrigin(0.5);
        this.buttonWorkLate = new  CenterMenuButton(this, 1.35, `${gameData._workLateTilesPerTeamValues[this.totalWorkLateTilesIndex]}`, FONTS.h3Light, () => {
            this.totalWorkLateTilesIndex++;
            if (this.totalWorkLateTilesIndex >= gameData._workLateTilesPerTeamValues.length) this.totalWorkLateTilesIndex = 0;
            this.buttonWorkLate.buttonText.setText(`${gameData._workLateTilesPerTeamValues[this.totalWorkLateTilesIndex]}`);
        });
    }
}