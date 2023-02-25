import {Wheel} from '../src/wheel.js';
import {jest} from '@jest/globals';

export let wheel = null;

export function initWheel(props = undefined) {
  wheel = createWheel(props);
  return this;
}

export function createWheel(props = undefined) {

  const container = document.createElement('div');

  jest.spyOn(container, 'clientWidth', 'get').mockReturnValue(500);
  jest.spyOn(container, 'clientHeight', 'get').mockReturnValue(500);

  return new Wheel(container, props);

}

export function addBlankItems (numberOfItems) {

  const newItems = [];

  for (let i = 0; i < numberOfItems; i++) {
    newItems.push({});
  }

  wheel.items = wheel.items.concat(newItems);

  return this;

}
