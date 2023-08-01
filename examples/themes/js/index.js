import '../../../dist/spin-wheel.js';
import {loadFonts} from '../../../scripts/util.js';
import {props} from './props.js';

window.onload = async () => {
  await loadFonts(props.map(i => i.itemLabelFont));
  init();
}

function init() {

  const wheel = document.querySelector('spin-wheel');

  const dropdown = document.querySelector('select');

  // Initalise dropdown with the names of each example:
  for (const p of props) {
    const opt = document.createElement('option');
    opt.textContent = p.name;
    dropdown.appendChild(opt);
  }

  // Handle dropdown change:
  dropdown.onchange = () => {
    wheel.init({
      ...props[dropdown.selectedIndex],
      rotation: wheel.rotation, // Preserve value.
    });
  }

  // Select default:
  dropdown.options[0].selected = 'selected';
  dropdown.onchange();

  // Save object globally for easy debugging.
  window.wheel = wheel;

}