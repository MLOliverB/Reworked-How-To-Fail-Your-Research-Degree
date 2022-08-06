import { COLOURS, FONTS, GAME_WIDTH } from "../constants";
import { GameData } from "../GameData";
import { TeamGameBoard } from "../scenes/TeamGameBoard";
import { Connectivity, GameActivityCard, stageT } from "./types";

export class CardBox {
    box: Phaser.GameObjects.Rectangle;
    text: Phaser.GameObjects.Text;

    gameData: GameData;
    gameBoard: TeamGameBoard;
    
    team: number;
    stage: stageT;
    index: number;

    cardID: number;
    hasWorkLate: boolean; // TODO: WorkLate tile logic

    image!: Phaser.GameObjects.Image;

    constructor(gameBoard: TeamGameBoard, gameData: GameData, index: number) {
        this.gameData = gameData;
        this.gameBoard = gameBoard;

        this.team = gameData.currentTeam;
        this.stage = gameData.stage;
        this.index = index;

        this.cardID = 0;
        this.hasWorkLate = false;

        let xPos = gameBoard.x*(1.1125+0.225*index);
        let yPos = gameBoard.y*(1.64-(0.31*this.stage));
        this.box = gameBoard.add.rectangle(xPos, yPos, gameBoard.width*0.108, gameBoard.height*0.136, COLOURS.card);

        // Zoom out camera if necessary
        let negBound = -(gameBoard.cameras.main.displayWidth/2);
        let posBound = (gameBoard.cameras.main.displayWidth/2);

        let negBoxBound = (xPos-(gameBoard.width*0.108)/2)-(GAME_WIDTH/2);
        let posBoxBound = (xPos+(gameBoard.width*0.108)/2)-(GAME_WIDTH/2);

        if (negBoxBound < negBound || posBoxBound > posBound) {
            let oldZoom = this.gameBoard.cameras.main.zoom
            this.gameBoard.cameras.main.setZoom(oldZoom*0.85, oldZoom*0.85);
        }

        this.box.setInteractive();
        this.box.on("pointerover", () => {
            if (!gameData.isElementsInteractive) return;
            this.box.setFillStyle(COLOURS.cardHover);
            // if (this.scene.gameData.teamToolbar.blockedOut && this.testBlock) { this.box.setFillStyle(0x898989); }
        });
		this.box.on("pointerout", () => {
            if (!gameData.isElementsInteractive) return;
            this.box.setFillStyle(COLOURS.card);
            // if (this.scene.gameData.teamToolbar.blockedOut && this.testBlock) { this.box.setFillStyle(0xafafaf); }
        });
		this.box.on("pointerup", () => {
            if (!gameData.isElementsInteractive) return;
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
                    if (this.gameData.teamToolbar.discardButton) this.gameData.teamToolbar.discardButton.setInteractive(true);
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



export function isDiscardable(gameData: GameData, team: number): boolean {
    // All cards in PLAN stage are always playable - so not discardable
    // If no card is currently held, can't discard by default
    if (gameData.stage == 1 || gameData.teams[team].currentCard == 0) {
        return false;
    }

    let currentRow = gameData.teams[team].cards[gameData.stage-1];
    let previousRow = gameData.teams[team].cards[gameData.stage-2];

    // Put all indexes of empty card boxes into an array freePositions
    let freePositions: number[] = [];
    currentRow.getIndexes().forEach((val) => {
        if (currentRow.get(val).cardID == 0) {
            freePositions.push(val);
        }
    });

    let currentCardID = gameData.teams[team].currentCard;
    let currentCard: GameActivityCard = gameData.activityCardMap.get(currentCardID);
    let currentCardConnectivity = currentCard.connectivity;

    let defaultConnectivity: Connectivity = {left: true, right: true, up: true, down: true};

    while (freePositions.length > 0) {
        let ix = freePositions.pop();
        if (ix == undefined) {
            ix = 0;
        }
        
        let leftCardID = (currentRow.leftIndex() <= ix-1) ? currentRow.get(ix-1).cardID : 0;
        let rightCardID = (currentRow.rightIndex() >= ix+1) ? currentRow.get(ix+1).cardID : 0;
        let bottomCardID = (previousRow.leftIndex() <= ix && previousRow.rightIndex() >= ix) ? previousRow.get(ix).cardID : 0;

        let leftCard: GameActivityCard | null = gameData.activityCardMap.has(leftCardID) ? gameData.activityCardMap.get(leftCardID) : null;
        let rightCard: GameActivityCard | null = gameData.activityCardMap.has(rightCardID) ? gameData.activityCardMap.get(rightCardID) : null;
        let bottomCard: GameActivityCard | null = gameData.activityCardMap.has(bottomCardID) ? gameData.activityCardMap.get(bottomCardID) : null;

        let leftCardConnectivity = (leftCard == null) ? defaultConnectivity : leftCard.connectivity;
        let rightCardConnectivity = (rightCard == null) ? defaultConnectivity : rightCard.connectivity;
        let bottomCardConnectivity = (bottomCard == null) ? defaultConnectivity : bottomCard.connectivity;

        // Check if an work-late tile is overlaid - if so then the card is automatically connected to all sides
        leftCardConnectivity = (leftCard != null && currentRow.get(ix-1).hasWorkLate) ? defaultConnectivity : leftCardConnectivity;
        rightCardConnectivity = (rightCard != null && currentRow.get(ix+1).hasWorkLate) ? defaultConnectivity : rightCardConnectivity;
        bottomCardConnectivity = (bottomCard != null && previousRow.get(ix).hasWorkLate) ? defaultConnectivity : bottomCardConnectivity;


        // For each direction (left, right, bottom), check if the connections of the cards line up
        let leftAligned = (leftCard == null) ? true : (leftCardConnectivity.right == currentCardConnectivity.left);
        let rightAligned = (rightCard == null) ? true : (rightCardConnectivity.left == currentCardConnectivity.right);
        let bottomAligned = (bottomCard == null) ? true : (bottomCardConnectivity.up == currentCardConnectivity.down);

        // For each direction (left, right, bottom), check if the card is actually connected in that direction
        let leftConnected = (leftCard == null) ? false : (leftCardConnectivity.right && currentCardConnectivity.left);
        let rightConnected = (rightCard == null) ? false : (rightCardConnectivity.left && currentCardConnectivity.right);
        let bottomConnected = (bottomCard == null) ? false : (bottomCardConnectivity.up && currentCardConnectivity.down);

        console.group(`Position (${gameData.stage}, ${ix})`);
        console.log(`| ${(leftCardConnectivity.up ? '^' : 'x')}   ${(currentCardConnectivity.up ? '^' : 'x')}   ${(rightCardConnectivity.up ? '^' : 'x')} |${(leftCard != null && currentRow.get(ix-1).hasWorkLate) ? ' Left Card Work Late' : (leftCard != null) ? ' Left Card Normal' : ' No Left Card'}\n|${(leftCardConnectivity.left ? '<' : 'x')}L${(leftCardConnectivity.right ? '>' : 'x')} ${(currentCardConnectivity.left ? '<' : 'x')}C${(currentCardConnectivity.right ? '>' : 'x')} ${(rightCardConnectivity.left ? '<' : 'x')}R${(rightCardConnectivity.right ? '>' : 'x')}|${(rightCard != null && currentRow.get(ix+1).hasWorkLate) ? ' Right Card Work Late' : (rightCard != null) ? ' Right Card Normal' : ' No Right Card'}\n| ${(leftCardConnectivity.down ? 'v' : 'x')}   ${(currentCardConnectivity.down ? 'v' : 'x')}   ${(rightCardConnectivity.down ? 'v' : 'x')} |${(bottomCard != null && previousRow.get(ix).hasWorkLate) ? ' Bottom Card Work Late' : (bottomCard != null) ? ' Bottom Card Normal' : ' No Bottom Card'}\n|     ${(bottomCardConnectivity.up ? '^' : 'x')}     |\n|    ${(bottomCardConnectivity.left ? '<' : 'x')}B${(bottomCardConnectivity.right ? '>' : 'x')}    |\n|     ${(bottomCardConnectivity.down ? 'v' : 'x')}     |`);
        console.log(`Alignment - Left ${leftAligned}, Right ${rightAligned}, Bottom ${bottomAligned}`);
        console.log(`Connectivity - Left ${leftConnected}, Right ${rightConnected}, Bottom ${bottomConnected}`);
        console.groupEnd();


        // If the card is placable in the current position, the user is not allowed to discard it
        // Else we check the next placement
        if (leftAligned && rightAligned && bottomAligned && (leftConnected || rightConnected || bottomConnected)) {
            console.log(`Card can be placed at ${gameData.stage} ${ix}`)
            return false;
        }
    }

    console.log("Card can't be placed")
    return true;
}