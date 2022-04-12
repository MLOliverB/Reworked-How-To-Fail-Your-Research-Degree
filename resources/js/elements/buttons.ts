import { colours } from "../theme/colours.js";
import { fonts } from "../theme/fonts.js";

type OnClick = () => void;
type OnClickArr = (() => void)[];
type OnHover = () => void;
type OnHoverExit = () => void;

class Button {
    button: Phaser.GameObjects.Rectangle;
    isInteractive: boolean;
    buttonText: Phaser.GameObjects.Text;

    constructor(scene, x: number, y: number, width: number, height: number, colour: number, setInteractive: boolean, text: string, textStyle, onClick: OnClick, onHover: OnHover, onHoverExit: OnHoverExit) {
        this.button = scene.add.rectangle(x, y, width, height, colour);
        if (setInteractive) this.button.setInteractive();
        this.isInteractive = setInteractive;

        this.button.on("pointerup", () => { onClick(); });
        if (onHover == undefined) {
            this.button.on("pointerover", () => { this.button.setFillStyle(colours.get("buttonHover")); });
        } else {
            this.button.on("pointerover", () => { onHover(); });
        }
        if (onHoverExit == undefined) {
            this.button.on("pointerout", () => { this.button.setFillStyle(colours.get("button")); });
        } else {
            this.button.on("pointerout", () => { onHoverExit(); });
        }
        
        this.buttonText = scene.add.text(x, y, text, textStyle).setOrigin(0.5);
    }

    setInteractive(bool: boolean) {
        if (bool) {
            this.button.setInteractive();
        } else {
            this.button.disableInteractive();
        }
    }

    toggleInteractive() {
        if (this.isInteractive) {
            this.button.disableInteractive();
        } else {
            this.button.setInteractive();
        }
    }

}


class CenterMenuButton extends Button {

    constructor(scene, y: number, text: string, textStyle, onClick: OnClick) {
        super(scene, scene.x, scene.y*y, scene.width*0.2, scene.height*0.09, colours.get("buttonEvent"), true, text, textStyle, onClick, () => { this.button.setFillStyle(colours.get("buttonEventHover")); }, () => { this.button.setFillStyle(colours.get("buttonEvent")); });
    }
}

function createMainMenuButtons(scene, buttonNames: string[], onClick: OnClickArr) {
    let count: number = buttonNames.length;
    let yIntervals: number = 2 / (count + 1);

    for (let i: number = 0; i < count; i++) {
        new Button(scene, scene.x*1.75, scene.y*(yIntervals*(i+1)), scene.width*0.2, scene.height*0.09, colours.get("button"), true, buttonNames[i], fonts.get("h3"), onClick[i], undefined, undefined);
    }

}

export { CenterMenuButton, createMainMenuButtons };