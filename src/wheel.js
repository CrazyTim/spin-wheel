import * as util from './util.js';
import * as Constants from './constants.js';
import {Defaults} from './constants.js';
import * as events from './events.js';
import {Item} from './item.js';

export class Wheel {

  constructor(container, props = {}) {

    this._frameRequestId = null; // Init.

    // Validate params.
    if (!(container instanceof Element)) throw 'container parameter must be an Element';
    if (!util.isObject(props) && props !== null) throw 'props parameter must be an Object or null';

    this._canvasContainer = container;
    this.canvas = document.createElement('canvas');
    this._context = this.canvas.getContext('2d');

    this.addCanvas();
    events.register(this);

    // Assign default values.
    // This avoids null exceptions when we initalise each property one-by-one in `init()`.
    for (const i of Object.keys(Defaults.wheel)) {
      this['_' + i] = Defaults.wheel[i];
    }

    if (props) {
      this.init(props);
    } else {
      this.init(Defaults.wheel);
    }

  }

  /**
   * Initialise all properties.
   * If a value is undefined or invalid then that property will fall back to a default value.
   */
  init(props = {}) {
    this._isInitialising = true;

    this.borderColor = props.borderColor;
    this.borderWidth = props.borderWidth;
    this.debug = props.debug;
    this.image = props.image;
    this.isInteractive = props.isInteractive;
    this.itemBackgroundColors = props.itemBackgroundColors;
    this.itemLabelAlign = props.itemLabelAlign;
    this.itemLabelBaselineOffset = props.itemLabelBaselineOffset;
    this.itemLabelColors = props.itemLabelColors;
    this.itemLabelFont = props.itemLabelFont;
    this.itemLabelFontSizeMax = props.itemLabelFontSizeMax;
    this.itemLabelRadius = props.itemLabelRadius;
    this.itemLabelRadiusMax = props.itemLabelRadiusMax;
    this.itemLabelRotation = props.itemLabelRotation;
    this.items = props.items;
    this.lineColor = props.lineColor;
    this.lineWidth = props.lineWidth;
    this.pixelRatio = props.pixelRatio;
    this.rotationSpeedMax = props.rotationSpeedMax;
    this.radius = props.radius;
    this.rotation = props.rotation;
    this.rotationResistance = props.rotationResistance;
    this.rotationSpeed = props.rotationSpeed;
    this.offset = props.offset;
    this.onCurrentIndexChange = props.onCurrentIndexChange;
    this.onRest = props.onRest;
    this.onSpin = props.onSpin;
    this.overlayImage = props.overlayImage;
    this.pointerAngle = props.pointerAngle;
  }

  addCanvas() {
    this._canvasContainer.appendChild(this.canvas);
  }

  removeCanvas() {
    this._canvasContainer.removeChild(this.canvas);
  }

  remove() {
    window.cancelAnimationFrame(this._frameRequestId);
    events.unregister(this);
    this.removeCanvas();
  }

  /**
   * Resize the wheel to fit inside it's container.
   * Call this after changing any property of the wheel that relates to it's size or position.
   */
  resize() {

    // Get the smallest dimension of `canvasContainer`:
    const [w, h] = [
      this._canvasContainer.clientWidth * this.getActualPixelRatio(),
      this._canvasContainer.clientHeight * this.getActualPixelRatio(),
    ];

    // Calc the size that the wheel needs to be to fit in it's container:
    const minSize = Math.min(w, h);
    const wheelSize = {
      w: minSize - (minSize * this.offset.w),
      h: minSize - (minSize * this.offset.h),
    };
    const scale = Math.min(w / wheelSize.w, h / wheelSize.h);
    this._size = Math.max(wheelSize.w * scale, wheelSize.h * scale);

    // Resize canvas element:
    this.canvas.style.width = this._canvasContainer.clientWidth + 'px';
    this.canvas.style.height = this._canvasContainer.clientHeight + 'px';
    this.canvas.width = w;
    this.canvas.height = h;

    // Re-calculate the center of the wheel:
    this._center = {
      x: w / 2 + (w * this.offset.w),
      y: h / 2 + (h * this.offset.h),
    };

    // Recalculate the wheel radius:
    this._actualRadius = (this._size / 2) * this.radius;

    // Adjust the font size of labels so they all fit inside `wheelRadius`:
    this.itemLabelFontSize = this.itemLabelFontSizeMax * (this._size / Constants.baseCanvasSize);
    this.labelMaxWidth = this._actualRadius * (this.itemLabelRadius - this.itemLabelRadiusMax);
    for (const item of this._items) {
      this.itemLabelFontSize = Math.min(this.itemLabelFontSize, util.getFontSizeToFit(item.label, this.itemLabelFont, this.labelMaxWidth, this._context));
    }

    this.refresh();

  }

  /**
   * Main animation loop.
   */
  draw(now = 0) {

    this._frameRequestId = null;

    const ctx = this._context;

    // Clear canvas.
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.animateRotation(now);

    const angles = this.getItemAngles(this.rotation);

    const actualBorderWidth = this.getActualBorderWidth();

    // Set font:
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.itemLabelAlign;
    ctx.font = this.itemLabelFontSize + 'px ' + this.itemLabelFont;

    ctx.save();

    // Build paths:
    for (const [i, a] of angles.entries()) {

      const path = new Path2D();
      path.moveTo(this._center.x, this._center.y);
      path.arc(
        this._center.x,
        this._center.y,
        this._actualRadius - (actualBorderWidth / 2),
        util.degRad(a.start + Constants.arcAdjust),
        util.degRad(a.end + Constants.arcAdjust)
      );

      this._items[i].path = path;

    }

    this.drawItemBackgrounds(ctx, angles);
    this.drawItemImages(ctx, angles);
    this.drawItemLines(ctx, angles);
    this.drawItemLabels(ctx, angles);
    this.drawBorder(ctx);
    this.drawImage(ctx, this._image, false);
    this.drawImage(ctx, this._overlayImage, true);
    this.drawPointerLine(ctx);
    this.drawDragEvents(ctx);

    this._isInitialising = false;

  }

  drawItemBackgrounds(ctx, angles = []) {

    for (const [i, a] of angles.entries()) {

      const item = this._items[i];

      ctx.fillStyle = item.backgroundColor ?? (
        // Fall back to a value from the repeating set:
        this.itemBackgroundColors[i % this.itemBackgroundColors.length]
      );

      ctx.fill(item.path);

    }

  }

  drawItemImages(ctx, angles = []) {

    for (const [i, a] of angles.entries()) {

      const item = this._items[i];

      if (!util.isImageLoaded(item.image)) return;

      ctx.save();

      ctx.clip(item.path);

      const angle = a.start + ((a.end - a.start) / 2);

      ctx.translate(
        this._center.x + Math.cos(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * item.imageRadius),
        this._center.y + Math.sin(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * item.imageRadius)
      );

      ctx.rotate(util.degRad(angle + item.imageRotation));

      const width = (this._size / 500) * item.image.width * item.imageScale;
      const height = (this._size / 500) * item.image.height * item.imageScale;
      const widthHalf = -width / 2;
      const heightHalf = -height / 2;

      ctx.drawImage(
        item.image,
        widthHalf,
        heightHalf,
        width,
        height,
      );

      ctx.restore();

    }

  }

  drawImage(ctx, image, isOverlay = false) {

    if (!util.isImageLoaded(image)) return;

    ctx.translate(
      this._center.x,
      this._center.y,
    );

    if (!isOverlay) ctx.rotate(util.degRad(this.rotation));

    // Draw the image centered and scaled to fit the wheel's container:
    // For convenience, scale the 'normal' image to the size of the wheel radius
    // (so a change in the wheel radius won't require the image to also be updated).
    const size = isOverlay ? this._size : this._size * this.radius;
    const sizeHalf = -(size / 2);

    ctx.drawImage(
      image,
      sizeHalf,
      sizeHalf,
      size,
      size,
    );

    ctx.resetTransform();

  }

  drawPointerLine(ctx, image, isOverlay = false) {

    if (!this.debug) return;

    ctx.translate(
      this._center.x,
      this._center.y,
    );

    ctx.rotate(util.degRad(this.pointerAngle + Constants.arcAdjust));

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this._actualRadius * 2, 0);

    ctx.strokeStyle = Constants.Debugging.pointerLineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.resetTransform();

  }

  drawBorder(ctx) {

    if (this.borderWidth <= 0) return;

    const actualBorderWidth = this.getActualBorderWidth();
    const actualBorderColor = this._borderColor || 'transparent';

    ctx.beginPath();
    ctx.strokeStyle = actualBorderColor;
    ctx.lineWidth = actualBorderWidth;
    ctx.arc(this._center.x, this._center.y, this._actualRadius - (actualBorderWidth / 2), 0, 2 * Math.PI);
    ctx.stroke();

    if (this.debug) {
      ctx.beginPath();
      ctx.strokeStyle = ctx.strokeStyle = Constants.Debugging.labelRadiusColor;
      ctx.lineWidth = 1;
      ctx.arc(this._center.x, this._center.y, this._actualRadius * this.itemLabelRadius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = ctx.strokeStyle = Constants.Debugging.labelRadiusColor;
      ctx.lineWidth = 1;
      ctx.arc(this._center.x, this._center.y, this._actualRadius * this.itemLabelRadiusMax, 0, 2 * Math.PI);
      ctx.stroke();
    }

  }

  drawItemLines(ctx, angles = []) {

    if (this.lineWidth <= 0) return;

    const actualLineWidth = (this.lineWidth / Constants.baseCanvasSize) * this._size;
    const actualBorderWidth = this.getActualBorderWidth();

    ctx.translate(
      this._center.x,
      this._center.y
    );

    for (const angle of angles) {
      ctx.rotate(util.degRad(angle.start + Constants.arcAdjust));

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this._actualRadius - actualBorderWidth, 0);

      ctx.strokeStyle = this.lineColor;
      ctx.lineWidth = actualLineWidth;
      ctx.stroke();

      ctx.rotate(-util.degRad(angle.start + Constants.arcAdjust));
    }

    ctx.resetTransform();

  }

  drawItemLabels(ctx, angles = []) {

    const actualItemLabelBaselineOffset = this.itemLabelFontSize * -this.itemLabelBaselineOffset;

    for (const [i, a] of angles.entries()) {

      const item = this._items[i];

      if (!item.label) continue;

      ctx.save();

      ctx.clip(item.path);

      const angle = a.start + ((a.end - a.start) / 2);

      ctx.translate(
        this._center.x + Math.cos(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * this.itemLabelRadius),
        this._center.y + Math.sin(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * this.itemLabelRadius)
      );

      ctx.rotate(util.degRad(angle + Constants.arcAdjust));

      ctx.rotate(util.degRad(this.itemLabelRotation));

      if (this.debug) {
        // Draw the outline of the label:
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.labelMaxWidth, 0);

        ctx.strokeStyle = Constants.Debugging.labelOutlineColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeRect(0, -this.itemLabelFontSize / 2, -this.labelMaxWidth, this.itemLabelFontSize);
      }

      ctx.fillStyle = item.labelColor ?? (
        // Fall back to a value from the repeating set:
        this.itemLabelColors[i % this.itemLabelColors.length]
      );

      ctx.fillText(item.label, 0, actualItemLabelBaselineOffset);

      ctx.restore();

    }

  }

  drawDragEvents(ctx) {

    if (!this.debug || !this.dragEvents?.length) return;

    const dragEventsReversed = [...this.dragEvents].reverse();

    for (const [i, event] of dragEventsReversed.entries()) {
      const percent = (i / this.dragEvents.length) * 100;
      ctx.beginPath();
      ctx.arc(event.x, event.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${Constants.Debugging.dragEventHue},100%,${percent}%)`;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.5;
      ctx.fill();
      ctx.stroke();
    }

  }

  animateRotation(now = 0) {

    if (this.rotationSpeed !== 0) {

      this.refresh(); // Ensure the animation loop is active while rotating.

      if (this.lastRotationFrame === undefined) this.lastRotationFrame = now;

      const delta = now - this.lastRotationFrame;

      if (delta > 0) {

        this.rotation += ((delta / 1000) * this.rotationSpeed) % 360;
        this.rotationSpeed = this.getRotationSpeedPlusDrag(delta);
        if (this.rotationSpeed === 0) this.raiseEvent_onRest();
        this.lastRotationFrame = now;

      }

      return;

    }

    this.lastRotationFrame = undefined;

  }

  getRotationSpeedPlusDrag(delta = 0) {

    // Simulate drag:
    const newRotationSpeed = this.rotationSpeed + (this.rotationResistance * (delta / 1000)) * this._rotationDirection;

    // Stop rotation once speed reaches 0.
    // Otherwise the wheel could rotate in the opposite direction next frame.
    if ((this._rotationDirection === 1 && newRotationSpeed < 0) || (this._rotationDirection === -1 && newRotationSpeed >= 0)) {
      return 0;
    }

    return newRotationSpeed;

  }

  /**
   * Spin the wheel by setting `rotationSpeed` and raise the `onSpin` event.
   * Optionally apply a random adjustment to the speed within a range (percent),
   * which can make the spin less predictable.
   */
  spin(speed = 0, randomAdjustmentPercent = 0.0) {

    const adjust = randomAdjustmentPercent / 2;
    this.rotationSpeed = util.getRandomInt(speed * (1 - adjust), speed * (1 + adjust));

    if (this.rotationSpeed !== 0) this.raiseEvent_onSpin();

  }

  /**
   * Return the scaled border size.
   */
  getActualBorderWidth() {
     return (this.borderWidth / Constants.baseCanvasSize) * this._size;
  }

  getActualPixelRatio() {
    return (this.pixelRatio !== 0) ? this.pixelRatio : window.devicePixelRatio;
  }

  /**
   * Return true if the given point is inside the wheel.
   */
  wheelHitTest(point = {x:0, y:0}) {
    const p = util.translateXYToElement(point, this.canvas, this.getActualPixelRatio());
    return util.isPointInCircle(p, this._center.x, this._center.y, this._actualRadius);
  }

  /**
   * Refresh the cursor state.
   * Call this after the pointer moves.
   */
  refreshCursor() {

    if (this.isDragging) {
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    if (this.isInteractive && this.isCursorOverWheel) {
      this.canvas.style.cursor = 'grab';
      return;
    }

    this.canvas.style.cursor = null;

  }

  /**
   * Get the angle (in degrees) of the given point from the center of the wheel.
   * 0 is north.
   */
  getAngleFromCenter(point = {x:0, y:0}) {
    return (util.getAngle(this._center.x, this._center.y, point.x, point.y) + 90) % 360;
  }

  /**
   * Get the index of the item that the Pointer is pointing at.
   * An item is considered "current" if `pointerAngle` is between it's start angle (inclusive)
   * and it's end angle (exclusive).
   */
  getCurrentIndex() {
    return this._currentIndex;
  }

  /**
   * Calculate and set `currentIndex`
   */
  refreshCurrentIndex(angles = []) {
    if (this._items.length === 0) this._currentIndex = -1;

    for (const [i, a] of angles.entries()) {

      if (!util.isAngleBetween(this.pointerAngle, a.start % 360, a.end % 360)) continue;

      if (this._currentIndex === i) break;

      this._currentIndex = i;

      if (!this._isInitialising) this.raiseEvent_onCurrentIndexChange();

      break;

    }
  }

  /**
   * Return an array of objects which represents the current start/end angles for each item.
   */
  getItemAngles(initialRotation = 0) {

    const angles = [];
    const weightedItemAngle = 360 / this.items.reduce((a, i) => a + i.weight, 0);

    let itemAngle;
    let lastItemAngle = initialRotation;

    for (const item of this._items) {
      itemAngle = item.weight * weightedItemAngle;
      angles.push({
        start: lastItemAngle,
        end: lastItemAngle + itemAngle,
      });
      lastItemAngle += itemAngle;
    }

    // Ensure the difference between last angle.end and first angle.start is exactly 360 degrees.
    // Sometimes floating point arithmetic pushes the end value past 360 degrees by
    // a very small amount, which causes issues when calculating `currentIndex`.
    if (this._items.length > 1) {
      angles[angles.length - 1].end = angles[0].start + 360;
    }

    return angles;

  }

  /**
   * Schedule a redraw of the wheel on the canvas.
   * Call this after changing any property of the wheel that relates to it's appearance.
   */
  refresh() {
    if (this._frameRequestId === null) {
      this._frameRequestId = window.requestAnimationFrame(this.draw.bind(this));
    }
  }

  /**
   * The color of the line around the circumference of the wheel.
   */
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(val) {
    if (typeof val === 'string') {
      this._borderColor = val;
    } else {
      this._borderColor = Defaults.wheel.borderColor;
    }
    this.refresh();
  }

  /**
   * The width (in pixels) of the line around the circumference of the wheel.
   */
  get borderWidth() {
    return this._borderWidth;
  }
  set borderWidth(val) {
    if (typeof val === 'number') {
      this._borderWidth = val;
    } else {
      this._borderWidth = Defaults.wheel.borderWidth;
    }
    this.refresh();
  }

  /**
   * Show debugging info.
   * This is particularly helpful when fine-tuning labels.
   */
  get debug() {
    return this._debug;
  }
  set debug(val) {
    if (typeof val === 'boolean') {
      this._debug = val;
    } else {
      this._debug = Defaults.wheel.debug;
    }
    this.refresh();
  }

  /**
   * The url of an image that will be drawn over the center of the wheel which will rotate with the wheel.
   * It will be automatically scaled to fit `radius`.
   */
  get image() {
    return this._image;
  }
  set image(val) {
    let img = new Image();
    if (typeof val === 'string') {
      img.src = val;
      img.onload = e => this.refresh();
    } else {
      img = Defaults.wheel.image;
    }
    this._image = img;
    this.refresh();
  }

  /**
   * Allow the user to spin the wheel using click-drag/touch-flick.
   */
  get isInteractive() {
    return this._isInteractive;
  }
  set isInteractive(val) {
    if (typeof val === 'boolean') {
      this._isInteractive = val;
    } else {
      this._isInteractive = Defaults.wheel.isInteractive;
    }
    this.refresh();
  }

  /**
   * The repeating pattern of background colors for all items.
   * Overridden by `Item.backgroundColor`.
   * Example: `['#fff','#000']`.
   */
  get itemBackgroundColors() {
    return this._itemBackgroundColors;
  }
  set itemBackgroundColors(val) {
    if (Array.isArray(val)) {
      this._itemBackgroundColors = val;
    } else {
      this._itemBackgroundColors = Defaults.wheel.itemBackgroundColors;
    }
    this.refresh();
  }

  /**
   * The alignment of all item labels.
   * Accepted values: `'left'`|`'center'`|`'right'`.
   * You may need to set `itemLabelRotation` in combination with this.
   */
  get itemLabelAlign() {
    return this._itemLabelAlign;
  }
  set itemLabelAlign(val) {
    if (typeof val === 'string') {
      this._itemLabelAlign = val;
    } else {
      this._itemLabelAlign = Defaults.wheel.itemLabelAlign;
    }
    this.refresh();
  }

  /**
   * The offset of the baseline (or line height) of all item labels (as a percent of the label's height).
   */
  get itemLabelBaselineOffset() {
    return this._itemLabelBaselineOffset;
  }
  set itemLabelBaselineOffset(val) {
    if (typeof val === 'number') {
      this._itemLabelBaselineOffset = val;
    } else {
      this._itemLabelBaselineOffset = Defaults.wheel.itemLabelBaselineOffset;
    }
    this.resize();
  }

  /**
   * The repeating pattern of colors for all item labels.
   * Overridden by `Item.labelColor`.
   * Example: `['#fff','#000']`.
   */
  get itemLabelColors() {
    return this._itemLabelColors;
  }
  set itemLabelColors(val) {
    if (Array.isArray(val)) {
      this._itemLabelColors = val;
    } else {
      this._itemLabelColors = Defaults.wheel.itemLabelColors;
    }
    this.refresh();
  }

  /**
   * The font family for all item labels.
   * Overridden by `Item.labelFont`.
   * Example: `'sans-serif'`.
   */
  get itemLabelFont() {
    return this._itemLabelFont;
  }
  set itemLabelFont(val) {
    if (typeof val === 'string') {
      this._itemLabelFont = val;
    } else {
      this._itemLabelFont = Defaults.wheel.itemLabelFont;
    }
    this.resize();
  }

  /**
   * The maximum font size (in pixels) for all item labels.
   */
  get itemLabelFontSizeMax() {
    return this._itemLabelFontSizeMax;
  }
  set itemLabelFontSizeMax(val) {
    if (typeof val === 'number') {
      this._itemLabelFontSizeMax = val;
    } else {
      this._itemLabelFontSizeMax = Defaults.wheel.itemLabelFontSizeMax;
    }
    this.resize();
  }

  /**
   * The point along the radius (as a percent, starting from the center of the wheel)
   * to start drawing all item labels.
   */
  get itemLabelRadius() {
    return this._itemLabelRadius;
  }
  set itemLabelRadius(val) {
    if (typeof val === 'number') {
      this._itemLabelRadius = val;
    } else {
      this._itemLabelRadius = Defaults.wheel.itemLabelRadius;
    }
    this.resize();
  }

  /**
   * The point along the radius (as a percent, starting from the center of the wheel)
   * to calculate the maximum font size for all item labels.
   */
  get itemLabelRadiusMax() {
    return this._itemLabelRadiusMax;
  }
  set itemLabelRadiusMax(val) {
    if (typeof val === 'number') {
      this._itemLabelRadiusMax = val;
    } else {
      this._itemLabelRadiusMax = Defaults.wheel.itemLabelRadiusMax;
    }
    this.resize();
  }

  /**
   * The rotation of all item labels.
   * Use this to flip the labels `180°` in combination with `itemLabelAlign`.
   */
  get itemLabelRotation() {
    return this._itemLabelRotation;
  }
  set itemLabelRotation(val) {
    if (typeof val === 'number') {
      this._itemLabelRotation = val;
    } else {
      this._itemLabelRotation = Defaults.wheel.itemLabelRotation;
    }
    this.refresh();
  }

  /**
   * The items to show on the wheel.
   */
  get items() {
    return this._items;
  }
  set items(val) {
    if (Array.isArray(val)) {

      this._items = [];

      for (const item of val) {
        this._items.push(new Item(this, {
          backgroundColor: item.backgroundColor,
          image: item.image,
          imageRadius: item.imageRadius,
          imageRotation: item.imageRotation,
          imageScale: item.imageScale,
          label: item.label,
          labelColor: item.labelColor,
          value: item.value,
          weight: item.weight,
        }));
      }

    } else {
      this._items = Defaults.wheel.items;
    }

    this.refreshCurrentIndex(this.getItemAngles(this.rotation));
  }

  /**
   * The color of the lines between the items.
   */
  get lineColor() {
    return this._lineColor;
  }
  set lineColor(val) {
    if (typeof val === 'string') {
      this._lineColor = val;
    } else {
      this._lineColor = Defaults.wheel.lineColor;
    }
    this.refresh();
  }

  /**
   * The width (in pixels) of the lines between the items.
   */
  get lineWidth() {
    return this._lineWidth;
  }
  set lineWidth(val) {
    if (typeof val === 'number') {
      this._lineWidth = val;
    } else {
      this._lineWidth = Defaults.wheel.lineWidth;
    }
    this.refresh();
  }

  /**
   * The radius of the wheel (as a percent of the container's smallest dimension).
   */
  get radius() {
    return this._radius;
  }
  set radius(val) {
    if (typeof val === 'number') {
      this._radius = val;
    } else {
      this._radius = Defaults.wheel.radius;
    }
    this.resize();
  }

  /**
   * The rotation (angle in degrees) of the wheel.
   * `0` is north.
   * The first item will be drawn clockwise from this point.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(val) {
    if (typeof val === 'number') {
      this._rotation = val;
    } else {
      this._rotation = Defaults.wheel.rotation;
    }
    this.refreshCurrentIndex(this.getItemAngles(this.rotation));
    this.refresh();
  }

  /**
   * How much to reduce `rotationSpeed` by every second.
   */
  get rotationResistance() {
    return this._rotationResistance;
  }
  set rotationResistance(val) {
    if (typeof val === 'number') {
      this._rotationResistance = val;
    } else {
      this._rotationResistance = Defaults.wheel.rotationResistance;
    }
  }

  /**
   * The pixel ratio used to render the wheel.
   * Values above 0 will produce a sharper image at the cost of performance.
   * A value of `0` will cause the pixel ratio to be automatically determined using `window.devicePixelRatio`.
   */
   get pixelRatio() {
    return this._pixelRatio;
  }
  set pixelRatio(val) {
    if (typeof val === 'number') {
      this._pixelRatio = val;
    } else {
      this._pixelRatio = Defaults.wheel.pixelRatio;
    }
    this.resize();
  }

  /**
   * How far (angle in degrees) the wheel should spin every 1 second.
   * Any number other than 0 will spin the wheel.
   * A positive number will spin clockwise, a negative number will spin antiClockwise.
   */
  get rotationSpeed() {
    return this._rotationSpeed;
  }
  set rotationSpeed(val) {
    if (typeof val === 'number') {

      // Limit speed to `rotationSpeedMax`
      let newSpeed = Math.min(val, this.rotationSpeedMax);
      newSpeed = Math.max(newSpeed, -this.rotationSpeedMax);

      // 1 for clockwise, -1 for antiClockwise.
      this._rotationDirection = (newSpeed > 0) ? 1 : -1;

      this._rotationSpeed = newSpeed;

    } else {
      this._rotationDirection = 0;
      this._rotationSpeed = Defaults.wheel.rotationSpeed;
    }
    this.refresh();
  }

  /**
   * The maximum value for `rotationSpeed`.
   * The wheel will not spin faster than this value.
   */
  get rotationSpeedMax() {
    return this._rotationSpeedMax;
  }
  set rotationSpeedMax(val) {
    if (typeof val === 'number') {
      this._rotationSpeedMax = val;
    } else {
      this._rotationSpeedMax = Defaults.wheel.rotationSpeedMax;
    }
  }

  /**
   * The offset of the wheel relative to it's center (as a percent of the wheel's diameter).
   */
  get offset() {
    return this._offset;
  }
  set offset(val) {
    if (val) {
      this._offset = val;
    } else {
      this._offset = Defaults.wheel.offset;
    }
    this.resize();
  }

  /**
   * The callback for the `onCurrentIndexChange` event.
   */
  get onCurrentIndexChange() {
    return this._onCurrentIndexChange;
  }
  set onCurrentIndexChange(val) {
    if (typeof val === 'function') {
      this._onCurrentIndexChange = val;
    } else {
      this._onCurrentIndexChange = Defaults.wheel.onCurrentIndexChange;
    }
  }

  /**
   * The callback for the `onRest` event.
   */
  get onRest() {
    return this._onRest;
  }
  set onRest(val) {
    if (typeof val === 'function') {
      this._onRest = val;
    } else {
      this._onRest = Defaults.wheel.onRest;
    }
  }

  /**
   * The callback for the `onSpin` event.
   */
  get onSpin() {
    return this._onSpin;
  }
  set onSpin(val) {
    if (typeof val === 'function') {
      this._onSpin = val;
    } else {
      this._onSpin = Defaults.wheel.onSpin;
    }
  }

  /**
   * The url of an image that will be drawn over the center of the wheel which will not rotate with the wheel.
   * It will be automatically scaled to fit the container's smallest dimension.
   * Use this to draw decorations around the wheel, such as a stand or pointer.
   */
  get overlayImage() {
    return this._overlayImage;
  }
  set overlayImage(val) {
    let img;
    if (typeof val === 'string') {
      img = new Image();
      img.src = val;
      img.onload = e => this.refresh();
    } else {
      img = Defaults.wheel.overlayImage;
    }
    this._overlayImage = img;
    this.refresh();
  }

  /**
   * The angle of the Pointer which is used to determine the `currentIndex` (or the "winning" item).
   */
  get pointerAngle() {
    return this._pointerAngle;
  }
  set pointerAngle(val) {
    if (typeof val === 'number') {
      this._pointerAngle = val;
    } else {
      this._pointerAngle = Defaults.wheel.pointerAngle;
    }
    if (this.debug) this.refresh();
  }

  /**
   * Enter the drag state.
   */
  dragStart(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas, this.getActualPixelRatio());

    this.isDragging = true;

    this.rotationSpeed = 0; // Stop the wheel from spinning.

    this.dragEvents = [{
      distance: 0,
      x: p.x,
      y: p.y,
      now:performance.now(),
    }];

    this.refreshCursor();

  }

  dragMove(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas, this.getActualPixelRatio());
    const a = this.getAngleFromCenter(p);

    const lastDragPoint = this.dragEvents[0];
    const lastAngle = this.getAngleFromCenter(lastDragPoint);
    const angleSinceLastMove = util.diffAngle(lastAngle, a);

    this.dragEvents.unshift({
      distance: angleSinceLastMove,
      x: p.x,
      y: p.y,
      now:performance.now(),
    });

    // Retain max 40 events when debugging.
    if (this.debug && this.dragEvents.length >= 40) this.dragEvents.pop();

    // Snap the wheel to the new rotation.
    this.rotation += angleSinceLastMove; // TODO: can we apply easing here so it looks nicer?

  }

  /**
   * Exit the drag state.
   * Set the rotation speed so the wheel continues to spin in the same direction.
   */
  dragEnd() {

    this.isDragging = false;

    // Calc the drag distance:
    let dragDistance = 0;
    const now = performance.now();

    for (const [i, event] of this.dragEvents.entries()) {

      if (!this.isDragEventTooOld(now, event)) {
        dragDistance += event.distance;
        continue;
      }

      // Exclude old events:
      this.dragEvents.length = i;
      break;

    }

    this.refreshCursor();

    if (dragDistance === 0) return;

    this.rotationSpeed = dragDistance * (1000 / Constants.dragCapturePeriod);

    this.raiseEvent_onSpin({dragEvents: this.dragEvents});

  }

  isDragEventTooOld(now = 0, event = {}) {
    return (now - event.now) > Constants.dragCapturePeriod;
  }

  raiseEvent_onCurrentIndexChange(data = {}) {
    this.onCurrentIndexChange?.({
      event: 'currentIndexChange',
      currentIndex: this._currentIndex,
      ...data,
    });
  }

  raiseEvent_onRest(data = {}) {
    this.onRest?.({
      event: 'rest',
      currentIndex: this._currentIndex,
      rotation: this._rotation,
      ...data,
    });
  }

  raiseEvent_onSpin(data = {}) {
    this.onSpin?.({
      event: 'spin',
      rotationSpeed: this.rotationSpeed,
      ...data,
    });
  }

}
