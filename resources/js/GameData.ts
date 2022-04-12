// @ts-check

export default class GameData {
    game: Phaser.Game;

    _roundLengthValues: number[];
    _eventCardsPerRoundValues: number[];
    _workLateTilesPerTeamValues: number[];

    _defaultRoundLengthIndex: number;
    _defaultEventCardsPerRoundIndex: number;
    _defaultWorkLateTilesPerTeamIndex: number;

    roundLength: number;
    totalEventCards: number;
    totalWorkLateTiles: number;

    numberOfTeams: number;
    cardMap;

    isCardsLoaded: boolean;
    isGameLoaded: boolean;
    isGameInit: boolean;

    stage: number;
    currentTeam: number;
    teams; // TODO
    teamToolbar: any; // TODO

    constructor() {
        this.game = undefined;

        this._roundLengthValues = [15, 30, 60, 120, Infinity];
        this._eventCardsPerRoundValues = [0, 1, 2, 3, 4, 5];
        this._workLateTilesPerTeamValues = [0, 1, 2, 3, 4];

        this._defaultRoundLengthIndex = 1;
        this._defaultEventCardsPerRoundIndex = 0;
        this._defaultWorkLateTilesPerTeamIndex = 4;

        this.roundLength = undefined;
        this.totalEventCards = undefined;
        this.totalWorkLateTiles = undefined;

        this.numberOfTeams = undefined;

        this.cardMap = new Map();
        this.cardMap.set(0, null);

        this.isCardsLoaded = false;
        this.isGameLoaded = false;
        this.isGameInit = false;

        this._getCards();
    }

    async _getCards() {
        // TODO: query the database for all the cards objects and add them to the cardMap based on id
        this._cardsLoaded() // This is called once all cards are loaded
    }

    /**
     * Function is called once all cards are loaded
     * If the actual game was already attempted to be initialized and the Phaser game object is loaded,
     * Then we were just waiting on the cards to fully load
     * Hence the game can now be initialized
     * Otherwise just flag that the cards are now fully loaded
     */
    _cardsLoaded() {
        this.isCardsLoaded = true;
        if (this.isGameLoaded && this.isGameInit) {
            this.gameInit();
        }
    }

    /**
     * Function is called once the Phaser game is fully loaded
     * If the actual game was already attempted to be initialized and the cards are already fully loaded,
     * Then we were just waiting on the Phaser game to fully load (I don't think this can actually happen, but you never know)
     * Hence the game now be initialized
     * Otherwise just flag that the Phaser game is now fully loaded
     */
    _gameLoaded() {
        this.isGameLoaded = true;
        if (this.isCardsLoaded && this.isGameInit) {
            this.gameInit();
        }
    }

    /**
     * This function is called once the facilitator chooses to start the game
     * From this, the game boards are generated according to the number of teams specified
     */
    gameInit() {
        // If the cards or the game are not yet fully loaded then don't initialize yet
        // _cardsLoaded() and _gameLoaded ensure that this function will be called again once everything else is loaded
        if (!(this.isCardsLoaded && this.isGameLoaded)) {
            this.isGameInit = true;
            return;
        }

        this.stage = 1;
        this.currentTeam = 0;
        this.teams = [];

        if (this.roundLength == undefined) this.roundLength = this._roundLengthValues[this._defaultRoundLengthIndex];
        if (this.totalEventCards == undefined) this.totalEventCards = this._eventCardsPerRoundValues[this._defaultEventCardsPerRoundIndex];
        if (this.totalWorkLateTiles == undefined) this.totalWorkLateTiles = this._workLateTilesPerTeamValues[this._defaultWorkLateTilesPerTeamIndex];

        if (this.numberOfTeams == undefined) this.numberOfTeams = 1;

        for (let i = 0; i < this.numberOfTeams; i++) {
            this.teams.push({
                cards: [],
                addCardBoxes: [],
                workLateTiles: this.totalWorkLateTiles,
                eventCardsStored: [],
                activityCardsQueue: [],
            });
            let keyName = `board${i}`
            this.teams[i].scene = this.game.scene.add(keyName, undefined, false);   // TODO Replace undefined with the teamGameBoard class
            this.teams[i].keyName = keyName;
        }

        this.teamToolbar = this.game.scene.add("teamToolbar", undefined, false);    // TODO Replace undefined with the teamToolbar class

        this.game.scene.start("teamToolbar");
        
        for (let i = 0; i < this.numberOfTeams; i++) {
            this.game.scene.start(this.teams[i].keyName);
        }

        // Re-arrange the order of the scenes
        this.game.scene.bringToTop(this.teams[0].keyName);
        this.game.scene.bringToTop("teamToolbar");
        for (let i = 1; i < this.numberOfTeams; i++) {
            this.game.scene.sendToBack(this.teams[i].keyName);
        }

        // Turn all game boards expect the one of the first team invisible
        for (let i = 1; i < this.numberOfTeams; i++) {
            this.teams[i].scene.sys.setVisible(false);
        }

        this.game.scene.remove("mainMenu");
        this.game.scene.remove("numberOfTeams");
        this.game.scene.remove("options");
    }
}