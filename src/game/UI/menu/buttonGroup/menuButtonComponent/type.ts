import { Scene } from "phaser";

export interface IButton {
    x: number;
    y: number;
    text: string;
    scene: Scene;
    to: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
}
