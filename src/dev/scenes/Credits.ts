import { COLOURS, FONTS, version } from "../constants";
import { CenterMenuButton } from "../elements/buttons";
import { GameData } from "../GameData";
import { openExternalLink } from "../util";
import { BaseScene } from "./BaseScene";

export class Credits extends BaseScene {

    constructor(gameData: GameData) {
        super(gameData, {key: "Credits"});
    }

    create() {
        super.create();

        this.add.rectangle(this.x, this.y, this.width, this.height, COLOURS.background);
        this.add.rectangle(this.x, this.y*0.2, this.width*0.2, this.height*0.15, COLOURS.toolbar);
        this.add.text(this.x, this.y*0.2, "Credits", FONTS.h2).setOrigin(0.5);

        let columnHeading =     {color: "#000000", fontFamily: "Bahiana", fontSize: "60px", align: "center", wordWrap: {width: 500}};
        let columnTextCenter =  {color: "#000000", fontFamily: "Bahiana", fontSize: "40px", align: "center", wordWrap: {width: 500}};
        let columnTextJustify = {color: "#000000", fontFamily: "Bahiana", fontSize: "40px", align: "justify", wordWrap: {width: 500}};

        let heading1 = `Original Board Game`;
        let heading2 = `First Digital Version`;
        let heading3 = `Reworked Version`;

        this.add.text(this.x*0.35, this.y*0.4, heading1, columnHeading).setOrigin(0.5, 0);
        this.add.text(this.x, this.y*0.4, heading2, columnHeading).setOrigin(0.5, 0);
        this.add.text(this.x*1.65, this.y*0.4, heading3, columnHeading).setOrigin(0.5, 0);

        // Column 1
        let text = "Physical board game Created by Daisy Abbott";
        this.add.text(this.x*0.35, this.y*0.55, text, columnTextCenter).setOrigin(0.5, 0);

        text = "- howtofailyourresearchdegree.com -"
        let link1 = this.add.text(this.x*0.35, this.y*0.63, text, columnTextCenter).setOrigin(0.5, 0);
        link1.on("pointerup", () => { openExternalLink("http://howtofailyourresearchdegree.com/"); });
        link1.on("pointerover", () => { link1.setColor("#FFFFFF"); });
        link1.on("pointerout", () => { link1.setColor("#000000"); });
        link1.setInteractive();

        text = "An interactive educational game aimed at PHD students at the start of their degree with the aim of making them aware of the many difficulties and pitfalls you might encounter, presented in a fun and lighthearted context.";
        this.add.text(this.x*0.35, this.y*0.8, text, columnTextJustify).setOrigin(0.5, 0);

        // Column 2
        text = "Digital version created by:\nCheuk Chung\nOliver Billich\nSolaris Li\nThomas Bidaut";
        this.add.text(this.x, this.y*0.55, text, columnTextCenter).setOrigin(0.5, 0);

        text = "- Original GitLab instance -";
        let link2 = this.add.text(this.x, this.y*1.0, text, columnTextCenter).setOrigin(0.5, 0);
        link2.on("pointerup", () => { openExternalLink("https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs01/cs01-main"); });
        link2.on("pointerover", () => { link2.setColor("#FFFFFF"); });
        link2.on("pointerout", () => { link2.setColor("#000000"); });
        link2.setInteractive();

        text = "- Public GitHub clone -";
        let link3 = this.add.text(this.x, this.y*1.15, text, columnTextCenter).setOrigin(0.5, 0);
        link3.on("pointerup", () => { openExternalLink("https://github.com/MLOliverB/How-To-Fail-Your-Research-Degree"); });
        link3.on("pointerover", () => { link3.setColor("#FFFFFF"); });
        link3.on("pointerout", () => { link3.setColor("#000000"); });
        link3.setInteractive();

        this.add.rectangle(this.x, this.y*1.3, this.width*0.9, this.height*0.002, 0x000000);

        text = `Local Multiplayer Release ${version}`
        this.add.text(this.x, this.y*1.35, text, columnTextCenter).setOrigin(0.5, 0);

        text = "This work is licensed under CC BY-NC-SA 4.0";
        let link4 = this.add.text(this.x, this.y*1.45, text, columnTextCenter).setOrigin(0.5, 0);
        link4.on("pointerup", () => { openExternalLink("https://creativecommons.org/licenses/by-nc-sa/4.0/"); });
        link4.on("pointerover", () => { link4.setColor("#FFFFFF"); });
        link4.on("pointerout", () => { link4.setColor("#000000"); });
        link4.setInteractive();

        // Column 3
        text = "Reworked version created by:\nOliver Billich";
        this.add.text(this.x*1.65, this.y*0.55, text, columnTextCenter).setOrigin(0.5, 0);

        text = "More info\n(GitHub)";
        let link5 = this.add.text(this.x*1.65, this.y*0.9, text, columnTextCenter).setOrigin(0.5, 0);
        link5.setFontSize(50);
        link5.on("pointerup", () => { openExternalLink("https://github.com/MLOliverB/Reworked-How-To-Fail-Your-Research-Degree"); });
        link5.on("pointerover", () => { link5.setColor("#FFFFFF"); });
        link5.on("pointerout", () => { link5.setColor("#000000"); });
        link5.setInteractive();
        let box = this.add.rectangle(this.x*1.65, this.y*1.0, this.width*0.1, this.height*0.12, 0x000000);
        box.setFillStyle(0x000000, 0);
        box.setStrokeStyle(this.width*0.002, 0x000000);

        new CenterMenuButton(this, 1.75, "Back to Main Menu", FONTS.h3, () => { this.scene.start("MainMenu") });
    }
}