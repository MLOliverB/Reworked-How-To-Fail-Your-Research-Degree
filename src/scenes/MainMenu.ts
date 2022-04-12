import { colours } from "../theme/colours.js";
import { fonts } from "../theme/fonts.js";
import { createMainMenuButtons } from "../elements/buttons.js";
import GameData from "../GameData.js";
import BaseScene from "./BaseScene.js";

export default class MainMenu extends BaseScene {

    constructor(gameData: GameData) {
        super(gameData, {key: "MainMenu"});
    }

    create() {
        super.create();

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.background); // background
        this.add.rectangle(this.x*2-this.x*0.5/2, this.y, this.x*0.5, this.height, colours.toolbar); // sidebar
        this.add.text(this.x-this.x*0.5/2, this.y, "How to Fail Your\nResearch Degree", fonts.h1).setOrigin(0.5);

        let buttonLabels = [
            "Start Game",
            "Options",
            "Credits"
        ];
        let buttonOnClick = [
            () => { console.log("Start Game"); },
            () => { this.scene.start("Options"); },
            () => { this.scene.start("Credits"); },
        ];
        createMainMenuButtons(this, buttonLabels, buttonOnClick);
    }
}