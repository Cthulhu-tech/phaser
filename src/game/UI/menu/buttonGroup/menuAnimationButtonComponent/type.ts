import { Scene } from "phaser";
import { IGifButtonLevelDataType } from "../../../../constant/levelMenu/type";

export type GetObjDifferentKeys<T, U> = Omit<T, keyof U> & Omit<U, keyof T>

export interface IAnimationButton {
    scene: Scene;
    name: string;
    end: number;
    zeroPad: number;
    repeat: number;
    frameRate: number;
}

export interface  IMainMenuAnimationButton extends IGifButtonLevelDataType {
    scene: Scene;
}
