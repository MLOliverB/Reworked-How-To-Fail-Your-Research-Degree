import { COLOURS, FONTS } from "../constants";
import { BaseScene } from "../scenes/BaseScene";

type OnClick = () => void;
type OnClickArr = (() => void)[];
type OnHover = () => void;
type OnHoverExit = () => void;

class Button {
    button: Phaser.GameObjects.Rectangle;
    isInteractive: boolean;
    buttonText: Phaser.GameObjects.Text;

    constructor(scene: BaseScene, x: number, y: number, width: number, height: number, colour: number, setInteractive: boolean,
        text: string, textStyle: Phaser.Types.GameObjects.Text.TextStyle,
        onClick: OnClick, onHover: OnHover | undefined, onHoverExit: OnHoverExit | undefined) {
        this.button = scene.add.rectangle(x, y, width, height, colour);
        if (setInteractive) this.button.setInteractive();
        this.isInteractive = setInteractive;

        this.button.on("pointerup", () => { onClick(); });
        if (onHover == undefined) {
            this.button.on("pointerover", () => { this.button.setFillStyle(COLOURS.buttonHover); });
        } else {
            this.button.on("pointerover", () => { onHover(); });
        }
        if (onHoverExit == undefined) {
            this.button.on("pointerout", () => { this.button.setFillStyle(COLOURS.button); });
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


export class CenterMenuButton extends Button {
    constructor(scene: BaseScene, y: number, text: string, textStyle: Phaser.Types.GameObjects.Text.TextStyle, onClick: OnClick) {
        super(scene, scene.x, scene.y*y, scene.width*0.2, scene.height*0.09, COLOURS.buttonEvent, true, text, textStyle, onClick, () => { this.button.setFillStyle(COLOURS.buttonEventHover); }, () => { this.button.setFillStyle(COLOURS.buttonEvent); });
    }
}

export function createMainMenuButtons(scene: BaseScene, buttonNames: string[], onClick: OnClickArr) {
    let count: number = buttonNames.length;
    let yIntervals: number = 2 / (count + 1);

    for (let i: number = 0; i < count; i++) {
        new Button(scene, scene.x*1.75, scene.y*(yIntervals*(i+1)), scene.width*0.2, scene.height*0.09, COLOURS.button, true, buttonNames[i], FONTS.h3, onClick[i], undefined, undefined);
    }

}