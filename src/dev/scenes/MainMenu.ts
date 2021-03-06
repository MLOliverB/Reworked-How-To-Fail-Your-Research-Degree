import { COLOURS, FONTS } from "../constants";
import { CenterMenuButton, createMainMenuButtons } from "../elements/buttons";
import { GameData } from "../GameData";
import { BaseScene } from "./BaseScene";

export class MainMenu extends BaseScene {

    buttonMap!: Map<string, CenterMenuButton>;

    constructor(gameData: GameData) {
        super(gameData, {key: "MainMenu"});
    }

    create() {
        super.create();

        this.add.rectangle(this.x, this.y, this.width, this.height, COLOURS.background); // background
        this.add.rectangle(this.x*2-this.x*0.5/2, this.y, this.x*0.5, this.height, COLOURS.toolbar); // sidebar
        this.add.text(this.x-this.x*0.5/2, this.y, "How to Fail Your\nResearch Degree", FONTS.h1).setOrigin(0.5);

        let buttonLabels = [
            "Start Game",
            "Options",
            "Credits"
        ];
        let buttonOnClick = [
            () => { this.gameData._startGame(this); },
            () => { this.scene.start("Options"); },
            () => { this.scene.start("Credits"); },
        ];
        this.buttonMap = createMainMenuButtons(this, buttonLabels, buttonOnClick);
    }
}