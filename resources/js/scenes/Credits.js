// @ts-check
import { CenterMenuButton } from "../elements/buttons.js";
import { fonts } from "../theme/fonts.js";
import { colours } from "../theme/colours.js";
import { openExternalLink } from "../util.js"

export default class Credits extends Phaser.Scene {
    constructor() {
        super({key: "Credits"});
    }

    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.events.on('shutdown', this.shutdown, this);

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background"));
        this.add.rectangle(this.x, this.y*0.2, this.width*0.2, this.height*0.15, colours.get("toolbar"));
        this.add.text(this.x, this.y*0.2, "Credits", fonts.get("h2")).setOrigin(0.5);

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
        this.link1 = this.add.text(this.x*0.35, this.y*0.63, text, columnTextCenter).setOrigin(0.5, 0);
        this.link1.on("pointerup", () => { openExternalLink("http://howtofailyourresearchdegree.com/"); });
        this.link1.on("pointerover", () => { this.link1.setColor("#FFFFFF"); });
        this.link1.on("pointerout", () => { this.link1.setColor("#000000"); });
        this.link1.setInteractive();

        text = "An interactive educational game aimed at PHD students at the start of their degree with the aim of making them aware of the many difficulties and pitfalls you might encounter, presented in a fun and lighthearted context.";
        this.add.text(this.x*0.35, this.y*0.8, text, columnTextJustify).setOrigin(0.5, 0);

        // Column 2
        text = "Digital version created by:\nCheuk Chung\nOliver Billich\nSolaris Li\nThomas Bidaut";
        this.add.text(this.x, this.y*0.55, text, columnTextCenter).setOrigin(0.5, 0);

        text = "- Original GitLab instance -";
        this.link2 = this.add.text(this.x, this.y*1.0, text, columnTextCenter).setOrigin(0.5, 0);
        this.link2.on("pointerup", () => { openExternalLink("https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs01/cs01-main"); });
        this.link2.on("pointerover", () => { this.link2.setColor("#FFFFFF"); });
        this.link2.on("pointerout", () => { this.link2.setColor("#000000"); });
        this.link2.setInteractive();

        text = "- Public GitHub clone -";
        this.link3 = this.add.text(this.x, this.y*1.15, text, columnTextCenter).setOrigin(0.5, 0);
        this.link3.on("pointerup", () => { openExternalLink("https://github.com/MLOliverB/How-To-Fail-Your-Research-Degree"); });
        this.link3.on("pointerover", () => { this.link3.setColor("#FFFFFF"); });
        this.link3.on("pointerout", () => { this.link3.setColor("#000000"); });
        this.link3.setInteractive();

        this.add.rectangle(this.x, this.y*1.3, this.width*0.9, this.height*0.002, 0x000000);

        text = "Release XXXX"
        this.add.text(this.x, this.y*1.35, text, columnTextCenter).setOrigin(0.5, 0);

        text = "This work is licensed under CC BY-NC-SA 4.0";
        this.link4 = this.add.text(this.x, this.y*1.45, text, columnTextCenter).setOrigin(0.5, 0);
        this.link4.on("pointerup", () => { openExternalLink("https://creativecommons.org/licenses/by-nc-sa/4.0/"); });
        this.link4.on("pointerover", () => { this.link4.setColor("#FFFFFF"); });
        this.link4.on("pointerout", () => { this.link4.setColor("#000000"); });
        this.link4.setInteractive();

        // Column 3
        text = "Reworked version created by:\nOliver Billich";
        this.add.text(this.x*1.65, this.y*0.55, text, columnTextCenter).setOrigin(0.5, 0);

        text = "More info\n(GitHub)";
        this.link5 = this.add.text(this.x*1.65, this.y*0.9, text, columnTextCenter).setOrigin(0.5, 0);
        this.link5.setFontSize(50);
        this.link5.on("pointerup", () => { openExternalLink("https://github.com/MLOliverB/Reworked-How-To-Fail-Your-Research-Degree"); });
        this.link5.on("pointerover", () => { this.link5.setColor("#FFFFFF"); });
        this.link5.on("pointerout", () => { this.link5.setColor("#000000"); });
        this.link5.setInteractive();
        this.box = this.add.rectangle(this.x*1.65, this.y*1.0, this.width*0.1, this.height*0.12, 0x000000);
        this.box.setFillStyle(0x000000, 0);
        this.box.setStrokeStyle(this.width*0.002, 0x000000);

        new CenterMenuButton(this, 1.75, "Back to Main Menu", fonts.get("h3"), () => { this.scene.start("MainMenu") });
    }

    shutdown() {
        // Clear keyboard events, otherwise they'll stack up when MainMenu is re-run
        this.input.keyboard.shutdown();
    }
}