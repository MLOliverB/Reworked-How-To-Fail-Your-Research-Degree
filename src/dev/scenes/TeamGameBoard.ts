import { GameData } from "../GameData";
import { BaseScene } from "./BaseScene";

export class TeamGameBoard extends BaseScene {

    teamNumber: number;

    constructor(gameData: GameData, key: string, teamNumber: number) {
        super(gameData, {key: key});
        this.teamNumber = teamNumber;
    }

    create() {
        super.create();
    }


    public zoomOut() {
        let oldZoom = this.cameras.main.zoom;
        this.cameras.main.setZoom(oldZoom * 0.85, oldZoom * 0.85);
    }
}