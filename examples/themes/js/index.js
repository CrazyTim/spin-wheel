import {Wheel} from '../../../dist/spin-wheel-esm.js';
import {loadFonts} from '../../../scripts/util.js';
import {props} from './props.js';

window.onload = async () => {

  await loadFonts(props.map(i => i.itemLabelFont));

  const wheel = new Wheel(document.querySelector('.wheel-wrapper'));
  const dropdown = document.querySelector('select');

  // Initalise dropdown with the names of each example:
  for (const p of props) {
    const opt = document.createElement('option');
    opt.textContent = p.name;
    dropdown.append(opt);
  }

  // Handle dropdown change:
  dropdown.onchange = () => {
    wheel.init({
      ...props[dropdown.selectedIndex],
      rotation: wheel.rotation, // Preserve value.
    });
  };

  // Select default:
  dropdown.options[0].selected = 'selected';
  dropdown.onchange();

  // Save object globally for easy debugging.
  window.wheel = wheel;

  const btnSpin = document.querySelector('button');
  let modifier = 0;

  window.addEventListener('click', (e) => {

    // Listen for click event on spin button:
    if (e.target === btnSpin) {
      const {duration, winningItemRotaion} = calcSpinToValues();
      wheel.spinTo(winningItemRotaion, duration);
    }

  });

  function calcSpinToValues() {
    const duration = 3000;
    const winningItemRotaion = getRandomInt(360, 360 * 1.75) + modifier;
    modifier += 360 * 1.75;
    return {duration, winningItemRotaion};
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

};