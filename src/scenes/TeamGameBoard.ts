import GameData from "../GameData";
import BaseScene from "./BaseScene";

export default class TeamGameBoard extends BaseScene {
    constructor(gameData: GameData, key: string) {
        super(gameData, {key: key});
    }

    create() {
        super.create();
    }
}