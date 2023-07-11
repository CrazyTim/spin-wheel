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

// Save object globally for easy debugging.
window.wheel = new Wheel(container, props);

// Log events for easy debugging:
document.addEventListener('spin-wheel:current-index-change', log);
document.addEventListener('spin-wheel:rest', log);
document.addEventListener('spin-wheel:spin', log);

function log(e) {
  console.log({eventType: e.type, ...e.detail});
}
