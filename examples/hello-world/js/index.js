import '../../../dist/spin-wheel.js'

const wheel = document.querySelector('spin-wheel');

wheel.init({
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
});

// Save object globally for easy debugging.
window.wheel = wheel;