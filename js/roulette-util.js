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
 * Sum the given property for each object in `array`.
 * Falsy values are treated as 0.
 */
export function sumObjArray(array, property) {
  return array.reduce((a, b) => a + (b[property] || 0), 0);
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
 * Average the values in `array`.
 * Falsy values are treated as 0.
 * An empty array will return 0.
 */
export function avgArray(array) {
  return array.reduce((a, b) => a + (b || 0), 0) / array.length || 0;
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

// x, y is the point to test
// cx, cy is circle center
// radius is circle radius
export function isPointInCircle(x, y, cx, cy, radius) {
  var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}

export function translateXYToCanvas(x, y, canvas) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: x - rect.left,
    y: y - rect.top,
  };
}

export function getMouseButtonsPressed(event) {
  return [1,2,4,8,16].filter(i => event.buttons & i);
}

export function getAngle(originX, originY, targetX, targetY) {
    var dx = originX - targetX;
    var dy = originY - targetY;

    // var theta = Math.atan2(dy, dx);  // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = west
    // theta *= 180 / Math.PI;          // [0, 180] then [-180, 0]; clockwise; 0° = west
    // if (theta < 0) theta += 360;     // [0, 360]; clockwise; 0° = west

    // var theta = Math.atan2(-dy, dx); // [0, Ⲡ] then [-Ⲡ, 0]; anticlockwise; 0° = west
    // theta *= 180 / Math.PI;          // [0, 180] then [-180, 0]; anticlockwise; 0° = west
    // if (theta < 0) theta += 360;     // [0, 360]; anticlockwise; 0° = west

    // var theta = Math.atan2(dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; anticlockwise; 0° = east
    // theta *= 180 / Math.PI;          // [0, 180] then [-180, 0]; anticlockwise; 0° = east
    // if (theta < 0) theta += 360;     // [0, 360]; anticlockwise; 0° = east

    var theta = Math.atan2(-dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = east
    theta *= 180 / Math.PI;           // [0, 180] then [-180, 0]; clockwise; 0° = east
    if (theta < 0) theta += 360;      // [0, 360]; clockwise; 0° = east

    return theta;
}

/**
 * Return the distance between two points.
 */
export function distanceBetweenPoints(x1,y1, x2, y2) {
  return Math.hypot(x2-x1, y2-y1);
}

// Add two angles together.
// The result will be a valid angle between 0 and 359.9999.
// tests:
// 0 + 0 = 0
// 0 + 1 = 1
// 0 + 360 = 0
// 0 + 361 = 1
// 0 + -1 = 359
// 0 + -361 = 359
// 0 + -360 = 0
export function addAngle(a1, a2) {
  let sum = a1 + a2;
  if (sum > 0)
    return sum % 360;
    return 360 + (sum % 360);
}
