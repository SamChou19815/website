import { SanctionedColor } from '../models/common-types';

export const APP_NAME = 'Tasks (Alpha)';

export type Page = 'Landing Page' | 'Tasks View' | 'Graph View';

export const pages: readonly Page[] = ['Landing Page', 'Tasks View', 'Graph View'];

export const sanctionedColors: readonly SanctionedColor[] = [
  'Red',
  'Pink',
  'Purple',
  'Indigo',
  'Blue',
  'Teal',
  'Green',
  'Light Green',
  'Orange',
  'Gray'
];

export const sanctionedColorMapping = {
  Red: '#f44336',
  Pink: '#e91e63',
  Purple: '#9c27b0',
  Indigo: '#3f51b5',
  Blue: '#2196f3',
  Teal: '#009688',
  Green: '#4caf50',
  'Light Green': '#8bc34a',
  Orange: '#ff9800',
  Gray: '#607d8b'
} as const;
