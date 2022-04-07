// @ts-check
import { CenterMenuButton } from "../elements/buttons.js";
import { fonts } from "../theme/fonts.js";
import { colours } from "../theme/colours.js";

export default class Credits extends Phaser.Scene {
    constructor() {
        super({key: "Credits"});
    }

    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.events.on('shutdown', this.shutdown, this);

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background"));
        this.add.rectangle(this.x, this.y*0.2, this.width*0.2, this.height*0.2, colours.get("toolbar"));
        this.add.text(this.x, this.y*0.2, "Credits", fonts.get("h2")).setOrigin(0.5);
        new CenterMenuButton(this, 1.75, "Back to Main Menu", fonts.get("h3"), () => { this.scene.start("MainMenu") });
    }

    shutdown() {
        // Clear keyboard events, otherwise they'll stack up when MainMenu is re-run
        this.input.keyboard.shutdown();
    }
}