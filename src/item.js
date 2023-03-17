import * as util from './util.js';
import {Defaults} from './constants.js';

export class Item {

  constructor(wheel, props = {}) {

    // Validate params.
    if (!util.isObject(wheel)) throw 'wheel parameter must be an Object';
    if (!util.isObject(props) && props !== null) throw 'props parameter must be an Object or null';

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
   * If a value is undefined or invalid then that property will fall back to a default value.
   */
  init(props = {}) {
    this.backgroundColor = props.backgroundColor;
    this.image = props.image;
    this.imageRadius = props.imageRadius;
    this.imageRotation = props.imageRotation;
    this.imageScale = props.imageScale;
    this.label = props.label;
    this.labelColor = props.labelColor;
    this.value = props.value;
    this.weight = props.weight;
  }

  /**
   * The background color of the item.
   * Falls back to `Wheel.itemBackgroundColors` when `null`.
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
   */
  get image() {
    return this._image;
  }
  set image(val) {
    let img;
    if (typeof val === 'string') {
      img = new Image();
      img.src = val;
      img.onload = e => this._wheel.refresh();
    } else {
      img = Defaults.item.image;
    }
    this._image = img;
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
   * The color of the label.
   * Falls back to `Wheel.itemLabelColors` when `null`.
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
    this._value = val;
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

}
