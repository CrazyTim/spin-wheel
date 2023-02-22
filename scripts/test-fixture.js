import {Wheel} from '../src/wheel.js';
import {jest} from '@jest/globals';

export let wheel = null;

export function initWheel() {

  const container = document.createElement('div');

  jest.spyOn(container, 'clientWidth', 'get').mockReturnValue(500);
  jest.spyOn(container, 'clientHeight', 'get').mockReturnValue(500);

  wheel = new Wheel(container);

  return this;

}

export function addBlankItems (numberOfItems) {

  const newItems = [];

  for (let i = 0; i < numberOfItems; i++) {
    newItems.push({});
  }

  wheel.items = wheel.items.concat(newItems);

  return this;

}
