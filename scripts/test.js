import {Wheel} from '../src/wheel.js';
import {jest} from '@jest/globals';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

export function createWheel(props) {

  const wheel = new Wheel(createContainer(), props);
  addBlankItems(wheel, props?.numberOfItems);

  return wheel;

}

function addBlankItems(wheel, numberOfItems) {

  if (!numberOfItems) return;

  const newItems = [];
  for (let i = 0; i < numberOfItems; i++) {
    newItems.push({});
  }
  wheel.items = wheel.items.concat(newItems);

}

export function createContainer() {

  const container = document.createElement('div');
  jest.spyOn(container, 'clientWidth', 'get').mockReturnValue(500);
  jest.spyOn(container, 'clientHeight', 'get').mockReturnValue(500);
  return container;

}
