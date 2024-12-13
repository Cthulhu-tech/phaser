import { IButton } from "./type";

export class TextButton extends Phaser.GameObjects.Text {
    constructor({ scene, x, y, text, style, to }: IButton) {
    super(scene, x, y, text, style);

    this.setInteractive({ useHandCursor: true })
        .on('pointerover', this.enterButtonHoverState)
        .on('pointerout', this.enterButtonRestState)
        .on('pointerdown', () => this.enterButtonActiveState(scene, to))
        .on('pointerup', this.enterButtonHoverState);
    }

    enterButtonHoverState() {
        this.setStyle({ fill: '#ff0'});
    }

    enterButtonRestState() {
        this.setStyle({ fill: '#0f0'});
    }

    enterButtonActiveState(sceneData: Phaser.Scene, to: string) {
        this.setStyle({ fill: '#0ff' });
        sceneData.scene.switch(to);
    }
}