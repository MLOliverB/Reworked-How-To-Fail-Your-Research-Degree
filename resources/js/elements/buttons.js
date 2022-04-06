// @ts-check
import { colours } from "../theme/colours.js";

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
     */
    constructor(scene, x, y, width, height, colour, setInteractive, text, textStyle, onClick, onHover, onHoverExit) {
        this.button = scene.add.rectangle(x, y, width, height, colour);
        if (setInteractive) this.button.setInteractive();

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
        
        this.buttonText = scene.add.text(x, y, text, textStyle);
    }

}