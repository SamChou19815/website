/* eslint-disable no-alert */

import React, { ReactElement, useState, useEffect, useRef } from 'react';

import {
  getAccessLevel,
  sendCreateEntityRequest,
  sendCreateACritterRequest,
  sendCreateCrittersRequest,
  sendDeleteCritterRequest,
  sendNewWorldRequest,
  sendRunWorldRequest,
  sendStepWorldRequest,
} from '../utils/http';
import { useWindowSize } from '../utils/window-size-hook';
import CritterInspectionCard from './CritterInspectionCard';
import CritterWorldCanvas from './CritterWorldCanvas';

const buttonClassname = 'button button--primary app-control-button';
const smallButtonClassname = 'button button--primary app-control-button-small';

type Props = { readonly worldState: WorldState };

const getCritterInformation = (): Readonly<{
  name: string;
  memory: readonly number[];
  program: string;
}> | null => {
  const name = prompt('Critter Species');
  if (name == null || name.trim() === '') return null;
  const memoryString = prompt('Comma separated critter memory');
  if (memoryString == null || memoryString.trim() === '') return null;
  const memory = memoryString.split(',').map((it) => parseInt(it.trim(), 10));
  const program = prompt('Critter Program');
  if (program == null || program.trim() === '') return null;
  return { name, memory, program };
};

const DataLoadedApp = ({ worldState }: Props): ReactElement => {
  const [currentXPosition, setCurrentXPosition] = useState(0);
  const [currentYPosition, setCurrentYPosition] = useState(0);
  const [rate, setRate] = useState(worldState.rate);
  const [onEditingRate, setOnEditingRate] = useState(false);
  const [hexRadius, setHexRadius] = useState(16);
  const [clickHexMode, setClickHexMode] = useState<
    'INSPECT' | 'PUT_ROCK' | 'PUT_FOOD' | 'PUT_CRITTER' | 'REMOVE_CRITTER'
  >('INSPECT');
  const [idOfCritterToInspect, setIdOfCritterToInspect] = useState<number | null>(null);
  const [isInspectionCardOn, setIsInspectionCardOn] = useState(false);
  const critterWorldCanvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = critterWorldCanvasRef.current;
    if (element == null) return () => {};
    const listener = (): void => {
      setCurrentXPosition(element.scrollLeft);
      setCurrentYPosition(element.scrollTop);
    };
    element.addEventListener('scroll', listener);
    return () => element.removeEventListener('scroll', listener);
  }, [critterWorldCanvasRef]);

  const windowSize = useWindowSize();

  if (!onEditingRate && worldState.rate !== rate) setRate(worldState.rate);

  const map = Object.fromEntries(
    worldState.tiles.map((it) => [`${it.location.column}-${it.location.row}`, it])
  );

  const critterToInspect = worldState.tiles.find(
    (it) => it.__type__ === 'critter' && it.id === idOfCritterToInspect
  ) as TileCritter | undefined;

  const onClickHex = (location: TileLocation): void => {
    switch (clickHexMode) {
      case 'INSPECT': {
        const tile = map[`${location.column}-${location.row}`];
        if (tile != null && tile.__type__ === 'critter') {
          setIdOfCritterToInspect(tile.id);
          setIsInspectionCardOn(true);
        }
        return;
      }
      case 'PUT_ROCK': {
        const tile = map[`${location.column}-${location.row}`];
        if (tile == null || tile.__type__ !== 'nothing') {
          alert('The tile is already occupied!');
          setClickHexMode('INSPECT');
          return;
        }
        sendCreateEntityRequest(location);
        setClickHexMode('INSPECT');
        return;
      }
      case 'PUT_FOOD': {
        const tile = map[`${location.column}-${location.row}`];
        if (tile == null || tile.__type__ !== 'nothing') {
          alert('The tile is already occupied!');
          setClickHexMode('INSPECT');
          return;
        }
        const amount = prompt('Amount of food');
        if (amount == null) {
          setClickHexMode('INSPECT');
          return;
        }
        const intAmount = parseInt(amount, 10);
        sendCreateEntityRequest(location, intAmount);
        setClickHexMode('INSPECT');
        return;
      }
      case 'PUT_CRITTER': {
        const tile = map[`${location.column}-${location.row}`];
        if (tile == null || tile.__type__ !== 'nothing') {
          alert('The tile is already occupied!');
          setClickHexMode('INSPECT');
          return;
        }
        const direction = prompt('Critter direction');
        if (direction == null) {
          setClickHexMode('INSPECT');
          return;
        }
        let intDirection = parseInt(direction, 10);
        intDirection = ((intDirection % 6) + 6) % 6;
        const info = getCritterInformation();
        if (info == null) {
          setClickHexMode('INSPECT');
          return;
        }
        sendCreateACritterRequest(info.name, info.memory, info.program, location, intDirection);
        setClickHexMode('INSPECT');
        return;
      }
      case 'REMOVE_CRITTER': {
        const tile = map[`${location.column}-${location.row}`];
        if (tile == null || tile.__type__ !== 'critter') {
          alert('The tile does not have a critter!');
          setClickHexMode('INSPECT');
          return;
        }
        sendDeleteCritterRequest(tile.id);
        setClickHexMode('INSPECT');
        return;
      }
    }
  };

  return (
    <div>
      <CritterWorldCanvas
        currentXPosition={currentXPosition}
        currentYPosition={currentYPosition}
        canvasWidth={windowSize.width}
        canvasHeight={windowSize.height - 305}
        hexRadius={hexRadius}
        worldWidth={worldState.width}
        worldHeight={worldState.height}
        highlightedCritterID={idOfCritterToInspect}
        critterWorldCanvasRef={critterWorldCanvasRef}
        contentProvider={(location) => map[`${location.column}-${location.row}`]}
        onHexClick={onClickHex}
      />
      {critterToInspect && isInspectionCardOn && <CritterInspectionCard tile={critterToInspect} />}
      <footer className="horizontal-center">
        <div className="app-control-big-section">
          <div style={{ textAlign: 'center' }}>
            <div>Name: {worldState.name}</div>
            <div>Steps: {worldState.timestamp}</div>
            <div>Critters: {worldState.population}</div>
          </div>
          <div className="horizontal-center">
            <div className="app-control-small-section">
              <button
                className={smallButtonClassname}
                disabled={hexRadius === 32}
                onClick={() => setHexRadius((r) => r * 2)}
              >
                +
              </button>
              <button
                className={smallButtonClassname}
                disabled={hexRadius === 16}
                onClick={() => setHexRadius((r) => r / 2)}
              >
                -
              </button>
              <button className={buttonClassname} onClick={() => setIsInspectionCardOn((o) => !o)}>
                Critter Inspection
              </button>
            </div>
          </div>
        </div>
        <div>
          <img width={400} className="app-logo" alt="Critter World Logo" src="/critter_world.png" />
        </div>
        <div className="app-control-big-section">
          <div className="horizontal-center">
            <div className="app-control-small-section">
              <div>Simulation Rate: {rate}</div>
              <input
                disabled={getAccessLevel() === 'READ' || worldState.rate > 0}
                type="range"
                min="0"
                max="100"
                value={Math.min(rate, 100)}
                onChange={(e) => {
                  setRate(parseInt(e.target.value, 10));
                  setOnEditingRate(true);
                }}
              />
            </div>
            <div className="app-control-small-section">
              <button
                className={buttonClassname}
                disabled={getAccessLevel() === 'READ'}
                onClick={() => sendStepWorldRequest()}
              >
                Next
              </button>
              <button
                className={buttonClassname}
                disabled={getAccessLevel() === 'READ'}
                onClick={() => {
                  if (worldState.rate === 0) {
                    sendRunWorldRequest(rate).then(() => setOnEditingRate(false));
                  } else {
                    sendRunWorldRequest(0);
                  }
                }}
              >
                {worldState.rate === 0 ? 'Run' : 'Stop'}
              </button>
            </div>
          </div>
          <div>
            <div className="horizontal-center app-four-button-row">
              <button
                className={buttonClassname}
                disabled={getAccessLevel() !== 'ADMIN' || worldState.rate > 0}
                onClick={() => {
                  const worldDescription = prompt('New world description.');
                  if (worldDescription == null) return;
                  sendNewWorldRequest(worldDescription);
                }}
              >
                Load World
              </button>
              <button
                className={buttonClassname}
                disabled={getAccessLevel() === 'READ' || worldState.rate > 0}
                onClick={() => {
                  alert('Select an empty hex on the map to place the rock.');
                  setClickHexMode('PUT_ROCK');
                }}
              >
                Put Rock
              </button>
              <button
                className={buttonClassname}
                disabled={getAccessLevel() === 'READ' || worldState.rate > 0}
                onClick={() => {
                  alert('Select an empty hex on the map to place the food.');
                  setClickHexMode('PUT_FOOD');
                }}
              >
                Put Food
              </button>
            </div>
            <div className="horizontal-center app-four-button-row">
              <button
                className={buttonClassname}
                disabled={getAccessLevel() === 'READ' || worldState.rate > 0}
                onClick={() => {
                  const info = getCritterInformation();
                  if (info == null) return;
                  const number = prompt('Number of critters');
                  if (number == null) return;
                  sendCreateCrittersRequest(
                    info.name,
                    info.memory,
                    info.program,
                    parseInt(number, 10)
                  );
                }}
              >
                Load Critters
              </button>
              <button
                className={buttonClassname}
                disabled={getAccessLevel() === 'READ' || worldState.rate > 0}
                onClick={() => {
                  alert('Select an empty hex on the map to place the critter.');
                  setClickHexMode('PUT_CRITTER');
                }}
              >
                Put Critter
              </button>
              <button
                className={buttonClassname}
                disabled={getAccessLevel() !== 'ADMIN' || worldState.rate > 0}
                onClick={() => {
                  alert('Select a critter hex on the map to remove it.');
                  setClickHexMode('REMOVE_CRITTER');
                }}
              >
                Remove Critter
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataLoadedApp;
