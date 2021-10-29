/**
 * Adjustment when drawing canvas arcs, because it draws from 90° instead of 0°.
 */
export const arcAdjust = -90;

export const fontScale = 500; // 500 seemed to be a good base value for this.

/**
 * Text alignment
 */
export const AlignText = Object.freeze({
  left: 'left',
  right: 'right',
  center: 'center',
});

/**
 * Wheel property defaults
 */
export const Defaults = Object.freeze({
  debug: false,
  image: '',
  isInteractive: true,
  itemBackgroundColors: [],
  itemLabelAlign: AlignText.right,
  itemLabelBaselineOffset: 0,
  itemLabelColors: [],
  itemLabelFont: 'sans-serif',
  itemLabelFontSizeMax: 100,
  itemLabelRadius: 0.85,
  itemLabelRadiusMax: 0.2,
  itemLabelRotation: 0,
  items: [],
  lineColor: '#000',
  lineWidth: 1,
  radius: 0.95,
  rotation: 0,
  rotationResistance: -35,
  rotationSpeed: 0,
  rotationSpeedMax: 250,
  offset: {w: 0, h: 0},
  onRest: null,
  onSpin: null,
  overlayImage: '',
  pointerRotation: 0,
});
