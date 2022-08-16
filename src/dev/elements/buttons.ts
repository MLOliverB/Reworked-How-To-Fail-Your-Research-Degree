import { CardBoxSwapper } from "../cards/activityCards/CardBox";
import { isDiscardable } from "../cards/activityCards/util";
import { COLOURS, FONTS } from "../constants";
import { BaseScene } from "../scenes/BaseScene";
import { createPopupDialog } from "../scenes/PopupScene";
import { TeamToolbar } from "../scenes/TeamToolbar";

type OnClick = () => void;
type OnClickArr = (() => void)[];
type OnHover = () => void;
type OnHoverExit = () => void;


/**
 * A basic button class.
 * This is a convencience class to reduce the boilerplate code of drawing a button rectangle, making it interactive, and adding mouse listeners along with the appropriate colour pallettes.
 * 
 * @author Oliver Billich
 */
class Button {
    readonly scene: BaseScene

    private button: Phaser.GameObjects.Rectangle;
    private isInteractive: boolean;
    readonly buttonText: Phaser.GameObjects.Text;

    private buttonColour: number;
    private buttonHoverColour: number;
    private buttonDisabledColour: number;

    private onClick: OnClick;
    private onHover: OnHover | undefined;
    private onHoverExit: OnHoverExit | undefined;

    /**
     * Creates and draws a new button within the given scene.
     * @param scene The scene in which the button will be created.
     * @param x The x-coordinate at which the button is placed.
     * @param y The y-coordinate at which the button is placed.
     * @param width The width of the button.
     * @param height The height of the button.
     * @param setInteractive True if the button is to be interactive upon creation.
     * @param text The button text.
     * @param textStyle The button text style.
     * @param buttonColour The normal colour of the button.
     * @param buttonHoverColour The colour of the button when hovered over with a mouse.
     * @param buttonDisabledColour The colour of the button when disabled.
     * @param onClick Function that is called whenever the button is clicked.
     * @param onHover Optional function that is called whenever the mouse is hovered over the button.
     * @param onHoverExit Optional function that is called whenever the mouse leaves the button.
     */
    constructor(scene: BaseScene, x: number, y: number, width: number, height: number, setInteractive: boolean,
        text: string, textStyle: Phaser.Types.GameObjects.Text.TextStyle,
        buttonColour: number, buttonHoverColour: number, buttonDisabledColour: number,
        onClick: OnClick, onHover?: OnHover, onHoverExit?: OnHoverExit) {
        
        this.scene = scene;

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

    /**
     * Sets the button to be clickable or not.
     * @param bool True if button should be interactive, False otherwise.
     */
    public setInteractive(bool: boolean) {
        if (bool) {
            this.isInteractive = true;
            this.button.setInteractive();
            this.button.setFillStyle(this.buttonColour);

            this.button.on("pointerover", () => { this.scene.gameData.isInteractiveFunction(() => {
                this.button.setFillStyle(this.buttonHoverColour);
            })});
            this.button.on("pointerout", () => { this.scene.gameData.isInteractiveFunction(() => {
                this.button.setFillStyle(this.buttonColour);
            })});

            this.button.on("pointerup", () => { this.scene.gameData.isInteractiveFunction(() => {
                this.onClick()
            })});

            if (this.onHover != undefined) {
                this.button.on("pointerover", () => { this.scene.gameData.isInteractiveFunction(() => {
                    if (this.onHover != undefined) this.onHover()
                })});
            }
            if (this.onHoverExit != undefined) {
                this.button.on("pointerout", () => { this.scene.gameData.isInteractiveFunction(() => {
                    if (this.onHoverExit != undefined) this.onHoverExit()
                })});
            }
        } else {
            this.isInteractive = false;
            this.button.removeAllListeners();
            this.button.disableInteractive();
            this.button.setFillStyle(this.buttonDisabledColour);
        }
    }

    /**
     * @see {@link setInteractive}
     */
    public toggleInteractive() {
        if (this.isInteractive) {
            this.setInteractive(false);
        } else {
            this.setInteractive(true);
        }
    }

    /**
     * Show or hide the button.
     * @param bool True to show the button, False to hide it.
     */
    setVisible(bool: boolean) {
        this.button.setVisible(bool);
        this.buttonText.setVisible(bool);
    }

    /**
     * @see {@link setVisible}
     */
    toggleVisible() {
        if (this.button.visible) {
            this.setVisible(false);
        } else {
            this.setVisible(true);
        }
    }

    /**
     * Frees the button and buttonText from the Phaser resources.
     * This must be called whenever a button instance is dereferenced in order to prevent memory leaks.
     */
    destroy() {
        this.button.destroy();
        this.buttonText.destroy();
    }

}

// ================================================================================================
// ================================================================================================


/**
 * Standardized button that is centered horizontally in the scene and has a fixed size.
 * Commonly used for menu options before the start of the game.
 * @extends Button
 * @author Oliver Billich
 */
export class CenterMenuButton extends Button {

    /**
     * Creates and draws a new Center Menu Button
     * 
     * @param scene The scene in which the button will be created.
     * @param y The y-coordinate at which the button is placed.
     * @param text The button text.
     * @param textStyle The button text style.
     * @param onClick Function that is called whenever the button is clicked.
     */
    constructor(scene: BaseScene, y: number, text: string, textStyle: Phaser.Types.GameObjects.Text.TextStyle, onClick: OnClick) {
        super(scene, scene.x, scene.y*y, scene.width*0.2, scene.height*0.09, true, text, textStyle, COLOURS.buttonEvent, COLOURS.buttonEventHover, COLOURS.buttonDisabled, onClick);
    }
}

/**
 * Creates the specified buttons and places them equally spaced vertically in the scene.
 * This function is meant to draw the buttons for the Main menu screen before the game starts.
 * 
 * @see {@link Button}
 * 
 * @param scene The given scene on which the buttons will be placed.
 * @param buttonNames An array of names which the buttons will have.
 * @param onClick An array of functions determining the mouse listeners for each button in order.
 * @returns A map with the button names as keys and the buttons as corresponding values.
 */
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

/**
 * A button that is styled to be used on either the Team Toolbar or the Facilitator Toolbar.
 * @extends Button
 * @author Oliver Billich
 */
export class ToolbarButton extends Button {

    /**
     * Creates and draws a new Toolbar Button.
     * 
     * @param scene The scene in which the button will be created.
     * @param x The x-coordinate at which the button is placed.
     * @param y The y-coordinate at which the button is placed.
     * @param width The width of the button.
     * @param height The height of the button.
     * @param text The button text.
     * @param onClick Function that is called whenever the button is clicked.
     * @param onHover Optional function that is called whenever the mouse is hovered over the button.
     */
    constructor(scene: BaseScene, x: number, y: number, width: number, height: number, text: string, onClick: OnClick, onHover?: OnHover) {
        super(scene, x, y, width, height, false, text, FONTS.button, COLOURS.button, COLOURS.buttonHover, COLOURS.buttonDisabled, onClick, onHover);
    }
}


/**
 * A button used for the Activity Card Stack.
 * @extends Button
 * @author Oliver Billich
 */
export class CardStackButton extends Button {

    /**
     * @override
     */
    public scene: TeamToolbar;

    private image!: Phaser.GameObjects.Image;

    /**
     * Creates and draws a new Activity Card Stack Button.
     * 
     * @param scene The scene in which the button will be created.
     * @param x The x-coordinate at which the button is placed.
     * @param y The y-coordinate at which the button is placed.
     * @param text The button text.
     * @param onClick Function that is called whenever the button is clicked.
     */
    constructor(scene: TeamToolbar, x: number, y: number, text: string, onClick: OnClick) {
        super(scene, x, y, scene.width*0.162, scene.height*0.204, false, text, FONTS.button, COLOURS.cardStack, COLOURS.cardStackHover, COLOURS.buttonDisabled, onClick);
        this.scene = scene;
    }

    /**
     * Updates the image overlaid on top of the button.
     * This image must be an activity card.
     * @param key The Phaser resource key of the new image.
     */
    public setImage(key: string) {
        if (this.image != undefined) this.image.destroy();
        this.buttonText.setText("");
        if (this.scene.textures.exists(key)) {
            this.image = this.scene.add.image(this.scene.x, this.scene.y*1.76, key).setScale(0.6);
        }
    }

    /**
     * Removes the current image displayed on the button.
     */
    public removeImage() {
        if (this.image != undefined) this.image.destroy();
        this.buttonText.setText("+");
    }

    /**
     * Callback function that should be called whenever a card has been taken from the Activity Card Stack.
     */
    public cardUsed() {
        if (this.scene.discardButton) this.scene.discardButton.setInteractive(false);
        if (this.scene.gameData.stage == 1 && this.scene.gameData.activityCardStack.popCounter >= this.scene.gameData.planCards) {
            this.scene.gameData.teamToolbar.cardStackButton.setInteractive(false);
            this.scene.gameData.teamToolbar.instructionText.setText("Swap Cards or Press Continue");
            this.scene.gameData.allowSwap = new CardBoxSwapper(this.scene.gameData);
            this.scene.gameData.teamToolbar.continueButton.setInteractive(true);
        }
    }
}


/**
 * A button used for the Activity Card Discard Stack.
 * @extends Button
 * @author Oliver Billich
 */
export class DiscardButton extends Button {

    /**
     * Creates and draws a new Discard Stack Button.
     * 
     * @param scene The scene in which the button will be created.
     * @param x The x-coordinate at which the button is placed.
     * @param y The y-coordinate at which the button is placed.
     * @param width The width of the button.
     * @param height The height of the button.
     */
    constructor(scene: TeamToolbar, team: number, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, false, "Discard", FONTS.button, COLOURS.button, COLOURS.buttonHover, COLOURS.buttonDisabled, 
        () => {
            // onClick
            this.setInteractive(false);
            let isCardDiscardable = isDiscardable(scene.gameData, scene.gameData.currentTeam);
            console.log("Is Card Discardable: " + isCardDiscardable);
            if (isCardDiscardable) {
                scene.gameData.teams[scene.gameData.currentTeam].currentCard = 0;
                scene.cardStackButton.removeImage();
            } else {
                // TODO: Test if Discard Stack is buggy - alert triggers even though card can't be placed
                createPopupDialog(scene.gameData, "This card can be played and therefore must not be discarded");
            }

            this.setInteractive(true);
        });
    }
}