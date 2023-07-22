import {test, expect} from '@jest/globals';
import {Defaults} from './constants.js';
import {createWheel} from '../scripts/test.js';
import {getInstanceProperties, delay} from '../scripts/util.js';
import {Wheel} from '../src/wheel.js';

test('Wheel default state is correct', () => {
  const wheel = createWheel();
  expect(wheel).toMatchSnapshot();
});

test('Wheel can be initialised with props', () => {
  createWheel(null);
  createWheel({});
});

test('Should throw when initialised without container param', () => {
  expect(() => {
    return new Wheel();
  }).toThrow('container must be an instance of Element');
});

test('Each Wheel property has a coresponding default value', () => {

  const wheel = createWheel();
  const setters = getInstanceProperties(wheel).setters;

  for (const i of setters) {
    expect(Defaults.wheel[i]).not.toBe(undefined);
  }

});

test('Each Wheel property is given a Default value when the Wheel is initalised', () => {

  const wheel = createWheel();
  const setters = getInstanceProperties(wheel).setters;

  for (const i of setters) {
    expect(wheel[i]).toEqual(Defaults.wheel[i]);
  }

});

test('getItemAngles() works', () => {

  const wheel = createWheel({
    numberOfItems: 4,
    rotation: 90, // Rotation should not affect start/end angles
  });

  expect(wheel.items[0].getStartAngle()).toBe(0); // First start angle should be 0.
  expect(wheel.items[0].getEndAngle()).toBe(90);
  expect(wheel.items[1].getStartAngle()).toBe(90);
  expect(wheel.items[1].getEndAngle()).toBe(180);
  expect(wheel.items[3].getEndAngle()).toBe(360); // Last end angle should be 360.

});

test('getItemAngles() works when weighted', () => {

  const wheel = createWheel({
    items: [
      {weight: 2},
      {weight: 1},
      {weight: 1},
    ],
  });

  const angles = wheel.getItemAngles();

  expect(angles[0].start).toBe(0);
  expect(angles[0].end).toBe(180);
  expect(angles[1].start).toBe(180);
  expect(angles[1].end).toBe(270);

});

test('Default value works for itemBackgroundColors', () => {

  const wheel = createWheel({
    items: [
      {},
      {backgroundColor: 'bar'},
    ],
  });

  expect(wheel.items[0].backgroundColor).toBe(Defaults.item.backgroundColor);
  expect(wheel.items[1].backgroundColor).toBe('bar');

});

test('Default value works for itemLabelColors', () => {

  const wheel = createWheel({
    items: [
      {},
      {labelColor: 'bar'},
    ],
  });

  expect(wheel.items[0].labelColor).toBe(Defaults.item.labelColor);
  expect(wheel.items[1].labelColor).toBe('bar');

});

test('spin() works', async () => {

  // Note: this test is not very precise.

  const wheel = createWheel({
    rotationResistance: -10,
  });

  wheel.spin(10);
  expect(wheel.rotationSpeed).toBe(10);

  // 0.5 seconds:
  await delay(500);
  expect(wheel.rotationSpeed).toBeCloseTo(5, 0);

  // 1 second:
  await delay(500);
  expect(wheel.rotationSpeed).toBeCloseTo(0, 0);
  expect(wheel.rotation).toBeCloseTo(5, 0);

});

test('spinTo() works', async () => {

  const wheel = createWheel();

  wheel.spinTo(360, 0);
  await delay(100);
  expect(wheel.rotation).toBe(360);

  wheel.spinTo(-360, 0);
  await delay(100);
  expect(wheel.rotation).toBe(-360);

});

test('spinToItem() works', async () => {

  // Note: this is a simple integration test.
  // The full logic is tested elsewhere for `calcWheelRotationForTargetAngle`.

  const wheel = createWheel({
    numberOfItems: 4,
  });

  // Clockwise:
  let direction = 1;
  let itemIndex = 0;
  const numberOfRevolutions = 0;

  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  await delay(100);
  expect(wheel.rotation).toBe(360 - 45);

  // Anti-clockwise:
  direction = -1;
  itemIndex = 0;
  wheel.rotation = 0;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  await delay(100);
  expect(wheel.rotation).toBe(0 - 45);

  // Anti-clockwise, but rotation is just past target, so will have to spin almost 360 degrees again:
  direction = -1;
  itemIndex = 0;
  wheel.rotation = -46;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  await delay(100);
  expect(wheel.rotation).toBe(0 - 360 - 45);

  // Clockwise, pointer angle is below 180:
  direction = 1;
  itemIndex = 0;
  wheel.pointerAngle = 90;
  wheel.rotation = 0;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  await delay(100);
  expect(wheel.rotation).toBe(45);

  // Clockwise, pointer angle is above 180:
  direction = 1;
  itemIndex = 0;
  wheel.pointerAngle = 270;
  wheel.rotation = 0;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  await delay(100);
  expect(wheel.rotation).toBe(270 - 45);

  // TODO: test number of revolutions

});

test('getRotationSpeedPlusDrag() works', () => {

  const wheel = createWheel({
    rotationResistance: -1,
  });

  wheel.spin(2);

  // No time has elapsed (since the last frame), rotation speed should be unchanged:
  let delta = 0;
  expect(wheel.getRotationSpeedPlusDrag(delta)).toBe(2);

  // 1 millisecond has passed:
  delta = 1;
  expect(wheel.getRotationSpeedPlusDrag(delta)).toBe(1.999);

  delta = 100;
  expect(wheel.getRotationSpeedPlusDrag(delta)).toBe(1.900);

  delta = 2000;
  expect(wheel.getRotationSpeedPlusDrag(delta)).toBe(0);

  // Ensure rotation speed does not go past 0:
  delta = 2001;
  expect(wheel.getRotationSpeedPlusDrag(delta)).toBe(0); // Clockwise
  wheel.spin(-2);
  expect(wheel.getRotationSpeedPlusDrag(delta)).toBe(0); // Anti-clockwise

});

test('rotationSpeedMax works', () => {

  const wheel = createWheel({
    rotationSpeedMax: 1,
  });

  wheel.spin(2);
  expect(wheel.rotationSpeed).toBe(1);

  wheel.spin(-2);
  expect(wheel.rotationSpeed).toBe(-1);

});
