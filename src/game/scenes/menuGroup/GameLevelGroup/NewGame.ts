import { Scene } from "phaser";
import { MainMenuButton } from "../../../UI/menu/buttonGroup/menuButtonComponent/menuButtonComponent";
import { ButtonLevelData, GifButtonLevelData } from "../../../constant/levelMenu/levelMenu";
import { MainMenuAnimationButton } from "../../../UI/menu/buttonGroup/menuAnimationButtonComponent/menuAnimationButtonComponent";

export class NewGame extends Scene {

    constructor () {
        super('NewGame');
    }
    preload() {
        GifButtonLevelData.forEach((buttonData) => {
            this.load.atlas(buttonData.name, buttonData.texture, buttonData.json);
        });
    }

    create () {
        ButtonLevelData.forEach((buttonData) => {
            this.add.existing(new MainMenuButton({
                scene: this,
                x: buttonData.positionX,
                y: buttonData.positionY,
                text: buttonData.text,
                to: buttonData.to,
            }));
        });
        GifButtonLevelData.forEach((buttonData) => {
            new MainMenuAnimationButton({
                scene: this,
                ...buttonData,
            });
        });
    }
}
