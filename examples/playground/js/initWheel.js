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
  itemBackgroundColors: ['#fff', '#eee', '#ddd'],
  itemLabelFontSizeMax: 40,
});

// Save object globally for easy debugging.
window.wheel = wheel;

// Log events for easy debugging:
document.addEventListener('spin-wheel:current-index-change', log);
document.addEventListener('spin-wheel:rest', log);
document.addEventListener('spin-wheel:spin', log);

function log(e) {
  console.log({eventType: e.type, ...e.detail});
}
