const inputGroups = document.querySelectorAll('.input-group');

const wheelPropInits = {
  'borderColor': initTextbox,
  'borderWidth': initRange,
  'debug': initCheckbox,
  'image': initImage,
  'isInteractive': initCheckbox,
  'itemBackgroundColors': initTextboxArray,
  'itemLabelAlign': initTextbox,
  'itemLabelBaselineOffset': initRange,
  'itemLabelColors': initTextboxArray,
  'itemLabelFont': initTextbox,
  'itemLabelFontSizeMax': initRange,
  'itemLabelRadius': initRange,
  'itemLabelRadiusMax': initRange,
  'itemLabelRotation': initRange,
  //'items': TODO
  'lineColor': initTextbox,
  'lineWidth': initRange,
  //'offset': initRange,
  'overlayImage': initImage,
  'pixelRatio': initRange,
  'pointerAngle': initRange,
  'radius': initRange,
  'rotationResistance': initRange,
  'rotationSpeedMax': initRange,
}

for (const g of inputGroups) {

  const span = g.querySelector('h2 .prop-name');

  if (span) {
    span.textContent = g.dataset.name + ':';
  }

  if (wheelPropInits[g.dataset.name]) wheelPropInits[g.dataset.name](g);
}

document.querySelector('.btn.export').addEventListener('click', exportWheelAsJson);


function initRange(g) {
  g.querySelector('input').addEventListener('input', () => {
    const val = parseFloat(g.querySelector('input').value) * (g.dataset.multiplier ?? 1);
    g.querySelector('.prop-value').textContent = roundUp(val);
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = window.wheel[g.dataset.name];
  g.querySelector('.prop-value').textContent = roundUp(initialVal);
  g.querySelector('input').value = initialVal / (g.dataset.multiplier ?? 1);
}

function initCheckbox(g) {
  g.querySelector('input').addEventListener('input', () => {
    const val = g.querySelector('input').checked;
    g.querySelector('.prop-value').textContent = val;
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = window.wheel[g.dataset.name];
  g.querySelector('.prop-value').textContent = initialVal;
  g.querySelector('input').checked = initialVal;
}

function initImage(g) {
  const btnClear = g.querySelector('.btn.clear');
  const btnChoose = g.querySelector('.btn.choose');
  const input = g.querySelector('input');
  const localStorageKey = 'wheel.' + g.dataset.name;
  const reader = new FileReader();

  btnChoose.addEventListener('click', () => input.click());
  btnClear.addEventListener('click', () => clearImage());
  input.addEventListener('input', async () => await onInput());
  reader.addEventListener("load", () => setImage(reader.result));

  async function onInput () {
    const file = input.files[0];

    clearImage();

    if (!file) {
      return true;
    }

    if (file.size > 1000000) {
      alert('This file is too large. Please choose one < 1 MB');
      return true;
    }

    reader.readAsDataURL(file);
    return true;
  }

  function setImage(img) {
    if (!img) {
      clearImage();
      return;
    };

    btnClear.style.display = 'inline';
    g.querySelector('.prop-value').textContent = 'file';
    window.wheel[g.dataset.name] = img;
    localStorage.setItem(localStorageKey, img);
  }

  function clearImage() {
    input.value = '';
    btnClear.style.display = '';
    g.querySelector('.prop-value').textContent = '';
    window.wheel[g.dataset.name] = null;
    localStorage.removeItem(localStorageKey);
  }

  setImage(localStorage.getItem(localStorageKey))
}

function initTextbox(g) {
  g.querySelector('input').addEventListener('input', () => {
    const val = g.querySelector('input').value;
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = window.wheel[g.dataset.name];
  g.querySelector('input').value = initialVal;
}

function initTextboxArray(g) {
  g.querySelector('input').addEventListener('input', () => {
    let val = g.querySelector('input').value.split(',').map(i => i.trim());
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = window.wheel[g.dataset.name].join(', ');
  g.querySelector('input').value = initialVal;
}

function exportWheelAsJson() {
  const obj = {};
  for (const [key, value] of Object.entries(wheelPropInits)) {
    obj[key] = window.wheel[key];
  }
  downloadTextFile(JSON.stringify(obj, null, 2), 'spin-wheel-settings.json', 'text/json');
}

function roundUp(num = 0, decimalPlaces = 2) {
  if (num < 0) return -roundUp(-num, decimalPlaces);
  return +(Math.round(num + "e+" + decimalPlaces)  + "e-" + decimalPlaces);
}

function downloadTextFile(text, fileName, mimeType) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL( new Blob([text], {type: mimeType} ) );
  a.download = fileName;
  a.click();
}
