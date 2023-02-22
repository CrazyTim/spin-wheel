import {beforeEach, test, expect} from '@jest/globals';
import {Defaults} from './constants.js';
import * as fixture from '../scripts/test-fixture.js';
import {getInstanceProperties} from '../scripts/util.js';
import {Wheel} from '../src/wheel.js';
import * as easing from 'easing-utils';

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
  }).toThrow('container parameter');
});

test('Each Wheel property has a coresponding default value', () => {

  const wheelGetters = getInstanceProperties(fixture.wheel).getters;

  for (const i of wheelGetters) {
    expect(Defaults.wheel[i]).not.toBe(undefined);
  }

});

test('Each Wheel property is given a Default value when the Wheel is initalised', () => {

  const wheelGetters = getInstanceProperties(fixture.wheel).getters;

  for (const i of wheelGetters) {
    expect(fixture.wheel[i]).toEqual(Defaults.wheel[i]);
  }

});

test('getItemAngles() works', () => {

  fixture.addBlankItems(4);
  fixture.wheel.rotation = 90; // rotation should not affect start/end angles

  const items = fixture.wheel.items;

  expect(items[0].getStartAngle()).toBe(0); // First start angle should be 0.
  expect(items[3].getEndAngle()).toBe(360); // Last end angle should be 360.

  expect(items[0].getEndAngle()).toBe(90);
  expect(items[1].getStartAngle()).toBe(90);
  expect(items[1].getEndAngle()).toBe(180);

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

test('getRotationSpeedPlusDrag() works', () => {

  fixture.wheel.rotationSpeed = 100;
  fixture.wheel.rotationResistance = -5;
  fixture.wheel.lastRotationFrame = 0;
  const newRotationSpeed = fixture.wheel.getRotationSpeedPlusDrag(1000);

  expect(newRotationSpeed).toBe(95);

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

test ('Goto angle works', () => {

  fixture.addBlankItems(3);

});

test ('Goto item works', () => {

  expect(fixture.wheel.calcSpinToAngle(0, 0, 0)).toBe(0);
  expect(fixture.wheel.calcSpinToAngle(0, 90, 0)).toBe(360);
  expect(fixture.wheel.calcSpinToAngle(0, 180, 0)).toBe(360);
  expect(fixture.wheel.calcSpinToAngle(0, 270, 0)).toBe(360);

  expect(fixture.wheel.calcSpinToAngle(90, 0, 0)).toBe(270);
  expect(fixture.wheel.calcSpinToAngle(90, 90, 0)).toBe(270);
  expect(fixture.wheel.calcSpinToAngle(90, 180, 0)).toBe(270);
  expect(fixture.wheel.calcSpinToAngle(90, 270, 0)).toBe(270);

  expect(fixture.wheel.calcSpinToAngle(180, 0, 0)).toBe(180);
  expect(fixture.wheel.calcSpinToAngle(180, 90, 0)).toBe(180);
  expect(fixture.wheel.calcSpinToAngle(180, 180, 0)).toBe(180);
  expect(fixture.wheel.calcSpinToAngle(180, 270, 0)).toBe(540);

  expect(fixture.wheel.calcSpinToAngle(270, 0, 0)).toBe(90);
  expect(fixture.wheel.calcSpinToAngle(270, 90, 0)).toBe(90);
  expect(fixture.wheel.calcSpinToAngle(270, 180, 0)).toBe(450);
  expect(fixture.wheel.calcSpinToAngle(270, 270, 0)).toBe(450);

  // handles negative angles
  expect(fixture.wheel.calcSpinToAngle(0, 0, 0)).toBe(0);
  expect(fixture.wheel.calcSpinToAngle(0, -90, 0)).toBe(0);
  expect(fixture.wheel.calcSpinToAngle(0, -180, 0)).toBe(0);
  expect(fixture.wheel.calcSpinToAngle(0, -270, 0)).toBe(0);

  // -90 is same as 270
  expect(fixture.wheel.calcSpinToAngle(-90, 0, 0)).toBe(90);
  expect(fixture.wheel.calcSpinToAngle(-90, 90, 0)).toBe(90);
  expect(fixture.wheel.calcSpinToAngle(-90, 180, 0)).toBe(450);
  expect(fixture.wheel.calcSpinToAngle(-90, 270, 0)).toBe(450);

});

// TODO: add tests for item.angles to ensure they are inclusive/exclusive
