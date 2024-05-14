// @ts-check
import * as util from './util.js';
import {Defaults} from './constants.js';
import {IWheel} from './wheel.js';

/**
 * @typedef {object} ItemProps
 * @prop {?string} [backgroundColor]
 * @prop {?string} [image]
 * @prop {number} [imageOpacity]
 * @prop {number} [imageRadius]
 * @prop {number} [imageRotation]
 * @prop {number} [imageScale]
 * @prop {string} [label]
 * @prop {?string} [labelColor]
 * @prop {?string} [value]
 * @prop {number} [weight]
*/

/** @type {ItemProps} */
export let ItemProps;

export class Item {

  /**
   * Create an Item (to be used inside a wheel) and initialise it with props.
   * @param {IWheel} wheel
   * @param {ItemProps} [props]
   */
  constructor(wheel, props = {}) {

    // Validate params.
    if (!util.isObject(wheel)) throw new Error('wheel must be an instance of Wheel'); // Ideally we would use instanceof, however importing the Wheel class would create a circular ref.
    if (!util.isObject(props) && props !== null) throw new Error('props must be an Object or null');

    /**
     * @private
     * @type {IWheel}
     */
    this._wheel = wheel;

    // Assign default values.
    // This avoids null exceptions when we initialise each property one-by-one in `init()`.
    for (const i of Object.keys(Defaults.item)) {
      this['_' + i] = Defaults.item[i];
    }

    /**
     * @type {Path2D}
     * @package
     */
    this.path = new Path2D;

    /**
     * @type {?HTMLImageElement}
     */
    this._imageObj = null;


    // --------------------------------------------------
    // Init private props vars.
    // We only need to do this so we have nice types.
    // --------------------------------------------------

    /**
     * @type {?string}
     * @private
     */
    this._backgroundColor = null;

    /**
     * @type {?string}
     * @private
     */
    this._image = null;

    /**
     * @type {number}
     * @private
     */
    this._imageOpacity = 0;

    /**
     * @type {number}
     * @private
     */
    this._imageRadius = 0;

    /**
     * @type {number}
     * @private
     */
    this._imageRotation = 0;

    /**
     * @type {number}
     * @private
     */
    this._imageScale = 0;

    /**
     * @type {string}
     * @private
     */
    this._label = '';

    /**
     * @type {?string}
     * @private
     */
    this._labelColor = null;

    /**
     * @type {any}
     * @private
     */
    this._value = undefined;

    /**
     * @type {number}
     * @private
     */
    this._weight = 0;

    if (props) {
      this.init(props);
    } else {
      this.init(Defaults.item);
    }

  }

  /**
   * Initialise all properties.
   * @param {ItemProps} props
   */
  init(props = {}) {
    // @ts-ignore
    this.backgroundColor = props.backgroundColor; // @ts-ignore
    this.image = props.image; // @ts-ignore
    this.imageOpacity = props.imageOpacity; // @ts-ignore
    this.imageRadius = props.imageRadius; // @ts-ignore
    this.imageRotation = props.imageRotation; // @ts-ignore
    this.imageScale = props.imageScale; // @ts-ignore
    this.label = props.label; // @ts-ignore
    this.labelColor = props.labelColor; // @ts-ignore
    this.value = props.value; // @ts-ignore
    this.weight = props.weight; // @ts-ignore
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
   * The url of an image that will be drawn on the item.
   * Any part of the image that extends outside the item will be clipped.
   * The image will be drawn over the top of `Item.backgroundColor`.
   */
  get image() {
    return this._image;
  }
  set image(val) {
    if (typeof val === 'string') {
      this._image = val;
      this._imageObj = util.loadImage(val, e => this._wheel.refresh());
    } else {
      this._image = Defaults.item.image;
      this._imageObj = null;
    }
    this._wheel.refresh();
  }

  get imageObj() {
    return this._imageObj;
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
   * The point along the radius (as a percent, starting from the center of the wheel) to draw the center of `Item.image`.
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
   * The scale (as a percent) to resize `Item.image`.
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
   * @returns {number}
   */
  getIndex() {
    const index = this._wheel.items.findIndex(i => i === this);
    if (index === -1) throw new Error('Item not found in parent Wheel');
    return index;
  }

  /**
   * Get the angle (in degrees) that this item ends at (exclusive), ignoring the current `rotation` of the wheel.
   * @returns {number}
   */
  getCenterAngle() {
    const angle = this._wheel.getItemAngles()[ this.getIndex() ];
    return angle.start + ((angle.end - angle.start) / 2);
  }

  /**
   * Get the angle (in degrees) that this item starts at (inclusive), ignoring the current `rotation` of the wheel.
   * @returns {number}
   */
  getStartAngle() {
    return this._wheel.getItemAngles()[ this.getIndex() ].start;
  }

  /**
   * Get the angle (in degrees) that this item ends at (inclusive), ignoring the current `rotation` of the wheel.
   * @returns {number}
   */
  getEndAngle() {
    return this._wheel.getItemAngles()[ this.getIndex() ].end;
  }

  /**
   * Return a random angle (in degrees) between this item's start angle (inclusive) and end angle (inclusive).
   * @returns {number}
   */
  getRandomAngle() {
    return util.getRandomFloat(this.getStartAngle(), this.getEndAngle());
  }

}
