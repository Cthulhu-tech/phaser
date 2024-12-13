import { Boot } from './scenes/menuGroup/Boot';
import { GameOver } from './scenes/gameScreenGroup/gameOver/GameOver';
import { MainMenu } from './scenes/menuGroup/MainMenu';
import { AUTO } from 'phaser';
import { Preloader } from './scenes/menuGroup/Preloader';
import { Settings } from './scenes/menuGroup/SettingGroup/Setting';
import { AudioSettings } from './scenes/menuGroup/SettingGroup/Audio';
import { VideoSettings } from './scenes/menuGroup/SettingGroup/Video';
import { GamePlaySettings } from './scenes/menuGroup/SettingGroup/GamePlay';
import { LevelSelect } from './scenes/menuGroup/GameLevelGroup/LevelSelectGroup/LevelSelect';
import { LevelSetting } from './scenes/menuGroup/GameLevelGroup/LevelSettingGroup/LevelSetting';
import { NewGame } from './scenes/menuGroup/GameLevelGroup/NewGame';
import { wastelandEasy } from './scenes/gameScreenGroup/wasteland/wasteland_easy/wastelandEasy';
import { IsometricPlugin } from '@koreez/phaser3-isometric-plugin';

class Game extends Phaser.Game {
    constructor(parent: string) {
        const config: Phaser.Types.Core.GameConfig = {
            type: AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: parent,
                width: 1200,
                height: 1200 * (9 / 16)
            },
            parent: parent,
            backgroundColor: '#fff',
            scene: [
                Boot,
                Preloader,
                MainMenu,
                // Game
                NewGame,
                LevelSelect,
                LevelSetting,
                GameOver,
                // easy
                wastelandEasy,
                // Settings
                Settings,
                AudioSettings,
                VideoSettings,
                GamePlaySettings,
            ],
            plugins: {
                global: [
                    {
                        key: 'IsometricPlugin',
                        plugin: IsometricPlugin,
                        start: true
                    },
                ],
            },
        };

        super({ ...config, parent });
    }
}

const StartGame = (parent: string) => {
    return new Game(parent);
}

export default StartGame;
