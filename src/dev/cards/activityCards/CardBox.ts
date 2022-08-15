import { COLOURS, FONTS, GAME_WIDTH } from "../../constants";
import { GameData } from "../../GameData";
import { TeamGameBoard } from "../../scenes/TeamGameBoard";
import { stageT } from "../types";

/**
 * The primitive element for displaying an activity card on the game board.
 *
 * @author Oliver Billich
 */
export class CardBox {

    readonly gameData: GameData; // Global Gamedata instance
    readonly gameBoard: TeamGameBoard; // The game board on which the CardBox is placed

    readonly stage: stageT; // The stage to which the CardBox belongs
    readonly index: number; // The index at which the CardBox is placed (pos/neg)

    readonly xPos: number; // x-Position of the CardBox
    readonly yPos: number; // y-Position of the CardBox

    readonly box: Phaser.GameObjects.Rectangle; // The rectangle for this CardBox that will be drawn on the game board scene
    readonly text: Phaser.GameObjects.Text; // Text shown on the CardBox
    
    private cardID: number; // The ID of the card held by the CardBox. Not a unique identifier
    private image!: Phaser.GameObjects.Image; // The image showing the placed down tile

    private workLate: boolean; // TODO: WorkLate tile logic
    private workLateImage!: Phaser.GameObjects.Image; // The image showing the overlaid work-late tile


    /**
     * Creates a new CardBox.
     * @param gameBoard The game board on which the CardBox will be placed.
     * @param gameData The global gameData instance.
     * @param index The index at which this CardBox will be placed down at the current stage.
     */
    constructor(gameBoard: TeamGameBoard, gameData: GameData, index: number) {
        this.gameData = gameData;
        this.gameBoard = gameBoard;

        this.stage = gameData.stage;
        this.index = index;

        this.xPos = gameBoard.x * (1.1125 + 0.225 * index);
        this.yPos = gameBoard.y * (1.64 - (0.31 * this.stage));

        this.cardID = 0;
        
        this.workLate = false;

        this.box = gameBoard.add.rectangle(this.xPos, this.yPos, gameBoard.width * 0.108, gameBoard.height * 0.136, COLOURS.card);
        this.text = gameBoard.add.text(this.xPos, this.yPos, "Place Card", FONTS.button).setOrigin(0.5);

        {   // Zoom out camera if necessary
            let negBound = -(gameBoard.cameras.main.displayWidth / 2);
            let posBound = (gameBoard.cameras.main.displayWidth / 2);

            let negBoxBound = (this.xPos - (gameBoard.width * 0.108) / 2) - (GAME_WIDTH / 2);
            let posBoxBound = (this.xPos + (gameBoard.width * 0.108) / 2) - (GAME_WIDTH / 2);

            if (negBoxBound < negBound || posBoxBound > posBound) {
                this.gameBoard.zoomOut();
            }
        }
        

        this.box.setInteractive();

        this.box.on("pointerover", () => { gameData.isInteractiveFunction(() => {
            this.box.setFillStyle(COLOURS.cardHover);
        })});

        this.box.on("pointerout", () => { gameData.isInteractiveFunction(() => {
            this.box.setFillStyle(COLOURS.card);
        })});

        this.box.on("pointerup", () => { gameData.isInteractiveFunction(() => {
            if (this.gameData.allowSwap == null) {
                // Just act normally by either putting back on cardStack or not
                if (gameData.teams[this.gameBoard.teamNumber].currentCard != 0 && this.cardID == 0) {
                    gameData.teamToolbar.cardStackButton.removeImage();
                    this.setCard(gameData.teams[this.gameBoard.teamNumber].currentCard);
                    gameData.teams[this.gameBoard.teamNumber].currentCard = 0;
                    gameData.teams[this.gameBoard.teamNumber].lastPlacedCard = this;
                    gameData.teamToolbar.cardStackButton.cardUsed();

                    if (this.gameData.stage != 1) {
                        let newCardBox = null;
                        if (this.index == -this.gameData.teams[this.gameBoard.teamNumber].cards[this.gameData.stage - 1].leftLength()) {
                            newCardBox = new CardBox(this.gameBoard, this.gameData, this.index - 1);
                            this.gameData.teams[this.gameBoard.teamNumber].cards[this.gameData.stage - 1].pushLeft(newCardBox);
                        } else if (this.index == this.gameData.teams[this.gameBoard.teamNumber].cards[this.gameData.stage - 1].rightLength() - 1) {
                            newCardBox = new CardBox(this.gameBoard, this.gameData, this.index + 1);
                            this.gameData.teams[this.gameBoard.teamNumber].cards[this.gameData.stage - 1].pushRight(newCardBox);
                        }
                    }
                } else if (gameData.teams[this.gameBoard.teamNumber].currentCard == 0 && this.cardID != 0 && gameData.teams[this.gameBoard.teamNumber].lastPlacedCard != null && gameData.teams[this.gameBoard.teamNumber].lastPlacedCard == this) {
                    gameData.teams[this.gameBoard.teamNumber].lastPlacedCard = null;
                    gameData.teams[this.gameBoard.teamNumber].currentCard = this.removeCard();
                    gameData.teamToolbar.cardStackButton.setImage(`card_${gameData.teams[this.gameBoard.teamNumber].currentCard}`);
                    if (this.gameData.teamToolbar.discardButton)
                        this.gameData.teamToolbar.discardButton.setInteractive(true);
                }
            } else {
                // Select or deselect for swapping
                this.gameData.allowSwap.toggle(this);
            }
        })});

        
    }

    /**
     * Updates the card being held by this card box.
     * This encompasses updated the card ID and the image shown on the card box.
     * @param cardID 
     * @returns True if the card could be set correctly, False if the image corresponding to the given card ID could not be loaded.
     */
    public setCard(cardID: number): boolean {
        this.cardID = cardID;
        this.text.setText(`${cardID}`);

        let xPos = this.gameBoard.x * (1.1125 + 0.225 * this.index);
        let yPos = this.gameBoard.y * (1.64 - (0.31 * this.stage));

        if (this.image != undefined) {
            this.image.destroy();
        }

        if (this.gameBoard.textures.exists(`card_${cardID}`)) {
            this.image = this.gameBoard.add.image(xPos, yPos, `card_${cardID}`).setScale(0.4);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Removes the card currently held by the card box along with the card image.
     * @returns The ID of the previously held card.
     */
    public removeCard(): number {
        let cardID = this.cardID;
        this.cardID = 0;
        this.text.setText("Place Card");

        if (this.image != undefined) {
            this.image.destroy();
        }

        return cardID;
    }

    /**
     * @returns The ID of the card currently held by this card box. 0 means that no card is currently held.
     */
    public getCardID(): number {
        return this.cardID;
    }

    /**
     * Overlays a Work-Late on top of the card held by this card box.
     * @returns False if there already is a Work-Late tile or no card is currently held by the card box, True otherwise.
     */
    public addWorkLate(): boolean {
        return false;
    }

    /**
     * Attempts to remove the Work-Late tile held by the card box.
     * @returns True if the Work-Late tile was removed, False if there was no Work-Late tile to remove.
     */
    public removeWorkLate(): boolean {
        return false;
    }

    /**
     * @returns True if the card box holds a Work-Late tile, False otherwise.
     */
    public hasWorkLate(): boolean {
        return this.workLate;
    }

    /**
     * 'Selects' the card box visually by drawing a border around the edge.
     * This is only changing how the card box is displayed and does not provide any further functionality.
     * @param bool True to select, False to de-select
     */
    public select(bool: boolean) {
        if (bool) {
            this.box.setStrokeStyle(5, COLOURS.black, 1);
        } else {
            this.box.setStrokeStyle();
        }
    }

    /**
     * A convenience function meant for debugging purposes that converts the instance with its attributes into a string.
     * @returns A compact string version of the card box instance conveying the most important information.
     */
    public toString(): string {
        return `CardBox{id:${this.cardID} workLate:${this.hasWorkLate()} ix:${this.index} team:${this.gameBoard.teamNumber} stage:${this.stage}}`;
    }
}



export class CardBoxSwapper {
    gameData: GameData

    candidate1: CardBox | null;
    candidate2: CardBox | null;

    constructor(gameData: GameData) {
        this.gameData = gameData;

        this.candidate1 = null;
        this.candidate2 = null;
    }

    toggle(cardBox: CardBox) {
        if (this.candidate1 == cardBox) {
            this.candidate1 = null;
            cardBox.select(false);
        } else if (this.candidate2 == cardBox) {
            this.candidate2 = null;
            cardBox.select(false);
        } else if (this.candidate1 == null) {
            this.candidate1 = cardBox;
            cardBox.select(true);
        } else {
            this.candidate2 = cardBox;
            cardBox.select(true);
        }

        if (this.candidate1 != null && this.candidate2 != null) {
            this._swap();
        }
    }

    private _swap() {
        if (this.candidate1 != null && this.candidate2 != null) {

            let tempCardID = this.candidate1.removeCard();
            this.candidate1.setCard(this.candidate2.removeCard());
            this.candidate2.setCard(tempCardID);

            let team = this.candidate1.gameBoard.teamNumber

            if (this.candidate1 == this.gameData.teams[team].lastPlacedCard) {
                this.gameData.teams[team].lastPlacedCard = this.candidate2;
            } else if (this.candidate2 == this.gameData.teams[team].lastPlacedCard) {
                this.gameData.teams[team].lastPlacedCard = this.candidate1;
            }

            this.candidate1.select(false);
            this.candidate2.select(false);

            this.candidate1 = null;
            this.candidate2 = null;
        }
    }
}