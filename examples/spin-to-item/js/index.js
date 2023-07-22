import {Wheel} from '../../../dist/spin-wheel-esm.js';
import * as easing from "https://cdn.skypack.dev/d3-ease@3";

window.onload = () => {

  const container = document.querySelector('.wheel-wrapper');
  const dropdownWinningItem = document.querySelector('select.winning-item');
  const dropdownEasingFunction = document.querySelector('select.easing-function');
  const dropdownRevolutions = document.querySelector('select.revolutions');

  const btnSpin = document.querySelector('.gui-wrapper button');

  const props = {
    debug: true, // So we can see pointer angle.
    items: [
      {
        label: 'Dog',
        weight: 6,
      },
      {
        label: 'Cat',
        weight: 4.9,
      },
      {
        label: 'Fish',
        weight: 4.1,
      },
      {
        label: 'Rabbit',
        weight: 3.7,
      },
      {
        label: 'Bird',
        weight: 3,
      },
      {
        label: 'Chicken',
        weight: 2.8,
      },
      {
        label: 'Lizard',
        weight: 2.5,
      },
      {
        label: 'Turtle',
        weight: 1,
      },
    ],
    itemLabelRadiusMax: .5,
  };

  const easingFunctions = [
    {
      label: 'default (easeSinOut)',
      function: null,
    },
    {
      label: 'easeSinInOut',
      function: easing.easeSinInOut,
    },
    {
      label: 'easeCubicOut',
      function: easing.easeCubicOut,
    },
    {
      label: 'easeCubicInOut',
      function: easing.easeCubicInOut,
    },
    {
      label: 'easeElasticOut',
      function: easing.easeElasticOut,
    },
    {
      label: 'easeBounceOut',
      function: easing.easeBounceOut,
    },
  ];

  window.wheel = new Wheel(container, props);

  // Initalise winning item dropdown:
  for (const [i, item] of wheel.items.entries()) {
    const opt = document.createElement('option');
    opt.textContent = item.label;
    opt.value = i;
    dropdownWinningItem.appendChild(opt);
  }

  // Initalise easing functions dropdown:
  for (const [i, item] of easingFunctions.entries()) {
    const opt = document.createElement('option');
    opt.textContent = item.label;
    opt.value = i;
    dropdownEasingFunction.appendChild(opt);
  }

  window.addEventListener('click', (e) => {

    // Listen for click event on spin button:
    if (e.target == btnSpin) {
      const winningItemIndex = fetchWinningItemIndexFromApi();
      const easing = easingFunctions[dropdownEasingFunction.value];
      const easingFunction = easing.function;
      const duration = 2600;
      const spinDirection = parseInt(document.querySelector('input[name="spinDirection"]:checked').value);
      const revolutions = parseInt(dropdownRevolutions.value);
      wheel.spinToItem(winningItemIndex, duration, true, revolutions, spinDirection, easingFunction);
    }

  });

  window.addEventListener('keyup', (e) => {

    if (e.target && e.target.matches('#pointerAngle')) {
      console.log(e.target.value);
      wheel.pointerAngle = parseInt(e.target.value) || 0;
    }

  });

  function fetchWinningItemIndexFromApi() {
    // Simulate a call to the back-end
    return dropdownWinningItem.value;
  }

}