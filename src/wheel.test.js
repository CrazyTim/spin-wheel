import {beforeEach, test, expect} from '@jest/globals';
import {Defaults} from './constants.js';
import * as fixture from '../scripts/test-fixture.js';
import {getInstanceProperties} from '../scripts/util.js';
import {Wheel} from '../src/wheel.js';

beforeEach(() => {
  fixture.initWheel();
});

test('Wheel default state is correct', () => {
  expect(fixture.wheel).toMatchSnapshot();
});

test('Wheel can be initialised with props', () => {
  fixture.createWheel(null);
  fixture.createWheel({});
});

test('Should throw when initialised without container param', () => {
  expect(() => {
    return new Wheel();
  }).toThrow('container must be an instance of Element');
});

test('Each Wheel property has a coresponding default value', () => {

  const wheelGetters = getInstanceProperties(fixture.wheel).setters;

  for (const i of wheelGetters) {
    expect(Defaults.wheel[i]).not.toBe(undefined);
  }

});

test('Each Wheel property is given a Default value when the Wheel is initalised', () => {

  const wheelGetters = getInstanceProperties(fixture.wheel).setters;

  for (const i of wheelGetters) {
    expect(fixture.wheel[i]).toEqual(Defaults.wheel[i]);
  }

});

test('getItemAngles() works', () => {

  fixture.addBlankItems(4);
  fixture.wheel.rotation = 90; // Rotation should not affect start/end angles

  const items = fixture.wheel.items;

  expect(items[0].getStartAngle()).toBe(0); // First start angle should be 0.
  expect(items[0].getEndAngle()).toBe(90);
  expect(items[1].getStartAngle()).toBe(90);
  expect(items[1].getEndAngle()).toBe(180);
  expect(items[3].getEndAngle()).toBe(360); // Last end angle should be 360.

});

test('getItemAngles() works when weighted', () => {

  fixture.wheel.items = [
    {weight: 2},
    {weight: 1},
    {weight: 1},
  ];

  const angles = fixture.wheel.getItemAngles();

  expect(angles[0].start).toBe(0);
  expect(angles[0].end).toBe(180);
  expect(angles[1].start).toBe(180);
  expect(angles[1].end).toBe(270);

});

test('Default value works for itemBackgroundColors', () => {

  fixture.wheel.items = [
    {},
    {backgroundColor: 'bar'},
  ];

  expect(fixture.wheel.items[0].backgroundColor).toBe(Defaults.item.backgroundColor);
  expect(fixture.wheel.items[1].backgroundColor).toBe('bar');

});

test('Default value works for itemLabelColors', () => {

  fixture.wheel.items = [
    {},
    {labelColor: 'bar'},
  ];

  expect(fixture.wheel.items[0].labelColor).toBe(Defaults.item.labelColor);
  expect(fixture.wheel.items[1].labelColor).toBe('bar');

});

test('spinToItem() works', () => {

  // Note: this is a simple integration test.
  // The full logic is tested elsewhere for `calcWheelRotationForTargetAngle`.

  fixture.addBlankItems(4);
  fixture.wheel.rotation = 0;

  // Clockwise:
  let direction = 1;
  let itemIndex = 0;
  const numberOfRevolutions = 0;
  fixture.wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);

  expect(fixture.wheel._spinToEndRotation).toBe(360 - 45);

  // Anti-clockwise:
  direction = -1;
  itemIndex = 0;
  fixture.wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);

  expect(fixture.wheel._spinToEndRotation).toBe(0 - 45);

  // Anti-clockwise, but rotation is just past target, so will have to spin almost 360 degrees again:
  direction = -1;
  itemIndex = 0;
  fixture.wheel.rotation = -46;
  fixture.wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);

  expect(fixture.wheel._spinToEndRotation).toBe(0 - 360 - 45);

  // Clockwise, pointer angle is below 180:
  direction = 1;
  itemIndex = 0;
  fixture.wheel.pointerAngle = 90;
  fixture.wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);

  expect(fixture.wheel._spinToEndRotation).toBe(45);

  // Clockwise, pointer angle is above 180:
  direction = 1;
  itemIndex = 0;
  fixture.wheel.pointerAngle = 270;
  fixture.wheel.spinToItem(itemIndex, 0, true, numberOfRevolutions, direction, null);

  expect(fixture.wheel._spinToEndRotation).toBe(270 - 45);

});

test('getRotationSpeedPlusDrag() works', () => {

  fixture.wheel.rotationResistance = -1;
  fixture.wheel.spin(2);

  // No time has elapsed (since the last frame), rotation speed should be unchanged:
  let delta = 0;
  expect(fixture.wheel.getRotationSpeedPlusDrag(delta)).toBe(2);

  // 1 millisecond has passed:
  delta = 1;
  expect(fixture.wheel.getRotationSpeedPlusDrag(delta)).toBe(1.999);

  delta = 100;
  expect(fixture.wheel.getRotationSpeedPlusDrag(delta)).toBe(1.900);

  delta = 2000;
  expect(fixture.wheel.getRotationSpeedPlusDrag(delta)).toBe(0);

  // Ensure rotation speed does not go past 0:
  delta = 2001;
  expect(fixture.wheel.getRotationSpeedPlusDrag(delta)).toBe(0); // Clockwise
  fixture.wheel.spin(-2);
  expect(fixture.wheel.getRotationSpeedPlusDrag(delta)).toBe(0); // Anti-clockwise

});

test('rotationSpeedMax works', () => {

  fixture.wheel.rotationSpeedMax = 1;

  fixture.wheel.spin(2);
  expect(fixture.wheel.rotationSpeed).toBe(1);

  fixture.wheel.spin(-2);
  expect(fixture.wheel.rotationSpeed).toBe(-1);

});