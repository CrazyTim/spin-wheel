import {beforeAll, test, expect} from '@jest/globals';
import * as util from './util.js';
import {Defaults} from './constants.js';
import {Wheel} from './wheel.js';
import setup from '../scripts/test-setup.js';
import {getInstanceProperties} from '../scripts/util.js';

beforeAll(() => {
  setup.useWheel();
});

test('Each Wheel property has a coresponding default value', () => {

  const wheelGetters = getInstanceProperties(window.wheel).getters;

  for (const i of wheelGetters) {
    expect(Defaults.wheel[i]).not.toBe(undefined);
  }

});

test('Each Wheel property is given a Default value when the Wheel is initalised', () => {

  const wheelGetters = getInstanceProperties(window.wheel).getters;

  for (const i of wheelGetters) {
    expect(window.wheel[i]).toEqual(Defaults.wheel[i]);
  }

});

test ('getItemAngles() works', () => {

  setup.addBlankItems(4);
  window.wheel.rotation = 90;

  const angles = window.wheel.getItemAngles();

  expect(angles[0].start).toBe(0); // First start angle should be 0.
  expect(angles[3].end).toBe(angles[0].start + 360); // Last angle.end must be the same as first angle.start.

  expect(angles[0].end).toBe(90);
  expect(angles[1].start).toBe(90);
  expect(angles[1].end).toBe(180);

});

test ('getItemAngles() works when weighted', () => {

  window.wheel.items = [
    {weight: 2},
    {weight: 1},
    {weight: 1},
  ];

  const angles = window.wheel.getItemAngles();

  expect(angles[0].start).toBe(0);
  expect(angles[0].end).toBe(180);
  expect(angles[1].start).toBe(180);
  expect(angles[1].end).toBe(270);

});
