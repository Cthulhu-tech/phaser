import { Scene } from 'phaser';

import { EventBus } from '../../EventBus';
import { MainMenuButton } from '../../UI/menu/buttonGroup/menuButtonComponent/menuButtonComponent';
import { ButtonMenuData } from '../../constant/mainMenu/screenButton';

export class MainMenu extends Scene
{
    constructor () {
        super('MainMenu');
    }

    create () {
        ButtonMenuData.forEach((buttonData) => {
            this.add.existing(new MainMenuButton({
                scene: this,
                x: buttonData.positionX,
                y: buttonData.positionY,
                text: buttonData.text,
                to: buttonData.to,
            }));
        });
        
        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene () {
        this.scene.start('Game');
    }
}
