import { waterType } from "./type";

export const waterAnimation = ({ tile, positionAnimation, scene, delay  }: waterType) => {
    scene.tweens.add({
        targets: tile,
        scale: 1,
        angle: 0,
        ease: 'easy',
        duration: 1000,
        delay: delay,
        repeat: -1,
        yoyo: true,
        hold: 1000,
        repeatDelay: 3000,
        isoX: positionAnimation,
    });
}
