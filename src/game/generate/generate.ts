import { IGenerate, GenerateType } from "./type";

const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Tree {
    leaf: Container;
    lchild: Tree | undefined;
    rchild: Tree | undefined;
    constructor(leaf: Container) {
        this.leaf = leaf
        this.lchild = undefined;
        this.rchild = undefined;
    }
    getLeafs(): Container[] | any {
        if(!this.lchild && !this.rchild) {
            return [this.leaf];
        }
        return [].concat(this.lchild?.getLeafs(), this.rchild?.getLeafs())
    }
    getLevel(level: number, queue: Tree[] | undefined) {
        if (!queue) {
            queue = [];
        }
        if (level == 1) {
            queue.push(this);
        } else {
            if (this.lchild) {
                this.lchild.getLevel(level - 1, queue);
            }
            if (this.rchild) {
                this.rchild.getLevel(level - 1, queue);
            }
        }
        return queue;
    }
}

export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Container {
    x: number;
    y: number;
    w: number;
    h: number;
    center: Point;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = new Point(
            this.x + (this.w / 2),
            this.y + (this.h / 2)
        );
    }
}

export class Room {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(container: Container) {
        this.x = container.x + random(0, Math.floor(container.w / 3));
        this.y = container.y + random(0, Math.floor(container.h / 3));
        this.w = container.w - (this.x - container.x);
        this.h = container.h - (this.y - container.y);
        this.w -= random(0, this.w / 3);
        this.h -= random(0, this.w / 3);
    }
}

export class Generate implements IGenerate {
    width: number;
    height: number;
    main_container: Container;
    container_tree: Tree;
    W_RATIO: number;
    H_RATIO: number;
    constructor({
        width,
        height,
        iteration,
        W_RATIO,
        H_RATIO,
    }: GenerateType) {
        this.width = width;
        this.height = height;
        this.W_RATIO = W_RATIO;
        this.H_RATIO = H_RATIO;
        this.main_container = new Container(0, 0, this.width, this.height);
        this.container_tree = this.splitContainer(this.main_container, iteration);
    }
    private drawRoomInArray(
        array: number[][],
        x: number,
        y: number,
        w: number,
        h: number,
    ) {
        for (let i = y; i < Math.min(y + h, array.length); i++) {
            for (let j = x; j < Math.min(x + w, array[0].length); j++) {
                array[i][j] = 1;
            }
        }
        return array;
    }
    createPath(gameMap: number[][]) {
        this.draw_paths(this.container_tree, gameMap);
        return gameMap;
    }

    private draw_paths(tree: Tree, gameMap: number[][]) {
        if (!tree.lchild || !tree.rchild) {
            return;
        }
        this.drawPath(tree.lchild.leaf, tree.rchild.leaf, gameMap);
        this.draw_paths(tree.lchild, gameMap);
        this.draw_paths(tree.rchild, gameMap);
    }

    private drawPath(containerLeft: Container, containerRight: Container, gameMap: number[][]) {
        let x1 = Math.floor(containerLeft.center.x); // Округление на случай дробных координат
        let y1 = Math.floor(containerLeft.center.y);
        let x2 = Math.floor(containerRight.center.x);
        let y2 = Math.floor(containerRight.center.y);
    
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = x1 < x2 ? 1 : -1;
        let sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
    
        while (true) {
            // Проверяем, что координаты внутри карты
            if (y1 >= 0 && y1 < gameMap.length && x1 >= 0 && x1 < gameMap[0].length) {
                gameMap[y1][x1] = 2; // Обозначаем путь
            }
    
            // Если достигли конечной точки, выходим из цикла
            if (x1 === x2 && y1 === y2) break;
    
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }

    createRooms(gameMap: number[][]) {
        const leafs = this.container_tree.getLeafs();
        for (var i = 0; i < leafs.length; i++) {
            const room = new Room(leafs[i]);
            this.drawRoomInArray(gameMap, room.x, room.y, room.w, room.h);
        }
        return gameMap;
    }
    splitContainer(container: Container, iter: number) {
        const root = new Tree(container);
        if (iter != 0) {
            const sr = this.randomSplit(container);
            root.lchild = this.splitContainer(sr[0], iter - 1);
            root.rchild = this.splitContainer(sr[1], iter - 1);
        }
        return root;
    }
    randomSplit(container: Container) {
        let r1 = null;
        let r2 = null;
        if (random(0, 1) == 0) {
            // Vertical
            r1 = new Container(
                container.x, container.y,             // r1.x, r1.y
                random(1, container.w), container.h   // r1.w, r1.h
            );

            r2 = new Container(
                container.x + r1.w, container.y,      // r2.x, r2.y
                container.w - r1.w, container.h       // r2.w, r2.h
            );

            const r1_w_ratio = r1.w / r1.h
            const r2_w_ratio = r2.w / r2.h
            if (r1_w_ratio < this.W_RATIO || r2_w_ratio < this.W_RATIO) {
                return this.randomSplit(container);
            }
        } else {
            // Horizontal
            r1 = new Container(
                container.x, container.y,             // r1.x, r1.y
                container.w, random(1, container.h)   // r1.w, r1.h
            );

            r2 = new Container(
                container.x, container.y + r1.h,      // r2.x, r2.y
                container.w, container.h - r1.h       // r2.w, r2.h
            );

            const r1_h_ratio = r1.h / r1.w
            const r2_h_ratio = r2.h / r2.w
            if (r1_h_ratio < this.H_RATIO || r2_h_ratio < this.H_RATIO) {
                return this.randomSplit(container);
            }
        }
        return [r1, r2];
    }
}
