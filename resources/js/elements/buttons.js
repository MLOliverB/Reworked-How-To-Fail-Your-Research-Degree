// @ts-check
import { colours } from "../theme/colours.js";
import { fonts } from "../theme/fonts.js";

class Button {
    /**
     * 
     * @param {*} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {*} colour
     * @param {boolean} setInteractive
     * @param {string} text
     * @param {*} textStyle
     * @param {*} onClick
     * @param {*} onHover
     * @param {*} onHoverExit
     */
    constructor(scene, x, y, width, height, colour, setInteractive, text, textStyle, onClick, onHover, onHoverExit) {
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

    /**
     * 
     * @param {boolean} bool 
     */
    setInteractive(bool) {
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
    /**
     * 
     * @param {*} scene 
     * @param {number} y 
     * @param {string} text 
     * @param {*} textStyle 
     * @param {*} onClick 
     */
    constructor(scene, y, text, textStyle, onClick) {
        super(scene, scene.x, scene.y*y, scene.width*0.2, scene.height*0.09, colours.get("buttonEvent"), true, text, textStyle, onClick, () => { this.button.setFillStyle(colours.get("buttonEventHover")); }, () => { this.button.setFillStyle(colours.get("buttonEvent")); });
    }
}


/**
 * 
 * @param {string[]} buttonNames 
 * @param {any[]} onClick 
 */
function createMainMenuButtons(scene, buttonNames, onClick) {
    let count = buttonNames.length;
    let yIntervals = 2 / (count + 1);

    for (let i = 0; i < count; i++) {
        new Button(scene, scene.x*1.75, scene.y*(yIntervals*(i+1)), scene.width*0.2, scene.height*0.09, colours.get("button"), true, buttonNames[i], fonts.get("h3"), onClick[i], undefined, undefined);
    }

}

export { CenterMenuButton, createMainMenuButtons };