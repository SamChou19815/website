type AccessLevel = 'READ' | 'WRITE' | 'ADMIN';

type TileLocation = { readonly row: number; readonly column: number };

type TileRock = {
  readonly __type__: 'rock';
  readonly location: TileLocation;
};

type TileFood = {
  readonly __type__: 'food';
  readonly location: TileLocation;
  readonly value: number;
};

type TileNothing = {
  readonly __type__: 'nothing';
  readonly location: TileLocation;
};

type TileCritter = {
  readonly __type__: 'critter';
  readonly location: TileLocation;
  readonly direction: number;
  readonly id: number;
  readonly species: string;
  readonly memory: readonly number[];
  readonly program?: string;
  readonly recentRuleID?: number;
};

type Tile = TileRock | TileFood | TileNothing | TileCritter;

type WorldState = {
  readonly timestamp: number;
  readonly version: number;
  readonly rate: number;
  readonly name: string;
  readonly population: number;
  readonly width: number;
  readonly height: number;
  readonly tiles: readonly Tile[];
};
