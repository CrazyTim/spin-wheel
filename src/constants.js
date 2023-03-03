/**
 * Adjustment when drawing canvas arcs, because it draws from 90° instead of 0°.
 */
export const arcAdjust = -90;

export const baseCanvasSize = 500; // 500 seemed to be a good value for this.

/**
 * The period in milliseconds that we record drag events.
 * Used to calculate how fast the wheel should spin after the drag ends.
 * For example, if the wheel was dragged 20 degrees over the last 250ms,
 * then it should continue rotating at a speed of 20 degrees every 250ms after the drag ends.
 */
export const dragCapturePeriod = 250;

/**
 * Text alignment enum.
 */
export const AlignText = Object.freeze({
  left: 'left',
  right: 'right',
  center: 'center',
});

/**
 * Wheel property defaults.
 */
export const Defaults = Object.freeze({
  wheel: {
    borderColor: '#000',
    borderWidth: 1,
    debug: false,
    image: null,
    isInteractive: true,
    itemBackgroundColors: ['#fff'],
    itemLabelAlign: AlignText.right,
    itemLabelBaselineOffset: 0,
    itemLabelColors: ['#000'],
    itemLabelFont: 'sans-serif',
    itemLabelFontSizeMax: baseCanvasSize,
    itemLabelRadius: 0.85,
    itemLabelRadiusMax: 0.2,
    itemLabelRotation: 0,
    items: [],
    lineColor: '#000',
    lineWidth: 1,
    pixelRatio: 0,
    radius: 0.95,
    rotation: 0,
    rotationResistance: -35,
    rotationSpeed: 0,
    rotationSpeedMax: 250,
    offset: {w: 0, h: 0},
    onCurrentIndexChange: null,
    onRest: null,
    onSpin: null,
    overlayImage: null,
    pointerAngle: 0,
  },
  item: {
    backgroundColor: null, // A value of null causes this to fall back to `Wheel.itemBackgroundColors`
    image: null,
    imageRadius: 0.5,
    imageRotation: 0,
    imageScale: 1,
    label: '',
    labelColor: null, // A value of null causes this to fall back to `Wheel.itemLabelColors`
    labelFont: null, // A value of null causes this to fall back to `Wheel.itemLabelFont`
    weight: 1,
  },
});

export const Debugging = Object.freeze({
  pointerLineColor: '#ff00ff',
  labelOutlineColor: '#ff00ff',
  labelRadiusColor: '#00ff00',
  dragEventHue: 200,
});
