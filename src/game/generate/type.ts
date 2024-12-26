import { Container, Tree } from "./generate";

export interface IGenerate {
    width: number;
    height: number;
    main_container: Container;
    container_tree: Tree;
    splitContainer(container: Container, iter: number): Tree;
    randomSplit(container: Container): Container[];
    createRooms(gameMap: number[][]): number[][];
    createPath(gameMap: number[][]): number[][];
}

export type GenerateType = {
    width: number;
    height: number;
    iteration: number;
    W_RATIO: number;
    H_RATIO: number;
    room_gap: number;
    road_width: number;
    MAX_WIDTH: number;
    MAX_HEIGHT: number;
}
