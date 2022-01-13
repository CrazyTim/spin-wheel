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
