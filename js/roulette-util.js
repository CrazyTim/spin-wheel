export const arcAdjust = -90; // Adjustment when drawing canvas arcs, because it draws from 90° instead of 0°.

export const KeyCodeEnum = Object.freeze({
  enter: 13,
});

export const AlignTextEnum = Object.freeze({
  left: 'left',
  right: 'right',
  center: 'center',
});

export function getRandomInt(min, max) {
  // Min is inclusive and max is exclusive.
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function degRad(deg) {
  return deg * Math.PI / 180;
}

/**
 * Return a randomly shuffled copy of the array.
 * Use the Fisher-Yates shuffle algorithm.
 */
export function shuffleArray(array) {
  let a = array.slice(); // Clone array.
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // Get random index from 0 to i
    [a[i], a[j]] = [a[j], a[i]]; // Swap a[i] and a[j]
  }
  return a;
}

/**
 * Return `value` if it is defined, otherwise return `defaultValue`.
 */
export function setDefault(value, defaultValue) {
  return value !== undefined ? value : defaultValue;
}

/**
 * Sum the value of the given key for each item.
 */
export function sum(items, key) {
  return items.reduce((a, b) => a + (b[key] || 0), 0);
}

/**
 * Return true if `angle` is between `arcStart` and `arcEnd`.
 * `arcStart` is inclusive and `arcEnd` is exclusive.
 * Example: `(0, 349, 11) == true`
 */
export function isAngleBetween(angle, arcStart, arcEnd) {
  if (arcStart < arcEnd)
   return arcStart <= angle && angle < arcEnd;
   return arcStart <= angle || angle < arcEnd;
}
