let baseURL = 'http://localhost:8080';
let sessionID = 0;
let userAccessLevel: AccessLevel = 'ADMIN';

export const getAccessLevel = (): AccessLevel => userAccessLevel;

export const sendLoginRequest = async (
  url: string,
  accessLevel: AccessLevel,
  password: string
): Promise<boolean> => {
  const response = await fetch(`${url}/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ access_level: accessLevel, password }),
  });
  if (response.status === 401) return false;
  const json = await response.json();
  baseURL = url;
  userAccessLevel = accessLevel;
  sessionID = json.session_id;
  return true;
};

export const sendCreateEntityRequest = (location: TileLocation, amount?: number): void => {
  fetch(`${baseURL}/world/create_entity?session_id=${sessionID}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      col: location.column,
      row: location.row,
      ...(amount == null ? { type: 'rock' } : { type: 'food', amount }),
    }),
  }).then((response) => response.text());
};

export const sendCreateACritterRequest = (
  name: string,
  memory: readonly number[],
  program: string,
  location: TileLocation,
  direction: number
): void => {
  fetch(`${baseURL}/critters?session_id=${sessionID}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      species_id: name,
      mem: memory,
      program,
      positions: [{ col: location.column, row: location.row, direction }],
    }),
  }).then((response) => response.text());
};

export const sendCreateCrittersRequest = (
  name: string,
  memory: readonly number[],
  program: string,
  number: number
): void => {
  fetch(`${baseURL}/critters?session_id=${sessionID}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ species_id: name, mem: memory, program, num: number }),
  }).then((response) => response.text());
};

export const sendDeleteCritterRequest = (critterID: number): void => {
  fetch(`${baseURL}/critter/${critterID}?session_id=${sessionID}`, {
    method: 'DELETE',
    headers: { 'content-type': 'text-plain' },
  }).then((response) => response.text());
};

export const sendGetWorldRequest = async (): Promise<WorldState> => {
  type Loc = { readonly row: number; readonly col: number };
  type ServerRock = Loc & { type: 'rock' };
  type ServerFood = Loc & { type: 'food'; value: number };
  type ServerNothing = Loc & { type: 'nothing' };
  type ServerCritter = Loc & {
    type: 'critter';
    id: number;
    species_id: string;
    direction: number;
    mem: number[];
    program?: string;
    recently_executed_rule?: number;
  };
  type ServerTile = ServerRock | ServerFood | ServerNothing | ServerCritter;
  type ServerResponse = {
    current_timestep: number;
    current_version_number: number;
    rate: number;
    name: string;
    population: number;
    height: number;
    width: number;
    state: ServerTile[];
  };

  const json: ServerResponse = await fetch(`${baseURL}/world?session_id=${sessionID}`, {
    headers: { 'content-type': 'application/json' },
  }).then((response) => response.json());
  const {
    current_timestep: timestamp,
    current_version_number: version,
    rate,
    name,
    population,
    width,
    height,
    state,
  } = json;

  const tiles = state.map(
    ({ row, col: column, ...serverTile }): Tile => {
      const location = { row, column };
      switch (serverTile.type) {
        case 'rock':
        case 'nothing':
          return { __type__: serverTile.type, location };
        case 'food':
          return { __type__: 'food', location, value: serverTile.value };
        case 'critter':
          return {
            __type__: 'critter',
            location,
            direction: serverTile.direction,
            id: serverTile.id,
            species: serverTile.species_id,
            memory: serverTile.mem,
            program: serverTile.program,
            recentRuleID: serverTile.recently_executed_rule,
          };
      }
    }
  );

  return { timestamp, version, rate, name, population, width, height, tiles };
};

export const sendNewWorldRequest = (description: string): void => {
  fetch(`${baseURL}/world?session_id=${sessionID}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ description }),
  }).then((response) => response.text());
};

export const sendStepWorldRequest = async (): Promise<void> => {
  fetch(`${baseURL}/step?session_id=${sessionID}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ count: 1 }),
  }).then((response) => response.text());
};

export const sendRunWorldRequest = async (rate: number): Promise<void> => {
  await fetch(`${baseURL}/run?session_id=${sessionID}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ rate }),
  }).then((response) => response.text());
};
