import {test, expect} from '@jest/globals';
import {Defaults} from '../src/constants.js';
import {Item} from '../src/item.js';
import {createWheel} from '../scripts/test.js';
import {getInstanceProperties} from '../scripts/util.js';

test('Initial state is correct', () => {
  const wheel = createWheel();
  const item = new Item(wheel);
  expect(item).toMatchSnapshot();
});

test('Can be instantiated', () => {
  const wheel = createWheel({});
  new Item(wheel);
  new Item(wheel, null);
  new Item(wheel, {});
});

test('Should throw when instantiated without wheel param', () => {
  expect(() => {
    return new Item();
  }).toThrow('wheel must be an instance of Wheel');
});

test('A default value exists for each property', () => {

  const wheel = createWheel({});
  const item = new Item(wheel);
  const setters = getInstanceProperties(item).setters;

  for (const i of setters) {
    expect(Defaults.item[i]).not.toBe(undefined);
  }

});

test('Each property is given a default value when instantiated', () => {

  const wheel = createWheel();
  const item = new Item(wheel);
  const setters = getInstanceProperties(item).setters;

  for (const i of setters) {
    expect(item[i]).toEqual(Defaults.item[i]);
  }

});
