import IsoPlugin, { IsoPhysics } from 'phaser3-plugin-isometric';
import { Scene } from 'phaser';
import { Generate } from '../../../../generate/generate';

export class wastelandEasy extends Scene {
    WIDTH = 50;
    HEIGHT = 50;
    exitingRooms: number[][] = [];
    gameMap: number[][] = [];

    constructor() {
        super({
            key: 'wastelandEasy',
            mapAdd: {
                isoPlugin: 'iso',
                isoPhysics: 'isoPhysics'
            },
        });
    }

    preload() {
        this.load.scenePlugin({
            key: 'IsoPlugin',
            url: IsoPlugin,
            sceneKey: 'iso'
        });
        this.load.scenePlugin({
            key: 'IsoPhysics',
            url: IsoPhysics,
            sceneKey: 'isoPhysics'
        });
        this.load.json('map', './json/wasteland/wastelandEasyLelvelData.json');
        this.load.atlas('wastelandEasyLelvel', './assets/wastelandEasy/grass_and_water.png', './assets/wastelandEasy/wastelandEasy.json');
    }

    create() {
        this.isoGroup = this.add.group();
        this.isoPhysics.projector.origin.setTo(0.5, 0.3);
        this.generateControl();
        this.generateMap();
    }

    private generateControl() {
        const keyboard = this.input.keyboard;
        if (keyboard) {
            const cursors = keyboard.createCursorKeys();

            const controlConfig = {
                camera: this.cameras.main,
                left: cursors.left,
                right: cursors.right,
                up: cursors.up,
                down: cursors.down,
                zoomIn: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
                zoomOut: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
                acceleration: 0.06,
                drag: 0.0005,
                maxSpeed: 1.0
            };

            new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

            this.input.keyboard.on('keydown-Q', () => {
                this.cameras.main.zoomTo(1.1, 300);
            });

            this.input.keyboard.on('keydown-E', () => {
                this.cameras.main.zoomTo(0.3, 300);
            });
        }
    }

    private generateMap() {
        const data = this.cache.json.get('map');
        const { frames } = this.textures.get('wastelandEasyLelvel');

        const rooms = [];
        this.gameMap = Array.from({ length: this.HEIGHT }, () => Array(this.WIDTH).fill(0));

        for (let i = 0; i < data.layers.length; i++) {
            rooms.push(data.layers[i]);
        }

        const generateMap = new Generate({
            width: this.WIDTH,
            height: this.HEIGHT,
            iteration: 4,
            W_RATIO: .45,
            H_RATIO: .45,
        });

        this.gameMap = generateMap.createRooms(this.gameMap);
        this.gameMap = generateMap.createPath(this.gameMap);
        this.buildMap(frames);
    }

    private buildMap(frames: object) {
        const isoGroup = this.add.group();

        for (let y = 0; y < this.gameMap.length; y++) {
            for (let x = 0; x < this.gameMap[y].length; x++) {
                const tileIndex = this.gameMap[y][x];

                const frame = frames[tileIndex];
                const zPosition = (frame.halfHeight) - 32;
                this.add.isoSprite((x * 32), (y * 32), zPosition, 'wastelandEasyLelvel', tileIndex, isoGroup);
            }
        }
    }

}
