// @ts-check
import { colours } from "../theme/colours.js";
import { fonts } from "../theme/fonts.js";
import { createMainMenuButtons } from "../elements/buttons.js";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: "MainMenu"});
    }

    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background")); // background
        this.add.rectangle(this.x*2-this.x*0.5/2, this.y, this.x*0.5, this.height, colours.get("toolbar")); // sidebar
        this.add.text(this.x-this.x*0.5/2, this.y, "How to Fail Your\nResearch Degree", fonts.get("h1")).setOrigin(0.5);
        this.events.on('shutdown', this.shutdown, this);

        let buttonLabels = [
            "Start Game",
            "Options",
            "Credits"
        ];
        let buttonOnClick = [
            () => { console.log("Start Game"); },
            () => { console.log("Options"); },
            () => { this.scene.start("Credits"); },
        ];
        createMainMenuButtons(this, buttonLabels, buttonOnClick);
    }

    shutdown() {
        // Clear keyboard events, otherwise they'll stack up when MainMenu is re-run
        this.input.keyboard.shutdown();
    }
}