import {AABB2} from './AABB2';
import {IMap2dLayerTilesRenderer} from './IMap2dLayerTilesRenderer';
import {Map2dAreaTile} from './Map2dAreaTile';
import {Map2dTileCoordsUtil} from './Map2dTileCoordsUtil';

export class Map2dLayer {
  #tileCoords: Map2dTileCoordsUtil;

  get tileWidth() {
    return this.#tileCoords.tileWidth;
  }

  set tileWidth(width: number) {
    this.#tileCoords.tileWidth = width;
  }

  get tileHeight() {
    return this.#tileCoords.tileHeight;
  }

  set tileHeight(width: number) {
    this.#tileCoords.tileHeight = width;
  }

  get xOffset() {
    return this.#tileCoords.xOffset;
  }

  set xOffset(offset: number) {
    this.#tileCoords.xOffset = offset;
  }

  get yOffset() {
    return this.#tileCoords.yOffset;
  }

  set yOffset(offset: number) {
    this.#tileCoords.yOffset = offset;
  }

  tiles: Map2dAreaTile[] = [];
  tilesRenderer: IMap2dLayerTilesRenderer;

  #lastViewArea = new AABB2();

  constructor(tileWidth: number, tileHeight: number, xOffset = 0, yOffset = 0) {
    this.#tileCoords = new Map2dTileCoordsUtil(tileWidth, tileHeight, xOffset, yOffset);
  }

  renderViewArea(left: number, top: number, width: number, height: number) {
    if (!this.tilesRenderer) return;
    if (!this.#lastViewArea.is(left, top, width, height)) {
      this.#lastViewArea.set(left, top, width, height);
      const tileCoords = this.#tileCoords.computeTilesWithinCoords(left, top, width, height);

      const fullViewArea = AABB2.from(tileCoords);
      const removeTiles: Map2dAreaTile[] = [];
      const reuseTiles: Map2dAreaTile[] = [];
      const createTilesState = new Uint8Array(tileCoords.rows * tileCoords.columns);

      this.tiles.forEach((tile) => {
        if (fullViewArea.isIntersecting(tile.view)) {
          reuseTiles.push(tile);
          const tx = tile.x - tileCoords.tileLeft;
          const ty = tile.y - tileCoords.tileTop;
          createTilesState[ty * tileCoords.columns + tx] = 1;
        } else {
          removeTiles.push(tile);
        }
      });

      const createTiles: Map2dAreaTile[] = [];

      for (let ty = 0; ty < tileCoords.rows; ty++) {
        for (let tx = 0; tx < tileCoords.columns; tx++) {
          if (createTilesState[ty * tileCoords.columns + tx] === 0) {
            const tileX = tx + tileCoords.tileLeft;
            const tileY = ty + tileCoords.tileTop;
            const tile = new Map2dAreaTile(
              tileX,
              tileY,
              new AABB2(
                tileX * tileCoords.tileWidth,
                tileY * tileCoords.tileHeight,
                tileCoords.tileWidth,
                tileCoords.tileHeight,
              ),
            );
            createTiles.push(tile);
          }
        }
      }

      this.tiles = reuseTiles.concat(createTiles);

      this.tilesRenderer.beginRender(this, fullViewArea);
      removeTiles.forEach((tile) => this.tilesRenderer.removeTile(tile));
      createTiles.forEach((tile) => this.tilesRenderer.addTile(tile));
      reuseTiles.forEach((tile) => this.tilesRenderer.reuseTile(tile));
      this.tilesRenderer.endRender();
    }
  }
}