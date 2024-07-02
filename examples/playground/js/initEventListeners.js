const inputGroups = document.querySelectorAll('.input-group');

for (const g of inputGroups) {

  // Add header:
  const header = document.createElement('h2');
  header.innerHTML = '<span class="prop-name"></span><span class="prop-value"></span>';
  header.querySelector('.prop-name').textContent = g.dataset.name + ':';
  g.prepend(header);

  if (g.dataset.type === 'textbox') {
    initTextboxOrColor(g, 'input');
  } else if (g.dataset.type === 'color') {
    initTextboxOrColor(g, 'color');
  } else if (g.dataset.type === 'textboxArray') {
    initTextboxArray(g);
  } else if (g.dataset.type === 'range') {
    initRange(g);
  } else if (g.dataset.type === 'checkbox') {
    initCheckbox(g);
  } else if (g.dataset.type === 'select') {
    initSelect(g);
  } else if (g.dataset.type === 'image') {
    initImage(g);
  }
}

document.querySelector('.btn.export').addEventListener('click', exportWheelAsJson);

function initRange(g) {
  const el = document.createElement('input');
  el.type = 'range';
  el.min = g.dataset.min;
  el.max = g.dataset.max;
  g.append(el);

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
  const el = document.createElement('input');
  el.type = 'checkbox';
  g.append(el);

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
  g.insertAdjacentHTML('beforeend',
    `<input type="file" accept="image/*">
    <div>
      <label class="btn choose">Choose file...</label>
      <label class="btn clear">x</label>
    </div>`);

  const btnClear = g.querySelector('.btn.clear');
  const btnChoose = g.querySelector('.btn.choose');
  const input = g.querySelector('input');
  const localStorageKey = 'wheel.' + g.dataset.name;
  const reader = new FileReader();

  btnChoose.addEventListener('click', () => input.click());
  btnClear.addEventListener('click', () => clearImage());
  input.addEventListener('input', async () => await onInput());
  reader.addEventListener('load', () => setImage(reader.result));

  async function onInput() {
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

    const val = new Image();
    val.src = img;

    btnClear.style.display = 'inline';
    g.querySelector('.prop-value').textContent = 'file';
    window.wheel[g.dataset.name] = val;
    localStorage.setItem(localStorageKey, img);
  }

  function clearImage() {
    input.value = '';
    btnClear.style.display = '';
    g.querySelector('.prop-value').textContent = '';
    window.wheel[g.dataset.name] = null;
    localStorage.removeItem(localStorageKey);
  }

  setImage(localStorage.getItem(localStorageKey));
}

function initSelect(g, options) {
  const el = document.createElement('select');
  g.append(el);

  const select = g.querySelector('select');
  for (const option of g.dataset.options.split('|')) {
    select.insertAdjacentHTML('beforeend',
      `<option value=${option}>${option}</option>`);
  }

  g.querySelector('select').addEventListener('change', () => {
    const val = select.value;
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = window.wheel[g.dataset.name];
  g.querySelector('select').value = initialVal;
}

function initTextboxOrColor(g, type = 'input') {
  const el = document.createElement('input');
  el.type = type;
  g.append(el);

  g.querySelector('input').addEventListener('input', () => {
    const val = g.querySelector('input').value;
    if (type === 'color') g.querySelector('.prop-value').textContent = val;
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = fixThreeCharHexColor( // Color input requires a 6 decimal hex
    window.wheel[g.dataset.name]
  );
  if (type === 'color') g.querySelector('.prop-value').textContent = initialVal;
  g.querySelector('input').value = initialVal;
}

function initTextboxArray(g) {
  const el = document.createElement('input');
  el.type = 'input';
  g.append(el);

  g.querySelector('input').addEventListener('input', () => {
    const val = g.querySelector('input').value.split(',').map(i => i.trim());
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = window.wheel[g.dataset.name].join(', ');
  g.querySelector('input').value = initialVal;
}

function exportWheelAsJson() {
  const json = {};
  for (const g of inputGroups) {
    const key = g.dataset.name;
    json[key] = window.wheel[key];
  }
  downloadTextFile(JSON.stringify(json, null, 2), 'spin-wheel-settings.json', 'text/json');
}

function roundUp(num = 0, decimalPlaces = 2) {
  if (num < 0) return -roundUp(-num, decimalPlaces);
  return +(Math.round(num + 'e+' + decimalPlaces) + 'e-' + decimalPlaces);
}

function downloadTextFile(text, fileName, mimeType) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], {type: mimeType}));
  a.download = fileName;
  a.click();
}

function fixThreeCharHexColor(s) {
  if (typeof s !== 'string' || s.length !== 4 || s[0] !== '#') return s;
  return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
}