import {Wheel} from '../src/wheel.js';

export default {

  useWheel: () => {

    document.body.innerHTML = '<div class="wheel-wrapper"></div>';

    const container = document.querySelector('.wheel-wrapper');

    window.wheel = new Wheel(container);

    return this;
  }

}
