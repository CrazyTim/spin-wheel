import {Wheel} from '../src/wheel.js';

export default {

  useWheel: () => {

    document.body.innerHTML = '<div class="wheel-wrapper"></div>';

    const container = document.querySelector('.wheel-wrapper');

    window.wheel = new Wheel(container);

    return this;

  },

  // Add n items:
  addBlankItems: (numberOfItems) => {

    const items = [];

    for (let i = 0; i < numberOfItems; i++) {
      items.push({});
    }

    window.wheel.items = items;

    return this;

  },

}
