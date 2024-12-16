import IsoPlugin, { IsoPhysics } from 'phaser3-plugin-isometric';
import { Scene } from 'phaser';

export class wastelandEasy extends Scene {
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
        this.buildMap();
    }

	private buildMap() {
		const data = this.cache.json.get('map');
        const { frames } = this.textures.get('wastelandEasyLelvel');

		const layer = data.layers[0].data;

		const mapwidth = data.layers[0].width;
		const mapheight = data.layers[0].height;

		let i = 0;

        const isoGroup = this.add.group();
		for (let y = 0; y < mapheight; y++) {
			for (let x = 0; x < mapwidth; x++) {
                const tileIndex = layer[i];
                const frame = frames[tileIndex];
                const zPosition = (frame.halfHeight) - 32;
                this.add.isoSprite((x * 32), (y * 32), zPosition, 'wastelandEasyLelvel', tileIndex, isoGroup);
                i++;
			}
		}
	}
}
