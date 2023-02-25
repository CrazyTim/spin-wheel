import {beforeEach, test, expect} from '@jest/globals';
import * as fixture from '../scripts/test-fixture.js';
import {Wheel} from './wheel.js';
import {Item} from './item.js';

beforeEach(() => {
  fixture.initWheel();
});

test('Item default state is correct', () => {
  const item = new Item(fixture.wheel);
  expect(item).toMatchSnapshot();
});

test('Item can be initialised', () => {
  new Item(fixture.wheel);
  new Item(fixture.wheel, null);
  new Item(fixture.wheel, {});
});

test('Should throw when initialised without wheel param', () => {
  expect(() => {
    return new Item();
  }).toThrow('wheel parameter');
});
