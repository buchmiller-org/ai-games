/**
 * Grid Lock - Level Data
 */

const LEVELS = [
  {
    id: 1,
    blocks: [
      { id: 'target', x: 0, y: 2, len: 2, axis: 'h', isTarget: true },
      { id: 'b1', x: 2, y: 1, len: 3, axis: 'v' },
      { id: 'b2', x: 4, y: 2, len: 2, axis: 'v' },
      { id: 'b3', x: 1, y: 4, len: 3, axis: 'h' }
    ]
  },
  {
    id: 2,
    blocks: [
      { id: 'target', x: 0, y: 2, len: 2, axis: 'h', isTarget: true },
      { id: 'b1', x: 2, y: 2, len: 2, axis: 'v' },
      { id: 'b2', x: 3, y: 1, len: 3, axis: 'v' },
      { id: 'b3', x: 0, y: 4, len: 3, axis: 'h' },
      { id: 'b4', x: 4, y: 3, len: 2, axis: 'h' },
      { id: 'b5', x: 1, y: 0, len: 3, axis: 'h' },
      { id: 'b6', x: 5, y: 0, len: 3, axis: 'v' }
    ]
  },
  {
    id: 3,
    blocks: [
      { id: 'target', x: 1, y: 2, len: 2, axis: 'h', isTarget: true },
      { id: 'b1', x: 3, y: 0, len: 3, axis: 'v' },
      { id: 'b2', x: 1, y: 3, len: 3, axis: 'h' },
      { id: 'b3', x: 0, y: 3, len: 2, axis: 'v' },
      { id: 'b4', x: 3, y: 4, len: 2, axis: 'h' },
      { id: 'b5', x: 4, y: 2, len: 2, axis: 'v' },
      { id: 'b6', x: 4, y: 0, len: 2, axis: 'v' },
      { id: 'b8', x: 5, y: 3, len: 2, axis: 'v' },
      { id: 'b9', x: 0, y: 0, len: 2, axis: 'h' }
    ]
  }
];
