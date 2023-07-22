import {test, expect} from '@jest/globals';
import {createWheel} from '../scripts/test.js';
import {Item} from './item.js';

test('Item default state is correct', () => {
  const wheel = createWheel();
  const item = new Item(wheel);
  expect(item).toMatchSnapshot();
});

test('Item can be initialised', () => {
  const wheel = createWheel({});
  new Item(wheel);
  new Item(wheel, null);
  new Item(wheel, {});
});

test('Should throw when initialised without wheel param', () => {
  expect(() => {
    return new Item();
  }).toThrow('wheel must be an instance of Wheel');
});
