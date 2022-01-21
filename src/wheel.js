import * as util from './util.js';
import * as Constants from './constants.js';
import {Defaults} from './constants.js';
import * as events from './events.js';

export class Wheel {

  constructor(container, props = {}) {

    // Validate params.
    if (!(container instanceof Element)) throw 'container parameter must be an Element';
    if (!util.isObject(props)) throw 'props parameter must be an Object';

    this.canvasContainer = container;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.addCanvas();
    events.register(this);

    // Assign default values to the coresponding properties on the wheel:
    for (const i of Object.keys(Defaults.wheel)) {
      this['_' + i] = Defaults.wheel[i];
    }

    if (props) this.init(Defaults.wheel);

  }

  /**
   * Initialise the instance with the given properties.
   * If any properties are omitted, then default values will be applied.
   * See README.md for property descriptions.
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
    this.rotationSpeedMax = props.rotationSpeedMax;
    this.radius = props.radius;
    this.rotation = props.rotation;
    this.rotationResistance =props.rotationResistance;
    this.rotationSpeed = props.rotationSpeed;
    this.offset = props.offset;
    this.onCurrentIndexChange = props.onCurrentIndexChange;
    this.onRest = props.onRest;
    this.onSpin = props.onSpin;
    this.overlayImage = props.overlayImage;
    this.pointerRotation = props.pointerRotation;
  }

  addCanvas() {
    this.canvasContainer.appendChild(this.canvas);
  }

  removeCanvas() {
    this.canvasContainer.removeChild(this.canvas);
  }

  remove() {
    window.cancelAnimationFrame(this.frameRequestId);
    events.unregister(this);
    this.removeCanvas();
  }

  /**
   * Resize the wheel to fit (contain) inside it's container.
   * Call this after changing any property of the wheel that relates to it's size or position.
   */
  resize() {

    // Reset the animation loop:
    window.cancelAnimationFrame(this.frameRequestId); // Cancel previous animation loop.

    // Get the smallest dimension of `canvasContainer`:
    const [w, h] = [this.canvasContainer.clientWidth, this.canvasContainer.clientHeight];

    // Calc the size that the wheel needs to be to fit in it's container:
    const minSize = Math.min(w, h);
    const wheelSize = {
      w: minSize - (minSize * this.offset.w),
      h: minSize - (minSize * this.offset.h),
    };
    const scale = Math.min(w / wheelSize.w, h / wheelSize.h);
    this.size = Math.max(wheelSize.w * scale, wheelSize.h * scale);

    // Resize canvas element:
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w;
    this.canvas.height = h;

    // Re-calculate the center of the wheel:
    this.center = {
      x: w / 2 + (w * this.offset.w),
      y: h / 2 + (h * this.offset.h),
    };

    // Recalculate the wheel radius:
    this.actualRadius = (this.size / 2) * this.radius;

    // Adjust the font size of labels so they all fit inside `wheelRadius`:
    this.itemLabelFontSize = this.itemLabelFontSizeMax * (this.size / Constants.baseCanvasSize);
    this.labelMaxWidth = this.actualRadius * (this.itemLabelRadius - this.itemLabelRadiusMax);
    for (const item of this.actualItems) {
      this.itemLabelFontSize = Math.min(this.itemLabelFontSize, util.getFontSizeToFit(item.label, this.itemLabelFont, this.labelMaxWidth, this.context));
    }

    this.frameRequestId = window.requestAnimationFrame(this.draw.bind(this));

  }

  /**
   * Main animation loop.
   */
  draw(now = 0) {

    const ctx = this.context;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas.

    // Calculate delta since last frame:
    if (this.lastFrame === undefined) {
      this.lastFrame = now;
    }
    const delta = (now - this.lastFrame) / 1000;
    if (delta > 0) {
      this.rotation += delta * this.rotationSpeed;
      this.rotation = this.rotation % 360;
    }
    this.lastFrame = now;

    const angles = this.getItemAngles(this.rotation);

    const borderWidth = (this.borderWidth / Constants.baseCanvasSize) * this.size;

    // Draw wedges:
    for (const [i, a] of angles.entries()) {

      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.arc(
        this.center.x,
        this.center.y,
        this.actualRadius - (borderWidth / 2),
        util.degRad(a.start + Constants.arcAdjust),
        util.degRad(a.end + Constants.arcAdjust)
      );
      ctx.closePath();

      ctx.fillStyle = this.actualItems[i].backgroundColor;
      ctx.fill();

    }

    this.drawItemLines(ctx, angles);
    this.drawBorder(ctx);

    // Set font:
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.itemLabelAlign;
    ctx.font = this.itemLabelFontSize + 'px ' + this.itemLabelFont;
    const itemLabelBaselineOffset = this.itemLabelFontSize * -this.itemLabelBaselineOffset;

    ctx.save();

    // Draw item labels:
    for (const [i, a] of angles.entries()) {

      const item = this.actualItems[i];

      if (!item.label) continue;

      ctx.save();

      const angle = a.start + ((a.end - a.start) / 2);

      ctx.translate(
        this.center.x + Math.cos(util.degRad(angle + Constants.arcAdjust)) * (this.actualRadius * this.itemLabelRadius),
        this.center.y + Math.sin(util.degRad(angle + Constants.arcAdjust)) * (this.actualRadius * this.itemLabelRadius)
      );

      ctx.rotate(util.degRad(angle + Constants.arcAdjust));

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

      ctx.rotate(util.degRad(this.itemLabelRotation));

      ctx.fillStyle = item.labelColor;
      ctx.fillText(item.label, 0, itemLabelBaselineOffset);

      ctx.restore();

    }

    this.drawItemImages(ctx, angles);
    this.drawImage(ctx, this.image, false);
    this.drawImage(ctx, this.overlayImage, true);
    this.drawPointerLine(ctx);
    this.drawDragEvents(ctx);

    this.applyDrag(delta);

    this._isInitialising = false;

    // Wait until next frame.
    this.frameRequestId = window.requestAnimationFrame(this.draw.bind(this));

  }

  drawItemImages(ctx, angles = []) {

    for (const [i, a] of angles.entries()) {

      const item = this.actualItems[i];

      if (!item.image || !item.image.complete || item.image.error) continue;

      ctx.save();

      const angle = a.start + ((a.end - a.start) / 2);

      ctx.translate(
        this.center.x + Math.cos(util.degRad(angle + Constants.arcAdjust)) * (this.actualRadius * item.imageRadius),
        this.center.y + Math.sin(util.degRad(angle + Constants.arcAdjust)) * (this.actualRadius * item.imageRadius)
      );

      ctx.rotate(util.degRad(angle));

      const width = (this.size / 500) * item.image.width * item.imageScale;
      const height = (this.size / 500) * item.image.height * item.imageScale;
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

    if (!image) return;

    ctx.save();

    ctx.translate(
      this.center.x,
      this.center.y,
    );

    if (!isOverlay) ctx.rotate(util.degRad(this.rotation));

    // Draw the image centered and scaled to fit the wheel's container:
    // For convenience, scale the 'normal' image to the size of the wheel radius
    // (so a change in the wheel radius won't require the image to also be updated).
    const size = isOverlay ? this.size : this.size * this.radius;
    const sizeHalf = -(size / 2);
    ctx.drawImage(
      image,
      sizeHalf,
      sizeHalf,
      size,
      size,
    );

    ctx.restore();

  }

  drawPointerLine(ctx, image, isOverlay = false) {

    if (!this.debug) return;

    ctx.save();

    ctx.translate(
      this.center.x,
      this.center.y,
    );

    ctx.rotate(util.degRad(this.pointerRotation + Constants.arcAdjust));

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.actualRadius * 2, 0);

    ctx.strokeStyle = Constants.Debugging.pointerLineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

  }

  drawBorder(ctx) {

    const borderWidth = (this.borderWidth / Constants.baseCanvasSize) * this.size;
    ctx.beginPath();
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = borderWidth;
    ctx.arc(this.center.x, this.center.y, this.actualRadius - (borderWidth / 2), 0, 2 * Math.PI);
    ctx.stroke();

  }

  drawItemLines(ctx, angles = []) {

    if (this.lineWidth <= 0) return;

    const actualLineWidth = (this.lineWidth / Constants.baseCanvasSize) * this.size;

    ctx.save();
    ctx.translate(this.center.x, this.center.y);

    for (const [i, a] of angles.entries()) {
      ctx.rotate(util.degRad(a.start + Constants.arcAdjust));

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.actualRadius - actualLineWidth, 0);

      ctx.strokeStyle = this.lineColor;
      ctx.lineWidth = actualLineWidth;
      ctx.stroke();

      ctx.rotate(-util.degRad(a.start + Constants.arcAdjust));
    }

    ctx.restore();

  }

  drawDragEvents() {

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

  applyDrag (delta = 0) {

    if (this.rotationSpeed === 0) return;

    // Simulate drag:
    let newSpeed = this.rotationSpeed + (this.rotationResistance * delta) * this.rotationDirection;

    // Prevent wheel from rotating in the oposite direction:
    if (this.rotationDirection === 1 && newSpeed < 0 || this.rotationDirection === -1 && newSpeed >= 0) {
      newSpeed = 0;
    }

    this.rotationSpeed = newSpeed;

    if (this.rotationSpeed === 0) this.raiseEvent_onRest();

  }

  /**
   * Set `rotationSpeed` and raise the onSpin event.
   * Optionally apply a random adjustment to the speed within a range (percent),
   * which can make the spin less predictable.
   */
  spin(speed = 0, randomAdjustmentPercent = 0.0) {

    const adjust = randomAdjustmentPercent / 2;
    this.rotationSpeed = util.getRandomInt(speed * (1 - adjust), speed * (1 + adjust));

    if (this.rotationSpeed !== 0) this.raiseEvent_onSpin();

  }

  /**
   * Return 1 for clockwise, -1 for antiClockwise.
   */
  getRotationDirection(speed = 0) {
     return (speed > 0) ? 1 : -1;
  }

  /**
   * Return true if the given point is inside the wheel.
   */
  wheelHitTest(point = {x:0, y:0}) {
    const p = util.translateXYToElement(point, this.canvas);
    return util.isPointInCircle(p, this.center.x, this.center.y, this.actualRadius);
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

  processItems() {

    this.actualItems = [];

    for (const [i, item] of this.items.entries()) {

      const newItem = {};

      // Background color:
      if (typeof item.backgroundColor === 'string') {
        newItem.backgroundColor = item.backgroundColor;
      } else if (this.itemBackgroundColors.length) {
        // Use a value from the repeating set:
        newItem.backgroundColor = this.itemBackgroundColors[i % this.itemBackgroundColors.length];
      } else {
        newItem.backgroundColor = Defaults.item.backgroundColor;
      }

      // Label:
      if (typeof item.label === 'string') {
        newItem.label = item.label;
      } else {
        newItem.label = Defaults.item.label;
      }

      // Label Font:
      if (typeof item.labelFont === 'string') {
        newItem.labelFont = item.labelFont;
      } else {
        newItem.labelFont = this.itemLabelFont;
      }

      // Label Color:
      if (typeof item.labelColor === 'string') {
        newItem.labelColor = item.labelColor;
      } else if (this.itemLabelColors.length) {
        // Use a value from the repeating set:
        newItem.labelColor = this.itemLabelColors[i % this.itemLabelColors.length];
      } else {
        newItem.labelColor = Defaults.item.labelColor;
      }

      // Weight:
      if (typeof item.weight === 'number') {
        newItem.weight = item.weight;
      } else {
        newItem.weight = Defaults.item.weight;
      };

      // Image:
      if (typeof item.image === 'string') {
        newItem.image = new Image();
        newItem.image.src = item.image;
        newItem.image.onerror = e => {
          newItem.image.error = true;
          return true; // Don't fire default event handler.
        };
      } else {
        newItem.image = Defaults.item.image;
      }

      // Image Radius:
      if (typeof item.imageRadius === 'number') {
        newItem.imageRadius = item.imageRadius;
      } else {
        newItem.imageRadius = Defaults.item.imageRadius;
      }

      // Image Scale:
      if (typeof item.imageScale === 'number') {
        newItem.imageScale = item.imageScale;
      } else {
        newItem.imageScale = Defaults.item.imageScale;
      }

      this.actualItems.push(newItem);

    }

    if (this.actualItems.length) {
      this.weightedItemAngle = 360 / util.sumObjArray(this.actualItems, 'weight');
    } else {
      this.weightedItemAngle = 0;
    }

  }

  /**
   * Get the angle (in degrees) of the given point from the center of the wheel.
   * 0 is north.
   */
  getAngleFromCenter(point = {x:0, y:0}) {
    return (util.getAngle(this.center.x, this.center.y, point.x, point.y) + 90) % 360;
  }

  /**
   * Get the index of the item that the Pointer is pointing at.
   * An item is considered "current" if the `pointerRotation` is between
   * it's start angle (inclusive) and it's end angle (exclusive).
   */
  getCurrentIndex() {
    return this._currentIndex;
  }

  /**
   * Calculate and set `currentIndex`
   */
  refreshCurrentIndex(angles = []) {
    if (this.actualItems.length === 0) this._currentIndex = -1;

    for (const [i, a] of angles.entries()) {

      if (!util.isAngleBetween(this.pointerRotation, a.start % 360, a.end % 360)) continue;

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
    let itemAngle;
    let lastItemAngle = initialRotation;

    for (const item of this.actualItems) {
      itemAngle = item.weight * this.weightedItemAngle;
      angles.push({
        start: lastItemAngle,
        end: lastItemAngle + itemAngle,
      });
      lastItemAngle += itemAngle;
    }

    // Ensure the difference between last angle.end and first angle.start is exactly 360 degrees.
    // Sometimes floating point arithmetic pushes the end value past 360 degrees by
    // a very small amount, which causes issues when calculating `currentIndex`.
    if (this.actualItems.length > 1) {
      angles[angles.length - 1].end = angles[0].start + 360;
    }

    return angles;

  }

  /**
   * The color of the line around the circumference of the wheel.
   */
  get borderColor () {
    return this._borderColor;
  }
  set borderColor(val) {
    if (typeof val === 'string') {
      this._borderColor = val;
    } else {
      this._borderColor = Defaults.wheel.borderColor;
    }
  }

  /**
   * The width (in pixels) of the line around the circumference of the wheel.
   * Scaled to a canvas size of 500px.
   */
  get borderWidth () {
    return this._borderWidth;
  }
  set borderWidth(val) {
    if (typeof val === 'number') {
      this._borderWidth = val;
    } else {
      this._borderWidth = Defaults.wheel.borderWidth;
    }
  }

  /**
   * Show debugging info.
   * This is particularly helpful when fine-tuning labels.
   */
  get debug () {
    return this._debug;
  }
  set debug(val) {
    if (typeof val === 'boolean') {
      this._debug = val;
    } else {
      this._debug = Defaults.wheel.debug;
    }
  }

  /**
   * The url of an image that will be drawn over the centre of the wheel which will rotate with the wheel.
   * It will be scaled to fit `radius`.
   */
  get image () {
    return this._image;
  }
  set image(val) {
    if (typeof val === 'string') {
      this._image = new Image();
      this._image.src = val;
    } else {
      this._image = Defaults.wheel.image;
    }
  }

  /**
   * Allow the user to spin the wheel using click-drag/touch-flick.
   */
  get isInteractive () {
    return this._isInteractive;
  }
  set isInteractive(val) {
    if (typeof val === 'boolean') {
      this._isInteractive = val;
    } else {
      this._isInteractive = Defaults.wheel.isInteractive;
    }
  }

  /**
   * The repeating pattern of colors that will be used for each item's `backgroundColor`.
   * Is overridden by `item.backgroundColor`.
   * Example: `['#fff','#000']`.
   */
  get itemBackgroundColors () {
    return this._itemBackgroundColors;
  }
  set itemBackgroundColors(val) {
    if (Array.isArray(val)) {
      this._itemBackgroundColors = val;
    } else {
      this._itemBackgroundColors = Defaults.wheel.itemBackgroundColors;
    }
    this.processItems();
  }

  /**
   * The alignment of each `item.label`.
   * Is overridden by `item.labelColor`.
   * Accepted vlaues: `'left'`|`'center'`|`'right'`.
   * If you change this to `'left'`, you will also need to set `itemLabelRotation` to `180°`.
   */
  get itemLabelAlign () {
    return this._itemLabelAlign;
  }
  set itemLabelAlign(val) {
    if (typeof val === 'string') {
      this._itemLabelAlign = val;
    } else {
      this._itemLabelAlign = Defaults.wheel.itemLabelAlign;
    }
  }

  /**
   * Offset the baseline (or line height) of each `item.label` as a percentage of the label's height.
   */
  get itemLabelBaselineOffset () {
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
   * The repeating pattern of colors that will be used for each item's `labelColor`.
   * Is overridden by `item.labelColor`.
   * Example: `['#fff','#000']`.
   */
  get itemLabelColors () {
    return this._itemLabelColors;
  }
  set itemLabelColors(val) {
    if (Array.isArray(val)) {
      this._itemLabelColors = val;
    } else {
      this._itemLabelColors = Defaults.wheel.itemLabelColors;
    }
    this.processItems();
  }

  /**
   * The font family of each `item.labelFont`.
   * Is overridden by `item.labelFont`.
   * Example: `'sans-serif'`.
   */
  get itemLabelFont () {
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
   * The maximum font size (in pixels) to draw each `item.label`.
   * Scaled to a canvas size of 500px.
   * The actual font size will be calculated automatically so that the longest label of all
   * the items fits within `itemLabelRadiusMax` and the font size is below `itemLabelFontSizeMax`.
   */
  get itemLabelFontSizeMax () {
    return this._itemLabelFontSizeMax;
  }
  set itemLabelFontSizeMax(val) {
    if (typeof val === 'number') {
      this._itemLabelFontSizeMax = val;
    } else {
      this._itemLabelFontSizeMax = Defaults.wheel.itemLabelFontSizeMax;
    }
  }

  /**
   * The point along the radius (as a percent, starting from the inside of the circle) to
   * start drawing each `item.label`.
   */
  get itemLabelRadius () {
    return this._itemLabelRadius;
  }
  set itemLabelRadius(val) {
    if (typeof val === 'number') {
      this._itemLabelRadius = val;
    } else {
      this._itemLabelRadius = Defaults.wheel.itemLabelRadius;
    }
  }

  /**
   * The point along the radius (as a percent, starting from the inside of the circle) to
   * resize each `item.label` (to fit) if it is too wide.
   */
  get itemLabelRadiusMax () {
    return this._itemLabelRadiusMax;
  }
  set itemLabelRadiusMax(val) {
    if (typeof val === 'number') {
      this._itemLabelRadiusMax = val;
    } else {
      this._itemLabelRadiusMax = Defaults.wheel.itemLabelRadiusMax;
    }
  }

  /**
   * The rotation of each `item.label`.
   * Use this to flip the labels `180°` when changing `itemLabelAlign`.
   */
  get itemLabelRotation () {
    return this._itemLabelRotation;
  }
  set itemLabelRotation(val) {
    if (typeof val === 'number') {
      this._itemLabelRotation = val;
    } else {
      this._itemLabelRotation = Defaults.wheel.itemLabelRotation;
    }
  }

  /**
   * The `items` to show on the wheel.
   */
  get items () {
    return this._items;
  }
  set items(val) {
    if (Array.isArray(val)) {
      this._items = val;
    } else {
      this._items = Defaults.wheel.items;
    }
    this.processItems();
    this.refreshCurrentIndex(this.getItemAngles(this.rotation));
  }

  /**
   * The color of the lines between each item.
   */
  get lineColor () {
    return this._lineColor;
  }
  set lineColor(val) {
    if (typeof val === 'string') {
      this._lineColor = val;
    } else {
      this._lineColor = Defaults.wheel.lineColor;
    }
  }

  /**
   * The width (in pixles) of the lines between each item.
   * Scaled to a canvas size of 500px.
   */
  get lineWidth () {
    return this._lineWidth;
  }
  set lineWidth(val) {
    if (typeof val === 'number') {
      this._lineWidth = val;
    } else {
      this._lineWidth = Defaults.wheel.lineWidth;
    }
  }

  /**
   * The radius of the wheel as a percent of the container's smallest dimension.
   */
  get radius () {
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
   * 0 is north. `item[0]` will be drawn clockwise from this point.
   */
  get rotation () {
    return this._rotation;
  }
  set rotation(val) {
    if (typeof val === 'number') {
      this._rotation = val;
    } else {
      this._rotation = Defaults.wheel.rotation;
    }
    this.refreshCurrentIndex(this.getItemAngles(this.rotation));
  }

  /**
   * How much to reduce `rotationSpeed` by every second.
   */
  get rotationResistance () {
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
   * How far (angle in degrees) the wheel should spin every 1 second.
   * Any number other than 0 will spin the wheel.
   * Pass a positive number to spin clockwise, or a negative number to spin antiClockwise.
   */
  get rotationSpeed () {
    return this._rotationSpeed;
  }
  set rotationSpeed(val) {
    if (typeof val === 'number') {

      // Limit speed to `rotationSpeedMax`
      let newSpeed = Math.min(val, this.rotationSpeedMax);
      newSpeed = Math.max(newSpeed, -this.rotationSpeedMax);

      this.rotationDirection = this.getRotationDirection(newSpeed);
      this._rotationSpeed = newSpeed;

    } else {
      this.rotationDirection = 0;
      this._rotationSpeed = Defaults.wheel.rotationSpeed;
    }
  }

  /**
   * The maximum value for `rotationSpeed`.
   * The wheel will not spin faster than this.
   */
  get rotationSpeedMax () {
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
   * The offset of the wheel relative to it's centre as a percent of the wheels diameter, where `1` = 100%.
   * This allows for simple positioning considering the wheel is always centred anyway.
   */
  get offset () {
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
  get onCurrentIndexChange () {
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
  get onRest () {
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
  get onSpin () {
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
   * The url of an image that will be drawn over the centre of the wheel which will not rotate with the wheel.
   * It will be scaled to fit a radius of 100%.
   * Use this to draw decorations around the wheel, such as a stand or pointer.
   */
  get overlayImage () {
    return this._overlayImage;
  }
  set overlayImage(val) {
    if (typeof val === 'string') {
      this._overlayImage = new Image();
      this._overlayImage.src = val;
    } else {
      this._overlayImage = Defaults.wheel.overlayImage;
    }
  }

  /**
   * The angle of the pointer which is used to determine the "winning" item.
   * 0 is north.
   */
  get pointerRotation () {
    return this._pointerRotation;
  }
  set pointerRotation(val) {
    if (typeof val === 'number') {
      this._pointerRotation = val;
    } else {
      this._pointerRotation = Defaults.wheel.pointerRotation;
    }
  }

  /**
   * Enter the drag state.
   */
  dragStart(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas);
    const a = -this.getAngleFromCenter(p);

    this.isDragging = true;

    this.rotationSpeed = 0; // Stop the wheel from spinning.

    this.dragStartRotation = util.addAngle(a, this.rotation);

    this.dragEvents = [{
      distance: 0,
      x: p.x,
      y: p.y,
      now:performance.now(),
    }];

    this.refreshCursor();

  }

  /**
   * Animate the wheel to follow the pointer while dragging.
   */
  dragMove(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas);
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

    this.rotation = util.addAngle(a, this.dragStartRotation); // Snap the wheel to the new rotation.

  }

  /**
   * Exit the drag state.
   * Set the rotation speed so the wheel continues to spin in the same direction.
   */
  dragEnd() {

    this.isDragging = false;

    clearInterval(this.dragClearOldDistances);

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
      ...data,
    });
  }

  raiseEvent_onSpin(data = {}) {
    this.onSpin?.({
      event: 'spin',
      direction: this.rotationDirection,
      rotationSpeed: this.rotationSpeed,
      ...data,
    });
  }

}
