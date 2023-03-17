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
 * Return 0 if the array is empty.
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
 * Return true if the given point is inside a circle.
 * cx, cy is circle center.
 * radius is circle radius.
 */
export function isPointInCircle(point = {x: 0, y: 0}, cx, cy, radius) {
  const distanceSquared = ((point.x - cx) ** 2) + ((point.y - cy) ** 2);
  return distanceSquared <= (radius ** 2);
}

/**
 * Translate the given point from the viewport's coordinate space to the element's coordinate space.
 */
export function translateXYToElement(point = {x: 0, y: 0}, element = {}, devicePixelRatio = 1) {
  const rect = element.getBoundingClientRect();
  return {
    x: (point.x - rect.left) * devicePixelRatio,
    y: (point.y - rect.top) * devicePixelRatio,
  };
}

export function getMouseButtonsPressed(event = {}) {
  return [1, 2, 4, 8, 16].filter(i => event.buttons & i);
}

/**
 * Source: https://stackoverflow.com/a/47653643/737393
 */
export function getAngle(originX, originY, targetX, targetY) {
    const dx = originX - targetX;
    const dy = originY - targetY;

    let theta = Math.atan2(-dy, -dx);
    theta *= 180 / Math.PI;
    if (theta < 0) theta += 360;

    return theta;
}

/**
 * Return the distance between two points.
 */
export function getDistanceBetweenPoints(point1 = {x: 0, y: 0}, point2 = {x: 0, y: 0}) {
  return Math.hypot(point2.x - point1.x, point2.y - point1.y);
}

/**
 * Add two angles together.
 * Return a positive number between 0 and 359.9999.
 */
export function addAngle(a = 0, b = 0) {
  const sum = a + b;
  let result;

  if (sum > 0) {
    result = sum % 360;
  } else {
    result = 360 + (sum % 360);
  }
  if (result === 360) result = 0;

  return result;
}

/**
 * Return the shortest difference between two angles.
 * Only accept angles between 0 and 360.
 */
export function diffAngle(a = 0, b = 0) {
  const offsetFrom180 = 180 - b;
  const aWithOffset = addAngle(a, offsetFrom180);
  return 180 - aWithOffset;
}

export function isObject(v) {
  return typeof v === 'object' && !Array.isArray(v) && v !== null;
}

/**
 * Return true if image has loaded.
 */
export function isImageLoaded(image) {
  // We can detect a broken image (didn't load) by checking the natural width/height.
  return image && image.complete && image.naturalWidth !== 0 && image.naturalHeight !== 0;
}
