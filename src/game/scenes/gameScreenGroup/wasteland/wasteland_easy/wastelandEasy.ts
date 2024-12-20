import IsoPlugin, { IsoPhysics } from 'phaser3-plugin-isometric';
import { Scene } from 'phaser';
import { NumberLiteralType } from 'typescript';

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

        // Инициализация пустой карты
        this.gameMap = Array.from({ length: this.HEIGHT }, () => Array(this.WIDTH).fill(0));

        // Массив для хранения центров комнат
        const roomCenters: { x: number, y: number, width: number, height: number }[] = [];

        // Генерация карты с добавлением комнат
        for (let i = 0; i < data.layers.length; i++) {
            const layer: number[][] = data.layers[i].data;
            this.addRandomRoom(layer, roomCenters); // Добавляем комнату
        }

        // Соединение комнат путями
        this.connectRooms(roomCenters);

        // Строим карту
        this.buildMap(frames);
    }

    private addRandomRoom(room: number[][], roomCenters: { x: number, y: number, width: number, height: number }[]) {
        let placed = false;
        const maxAttempts = 100;  // Ограничение попыток размещения
        let attempts = 0;

        // Попытки добавления комнаты на карту
        while (!placed && attempts < maxAttempts) {
            attempts++;

            // Случайное место для размещения комнаты
            const x = Math.floor(Math.random() * (this.gameMap.length - room.length));
            const y = Math.floor(Math.random() * (this.gameMap[0].length - room[0].length));

            // Если комната помещается, разместим её
            if (this.canPlaceRoom(room, x, y)) {
                this.placeRoom(room, x, y);
                roomCenters.push(this.getRoomCenter(room, x, y)); // Сохраняем центр комнаты
                placed = true;
            }
        }

        // Если после всех попыток не удалось разместить комнату
        if (!placed) {
            console.warn("Could not place room after 100 attempts");
        }
    }

    private canPlaceRoom(room: number[][], x: number, y: number) {
        // Проверка на пересечение с другими комнатами
        for (let i = 0; i < room.length; i++) {
            for (let j = 0; j < room[i].length; j++) {
                if (this.gameMap[x + i]?.[y + j] !== 0) {
                    return false;
                }
            }
        }
        return true;
    }

    private placeRoom(room: number[][], x: number, y: number) {
        for (let i = 0; i < room.length; i++) {
            for (let j = 0; j < room[i].length; j++) {
                this.gameMap[x + i][y + j] = room[i][j];
            }
        }
    }

    private buildMap(frames: object) {
        const isoGroup = this.add.group();

        // Проходим по всем ячейкам карты
        for (let y = 0; y < this.gameMap.length; y++) {
            for (let x = 0; x < this.gameMap[y].length; x++) {
                const tileIndex = this.gameMap[y][x];
                if (tileIndex > 0) {  // Игнорируем пустые ячейки
                    const frame = frames[tileIndex];
                    const zPosition = (frame.halfHeight) - 32;  // Подстраиваем высоту по оси Z
                    this.add.isoSprite((x * 32), (y * 32), zPosition, 'wastelandEasyLelvel', tileIndex, isoGroup);
                }
            }
        }
    }

    private connectRooms(roomCenters: { x: number, y: number, width: number, height: number }[]) {
        for (let i = 0; i < roomCenters.length - 1; i++) {
            const start = roomCenters[i];
            const widthStart = roomCenters[i].width;
            const heightStart = roomCenters[i].height;
            const end = roomCenters[i + 1];
            const widthEnd = roomCenters[i].width;
            const heightEnd = roomCenters[i].height;
            // Проверка для каждой комнаты - внешний тайл с ID 12 (дверь)
            const startDoor = this.findDoorOnPerimeter(start.x, start.y, widthStart, heightStart, 12); // Примерные размеры комнаты (ширина 10, высота 10)
            const endDoor = this.findDoorOnPerimeter(end.x, end.y, widthEnd, heightEnd, 12); // Примерные размеры комнаты (ширина 10, высота 10)
    
            // Если обе комнаты имеют двери на внешней границе
            if (startDoor && endDoor) {
                this.createPath(startDoor, endDoor);
            }
        }
    }

    private findDoorOnPerimeter(x: number, y: number, roomWidth: number, roomHeight: number, tile: number): { x: number, y: number } | null {
        // Проверяем верхнюю и нижнюю границу (по горизонтали)
        for (let i = x; i < x + roomWidth; i++) {
            if (this.gameMap[i] && this.gameMap[i][y] === tile) {
                return { x: i, y };
            }
            if (this.gameMap[i] && this.gameMap[i][y + roomHeight - 1] === tile) {
                return { x: i, y: y + roomHeight - 1 };
            }
        }
    
        // Проверяем левую и правую границу (по вертикали)
        for (let j = y; j < y + roomHeight; j++) {
            if (this.gameMap[x] && this.gameMap[x][j] === tile) {
                return { x, y: j };
            }
            if (this.gameMap[x + roomWidth - 1] && this.gameMap[x + roomWidth - 1][j] === tile) {
                return { x: x + roomWidth - 1, y: j };
            }
        }
    
        return null; // Если не нашли тайл двери
    }
    

    private createPath(start: { x: number, y: number }, end: { x: number, y: number }) {
        const path = this.findPath(start, end);
    
        // Прокладываем путь с использованием тайла 3
        for (const point of path) {
            if (this.gameMap[point.x][point.y] === 0) {
                this.gameMap[point.x][point.y] = 3; // Заменяем на путь (тайл 3)
            }
        }
    }

    private findPath(start: { x: number, y: number }, end: { x: number, y: number }): { x: number, y: number }[] {
        const path: { x: number, y: number }[] = [];
        let currentX = start.x;
        let currentY = start.y;

        // Прокладываем горизонтальный путь
        while (currentX !== end.x) {
            currentX += currentX < end.x ? 1 : -1;
            path.push({ x: currentX, y: currentY });
        }

        // Прокладываем вертикальный путь
        while (currentY !== end.y) {
            currentY += currentY < end.y ? 1 : -1;
            path.push({ x: currentX, y: currentY });
        }

        return path;
    }

    // Получаем центр комнаты (для соединения путями)
    private getRoomCenter(room: number[][], x: number, y: number): { x: number, y: number, width: number, height: number } {
        const centerX = x + Math.floor(room.length / 2);
        const centerY = y + Math.floor(room[0].length / 2);
        return { x: centerX, y: centerY, width: room.length, height: room[0].length };
    }
}
