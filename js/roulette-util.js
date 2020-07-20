export const arcAdjust = -90; // Adjustment when drawing canvas arcs, because it draws from 90° instead of 0°.

export const KeyCodeEnum = Object.freeze({
  enter: 13,
});

export const AlignTextEnum = Object.freeze({
  left: 'left',
  right: 'right',
  center: 'center',
});

/**
 * Get a random integer between `min` (inclusive) and `max` (exclusive).
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Convert degrees to radians.
 */
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
 * Sum the value of the given key for each item.
 */
export function sum(items, key) {
  return items.reduce((a, b) => a + (b[key] || 0), 0);
}

/**
 * Return true if `angle` is between `arcStart` (inclusive) and `arcEnd` (exclusive).
 * Example: `(0, 359, 1) == true`
 * Example: `(0, 1, 2) == false`
 */
export function isAngleBetween(angle, arcStart, arcEnd) {
  if (arcStart < arcEnd)
   return arcStart <= angle && angle < arcEnd;
   return arcStart <= angle || angle < arcEnd;
}

/**
 * Calculate the largest font size that `text` can have without exceeding `maxWidth`.
 * Won't work unless `fontFamily` has been loaded.
 */
export function getFontSizeToFit(text, fontFamily, maxWidth, canvasContext) {
  canvasContext.save();
  canvasContext.font = `1px ${fontFamily}`;
  const w = canvasContext.measureText(text).width;
  canvasContext.restore();
  return maxWidth / w;
}
