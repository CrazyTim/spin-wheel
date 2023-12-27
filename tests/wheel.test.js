import {jest, test, expect, beforeEach, afterEach} from '@jest/globals';
import {Defaults} from '../src/constants.js';
import {createWheel, createContainer} from '../scripts/test.js';
import {getInstanceProperties} from '../scripts/util.js';
import {Wheel} from '../src/wheel.js';

beforeEach(() => {
  jest.useFakeTimers();
  let count = 0;
  jest.spyOn(window, 'requestAnimationFrame')
    .mockImplementation(callback => {
      setTimeout(() => callback(count*100), 100); // Mocked frame will be called exactly every .1 seconds.
      return ++count; // Return frame id;
    });
});

afterEach(() => {
  window.requestAnimationFrame.mockRestore();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('Mocked requestAnimationFrame works', async () => {

  let time;
  const f = ((n = 0) => {
    time = n;
    window.requestAnimationFrame(f);
  });

  f();

  expect(time).toBe(0);
  jest.advanceTimersByTime(100);
  expect(time).toBe(100);
  jest.advanceTimersByTime(200);
  expect(time).toBe(300);
  jest.advanceTimersByTime(50);
  expect(time).toBe(300); // Should not advance because the mocked frame only renders every 100ms.

});

test('Initial state is correct', () => {
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

test('A default value exists for each property', () => {

  const wheel = createWheel();
  const setters = getInstanceProperties(wheel).setters;

  for (const i of setters) {
    expect(Defaults.wheel[i]).not.toBe(undefined);
  }

});

test('Each property is given a default value when instantiated', () => {

  const wheel = createWheel();
  const setters = getInstanceProperties(wheel).setters;

  for (const i of setters) {
    expect(wheel[i]).toEqual(Defaults.wheel[i]);
  }

});

test('Method "getItemAngles" works', () => {

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

test('Method "getItemAngles" works when weighted', () => {

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

test('Method "spin" works', async () => {

  const wheel = createWheel({
    rotationResistance: -10,
  });

  // Spin the wheel at 10 degrees/s:
  wheel.spin(10);
  expect(wheel.rotationSpeed).toBe(10);

  // 0.5 seconds elapsed.
  jest.advanceTimersByTime(500);
  expect(wheel.rotationSpeed).toBe(5);

  // 1 second elapsed.
  jest.advanceTimersByTime(500);
  expect(wheel.rotationSpeed).toBe(0);
  expect(wheel.rotation).toBe(5.5); // Wheel should finally rest at 5.5 degrees due to rotationResistance.

});

test('Method "spinTo" works', async () => {

  const wheel = createWheel();

  wheel.spinTo(360, 0);
  jest.advanceTimersByTime(100);
  expect(wheel.rotation).toBe(360);

  wheel.spinTo(-360, 0);
  jest.advanceTimersByTime(100);
  expect(wheel.rotation).toBe(-360);

});

test('Method "spinToItem" works', async () => {

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
  jest.advanceTimersByTime(100);
  expect(wheel.rotation).toBe(360 - 45);

  // Anti-clockwise:
  direction = -1;
  itemIndex = 0;
  wheel.rotation = 0;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  jest.advanceTimersByTime(100);
  expect(wheel.rotation).toBe(0 - 45);

  // Anti-clockwise, but rotation is just past target, so will have to spin almost 360 degrees again:
  direction = -1;
  itemIndex = 0;
  wheel.rotation = -46;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  jest.advanceTimersByTime(100);
  expect(wheel.rotation).toBe(0 - 360 - 45);

  // Clockwise, pointer angle is below 180:
  direction = 1;
  itemIndex = 0;
  wheel.pointerAngle = 90;
  wheel.rotation = 0;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  jest.advanceTimersByTime(100);
  expect(wheel.rotation).toBe(45);

  // Clockwise, pointer angle is above 180:
  direction = 1;
  itemIndex = 0;
  wheel.pointerAngle = 270;
  wheel.rotation = 0;
  wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);
  jest.advanceTimersByTime(100);
  expect(wheel.rotation).toBe(270 - 45);

  // TODO: test number of revolutions

});

test('Method "getRotationSpeedPlusDrag" works (resistance is applied to wheel correctly)', () => {

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

test('Property "rotationSpeedMax" works', () => {

  const wheel = createWheel({
    rotationSpeedMax: 1,
  });

  wheel.spin(2);
  expect(wheel.rotationSpeed).toBe(1);

  wheel.spin(-2);
  expect(wheel.rotationSpeed).toBe(-1);

});

test('Method "stop" works', () => {

  const wheel = createWheel({
    numberOfItems: 2,
    rotationResistance: 0,
  });

  const currentRotation = wheel.rotation;

  // Use Spin:
  wheel.spin(1);
  wheel.stop();
  expect(wheel.rotationSpeed).toBe(0);

  jest.advanceTimersByTime(1000);
  expect(wheel.rotation).toBe(currentRotation);

  // Use SpinTo:
  wheel.spinTo(180, 1);
  wheel.stop();

  jest.advanceTimersByTime(1000);
  expect(wheel.rotation).toBe(currentRotation);

});

test('Wheel can be removed from the DOM and added back again', () => {

  const wheel = createWheel({
    numberOfItems: 2,
  });

  wheel.remove();
  wheel.add(createContainer());

});

test('Event "currentIndexChange" is raised', async () => {

  const wheel = createWheel({
    numberOfItems: 2,
    rotationSpeedMax: 360,
    rotationResistance: 0,
    onCurrentIndexChange: jest.fn(),
  });

  wheel.spin(360);
  jest.advanceTimersByTime(600); // Advance to just after 180 degrees (because the angle check is exclusive of the end angle).

  expect(wheel.onCurrentIndexChange).toHaveBeenCalledTimes(1);
  expect(wheel.onCurrentIndexChange).toHaveBeenCalledWith({
    type: 'currentIndexChange',
    currentIndex: 0,
  });

});

test('Event "rest" is raised', async () => {

  const wheel = createWheel({
    numberOfItems: 2,
    rotationResistance: -10,
    onRest: jest.fn(),
  });

  wheel.spin(10);
  jest.advanceTimersByTime(1000);

  expect(wheel.onRest).toHaveBeenCalledTimes(1);
  expect(wheel.onRest).toHaveBeenCalledWith({
    type: 'rest',
    currentIndex: 1,
    rotation: 5.5,
  });

});

test('Event "spin" is raised', async () => {

  const wheel = createWheel({
    onSpin: jest.fn(),
  });

  wheel.spin(10);

  expect(wheel.onSpin).toHaveBeenCalledTimes(1);
  expect(wheel.onSpin).toHaveBeenCalledWith({
    type: 'spin',
    method: 'spin',
    rotationResistance: Defaults.wheel.rotationResistance,
    rotationSpeed: 10,
  });

});