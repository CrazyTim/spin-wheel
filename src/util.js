/**
 * Get a random integer between `min` (inclusive) and `max` (exclusive).
 */
export function getRandomInt(min = 0, max = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Get a random number between `min` (inclusive) and `max` (inclusive).
 * Control the number of decimal places with `round`.
 */
export function getRandomFloat(min = 0, max = 0, round = 14) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(round));
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
  if (arcStart < arcEnd) return arcStart <= angle && angle < arcEnd;
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
 * Return the shortest difference (in degrees) between two angles.
 * Only accept angles between 0 and 360.
 */
export function diffAngle(a = 0, b = 0) {
  const offsetFrom180 = 180 - b;
  const aWithOffset = addAngle(a, offsetFrom180);
  return 180 - aWithOffset;
}

/**
 * Calculate what the new rotation of a wheel should be, so that the relative angle `targetAngle` will be at 0 degrees (north).
 * targetAngle = a value between 0 and 360.
 * direction = the direction the wheel can spin. 1 for clockwise, -1 for antiClockwise.
 */
export function calcWheelRotationForTargetAngle(currentRotation = 0, targetAngle = 0, direction = 1) {

  let angle = ((currentRotation % 360) + targetAngle) % 360;

  // Ignore tiny values.
  // Due to floating point arithmetic, ocassionally the input angles won't add up exactly
  // and this can push the angle slightly above 360.
  angle = fixFloat(angle);

  // Apply direction:
  angle = ((direction === 1) ? (360 - angle) : 360 + angle) % 360;
  angle *= direction;

  return currentRotation + angle;
}

export function isObject(v) {
  return typeof v === 'object' && !Array.isArray(v) && v !== null;
}

export function isNumber(n) {
  return typeof n === 'number' && !Number.isNaN(n);
}

export function setProp({val, isValid, errorMessage, defaultValue, action = null}) {
  if (isValid) {
    return (action) ? action() : val;
  } else if (val === undefined) {
    return defaultValue;
  }
  throw new Error(errorMessage);
}

export function fixFloat(f = 0) {
  return Number(f.toFixed(9));
}

/**
 * Easing function.
 */
export function easeSinOut(n) {
  return Math.sin((n * Math.PI) / 2);
}

export function getResizeObserver(element = {}, callBack = {}) {

  if (window.ResizeObserver) {

    const observer = new ResizeObserver(() => {
      // We need to trigger a re-draw because there will be a canvas flicker when there is throttling on drawing.
      // Probably because the observer is called in the same animation frame as the resize event.
      // Note: the `Window.resize` event (see below) doesn't cause this flicker for some reason.
      // See this thread for a description of this issue: https://github.com/pixijs/pixijs/issues/3395#issuecomment-328334633
      callBack({redraw: true});
    });

    observer.observe(element);

    return {
      stop: () => { // TODO: test
        observer.unobserve(element);
        observer.disconnect();
      },
    };

  }

  // The browser does not support ResizeObserver.
  // Fallback to using `Window.resize`.
  // This method will not work in all scenarios, and you may still need to manually trigger a refresh.
  // For example when the element is inside a dialog, or when setting css display style to `none`.
  window.addEventListener('resize', callBack);

  return {
    stop: () => {
      window.removeEventListener('resize', callBack);
    },
  };

}
