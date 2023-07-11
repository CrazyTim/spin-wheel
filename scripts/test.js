import {Wheel} from '../src/wheel.js';
import {jest} from '@jest/globals';

export function createWheel(props) {

  const container = document.createElement('div');
  jest.spyOn(container, 'clientWidth', 'get').mockReturnValue(500);
  jest.spyOn(container, 'clientHeight', 'get').mockReturnValue(500);

  document.body.appendChild(container);

  const wheel = new Wheel(container, props);
  addBlankItems(wheel, props?.numberOfItems);

  return wheel;

}

function addBlankItems (wheel, numberOfItems) {

  if (!numberOfItems) return;

  const newItems = [];
  for (let i = 0; i < numberOfItems; i++) {
    newItems.push({});
  }
  wheel.items = wheel.items.concat(newItems);

  return this;

}
