import { CardBox, CardBoxSwapper } from "./cards/activityCards/CardBox";
import { parseEffect, parseLogicFunction } from "./cards/eventCards";
import { ActivityCard, Card, cardGroup, CardGroupGenerator, cardSlug, EventCard, GameActivityCard, GameEventCard, isCardGroup, isCardSlug, stageT } from "./cards/types";
import { QUANT_PLAN_TILES } from "./constants";
import { MainMenu } from "./scenes/MainMenu";
import { TeamGameBoard } from "./scenes/TeamGameBoard";
import { TeamToolbar } from "./scenes/TeamToolbar";
import { BidirectionalArray, mapGetOrElse, SelfReplenishingStack, UncheckedMap } from "./util";

interface TeamData {
    currentCard: number;
    lastPlacedCard: CardBox | null;
    cards: BidirectionalArray<CardBox>[],
    workLateTiles: number,
    eventCardsStored: GameEventCard[],
    activityCardsQueue: GameActivityCard[],
    scene: TeamGameBoard,
    keyName: string
}

export class GameData {
    game!: Phaser.Game;

    _roundLengthValues: number[];
    _eventCardsPerRoundValues: number[];
    _workLateTilesPerTeamValues: number[];

    _defaultRoundLengthIndex: number;
    _defaultEventCardsPerRoundIndex: number;
    _defaultWorkLateTilesPerTeamIndex: number;

    roundLength: number;
    totalEventCards: number;
    totalWorkLateTiles: number;
    planCards: number;

    numberOfTeams: number;

    activityCardMap: UncheckedMap<number, GameActivityCard>;
    eventCardMap: UncheckedMap<number, GameEventCard>;
    eventcardOffset: number;
    cardGroupMap: UncheckedMap<cardGroup, Set<number>>;

    stage: stageT;
    currentTeam: number;
    teams: TeamData[];

    activityCardStack: SelfReplenishingStack<number>;
    eventCardStack: SelfReplenishingStack<number>;

    allowSwap: CardBoxSwapper | null;

    teamToolbar!: TeamToolbar;

    isElementsInteractive: boolean = true;

    constructor() {
        this._roundLengthValues = [15, 30, 60, 120, Infinity];
        this._eventCardsPerRoundValues = [0, 1, 2, 3, 4, 5];
        this._workLateTilesPerTeamValues = [0, 1, 2, 3, 4];

        this._defaultRoundLengthIndex = 1;
        this._defaultEventCardsPerRoundIndex = 0;
        this._defaultWorkLateTilesPerTeamIndex = 4;

        this.roundLength = -1;
        this.totalEventCards = -1;
        this.totalWorkLateTiles = -1;
        this.planCards = QUANT_PLAN_TILES;

        this.numberOfTeams = -1;

        this.activityCardMap = new UncheckedMap();
        this.eventCardMap = new UncheckedMap();
        this.eventcardOffset = -1;
        this.cardGroupMap = new UncheckedMap();

        this.stage = 1;
        this.currentTeam = 0;
        this.teams = [];

        // Self Refilling activity card stack which takes cards from the current stage
        this.activityCardStack = new SelfReplenishingStack<number>(() => {
            let stack: number[] = [];
            this.activityCardMap.forEach((card) => {
                for (let i = 0; i < card.frequency; i++) {
                    if (card.stage == this.stage) stack.push(card.id);
                }
            });
            return stack;
        }, true);

        // Self Refilling event card stack which takes cards from the current stage
        this.eventCardStack = new SelfReplenishingStack<number>(() => {
            let stack: number[] = [];
            this.eventCardMap.forEach((card) => {
                if (card.stage == this.stage) stack.push(card.id);
            });
            return stack;
        }, true);

        this.allowSwap = null;
    }


    async _startGame(mainMenuScene: MainMenu) {
        let startGameButton = mainMenuScene.buttonMap.get("Start Game");
        if (startGameButton != undefined) {
            startGameButton.buttonText.setText("Starting...");
        }

        // Load card json files
        let cardData = await this._loadCardData();

        // Parse json files
        this._parseCards(cardData);

        // Load card images
        await this._loadCardImages();

        // Set game options
        if (this.roundLength == -1) this.roundLength = this._roundLengthValues[this._defaultRoundLengthIndex];
        if (this.totalEventCards == -1) this.totalEventCards = this._eventCardsPerRoundValues[this._defaultEventCardsPerRoundIndex];
        if (this.totalWorkLateTiles == -1) this.totalWorkLateTiles = this._workLateTilesPerTeamValues[this._defaultWorkLateTilesPerTeamIndex];
        if (this.numberOfTeams == -1) this.numberOfTeams = 1;

        // Create data structures for each team
        for (let i = 0; i < this.numberOfTeams; i++) {
            this.teams.push({
                currentCard: 0,
                lastPlacedCard: null,
                cards: [],
                workLateTiles: this.totalWorkLateTiles,
                eventCardsStored: [],
                activityCardsQueue: [],
                scene: new TeamGameBoard(this, `Board${i}`, i),
                keyName: `Board${i}`
            });
            this.game.scene.add(`Board${i}`, this.teams[i].scene, false)
        }

        // Add the team toolbar
        this.teamToolbar = new TeamToolbar(this);
        this.game.scene.add("TeamToolbar", this.teamToolbar, false);
        this.game.scene.start("TeamToolbar");
        
        // Start the game board for each team
        for (let i = 0; i < this.numberOfTeams; i++) {
            this.game.scene.start(this.teams[i].keyName);
        }

        // Re-arrange the order of the scenes
        this.game.scene.bringToTop(this.teams[0].keyName);
        this.game.scene.bringToTop("TeamToolbar");
        for (let i = 1; i < this.numberOfTeams; i++) {
            this.game.scene.sendToBack(this.teams[i].keyName);
        }

        // Turn all game boards off expect the one of the first team invisible
        for (let i = 1; i < this.numberOfTeams; i++) {
            this.teams[i].scene.sys.setVisible(false);
        }

        // Remove obsolete scenes
        this.game.scene.remove("MainMenu");
        this.game.scene.remove("NumberOfTeams");
        this.game.scene.remove("Options");
    }


    async _loadCardData() {
        return await new Promise((resolve, reject) => {
            let received = [false, false, false];
            let result = [undefined, undefined, undefined];

            function logicMerge(arr: boolean[]): boolean {
                if (arr.length == 0) {
                    return false;
                } else {
                    let acc = arr[0];
                    arr.forEach(function(val, ix, arr) {
                        acc = acc && val;
                    });
                    return acc;
                }
                
            }

            let xhrActivityCards = new XMLHttpRequest();
            let xhrEventCards = new XMLHttpRequest();
            let xhrCardGroups = new XMLHttpRequest();

            xhrActivityCards.open("GET", "./resources/data/activity-cards.json");
            xhrEventCards.open("GET", "./resources/data/event-cards.json");
            xhrCardGroups.open("GET", "./resources/data/card-groups.json");

            xhrActivityCards.responseType = 'json';
            xhrEventCards.responseType = 'json';
            xhrCardGroups.responseType = 'json';

            xhrActivityCards.onload = function() {
                if (xhrActivityCards.status != 200) {
                    console.error(`Error ${xhrActivityCards.status}: ${xhrActivityCards.statusText}`);
                } else {
                    result[0] = xhrActivityCards.response;
                    received[0] = true;
                    if (logicMerge(received)) resolve(result);
                }
            };

            xhrEventCards.onload = function() {
                if (xhrEventCards.status != 200) {
                    console.error(`Error ${xhrEventCards.status}: ${xhrEventCards.statusText}`);
                } else {
                    result[1] = xhrEventCards.response;
                    received[1] = true;
                    if (logicMerge(received)) resolve(result);
                }
            };

            xhrCardGroups.onload = function() {
                if (xhrCardGroups.status != 200) {
                    console.error(`Error ${xhrCardGroups.status}: ${xhrCardGroups.statusText}`);
                } else {
                    result[2] = xhrCardGroups.response;
                    received[2] = true;
                    if (logicMerge(received)) resolve(result);
                }
            };

            xhrActivityCards.send();
            xhrEventCards.send();
            xhrCardGroups.send();
        });
    }


    _parseCards(cardData: any) {
        let activityCards: ActivityCard[] = cardData[0];
        let eventCards: EventCard[] = cardData[1];
        let cardGroups: object = cardData[2];
        let slugIDMap: Map<cardSlug, number> = new Map();

        this.eventcardOffset = activityCards.length+1;

        activityCards.forEach((val, ix, arr) => {
            slugIDMap.set(val.slug, ix+1);
        });

        eventCards.forEach((val, ix, arr) => {
            slugIDMap.set(val.slug, ix + this.eventcardOffset);
        });

        Object.entries(cardGroups).forEach((val: [string, (cardSlug | CardGroupGenerator)[]]) => {
            let cardGroupName = '$' + val[0];
            if (isCardGroup(cardGroupName)) {
                let idSet = new Set<number>();
                val[1].forEach((exp) => {
                    if (typeof exp == 'string' && isCardSlug(exp)) {
                        idSet.add(mapGetOrElse(slugIDMap, exp, -1));
                    } else if (typeof exp == 'object') {
                        let f = new Function("activityCards,eventCards", `return activityCards.filter(function(card){return ${exp.activityCardFilter}}).concat(eventCards.filter(function(card){return ${exp.eventCardFilter}}))`);
                        let generatorFilter = f(activityCards, eventCards);
                        generatorFilter.forEach((element: Card) => {
                            idSet.add(mapGetOrElse(slugIDMap, element.slug, -1));
                        });
                    }
                });
                this.cardGroupMap.set(cardGroupName, idSet);
            }
        })

        activityCards.forEach((val, ix, arr) => {
            let gameActivityCard: GameActivityCard = {
                id: mapGetOrElse<cardSlug, number>(slugIDMap, val.slug, -1),
                title: val.title,
                stage: val.stage,
                frequency: val.frequency,
                image: val.image,
                description: val.description,
                connectivity: {
                    left: val.connectivity.left,
                    right: val.connectivity.right,
                    up: val.connectivity.up,
                    down: val.connectivity.down,
                },
            }
            this.activityCardMap.set(gameActivityCard.id, gameActivityCard);
        });

        eventCards.forEach((val, ix, arr) => {
            let gameEventCard: GameEventCard = {
                id: mapGetOrElse<cardSlug, number>(slugIDMap, val.slug, -1),
                title: val.title,
                stage: val.stage,
                image: val.image,
                isOptional: val.isOptional,
                effect: parseEffect(val.effect, slugIDMap),
                elseCondition: parseLogicFunction(val.elseCondition, slugIDMap),
                elseEffect: parseEffect(val.elseEffect, slugIDMap),
            }
            this.eventCardMap.set(gameEventCard.id, gameEventCard);
        });
    }


    async _loadCardImages() {
        return await new Promise((resolve, reject) => {
            let mainMenuScene = this.game.scene.getScene("MainMenu");
            
            let loadList: ([string, string])[] = [];

            this.activityCardMap.forEach((val) => {
                loadList.push([`card_${val.id}`, `/resources/images/cards/${val.image}`]);
            });

            this.eventCardMap.forEach((val) => {
                loadList.push([`card_${val.id}`, `/resources/images/cards/${val.image}`]);
            });

            let loadListLength = loadList.length;
            let counter = 0;
            loadList.forEach((val) => {
                mainMenuScene.load.image(val[0], val[1]);
            })

            mainMenuScene.load.on('filecomplete', () => {
                counter++;
                if (counter == loadListLength) {
                    mainMenuScene.load.removeAllListeners('filecomplete');
                    resolve(null);
                }
            });

            mainMenuScene.load.start()
        });
    }


    public isInteractiveFunction(fn: () => void) {
        if (this.isElementsInteractive) {
            fn();
        }
    }
}