import { CardBox, CardBoxSwapper } from "../cards/activityCards";
import { COLOURS, FONTS, stageNames } from "../constants";
import { CardStackButton, ToolbarButton } from "../elements/buttons";
import { GameData } from "../GameData";
import { BidirectionalArray } from "../util";
import { BaseScene } from "./BaseScene";
import { TeamGameBoard } from "./TeamGameBoard";

export class TeamToolbar extends BaseScene {
    cardStackButton!: CardStackButton;
    continueButton!: ToolbarButton;
    startRoundButton!: ToolbarButton;
    
    currentStageText!: Phaser.GameObjects.Text;
    currentTeamText!: Phaser.GameObjects.Text;
    instructionText!: Phaser.GameObjects.Text;

    timer!: Phaser.Time.TimerEvent;

    constructor(gameData: GameData) {
        super(gameData, {key: "TeamToolbar"});
    }

    create() {
        super.create();

        // Toolbar background
        this.add.rectangle(this.x, this.y*1.95, this.width, this.height*0.2, COLOURS.toolbar);

        // CardStack Button
        this.cardStackButton = new CardStackButton(this, this.x, this.y*1.76, "+",
        () => {
            // TODO onClick separate cases for PLAN round and all other rounds

            if (this.gameData.teams[this.gameData.currentTeam].currentCard == 0) {
                let cardID = this.gameData.activityCardStack.pop();
                this.gameData.teams[this.gameData.currentTeam].currentCard = cardID;
                this.cardStackButton.setImage(`card_${cardID}`);
            }
        }); 

        // Continue Button
        this.continueButton = new ToolbarButton(this, this.x*1.85, this.y*1.875, this.width*0.14, this.height*0.1, "Continue",
        () => {
            this.continueButton.setInteractive(false);
            this.gameData.allowSwap = null;
            this.instructionText.destroy();
            this.next();
            // TODO onClick
        });

        // Work Late Tile Button
        //

        // Discard Button
        //

        // Stage Indicator
        this.currentStageText = this.add.text(this.x*0.05, this.y*0.04, `Stage: ${this.gameData.stage}`, FONTS.button).setFontSize(70);
		

        // Team Indicator
        this.currentTeamText = this.add.text(this.x*0.05, this.y*0.18, `Team: ${this.gameData.currentTeam+1}`, FONTS.button).setFontSize(70);

        // Timer
        //        

        // Facilitator Mode Button
        //

        // Start Round Button
        this.startRoundButton = new ToolbarButton(this, this.x, this.y*0.13, this.width*0.2, this.height*0.12, "Start PLAN Round",
        () => {
            console.log(`Starting PLAN round - Team ${this.gameData.currentTeam+1}`);
            this.startRoundButton.destroy();
            this.instructionText = this.add.text(this.x, this.y*0.13, `Place down ${this.gameData.planCards} PLAN tiles`, FONTS.button).setOrigin(0.5).setFontSize(60);
            this.cardStackButton.setInteractive(true);

            let planCards = new BidirectionalArray<CardBox>()
            this.gameData.teams[this.gameData.currentTeam].cards.push(planCards);

            for (let i = -1; i >= -Math.floor(this.gameData.planCards/2); i--) {
                planCards.pushLeft(new CardBox(this.gameData.teams[this.gameData.currentTeam].scene, this.gameData, i));
            }

            for (let i = 0; i < this.gameData.planCards - Math.floor(this.gameData.planCards/2); i++) {
                planCards.pushRight(new CardBox(this.gameData.teams[this.gameData.currentTeam].scene, this.gameData, i));
            }
        });
        this.startRoundButton.setInteractive(true);
    }


    private next() {
        this.cardStackButton.removeImage();
        this.gameData.teams[this.gameData.currentTeam].currentCard = 0;
        if (this.gameData.currentTeam == this.gameData.numberOfTeams-1) {
            this.gameData.currentTeam = 0;
            this.gameData.stage++;
            this.currentStageText.setText(`Stage: ${this.gameData.stage}`);
            this.currentTeamText.setText(`Team: ${this.gameData.currentTeam+1}`);
            this.nextStage();
        } else {
            this.gameData.currentTeam++;
            this.currentStageText.setText(`Stage: ${this.gameData.stage}`);
            this.currentTeamText.setText(`Team: ${this.gameData.currentTeam+1}`);
            this.nextTeam();
        }
    }


    private nextTeam() {
        if (this.gameData.stage == 1) {
            this.startRoundButton = new ToolbarButton(this, this.x, this.y*0.13, this.width*0.2, this.height*0.12, "Start PLAN Round",
            () => {
                console.log(`Starting PLAN round - Team ${this.gameData.currentTeam+1}`);
                this.startRoundButton.destroy();
                this.instructionText = this.add.text(this.x, this.y*0.13, `Place down ${this.gameData.planCards} PLAN tiles`, FONTS.button).setOrigin(0.5).setFontSize(60);
                this.cardStackButton.setInteractive(true);

                let planCards = new BidirectionalArray<CardBox>();
                this.gameData.teams[this.gameData.currentTeam].cards.push(planCards);

                for (let i = -1; i >= -Math.floor(this.gameData.planCards/2); i--) {
                    planCards.pushLeft(new CardBox(this.gameData.teams[this.gameData.currentTeam].scene, this.gameData, i));
                }

                for (let i = 0; i < this.gameData.planCards - Math.floor(this.gameData.planCards/2); i++) {
                    planCards.pushRight(new CardBox(this.gameData.teams[this.gameData.currentTeam].scene, this.gameData, i));
                }
            });
            this.startRoundButton.setInteractive(true);
        } else {
            this.startRoundButton = new ToolbarButton(this, this.x, this.y*0.13, this.width*0.2, this.height*0.12, `Start ${stageNames[this.gameData.stage]} Round`,
            () => {
                console.log(`Starting ${stageNames[this.gameData.stage]} round - Team ${this.gameData.currentTeam+1}`);
                this.startRoundButton.destroy();
                this.instructionText = this.add.text(this.x, this.y*0.13, `Place down ${stageNames[this.gameData.stage]} tiles -( ${this.gameData.roundLength} s )-`, FONTS.button).setOrigin(0.5).setFontSize(60);

                let cardRow = new BidirectionalArray<CardBox>();
                this.gameData.teams[this.gameData.currentTeam].cards.push(cardRow);

                let previousRow = this.gameData.teams[this.gameData.currentTeam].cards[this.gameData.stage-2];

                for (let i = -1; i >= -previousRow.leftLength()-1; i--) {
                    cardRow.pushLeft(new CardBox(this.gameData.teams[this.gameData.currentTeam].scene, this.gameData, i));
                }

                for (let i = 0; i < previousRow.rightLength()+1; i++) {
                    cardRow.pushRight(new CardBox(this.gameData.teams[this.gameData.currentTeam].scene, this.gameData, i));
                }



                this.cardStackButton.setInteractive(true);
                this.continueButton.setInteractive(true);
                this.startTimer();
            });
            this.startRoundButton.setInteractive(true);
        }
    }


    private nextStage() {
        this.gameData.activityCardStack.clear();
        this.gameData.eventCardStack.clear();
        this.nextTeam();
    }


    private startTimer() {
        this.timer = this.time.addEvent({delay: 1000, repeat: this.gameData.roundLength-1, callback: TeamToolbar.updateTimerText, args: [this]});
    }


    private static updateTimerText(scene: TeamToolbar) {
        let timeRemaining = scene.timer.getOverallRemainingSeconds();
        if (timeRemaining == 0) {
            scene.instructionText.setText(`Place down ${stageNames[scene.gameData.stage]} tiles =( 0 s )=`);
            // TODO implement what happens after timer stops
            TeamToolbar.timerStop(scene);
        } else {
            scene.instructionText.setText(`Place down ${stageNames[scene.gameData.stage]} tiles -( ${timeRemaining} s )-`)
        }
    }


    private static timerStop(scene: TeamToolbar) {
        scene.cardStackButton.setInteractive(false);
    }
}