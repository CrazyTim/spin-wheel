import * as util from './util.js';
import {Defaults} from './constants.js';

export class Item {

  constructor(wheel, props = {}) {

    // Validate params.
    if (!util.isObject(wheel)) throw new Error('wheel must be an instance of Wheel'); // Ideally we would use instanceof, however importing the Wheel class would create a circular ref.
    if (!util.isObject(props) && props !== null) throw new Error('props must be an Object or null');

    this._wheel = wheel;

    // Assign default values.
    // This avoids null exceptions when we initalise each property one-by-one in `init()`.
    for (const i of Object.keys(Defaults.item)) {
      this['_' + i] = Defaults.item[i];
    }

    if (props) {
      this.init(props);
    } else {
      this.init(Defaults.item);
    }

  }

  /**
   * Initialise all properties.
   */
  init(props = {}) {
    this.backgroundColor = props.backgroundColor;
    this.image = props.image;
    this.imageOpacity = props.imageOpacity;
    this.imageRadius = props.imageRadius;
    this.imageRotation = props.imageRotation;
    this.imageScale = props.imageScale;
    this.label = props.label;
    this.labelColor = props.labelColor;
    this.value = props.value;
    this.weight = props.weight;
  }

  /**
   * The [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the item's background.
   * When `null`, the color will fall back to `Wheel.itemBackgroundColors`.
   * Example: `'#fff'`.
   */
  get backgroundColor() {
    return this._backgroundColor;
  }
  set backgroundColor(val) {
    if (typeof val === 'string') {
      this._backgroundColor = val;
    } else {
      this._backgroundColor = Defaults.item.backgroundColor;
    }
    this._wheel.refresh();
  }

  /**
   * The image (HTMLImageElement) to draw on the item.
   * Any part of the image that extends outside the item will be clipped.
   * The image will be drawn over the top of `Item.backgroundColor`.
   */
  get image() {
    return this._image;
  }
  set image(val) {
    if (val instanceof HTMLImageElement) {
      this._image = val;
    } else {
      this._image = Defaults.item.image;
    }
    this._wheel.refresh();
  }

  /**
   * The opacity (as a percent) of `Item.image`.
   * Useful if you want to fade the image to make the item's label stand out.
   */
  get imageOpacity() {
    return this._imageOpacity;
  }
  set imageOpacity(val) {
    if (typeof val === 'number') {
      this._imageOpacity = val;
    } else {
      this._imageOpacity = Defaults.item.imageOpacity;
    }
    this._wheel.refresh();
  }

  /**
   * The point along the wheel's radius (as a percent, starting from the center) to draw the center of `Item.image`.
   */
  get imageRadius() {
    return this._imageRadius;
  }
  set imageRadius(val) {
    if (typeof val === 'number') {
      this._imageRadius = val;
    } else {
      this._imageRadius = Defaults.item.imageRadius;
    }
    this._wheel.refresh();
  }

  /**
   * The rotation (angle in degrees) of `Item.image`.
   */
  get imageRotation() {
    return this._imageRotation;
  }
  set imageRotation(val) {
    if (typeof val === 'number') {
      this._imageRotation = val;
    } else {
      this._imageRotation = Defaults.item.imageRotation;
    }
    this._wheel.refresh();
  }

  /**
   * The scale (size as a percent) of `Item.image`.
   */
  get imageScale() {
    return this._imageScale;
  }
  set imageScale(val) {
    if (typeof val === 'number') {
      this._imageScale = val;
    } else {
      this._imageScale = Defaults.item.imageScale;
    }
    this._wheel.refresh();
  }

  /**
   * The text that will be drawn on the item.
   */
  get label() {
    return this._label;
  }
  set label(val) {
    if (typeof val === 'string') {
      this._label = val;
    } else {
      this._label = Defaults.item.label;
    }
    this._wheel.refresh();
  }

  /**
   * The [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the item's label.
   * When `null`, the color will fall back to `Wheel.itemLabelColors`.
   * Example: `'#000'`.
   */
  get labelColor() {
    return this._labelColor;
  }
  set labelColor(val) {
    if (typeof val === 'string') {
      this._labelColor = val;
    } else {
      this._labelColor = Defaults.item.labelColor;
    }
    this._wheel.refresh();
  }

  /**
   * Some value that has meaning to your application.
   * For example, a reference to the object representing the item on the wheel, or a database id.
   */
  get value() {
    return this._value;
  }
  set value(val) {
    if (val !== undefined) {
      this._value = val;
    } else {
      this._value = Defaults.item.value;
    }
  }

  /**
   * The proportional size of the item relative to other items on the wheel.
   * For example, if you have 2 items where `item[0]` has a weight of `1` and `item[1]` has a weight of `2`,
   * then `item[0]` will take up 1/3 of the space on the wheel.
   */
  get weight() {
    return this._weight;
  }
  set weight(val) {
    if (typeof val === 'number') {
      this._weight = val;
    } else {
      this._weight = Defaults.item.weight;
    }
  }

  /**
   * Get the 0-based index of this item.
   */
  getIndex() {
    const index = this._wheel.items.findIndex(i => i === this);
    if (index === -1) throw new Error('Item not found in parent Wheel');
    return index;
  }

  /**
   * Get the angle (in degrees) that this item ends at (exclusive), ignoring the current `rotation` of the wheel.
   */
  getCenterAngle() {
    const angle = this._wheel.getItemAngles()[ this.getIndex() ];
    return angle.start + ((angle.end - angle.start) / 2);
  }

  /**
   * Get the angle (in degrees) that this item starts at (inclusive), ignoring the current `rotation` of the wheel.
   */
  getStartAngle() {
    return this._wheel.getItemAngles()[ this.getIndex() ].start;
  }

  /**
   * Get the angle (in degrees) that this item ends at (inclusive), ignoring the current `rotation` of the wheel.
   */
  getEndAngle() {
    return this._wheel.getItemAngles()[ this.getIndex() ].end;
  }

  /**
   * Return a random angle (in degrees) between this item's start angle (inclusive) and end angle (inclusive).
   */
  getRandomAngle() {
    return util.getRandomFloat(this.getStartAngle(), this.getEndAngle());
  }

}
