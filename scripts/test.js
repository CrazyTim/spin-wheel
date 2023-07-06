import '../src/wheel.js';

export function createWheel(props) {

  const wheel = document.createElement('spin-wheel');

  document.body.appendChild(wheel);

  wheel.init(props);

  addBlankItems(wheel, props?.numberOfItems);

  return wheel;

}

function addBlankItems (wheel, numberOfItems) {

  if (!numberOfItems) return;

  const newItems = [];
  for (let i = 0; i < numberOfItems; i++) {
    newItems.push({});
  }
  wheel.items = wheel.items.concat(newItems);

  return this;

}