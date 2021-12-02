/**
 * Get a random integer between `min` (inclusive) and `max` (exclusive).
 */
export function getRandomInt(min = 0, max = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Convert degrees to radians.
 */
export function degRad(degrees = 0) {
  return degrees * Math.PI / 180;
}

/**
 * Sum the given property for each object in `array`.
 * Only operate on truthy values.
 * Truthy values that are not Numbers count as 1.
 * An empty array will return 0.
 */
export function sumObjArray(array, property) {
  let sum = 0;
  for (const i of array) {
    const val = i[property];
    if (val) sum += ((typeof val === 'number') ? val : 1);
  }
  return sum;
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
 * Only operate on truthy values.
 * Truthy values that are not Numbers count as 1.
 * An empty array will return 0.
 */
export function aveArray(array = []) {
  let sum = 0;
  for (const val of array) {
    if (val) sum += ((typeof val === 'number') ? val : 1);
  }
  return sum / array.length || 0;
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

/**
 * Return true if the given x/y point is inside a circle.
 * cx, cy is circle center.
 * radius is circle radius.
 */
export function isPointInCircle(point = {x: 0, y: 0}, cx, cy, radius) {
  const distancesquared = (point.x - cx) * (point.x - cx) + (point.y - cy) * (point.y - cy);
  return distancesquared <= radius * radius;
}

/**
 * Translate the given x/y point from the viewport's coordinate space to the element's coordinate space.
 */
export function translateXYToElement(point = {x: 0, y: 0}, element = {}) {
  const rect = element.getBoundingClientRect();
  return {
    x: point.x - rect.left,
    y: point.y - rect.top,
  };
}

export function getMouseButtonsPressed(event = {}) {
  return [1, 2, 4, 8, 16].filter(i => event.buttons & i);
}

export function getAngle(originX, originY, targetX, targetY) {
    const dx = originX - targetX;
    const dy = originY - targetY;

    // var theta = Math.atan2(dy, dx);  // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = west
    // theta *= 180 / Math.PI;          // [0, 180] then [-180, 0]; clockwise; 0° = west
    // if (theta < 0) theta += 360;     // [0, 360]; clockwise; 0° = west

    // var theta = Math.atan2(-dy, dx); // [0, Ⲡ] then [-Ⲡ, 0]; anticlockwise; 0° = west
    // theta *= 180 / Math.PI;          // [0, 180] then [-180, 0]; anticlockwise; 0° = west
    // if (theta < 0) theta += 360;     // [0, 360]; anticlockwise; 0° = west

    // var theta = Math.atan2(dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; anticlockwise; 0° = east
    // theta *= 180 / Math.PI;          // [0, 180] then [-180, 0]; anticlockwise; 0° = east
    // if (theta < 0) theta += 360;     // [0, 360]; anticlockwise; 0° = east

    let theta = Math.atan2(-dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = east
    theta *= 180 / Math.PI; // [0, 180] then [-180, 0]; clockwise; 0° = east
    if (theta < 0) theta += 360; // [0, 360]; clockwise; 0° = east

    return theta;
}

/**
 * Return the distance between two points.
 */
export function getDistanceBetweenPoints(point1 = {x: 0, y: 0}, point2 = {x: 0, y: 0}) {
  return Math.hypot(point2.x - point1.x, point2.y - point1.y);
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
export function addAngle(a1 = 0, a2 = 0) {
  const sum = a1 + a2;
  if (sum > 0)
    return sum % 360;
    return 360 + (sum % 360);
}
