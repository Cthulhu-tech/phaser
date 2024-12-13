import { Scene } from "phaser";
import { AnimationButton } from "./animationButton";
import { IMainMenuAnimationButton } from "./type";

export class MainMenuAnimationButton extends AnimationButton {
    button: Phaser.GameObjects.Sprite;
    constructor({ 
        scene,
        name,
        end,
        zeroPad,
        x,
        y,
        frameRate,
        to,
    }: IMainMenuAnimationButton) {

        super({ 
            scene,
            name,
            end,
            zeroPad,
            repeat: -1,
            frameRate,
        });

        this.button = scene.add
            .sprite(x, y, 'seacreatures')
            .play(name);
        this.pointerout();
        this.button.setInteractive();

        this.button.on('pointerover', () => this.pointerover(name));
        this.button.on('pointerout', () => this.pointerout());
        this.button.on('pointerdown', () => this.pointerdown(to, scene));
    }

    pointerover(name: string) {
        this.button.clearTint();
        this.button.play(name);
    }

    pointerout() {
        this.button.setTint(0xCCCCCC);
        this.button.anims.stop();
        this.button.setFrame(0);
    }
    
    pointerdown(to: string, scene: Scene) {
        scene.scene.switch(to);
    }
}
