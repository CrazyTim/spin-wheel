import {test, expect} from '@jest/globals';
import * as util from './util.js';

test('degRad() works', () => {
  const f = util.degRad;

  expect(f(-1)).toBe(-0.017453292519943295);
  expect(f(0)).toBe(0);
  expect(f(1)).toBe(0.017453292519943295);
  expect(f(360)).toBe(6.283185307179586);
});

test('isAngleBetween() works', () => {
  const f = util.isAngleBetween;

  expect(f(0, 1, 2)).toBe(false);
  expect(f(0, 359, 1)).toBe(true); // angleStart and angleEnd can be either side of 0 degrees.
  expect(f(0, 0, 1)).toBe(true); // angleStart should be inclusive.
  expect(f(1, 0, 1)).toBe(false); // angleEnd should be exclusive.
});

test('aveArray() works', () => {
  const f = util.aveArray;

  expect(f([0, 2, 4, 8])).toBe(3.5);
  expect(f([])).toBe(0); // Empty array.
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

test('isPointInCircle() works', () => {
  const f = util.isPointInCircle;

  expect(f({x:0, y:0}, 0, 0, 0)).toBe(true);
  expect(f({x:1, y:1}, 0, 0, 0)).toBe(false);
  expect(f({x:1, y:1}, 0, 0, 5)).toBe(true);
});

test('addAngle() works', () => {
  const f = util.addAngle;

  expect(f(0, 0)).toBe(0);
  expect(f(0, 1)).toBe(1);
  expect(f(0, 360)).toBe(0);
  expect(f(0, 361)).toBe(1);
  expect(f(0, -1)).toBe(359);
  expect(f(0, -361)).toBe(359);
  expect(f(0, -360)).toBe(0);
});

test('diffAngle() works', () => {
  const f = util.diffAngle;

  expect(f(0, 360)).toBe(0);
  expect(f(0, 0)).toBe(0);
  expect(f(350, 0)).toBe(10);
  expect(f(0, 350)).toBe(-10);
  expect(f(0, 10)).toBe(10);
  expect(f(10, 0)).toBe(-10);
  expect(f(350, 10)).toBe(20);
  expect(f(180, 180)).toBe(0);
  expect(f(180, 170)).toBe(-10);
  expect(f(180, 190)).toBe(10);
});

test('isObject() works', () => {
  const f = util.isObject;

  expect(f({})).toBe(true);
  expect(f(1)).toBe(false);
  expect(f([])).toBe(false);
  expect(f(null)).toBe(false);
});
