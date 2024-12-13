import { IGifButtonLevelDataType } from "./type";

export const ButtonLevelData = [{
    text: 'Level Setting',
    to: 'LevelSetting',
    positionX: 250,
    positionY: 20,
}];

export const GifButtonLevelData: IGifButtonLevelDataType[] = [{
    name: 'wastelandEasy',
    texture: './assets/wastelandEasy.png',
    json: './json/wasteland/wastelandEasy.json',
    to: 'wastelandEasy',
    end: 5,
    zeroPad: 4,
    x: 400,
    y: 400,
    ms: 1000,
    frameRate: 1,
}];
