const inputGroups = document.querySelectorAll('.input-group');

for (const g of inputGroups) {

  // Add header:
  const header = document.createElement('h2');
  header.innerHTML = '<span class="prop-name"></span><span class="prop-value"></span>';
  header.querySelector('.prop-name').textContent = g.dataset.name + ':';
  g.prepend(header);

  if (g.dataset.type === 'textbox') {
    const el = document.createElement('input');
    el.type = 'input';
    g.append(el);
    initTextboxOrColor(g);
  } else if (g.dataset.type === 'color') {
    const el = document.createElement('input');
    el.type = 'color';
    g.append(el);
    initTextboxOrColor(g);
  } else if (g.dataset.type === 'textboxArray') {
    const el = document.createElement('input');
    el.type = 'input';
    g.append(el);
    initTextboxArray(g);
  } else if (g.dataset.type === 'range') {
    const el = document.createElement('input');
    el.type = 'range';
    el.min = g.dataset.min;
    el.max = g.dataset.max;
    g.append(el);
    initRange(g);
  } else if (g.dataset.type === 'checkbox') {
    const el = document.createElement('input');
    el.type = 'checkbox';
    g.append(el);
    initCheckbox(g);
  } else if (g.dataset.type === 'image') {
    g.insertAdjacentHTML('beforeend', `<input type="file" accept="image/*">
    <div>
      <label class="btn choose">Choose file...</label>
      <label class="btn clear">x</label>
    </div>`);
    initImage(g);
  }
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

  setImage(localStorage.getItem(localStorageKey));
}

function initTextboxOrColor(g) {
  g.querySelector('input').addEventListener('input', () => {
    const val = g.querySelector('input').value;
    window.wheel[g.dataset.name] = val;
    return true;
  });
  const initialVal = fixThreeCharHexColor( // Color input requires a 6 decimal hex
    window.wheel[g.dataset.name]
  );
  g.querySelector('input').value = initialVal;
}

function initTextboxArray(g) {
  g.querySelector('input').addEventListener('input', () => {
    const val = g.querySelector('input').value.split(',').map(i => i.trim());
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