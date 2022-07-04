import { CardBoxSwapper } from "../cards/activityCards";
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

    buttonColour: number;
    buttonHoverColour: number;
    buttonDisabledColour: number;

    onClick: OnClick;
    onHover: OnHover | undefined;
    onHoverExit: OnHoverExit | undefined;

    constructor(scene: BaseScene, x: number, y: number, width: number, height: number, setInteractive: boolean,
        text: string, textStyle: Phaser.Types.GameObjects.Text.TextStyle,
        buttonColour: number, buttonHoverColour: number, buttonDisabledColour: number,
        onClick: OnClick, onHover?: OnHover, onHoverExit?: OnHoverExit) {
        this.button = scene.add.rectangle(x, y, width, height, buttonColour);

        this.buttonColour = buttonColour;
        this.buttonHoverColour = buttonHoverColour;
        this.buttonDisabledColour = buttonDisabledColour;

        this.onClick = onClick
        this.onHover = onHover;
        this.onHoverExit = onHoverExit;
        
        this.buttonText = scene.add.text(x, y, text, textStyle).setOrigin(0.5);

        this.setInteractive(setInteractive);
        this.isInteractive = setInteractive;
    }

    setInteractive(bool: boolean) {
        if (bool) {
            this.isInteractive = true;
            this.button.setInteractive();
            this.button.setFillStyle(this.buttonColour);

            this.button.on("pointerover", () => { this.button.setFillStyle(this.buttonHoverColour); });
            this.button.on("pointerout", () => { this.button.setFillStyle(this.buttonColour); });

            this.button.on("pointerup", this.onClick);
            if (this.onHover != undefined) this.button.on("pointerover", this.onHover);
            if (this.onHoverExit != undefined) this.button.on("pointerout", this.onHoverExit);
        } else {
            this.isInteractive = false;
            this.button.removeAllListeners();
            this.button.disableInteractive();
            this.button.setFillStyle(this.buttonDisabledColour);
        }
    }

    toggleInteractive() {
        if (this.isInteractive) {
            this.setInteractive(false);
        } else {
            this.setInteractive(true);
        }
    }

    setVisible(bool: boolean) {
        this.button.setVisible(bool);
        this.buttonText.setVisible(bool);
    }

    toggleVisible() {
        if (this.button.visible) {
            this.setVisible(false);
        } else {
            this.setVisible(true);
        }
    }

    destroy() {
        this.button.destroy();
        this.buttonText.destroy();
    }

}

// ================================================================================================
// ================================================================================================


export class CenterMenuButton extends Button {
    constructor(scene: BaseScene, y: number, text: string, textStyle: Phaser.Types.GameObjects.Text.TextStyle, onClick: OnClick) {
        super(scene, scene.x, scene.y*y, scene.width*0.2, scene.height*0.09, true, text, textStyle, COLOURS.buttonEvent, COLOURS.buttonEventHover, COLOURS.buttonDisabled, onClick);
    }
}

export function createMainMenuButtons(scene: BaseScene, buttonNames: string[], onClick: OnClickArr): Map<string, CenterMenuButton> {
    let count: number = buttonNames.length;
    let yIntervals: number = 2 / (count + 1);

    let buttonMap = new Map<string, Button>();

    for (let i: number = 0; i < count; i++) {
        buttonMap.set(buttonNames[i], new Button(scene, scene.x*1.75, scene.y*(yIntervals*(i+1)), scene.width*0.2, scene.height*0.09, true, buttonNames[i], FONTS.h3, COLOURS.button, COLOURS.buttonHover, COLOURS.buttonDisabled, onClick[i]));
    }

    return buttonMap;
}

// ================================================================================================
// ================================================================================================

export class ToolbarButton extends Button {
    constructor(scene: BaseScene, x: number, y: number, width: number, height: number, text: string, onClick: OnClick, onHover?: OnHover) {
        super(scene, x, y, width, height, false, text, FONTS.button, COLOURS.button, COLOURS.buttonHover, COLOURS.buttonDisabled, onClick, onHover);
    }
}


export class CardStackButton extends Button {
    scene: BaseScene;
    image!: Phaser.GameObjects.Image;

    constructor(scene: BaseScene, x: number, y: number, text: string, onClick: OnClick) {
        super(scene, x, y, scene.width*0.162, scene.height*0.204, false, text, FONTS.button, COLOURS.cardStack, COLOURS.cardStackHover, COLOURS.buttonDisabled, onClick);
        this.scene = scene;
    }

    setImage(key: string) {
        if (this.image != undefined) this.image.destroy();
        this.buttonText.setText("");
        if (this.scene.textures.exists(key)) {
            this.image = this.scene.add.image(this.scene.x, this.scene.y*1.76, key).setScale(0.6);
        }
    }

    removeImage() {
        if (this.image != undefined) this.image.destroy();
        this.buttonText.setText("+");
    }

    cardUsed() {
        if (this.scene.gameData.stage == 1 && this.scene.gameData.activityCardStack.popCounter >= this.scene.gameData.planCards) {
            this.scene.gameData.teamToolbar.cardStackButton.setInteractive(false);
            this.scene.gameData.teamToolbar.instructionText.setText("Swap Cards or Press Continue");
            this.scene.gameData.allowSwap = new CardBoxSwapper(this.scene.gameData);
            this.scene.gameData.teamToolbar.continueButton.setInteractive(true);
        }
    }
}