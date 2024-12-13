import IsoPlugin from 'phaser3-plugin-isometric';
import { Scene } from 'phaser';

export class wastelandEasy extends Scene {
    constructor() {
        super({
            key: 'wastelandEasy',
            mapAdd: { isoPlugin: 'iso' }
        });
    }

    preload() {
        this.load.spritesheet('wastelandEasyLelvel', './assets/wastelandEasy/grass_and_water.png', { frameWidth: 64, frameHeight: 64 });
        this.load.json('map', './json/wasteland/wastelandEasyLelvelData.json');
        this.load.scenePlugin({
            key: 'IsoPlugin',
            url: IsoPlugin,
            sceneKey: 'iso'
        });
    }

    create() {
        this.isoGroup = this.add.group();
        this.iso.projector.origin.setTo(0.5, 0.15);
        this.buildMap();
    }

	private buildMap()
	{
		const data = this.cache.json.get('map');

		const tilewidth = data.tilewidth;
		const tileheight = data.tileheight;

		const tileWidthHalf = tilewidth / 2;
		const tileHeightHalf = tileheight / 2;

		const layer = data.layers[0].data;

		const mapwidth = data.layers[0].width;
		const mapheight = data.layers[0].height;

		const centerX = mapwidth * tileWidthHalf;
		const centerY = 16;

		let i = 0;

		for (let y = 0; y < mapheight; y++) {
			for (let x = 0; x < mapwidth; x++) {
				const id = layer[i] - 1

				const tx = (x - y) * tileWidthHalf;
				const ty = (x + y) * tileHeightHalf;

				const tile = this.add.image(centerX + tx, centerY + ty, 'wastelandEasyLelvel', id);

                if(id === 85 || id === 86) {
                    this.tweens.add({
                        targets: tile,
                        scale: 1,
                        angle: 0,
                        ease: 'Power2',
                        duration: 1000,
                        delay: i * 50,
                        repeat: -1,
                        yoyo: true,
                        hold: 1000,
                        repeatDelay: 1000,
                        y: ty,
                    });
                }

				tile.depth = centerY + ty;

				i++;
			}
		}
	}
}
