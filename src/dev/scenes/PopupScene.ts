import { Game } from "phaser";
import { COLOURS, FONTS } from "../constants";
import { ToolbarButton } from "../elements/buttons";
import { GameData } from "../GameData";
import { BaseScene } from "./BaseScene";

export class PopupScene extends BaseScene {

    text: string;

    window!: Phaser.GameObjects.Rectangle;
    button!: Phaser.GameObjects.Rectangle;

    constructor(gameData: GameData, MessageText: string) {
        super(gameData, {key: "PopupDialog"});
        this.text = MessageText;
    }

    create() {
        super.create();
        this.gameData.teams[this.gameData.currentTeam].scene.sys.pause();

        let buttonX = this.x
        let buttonY = this.y*1.1

        this.window = this.add.rectangle(this.x, this.y, this.width*0.65, this.height*0.3, COLOURS.toolbar, 0.995);
        this.add.text(this.x, this.y*0.85, this.text, FONTS.h3Light).setOrigin(0.5);
        this.button = this.add.rectangle(buttonX, buttonY, this.width*0.08, this.height*0.10, COLOURS.button);
        this.add.text(buttonX, buttonY, "o.k.", FONTS.button).setOrigin(0.5);

        this.button.setInteractive();
        this.button.on("pointerover", () => { this.button.setFillStyle(COLOURS.buttonHover); });
        this.button.on("pointerout", () => { this.button.setFillStyle(COLOURS.button); });

        this.button.on("pointerup", () => {
            destroyPopupDialog(this.gameData);
        });

        this.events.on('destroy', function(this: PopupScene) {
            this.events.removeListener('destroy');
            this.gameData.isElementsInteractive = true;
            this.gameData.teams[this.gameData.currentTeam].scene.sys.resume();
        }, this);
    }
}


export function createPopupDialog(gameData: GameData, text: string) {
    gameData.isElementsInteractive = false;
    gameData.game.scene.add("PopupDialog", new PopupScene(gameData, text), true);
}

function destroyPopupDialog(gameData: GameData) {
    
    gameData.game.scene.remove("PopupDialog");
    
    
}