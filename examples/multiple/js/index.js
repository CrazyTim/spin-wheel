import {Wheel} from '../../../dist/spin-wheel-esm.js';

window.onload = () => {

  const WHEEL_2_INITIAL_ROTATION = 50;

  const props1 = {
    items: [
      {
        label: 'zero',
      },
      {
        label: 'one',
      },
      {
        label: 'two',
      },
      {
        label: 'three',
      },
        {
        label: 'four',
      },
      {
        label: 'five',
      },
      {
        label: 'six',
      },
      {
        label: 'seven',
      },
    ],
    itemLabelFontSizeMax: 40,
    itemLabelRadius: 0.95,
    isInteractive: false,
    rotation: 0,
    onRest: e => console.log(e),
  };

  const container1 = document.querySelector('.wheel-1');
  window.wheel1 = new Wheel(container1, props1);

  const props2 = {
    items: [
      {
        label: '0',
      },
      {
        label: '1',
      },
      {
        label: '2',
      },
      {
        label: '3',
      },
      {
        label: '4',
      },
    ],
    itemLabelFontSizeMax: 40,
    radius: 0.4,
    isInteractive: false,
    rotation: WHEEL_2_INITIAL_ROTATION,
    onRest: e => console.log(e),
  };

  const container2 = document.querySelector('.wheel-2');
  window.wheel2 = new Wheel(container2, props2);

  const btnSpin = document.querySelector('button');
  let modifier = 0;

  window.addEventListener('click', (e) => {

    // Listen for click event on spin button:
    if (e.target === btnSpin) {
      const {duration, winningItemRotaion} = calcSpinToValues();
      wheel1.spinTo(winningItemRotaion, duration);
      wheel2.spinTo(winningItemRotaion + WHEEL_2_INITIAL_ROTATION, duration);
    }

  });

  function calcSpinToValues() {
    const duration = 2600;
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