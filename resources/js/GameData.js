// @ts-check

export default class GameData {
    constructor(callback) {
        this.game = undefined;

        this._roundLengthValues = [15, 30, 60, 120, Infinity];
        this._eventCardsPerRoundValues = [0, 1, 2, 3, 4, 5];
        this._workLateTilesPerTeamValues = [0, 1, 2, 3, 4];

        this._defaultRoundLengthIndex = 1;
        this._defaultEventCardsPerRoundIndex = 0;
        this._defaultWorkLateTilesPerTeamIndex = 4;

        this.roundLength = undefined;
        this.totalEventcards = undefined;
        this.totalWorkLateTiles = undefined;

        this.numberOfTeams = undefined;

        this.cardMap = new Map();
        this.cardMap.set(0, null);

        this.isCardsLoaded = false;
        this.isGameInit = false;

        this._getCards(callback);
    }

    async _getCards(callback) {
        // TODO: query the database for all the cards objects and add them to the cardMap based on id
        // Once this is done, call callback()
    }

    /**
     * This function is called once the facilitator chooses to start the game
     * From this, the game boards are generated according to the number of teams specified
     */
    _gameInit() {
        this.stage = 0;
        this.currentTeam = 0;
        this.teams = [];

        if (this.roundLength == undefined) this.roundLength = this._roundLengthValues[this._defaultRoundLengthIndex];
        if (this.totalEventcards == undefined) this.totalEventcards = this._eventCardsPerRoundValues[this._defaultEventCardsPerRoundIndex];
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