import { IAnimationButton } from "./type";

export class AnimationButton extends Phaser.Animations.AnimationManager {
    constructor({
        scene,
        name,
        end,
        zeroPad,
        repeat,
        frameRate,
    }: IAnimationButton) {
    super(scene.game);
        scene.anims.create({
            key: name,
            frames: scene.anims.generateFrameNames(name,
                {
                    prefix: name,
                    end,
                    zeroPad,
                }
            ),
            frameRate,
            repeat,
        });
    }
}
