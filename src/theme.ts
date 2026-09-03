import { createTheme, type MantineColorsTuple } from '@mantine/core';

const stamp: MantineColorsTuple = [
  '#fdf1ef', '#f8dcd6', '#f0b8ac', '#e79280', '#df7057',
  '#d95a3a', '#b5402f', '#8f3021', '#732619', '#5c1e14',
];

const ink: MantineColorsTuple = [
  '#eef2f6', '#d3dde8', '#a9bfd4', '#7ea1c0', '#5986ac',
  '#3d6f97', '#2f5a7c', '#22344a', '#1a2838', '#121c27',
];

export const theme = createTheme({
  primaryColor: 'stamp',
  colors: { stamp, ink },
  fontFamily: '"Source Sans 3", -apple-system, sans-serif',
  headings: {
    fontFamily: '"IBM Plex Mono", monospace',
  },
  defaultRadius: 'md',
});
