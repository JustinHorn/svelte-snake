export const TILES_SQUARE_ROOT = 20;
export const MOVE_TIME = 250;
export const MAP = [...Array(TILES_SQUARE_ROOT).keys()].map((x) => [
  ...Array(TILES_SQUARE_ROOT).keys(),
]);
export const TILES = MAP.reduce((arr, curr, index) => {
  return [...arr, ...curr.map((v) => ({ x: index, y: v }))];
}, []);

export const INITIAL_SNAKE = [
  {
    head: true,
    direction: 0,
    x: 2,
    y: 2,
  },
  {
    x: 3,
    y: 2,
  },
  {
    x: 4,
    y: 2,
  },
  {
    x: 5,
    y: 2,
  },
  {
    x: 6,
    y: 2,
  },
];
