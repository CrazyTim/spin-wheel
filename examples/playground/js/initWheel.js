import {Wheel} from '../../../dist/spin-wheel-esm.js';

const props = {
  items: [
    {
      label: 'one',
    },
    {
      label: 'two',
    },
    {
      label: 'three',
    },
  ],
  itemBackgroundColors: ['#fff', '#eee', '#ddd'],
  itemLabelFontSizeMax: 40,
};

const container = document.querySelector('.wheel-wrapper');

window.wheel = new Wheel(container, props);