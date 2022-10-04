import {Wheel} from '../src/wheel.js';

export let wheel = null;

export function initWheel() {

  document.body.innerHTML = '<div class="wheel-wrapper"></div>';

  const container = document.querySelector('.wheel-wrapper');

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
