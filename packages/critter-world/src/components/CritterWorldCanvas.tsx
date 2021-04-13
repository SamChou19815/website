import React, { ReactElement, Ref } from 'react';

import PrimitiveHex from './PrimitiveHex';

const hashString = (s: string): number => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const CritterPicture = ({ tile }: { readonly tile: TileCritter }): ReactElement => {
  const index = hashString(tile.species) % 16;
  const url = `/${index}.png`;

  const sizeScale = Math.min(tile.memory[3] ?? 1, 10);

  return (
    <img
      src={url}
      alt={`critter variant ${index}`}
      width={`${90 + sizeScale * 4}%`}
      style={{ transform: `rotate(${tile.direction * 60}deg)` }}
    />
  );
};

const locationIsOutOfBound = (
  rowID: number,
  columnID: number,
  width: number,
  height: number
): boolean =>
  rowID < 0 ||
  columnID < 0 || // quick check
  columnID >= width || // outside of eastern boundary
  2 * rowID - columnID < 0 || // outside of southern boundary
  2 * rowID - columnID >= height; // outside of northern boundary

/**
 * Translate the row id in the world model to the row id for display, so that
 * we can draw things easily.
 *
 * @param location location object from model.
 * @return translated row id in display.
 */
const translateRowIDForDisplay = (location: TileLocation): number =>
  location.row * 2 - location.column;

/**
 * Translate the row id for display to the row id in the world model,
 * so that we can fetch things easily.
 *
 * @param rowID row id in display.
 * @param columnID column id in display.
 * @return translated row id in model.
 */
const translateRowIDForModel = (rowID: number, columnID: number): number =>
  Math.floor((rowID + columnID) / 2);

type Props = {
  readonly currentXPosition: number;
  readonly currentYPosition: number;
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly hexRadius: number;
  readonly worldWidth: number;
  readonly worldHeight: number;
  readonly highlightedCritterID: number | null;
  readonly critterWorldCanvasRef: Ref<HTMLDivElement>;
  readonly contentProvider: (location: TileLocation) => Tile | undefined;
  readonly onHexClick: (location: TileLocation) => void;
};

const CritterWorldCanvas = ({
  currentXPosition,
  currentYPosition,
  canvasWidth,
  canvasHeight,
  hexRadius,
  worldWidth,
  worldHeight,
  highlightedCritterID,
  critterWorldCanvasRef,
  contentProvider,
  onHexClick,
}: Props): ReactElement => {
  const fullWorldPixelWidth = (1.5 * worldWidth + 0.5) * hexRadius * 2;
  const fullWorldPixelHeight = (worldHeight + 1) * Math.sqrt(3.0) * hexRadius;

  /**
   * A helper method to find the display column and row id.
   *
   * @param mouseX mouse location in x-coordinate.
   * @param mouseY mouse location in y-coordinate.
   * @return (column, row).
   */
  const calculateColumnRowIndices = (mouseX: number, mouseY: number): readonly [number, number] => {
    // locate the range of possible choices by math.
    const baseColumnID = Math.floor(mouseX / ((3.0 / 2) * hexRadius * 2));
    const baseRowID = worldHeight - Math.floor(mouseY / ((Math.sqrt(3.0) / 2) * hexRadius * 2));
    let smallestDist = Number.MAX_SAFE_INTEGER;
    let columnID = baseColumnID;
    let rowID = baseRowID;
    // Local brute force search, it's not a problem since it's still O(1).
    for (const i of [-1, 0, 1]) {
      for (const j of [-1, 0, 1]) {
        const possibleColumnID = baseColumnID + i;
        const possibleRowID = baseRowID + j;
        if (possibleColumnID + (possibleRowID & 1) === 1) {
          /*
           * This check is necessary, because some combinations of
           * possible column id and row id are just illegal.
           */
          continue;
        }
        const centerX = getCenterX(possibleColumnID);
        const centerY = getCenterY(possibleRowID);
        const dist = (centerX - mouseX) ** 2.0 + (centerY - mouseY) ** 2.0;
        if (dist < smallestDist) {
          smallestDist = dist;
          columnID = possibleColumnID;
          rowID = possibleRowID;
        }
      }
    }
    return [columnID, rowID];
  };

  /**
   * Calculate center location in X coordinate. The X coordinate is the actual one, not the one
   * relative to the canvas. If program needs to the location to the canvas, it needs to
   * additional step of transformation.
   *
   * @param columnIndex column index.
   * @return center location in X coordinate.
   */
  const getCenterX = (columnIndex: number): number => (1.5 * columnIndex + 1.0) * hexRadius;

  /**
   * Calculate center location in Y coordinate. The Y coordinate is the actual one, not the one
   * relative to the canvas. If program needs to the location to the canvas, it needs to
   * additional step of transformation.
   *
   * @param rowIndex row index.
   * @return center location in Y coordinate.
   */
  const getCenterY = (rowIndex: number): number => {
    const invertedRowIndex = worldHeight - rowIndex;
    // upside down row sequence
    return Math.sqrt(3.0) * 0.5 * invertedRowIndex * hexRadius;
  };

  const getHex = (tile: Tile): ReactElement => {
    const left = 1.5 * tile.location.column * 2 * hexRadius;
    const top =
      Math.sqrt(3.0) * (worldHeight - translateRowIDForDisplay(tile.location) - 1) * hexRadius;

    const key = `${tile.location.column}-${tile.location.row}`;
    const onClick = () => onHexClick(tile.location);

    switch (tile.__type__) {
      case 'nothing':
        return (
          <PrimitiveHex
            key={key}
            radius={hexRadius}
            color="white"
            style={{ left, top }}
            onClick={onClick}
          />
        );
      case 'rock':
        return (
          <PrimitiveHex
            key={key}
            radius={hexRadius}
            color="var(--rock-gray)"
            style={{ left, top }}
            onClick={onClick}
          />
        );
      case 'food':
        return (
          <PrimitiveHex
            key={key}
            radius={hexRadius}
            color="var(--food-green)"
            style={{ left, top }}
            onClick={onClick}
          >
            {tile.value}
          </PrimitiveHex>
        );
      case 'critter':
        return (
          <PrimitiveHex
            key={key}
            radius={hexRadius}
            borderColor={highlightedCritterID === tile.id ? 'var(--critter-highlight)' : 'black'}
            color={'white'}
            style={{ left, top }}
            onClick={onClick}
          >
            <CritterPicture tile={tile} />
            <div style={{ position: 'absolute' }}>{tile.memory[3]}</div>
          </PrimitiveHex>
        );
    }
  };

  const [startCol, startRow] = calculateColumnRowIndices(currentXPosition, currentYPosition);
  const [endCol, endRow] = calculateColumnRowIndices(
    currentXPosition + canvasWidth,
    currentYPosition + canvasHeight
  );

  const tiles: ReactElement[] = [];
  for (let colID = startCol - 5; colID < endCol + 5; colID += 1) {
    for (let rowID = startRow + 5; rowID >= endRow - 4; rowID -= 1) {
      if ((rowID + colID) % 2 !== 0) continue;
      // translate coordinate system
      const rowInModel = translateRowIDForModel(rowID, colID);
      if (locationIsOutOfBound(rowInModel, colID, worldWidth, worldHeight)) {
        continue;
      }
      const tile = contentProvider({ row: rowInModel, column: colID });
      if (tile != null) {
        // Guard against bad server
        tiles.push(getHex(tile));
      }
    }
  }

  return (
    <div
      className="critter-world-canvas-container"
      style={{ width: canvasWidth, height: canvasHeight }}
      ref={critterWorldCanvasRef}
    >
      <div
        className="critter-world-canvas"
        style={{ width: fullWorldPixelWidth, height: fullWorldPixelHeight }}
      >
        {tiles}
      </div>
    </div>
  );
};

export default CritterWorldCanvas;
