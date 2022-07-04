import { COLOURS, FONTS, GAME_WIDTH } from "../constants";
import { GameData } from "../GameData";
import { TeamGameBoard } from "../scenes/TeamGameBoard";
import { GameActivityCard, stageT } from "./types";

export class CardBox {
    box: Phaser.GameObjects.Rectangle;
    text: Phaser.GameObjects.Text;

    gameData: GameData;
    gameBoard: TeamGameBoard;
    
    team: number;
    stage: stageT;
    index: number;

    cardID: number;

    image!: Phaser.GameObjects.Image;

    constructor(gameBoard: TeamGameBoard, gameData: GameData, index: number) {
        this.gameData = gameData;
        this.gameBoard = gameBoard;

        this.team = gameData.currentTeam;
        this.stage = gameData.stage;
        this.index = index;

        this.cardID = 0;

        let xPos = gameBoard.x*(1.1125+0.225*index);
        let yPos = gameBoard.y*(1.64-(0.31*this.stage));
        this.box = gameBoard.add.rectangle(xPos, yPos, gameBoard.width*0.108, gameBoard.height*0.136, COLOURS.card);

        // Zoom out camera if necessary
        let negBound = -(gameBoard.cameras.main.displayWidth/2);
        let posBound = (gameBoard.cameras.main.displayWidth/2);

        let negBoxBound = (xPos-(gameBoard.width*0.108)/2)-(GAME_WIDTH/2);
        let posBoxBound = (xPos+(gameBoard.width*0.108)/2)-(GAME_WIDTH/2);

        if (negBoxBound < negBound || posBoxBound > posBound) {
            console.log("zoom");
            let oldZoom = this.gameBoard.cameras.main.zoom
            this.gameBoard.cameras.main.setZoom(oldZoom*0.75, oldZoom*0.75);
        }

        this.box.setInteractive();
        this.box.on("pointerover", () => {
            this.box.setFillStyle(COLOURS.cardHover);
            // if (this.scene.gameData.teamToolbar.blockedOut && this.testBlock) { this.box.setFillStyle(0x898989); }
        });
		this.box.on("pointerout", () => {
            this.box.setFillStyle(COLOURS.card);
            // if (this.scene.gameData.teamToolbar.blockedOut && this.testBlock) { this.box.setFillStyle(0xafafaf); }
        });
		this.box.on("pointerup", () => {
            if (this.gameData.allowSwap == null) {
                // Just act normally by either putting back on cardStack or not
                if (gameData.teams[this.team].currentCard != 0 && this.cardID == 0) {
                    gameData.teamToolbar.cardStackButton.removeImage();
                    this.cardID = gameData.teams[this.team].currentCard;
                    gameData.teams[this.team].currentCard = 0;
                    this.setImage(`card_${this.cardID}`);
                    gameData.teamToolbar.cardStackButton.cardUsed();

                    if (this.gameData.stage != 1) {
                        let newCardBox = null;
                        if (this.index == -this.gameData.teams[this.gameData.currentTeam].cards[this.gameData.stage-1].leftLength()) {
                            newCardBox = new CardBox(this.gameBoard, this.gameData, this.index-1);
                            this.gameData.teams[this.gameData.currentTeam].cards[this.gameData.stage-1].pushLeft(newCardBox);
                        } else if (this.index == this.gameData.teams[this.gameData.currentTeam].cards[this.gameData.stage-1].rightLength()-1) {
                            newCardBox = new CardBox(this.gameBoard, this.gameData, this.index+1);
                            this.gameData.teams[this.gameData.currentTeam].cards[this.gameData.stage-1].pushRight(newCardBox);
                        }
                    }
                } else if (gameData.teams[this.team].currentCard == 0 && this.cardID != 0) {
                    // TODO ensure that only the last placed down card can be picked up again
                    this.removeImage();
                    gameData.teams[this.team].currentCard = this.cardID;
                    this.cardID = 0;
                    gameData.teamToolbar.cardStackButton.setImage(`card_${gameData.teams[this.team].currentCard}`);
                }
            } else {
                // Select or deselect for swapping
                this.gameData.allowSwap.toggle(this);
            }
        });

        this.text = gameBoard.add.text(xPos, yPos, "Place Card", FONTS.button).setOrigin(0.5);
    }

    setImage(key: string) {
        let xPos = this.gameBoard.x*(1.1125+0.225*this.index);
        let yPos = this.gameBoard.y*(1.64-(0.31*this.stage));
        if (this.image != undefined) this.image.destroy();
        if (this.gameBoard.textures.exists(key)) {
            this.image = this.gameBoard.add.image(xPos, yPos, key).setScale(0.4);
        }
    }

    removeImage() {
        if (this.image != undefined) this.image.destroy();
    }

    toString(): string {
        return `CardBox{id:${this.cardID} ix:${this.index} team:${this.team} stage:${this.stage}}`;
    }

    static swapPosition(cardBox1: CardBox, cardBox2: CardBox) {
        if (cardBox1.gameBoard != cardBox2.gameBoard || cardBox1.team != cardBox2.team || cardBox1.stage != cardBox2.stage) {
            throw `Can't swap ${cardBox1.toString()} and ${cardBox2.toString()} since they are not in interchangeable positions`;
        }
        let temp = cardBox1.cardID;
        cardBox1.cardID = cardBox2.cardID;
        cardBox2.cardID = temp;
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
            this.deSelect(cardBox);
        } else if (this.candidate2 == cardBox) {
            this.candidate2 = null;
            this.deSelect(cardBox);
        } else if (this.candidate1 == null) {
            this.candidate1 = cardBox;
            this.select(cardBox);
        } else {
            this.candidate2 = cardBox;
            this.select(cardBox);
        }

        if (this.candidate1 != null && this.candidate2 != null) {
            this._swap();
        }
    }

    private select(cardBox: CardBox) {
        cardBox.box.setStrokeStyle(5, COLOURS.black, 1);
    }

    private deSelect(cardBox: CardBox) {
        cardBox.box.setStrokeStyle();
    }

    private _swap() {
        if (this.candidate1 != null && this.candidate2 != null) {
            let tempCardID = this.candidate1.cardID;

            this.candidate1.cardID = this.candidate2.cardID;

            this.candidate2.cardID = tempCardID;

            this.candidate1.removeImage();
            this.candidate2.removeImage();

            this.candidate1.setImage(`card_${this.candidate1.cardID}`);
            this.candidate2.setImage(`card_${this.candidate2.cardID}`);

            this.deSelect(this.candidate1);
            this.deSelect(this.candidate2);

            this.candidate1 = null;
            this.candidate2 = null;
        }
    }
}