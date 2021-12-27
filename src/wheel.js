import * as util from './util.js';
import * as enums from './enums.js';
import * as drag from './drag.js';

export class Wheel {

  constructor(container, props = {}) {
    this.canvasContainer = container;
    this.initCanvas();

    // Set property defaults:
    this._debug = enums.Defaults.debug;
    this._image = enums.Defaults.image;
    this._isInteractive = enums.Defaults.isInteractive;
    this._itemBackgroundColors = enums.Defaults.itemBackgroundColors;
    this._itemLabelAlign = enums.Defaults.itemLabelAlign;
    this._itemLabelBaselineOffset = enums.Defaults.itemLabelBaselineOffset;
    this._itemLabelColors = enums.Defaults.itemLabelColors;
    this._itemLabelFont = enums.Defaults.itemLabelFont;
    this._itemLabelFontSizeMax = enums.Defaults.itemLabelFontSizeMax;
    this._itemLabelRadius = enums.Defaults.itemLabelRadius;
    this._itemLabelRadiusMax = enums.Defaults.itemLabelRadiusMax;
    this._itemLabelRotation = enums.Defaults.itemLabelRotation;
    this._items = enums.Defaults.items;
    this._lineColor = enums.Defaults.lineColor;
    this._lineWidth = enums.Defaults.lineWidth;
    this._rotationSpeedMax = enums.Defaults.rotationSpeedMax;
    this._radius = enums.Defaults.radius;
    this._rotation = enums.Defaults.rotation;
    this._rotationResistance =enums.Defaults.rotationResistance;
    this._rotationSpeed = enums.Defaults.rotationSpeed;
    this._offset = enums.Defaults.offset;
    this._onRest = enums.Defaults.onRest;
    this._onSpin = enums.Defaults.onSpin;
    this._overlayImage = enums.Defaults.overlayImage;
    this._pointerRotation = enums.Defaults.items;

    if (props) this.init(props);
  }

  initCanvas() {

    // Remove any existing children:
    while (this.canvasContainer.firstChild) {
       this.canvasContainer.removeChild(this.canvasContainer.firstChild);
    }

    this.canvas = document.createElement('canvas');
    this.canvasContainer.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    this.registerEvents();

  }

  /**
   * Initialise the instance with the given properties.
   * If any properties are omitted, then default values will be applied.
   * See README.md for property descriptions.
   */
  init(props = {}) {

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
    this.onRest = props.onRest;
    this.onSpin = props.onSpin;
    this.overlayImage = props.overlayImage;
    this.pointerRotation = props.items;

    this.resize(); // This will start the animation loop.

  }

  registerEvents() {
    window.onresize = () => this.resize();
    drag.registerEvents(this);
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
    this.itemLabelFontSize = this.itemLabelFontSizeMax * (this.size / enums.fontScale);
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

    const angles = this.getItemAngles();
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

    // Draw wedges:
    for (const [i, a] of angles.entries()) {

      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.arc(
        this.center.x,
        this.center.y,
        this.actualRadius,
        util.degRad(a.start + enums.arcAdjust),
        util.degRad(a.end + enums.arcAdjust)
      );
      ctx.closePath();

      ctx.fillStyle = this.actualItems[i].backgroundColor;
      ctx.fill();

      if (this.lineWidth > 0) {
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = 'bevel';
        ctx.stroke();
      }

      if (util.isAngleBetween(this.pointerRotation, a.start % 360, a.end % 360)) {
        if (this._currentIndex !== i) {
          this._currentIndex = i;

          this.onCurrentIndexChange?.({
            currentIndex: this._currentIndex,
          });
        }
      }

    }

    // Set font:
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.itemLabelAlign;
    ctx.font = this.itemLabelFontSize + 'px ' + this.itemLabelFont;
    const itemLabelBaselineOffset = this.itemLabelFontSize * -this.itemLabelBaselineOffset;

    ctx.save();

    // Draw item labels:
    for (const [i, a] of angles.entries()) {

      ctx.save();
      ctx.beginPath();

      ctx.fillStyle = this.actualItems[i].labelColor;

      const angle = a.start + ((a.start - a.end) / 2);

      ctx.translate(
        this.center.x + Math.cos(util.degRad(angle + enums.arcAdjust)) * (this.actualRadius * this.itemLabelRadius),
        this.center.y + Math.sin(util.degRad(angle + enums.arcAdjust)) * (this.actualRadius * this.itemLabelRadius)
      );

      ctx.rotate(util.degRad(angle + enums.arcAdjust));

      if (this.debug) {
        // Draw an outline around the label:
        ctx.beginPath();
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 1;
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.labelMaxWidth, 0);
        ctx.stroke();
        ctx.strokeRect(0, -this.itemLabelFontSize / 2, -this.labelMaxWidth, this.itemLabelFontSize);
      }

      ctx.rotate(util.degRad(this.itemLabelRotation));

      if (this.actualItems[i].label !== undefined) {
        ctx.fillText(this.actualItems[i].label, 0, itemLabelBaselineOffset);
      }

      ctx.restore();

    }

    this.drawImage(this.image, false);
    this.drawImage(this.overlayImage, true);

    if (this.rotationSpeed !== 0) {

      // Simulate drag:
      let newSpeed = this.rotationSpeed + (this.rotationResistance * delta) * this.rotationDirection;

      // Prevent wheel from rotating in the oposite direction:
      if (this.rotationDirection === 1 && newSpeed < 0 || this.rotationDirection === -1 && newSpeed >= 0) {
        newSpeed = 0;
      }

      this.rotationSpeed = newSpeed;

      if (this.rotationSpeed === 0) {
        this.onRest?.({
          event: 'rest',
          currentIndex: this._currentIndex,
        });
      }

    }

    // Draw drag move points:
    if (this.debug && this.dragMoves?.length) {

      const dragMovesReversed = [...this.dragMoves].reverse();

      for (const [i, point] of dragMovesReversed.entries()) {
        if (point === undefined) continue;
        const percentFill = (i / this.dragMoves.length) * 100;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(200,100%,${percentFill}%)`;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();
      }

    }

    // Wait until next frame.
    this.frameRequestId = window.requestAnimationFrame(this.draw.bind(this));

  }

  drawImage(image, isOverlay = false) {

    if (!image) return;

    const ctx = this.context;

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

  /**
   * Spin the wheel by setting `rotationSpeed`.
   * Apply a small randomised adjustment to make it realistic and less predictable.
   */
  spin(speed = 0) {

    const adjust = enums.onSpinPlusMinusRandomAdjustment / 2;

    this.rotationSpeed = util.getRandomInt(speed * (1 - adjust), speed * (1 + adjust));

    this.onSpin?.({
      event: 'spin',
      direction: this.rotationDirection,
      rotationSpeed: this.rotationSpeed,
    });

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
        newItem.backgroundColor = '#fff'; // Default.
      }

      // Label:
      if (typeof item.label === 'string') {
        newItem.label = item.label;
      } else {
        newItem.label = ''; // Default.
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
        newItem.labelColor = '#000'; // Default.
      }

      // Weight:
      if (typeof item.weight === 'number') {
        newItem.weight = item.weight;
      } else {
        newItem.weight = 1; // Default.
      };

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
   * Get the index of the item that the `pointer` is pointing at.
   */
  getCurrentIndex() {
    return this._currentIndex;
  }

  /**
   * Return an array of objects which represents the current start/end angles for each item.
   */
  getItemAngles() {

    const angles = [];
    let itemAngle;
    let lastItemAngle = this.rotation;

    for (const item of this.actualItems) {
      itemAngle = item.weight * this.weightedItemAngle;
      angles.push({
        start: lastItemAngle,
        end: lastItemAngle + itemAngle,
      });
      lastItemAngle += itemAngle;
    }

    return angles;

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
      this._debug = enums.Defaults.debug;
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
      this._image = enums.Defaults.image;
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
      this._isInteractive = enums.Defaults.isInteractive;
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
      this._itemBackgroundColors = enums.Defaults.itemBackgroundColors;
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
      this._itemLabelAlign = enums.Defaults.itemLabelAlign;
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
      this._itemLabelBaselineOffset = enums.Defaults.itemLabelBaselineOffset;
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
      this._itemLabelColors = enums.Defaults.itemLabelColors;
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
      this._itemLabelFont = enums.Defaults.itemLabelFont;
    }
    this.resize();
  }

  /**
   * The maximum font size to draw each `item.label`.
   * The actual font size will be calculated dynamically so that the longest label of all
   * the items fits within `itemLabelRadiusMax` and the font size is below `itemLabelFontSizeMax`.
   */
  get itemLabelFontSizeMax () {
    return this._itemLabelFontSizeMax;
  }
  set itemLabelFontSizeMax(val) {
    if (typeof val === 'number') {
      this._itemLabelFontSizeMax = val;
    } else {
      this._itemLabelFontSizeMax = enums.Defaults.itemLabelFontSizeMax;
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
      this._itemLabelRadius = enums.Defaults.itemLabelRadius;
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
      this._itemLabelRadiusMax = enums.Defaults.itemLabelRadiusMax;
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
      this._itemLabelRotation = enums.Defaults.itemLabelRotation;
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
      this._items = enums.Defaults.items;
    }
    this.processItems();
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
      this._lineColor = enums.Defaults.lineColor;
    }
  }

  /**
   * The width of the lines between each item.
   */
  get lineWidth () {
    return this._lineWidth;
  }
  set lineWidth(val) {
    if (typeof val === 'number') {
      this._lineWidth = val;
    } else {
      this._lineWidth = enums.Defaults.lineWidth;
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
      this._radius = enums.Defaults.radius;
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
      this._rotation = enums.Defaults.rotation;
    }
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
      this._rotationResistance = enums.Defaults.rotationResistance;
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
      this._rotationSpeed = enums.Defaults.rotationSpeed;
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
      this._rotationSpeedMax = enums.Defaults.rotationSpeedMax;
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
      this._offset = enums.Defaults.offset;
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
      this._onCurrentIndexChange = enums.Defaults.onCurrentIndexChange;
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
      this._onRest = enums.Defaults.onRest;
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
      this._onSpin = enums.Defaults.onSpin;
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
      this._overlayImage = enums.Defaults.overlayImage;
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
      this._pointerRotation = enums.Defaults.pointerRotation;
    }
  }

  /**
   * Enter the drag state.
   */
  dragStart(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas);

    this.isDragging = true;

    this.rotationSpeed = 0; // Stop the wheel from spinning.

    const a = this.getAngleFromCenter(p);

    this.dragDelta = util.addAngle(this.rotation, -a); // Used later in dragMove.
    this.dragMoves = []; // Initalise.
    this.dragPoint = {
      x: p.x,
      y: p.y,
    };

    this.refreshCursor();

  }

  /**
   * Animate the wheel to follow the pointer while dragging.
   */
  dragMove(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas);
    const a = this.getAngleFromCenter(p);

    // Calc rotation:
    const newRotation = util.addAngle(a, this.dragDelta);

    // Calc direction:
    const angle = util.addAngle(a, -this.getAngleFromCenter(this.dragPoint));
    const direction = (angle < 180) ? 1 : -1;

    // Calc distance:
    const distance = util.getDistanceBetweenPoints(p, this.dragPoint) * direction;

    // Save the last n drag events for later in `dragEnd()`.
    this.dragMoves.unshift({
      distance,
      x: p.x,
      y: p.y,
      now:performance.now(),
    });

    this.dragMoves.length = 50; // Truncate array.

    this.rotation = newRotation; // Snap the rotation to the drag start point.

    this.dragLastPoint = {
      x: p.x,
      y: p.y,
    };

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
    this.dragMoves = this.dragMoves.filter(i => {

      // Remove old events.
      // This allows the user to cancel the spin by holding the wheel still immediately before ending the drag.
      if (i !== undefined && !this.isDragEventTooOld(now, i)) {
        dragDistance += i.distance * 1.5;
        return true;
      }

      return false;

    });

    // Spin the wheel:
    if (dragDistance !== 0) {

      this.rotationSpeed = dragDistance;

      this.onSpin?.({
        event: 'spin',
        direction: this.rotationDirection,
        rotationSpeed: this.rotationSpeed,
        dragMoves: this.dragMoves,
      });

    }

    this.refreshCursor();

  }

  isDragEventTooOld(now, event = {}) {
    return (now - event.now) > enums.dragCapturePeriod;
  }

}
