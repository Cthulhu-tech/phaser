import { Scene } from 'phaser';
import { ButtonSettingData } from '../../../constant/settingMenu/settingMenu';
import { MainMenuButton } from '../../../UI/menu/buttonGroup/menuButtonComponent/menuButtonComponent';

export class Settings extends Scene {

    constructor () {
        super('Setting');
    }

    create () {
        ButtonSettingData.forEach((buttonData) => {
            this.add.existing(new MainMenuButton({
                scene: this,
                x: buttonData.positionX,
                y: buttonData.positionY,
                text: buttonData.text,
                to: buttonData.to,
            }));
        });
    }
}
