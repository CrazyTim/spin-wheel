import * as util from './util.js';

test('degRad() works', () => {
  const f = util.degRad;

  expect(f(-1)).toBe(-0.017453292519943295);
  expect(f(0)).toBe(0);
  expect(f(1)).toBe(0.017453292519943295);
  expect(f(360)).toBe(6.283185307179586);
});

test('sumObjArray() works', () => {
  const f = util.sumObjArray;

  const arr = [
    {a: 2, b: 4},
    {a: 8, b: 16},
    {a: 32},
    {b: 64},
  ];

  expect(f(arr, 'a')).toBe(42);
  expect(f(arr, 'b')).toBe(84);
});

test('sumObjArray() handles truthy/falsy values', () => {
  const f = util.sumObjArray;

  const arr = [
    // Truthy values:
    {a: 1},
    {a: true},
    {a: {}},
    {a: []},
    {a: i => {}},
    {a: new Set()},
    {a: new Map()},
    {a: new Date()},
    // Falsy values:
    {a: 0},
    {a: -0},
    {a: 0n},
    {a: ''},
    {a: false},
    {a: null},
    {a: undefined},
    {a: NaN},
  ];

  expect(f(arr, 'a')).toBe(8);
});

test('aveArray() works', () => {
  const f = util.aveArray;

  const arr = [0, 2, 4, 8];

  expect(f(arr)).toBe(3.5);
});

test('aveArray() handles truthy/falsy values', () => {
  const f = util.aveArray;

  const arr = [
    // Truthy values:
    1,
    true,
    {},
    [],
    i => {},
    new Set(),
    new Map(),
    new Date(),
    // Falsy values:
    0,
    -0,
    0n,
    '',
    false,
    null,
    undefined,
    NaN,
  ];

  expect(
    f(arr)
  ).toBe(0.5);
});

test('getMouseButtonsPressed() works', () => {
  const f = util.getMouseButtonsPressed;
  expect(f({buttons: 3})).toStrictEqual([1, 2]);
  expect(f({buttons: 12})).toStrictEqual([4, 8]);
  expect(f({buttons: 9})).toStrictEqual([1, 8]);
});

test('getDistanceBetweenPoints() works', () => {
  const f = util.getDistanceBetweenPoints;

  expect(f(
    {x: 0, y: 0},
    {x: 0, y: 0}
  )).toBe(0);

  expect(f(
    {x: 0, y: 0},
    {x: 0, y: 0}
  )).toBe(0);
});
