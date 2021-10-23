import * as util from './wheel.util.js';
import * as enums from './wheel.enums.js';
import * as drag from './wheel.drag.js';

export default class Wheel {

  constructor(container) {
    this.canvasContainer = container;
    this.initCanvas();

    this.itemBackgroundColors = [];
    this.itemLabelColors = [];
    this.offset = {x: 0, y: 0};
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
   */
  init(props = {}) {

    // Destructure properties, define defaults:
    // See README.md for property descriptions.
    ({
      itemLabelAlign:      this.itemLabelAlign = enums.AlignText.right,
      itemLabelFontMaxSize:this.itemLabelFontMaxSize = 100,
      itemLabelLineHeight: this.itemLabelLineHeight = 0,
      itemLabelMaxRadius:  this.itemLabelMaxRadius = 0.2,
      itemLabelRadius:     this.itemLabelRadius = 0.85,
      itemLabelRotation:   this.itemLabelRotation = 0,
    } = props);

    this.setImage(props.image);
    this.setIsInteractive(props.isInteractive);
    this.setItems(props.items);
    this.setItemBackgroundColors(props.itemBackgroundColors);
    this.setItemLabelColors(props.itemLabelColors);
    this.setItemLabelFont(props.itemLabelFont);
    this.setLineColor(props.lineColor);
    this.setLineWidth(props.lineWidth);
    this.setMaxRotationSpeed(props.maxRotationSpeed);
    this.setOffset(props.offset);
    this.setOnRest(props.onRest);
    this.setOnSpin(props.onSpin);
    this.setOverlayImage(props.overlayImage);
    this.setPointerRotation(props.items);
    this.setRadius(props.radius);
    this.setRotation(props.rotation);
    this.setRotationResistance(props.rotationResistance);
    this.setRotationSpeed(props.rotationSpeed);

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
      w: minSize - (minSize * this.offset.x),
      h: minSize - (minSize * this.offset.y),
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
      x: w / 2 + (w * this.offset.x),
      y: h / 2 + (h * this.offset.y),
    };

    // Recalculate the wheel radius:
    this.actualRadius = (this.size / 2) * this.radius;

    // Adjust the font size of labels so they all fit inside `wheelRadius`:
    this.itemLabelFontSize = this.itemLabelFontMaxSize * (this.size / enums.fontScale);
    const maxLabelWidth = this.actualRadius * (this.itemLabelRadius - this.itemLabelMaxRadius);
    this.actualItems.forEach((i) => {
      this.itemLabelFontSize = Math.min(this.itemLabelFontSize, util.getFontSizeToFit(i.label, this.itemLabelFont, maxLabelWidth, this.context));
    });

    this.frameRequestId = window.requestAnimationFrame(this.drawFrame.bind(this));

  }

  /**
   * Main animation loop.
   */
  drawFrame(now = 0) {

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

    let currentItem;
    let itemAngle;
    let lastItemAngle; // Record the last angle so we can resume in the next loop.

    // Draw wedges:
    lastItemAngle = this.rotation;
    for (let i = 0; i < this.actualItems.length; i++) {

      itemAngle = this.actualItems[i].weight * this.weightedItemAngle;
      const startAngle = lastItemAngle;
      const endAngle = lastItemAngle + itemAngle;

      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.arc(
        this.center.x,
        this.center.y,
        this.actualRadius,
        util.degRad(startAngle + enums.arcAdjust),
        util.degRad(endAngle + enums.arcAdjust)
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

      lastItemAngle += itemAngle;

      if (util.isAngleBetween(this.pointerRotation, startAngle % 360, endAngle % 360)) {
        currentItem = this.actualItems[i];
      }

    }

    // Set font:
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.itemLabelAlign;
    ctx.font = this.itemLabelFontSize + 'px ' + this.itemLabelFont;

    ctx.save();

    // Draw item labels:
    lastItemAngle = this.rotation;
    for (let i = 0; i < this.actualItems.length; i++) {

      itemAngle = this.actualItems[i].weight * this.weightedItemAngle;

      ctx.save();
      ctx.beginPath();

      ctx.fillStyle = this.actualItems[i].labelColor;

      const angle = lastItemAngle + (itemAngle / 2) + this.itemLabelLineHeight;

      ctx.translate(
        this.center.x + Math.cos(util.degRad(angle + enums.arcAdjust)) * (this.actualRadius * this.itemLabelRadius),
        this.center.y + Math.sin(util.degRad(angle + enums.arcAdjust)) * (this.actualRadius * this.itemLabelRadius)
      );

      ctx.rotate(util.degRad(angle + enums.arcAdjust + this.itemLabelRotation));

      if (this.actualItems[i].label !== undefined) {
        ctx.fillText(this.actualItems[i].label, 0, 0);
      }

      ctx.restore();

      lastItemAngle += itemAngle;

    }

    this.drawImageOnCanvas(this.image, false);
    this.drawImageOnCanvas(this.overlayImage, true);

    if (this.rotationSpeed !== 0) {

      // Decrease rotation (simulate drag):
      this.rotationSpeed += (this.rotationResistance * delta) * this.rotationDirection;

      // Prevent rotation from going back the oposite way:
      if (this.rotationDirection === 1 && this.rotationSpeed < 0) {
        this.rotationSpeed = 0;
      } else if (this.rotationDirection === -1 && this.rotationSpeed >= 0) {
        this.rotationSpeed = 0;
      }

      if (this.rotationSpeed === 0) {
        this.onRest?.({
          event: 'rest',
          item: currentItem,
        });
      }

    }

    /*
    // Debugging: draw dragMove events
    if (this.dragMoves && this.dragMoves.length) {
      for (let i = this.dragMoves.length; i >= 0; i--) {
        const point = this.dragMoves[i];
        if (point === undefined) continue;
        let percentFill = i / this.dragMoves.length;
        percentFill = (percentFill -1) * -1;
        percentFill *= 100;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(200,100%,${percentFill}%)`;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();
      }
    }
    */

    // Wait until next frame.
    this.frameRequestId = window.requestAnimationFrame(this.drawFrame.bind(this));

  }

  drawImageOnCanvas(image, isOverlay = false) {

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
   * Increase `rotationSpeed by the value of `speed` (randomised by ±15% to make it realistically chaotic).
   */
  spin(speed = 0) {

    const newSpeed = this.rotationSpeed + util.getRandomInt(speed * 0.85, speed * 0.15);

    this.setRotationSpeed(newSpeed);

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

    for (let i = 0; i < this.items.length; i++) {

      const item = this.items[i];
      const newItem = {};

      // Background color:
      if (item.backgroundColor) {
        newItem.backgroundColor = item.backgroundColor
      } else if (this.itemBackgroundColors.length) {
        // Use a value from the repeating set:
        newItem.backgroundColor = this.itemBackgroundColors[i % this.itemBackgroundColors.length];
      } else {
        newItem.backgroundColor = '#fff'; // Default.
      }

      // Label:
      if (item.label) {
        newItem.label = item.label;
      } else {
        newItem.label = '';
      }

      // Label Color:
      if (item.labelColor) {
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
        newItem.weight = 1;
      };

      this.actualItems.push(newItem);

    }

    if (this.actualItems.length) {
      this.weightedItemAngle = 360 / util.sumObjArray(this.actualItems, 'weight');
    } else {
      this.weightedItemAngle = 0;
    }

  }

  setImage(url = '') {
    if (!url) {
      this.image = null;
      return;
    }
    this.image = new Image();
    this.image.src = url;
  }

  setOffset(point = {x: 0, y: 0}) {
    if (!point) {
      this.offset = {x: 0, y: 0};
      return;
    }
    this.offset = point;
    this.resize();
  }

  setOverlayImage(url = '') {
    if (!url) {
      this.overlayImage = null;
      return;
    }
    this.overlayImage = new Image();
    this.overlayImage.src = url;
  }

  /**
   * Set the `items` to show on the wheel.
   */
  setItems(items = []) {
    if(!Array.isArray(items)) {
      this.items = [];
      this.weightedItemAngle = 0;
      return;
    }
    this.items = items;
    this.processItems();
  }

  /**
   * Set the repeating pattern of colors that will be used for each item's `backgroundColor`.
   * Is overridden by `item.backgroundColor`.
   * Example: `['#fff','#000']`.
   */
  setItemBackgroundColors(value = []) {
    if(!Array.isArray(value)) {
      this.itemBackgroundColors = [];
      return;
    }
    this.itemBackgroundColors = value;
    this.processItems();
  }

  /**
   * Set the repeating pattern of colors that will be used for each item's `labelColor`.
   * Is overridden by `item.labelColor`.
   * Example: `['#fff','#000']`.
   */
  setItemLabelColors(value = []) {
    if(!Array.isArray(value)) {
      this.itemLabelColors = [];
      return;
    }
    this.itemLabelColors = value;
    this.processItems();
  }

  /**
   * Set the font family of each `item.labelFont`.
   * Is overridden by `item.labelFont`.
   * Example: `'sans-serif'`.
   */
  setItemLabelFont(value = 'sans-serif') {
    if(!value) {
      this.itemLabelFont = 'sans-serif';
      return;
    }
    this.itemLabelFont = value;
    this.resize();
  }

  /**
   * Enable/disable the feature that lets the user spin the wheel using click-drag/touch-flick.
   */
  setIsInteractive(value = true) {
    if (typeof resistance !== 'number') {
      this.isInteractive = true;
      return;
    }
    this.isInteractive = value;
  }

  /**
   * Set the color of the lines between each item.
   */
  setLineColor(value = '#000') {
    if (typeof value !== 'string') {
      this.lineColor = '#000';
      return;
    }
    this.lineColor = value;
  }

  /**
   * Set the width of the lines between each item.
   */
  setLineWidth(value = 1) {
    if (typeof value !== 'number') {
      this.lineWidth = 1;
      return;
    }
    this.lineWidth = value;
  }

  /**
   * Set a maximum value for `rotationSpeed`.
   * The wheel will not spin faster than this value.
   */
  setMaxRotationSpeed(value = 250) {
    if (typeof value !== 'number') {
      this.maxRotationSpeed = 250;
      return;
    }
    this.maxRotationSpeed = value;
  }

  /**
   * Set a callback for the `onRest` event.
   */
  setOnRest(callback = null) {
    if (typeof callback !== 'function') {
      this.onRest = null;
      return;
    }
    this.onRest = callback;
  }

  /**
   * Set a callback for the `onSpin` event.
   */
  setOnSpin(callback = null) {
    if (typeof callback !== 'function') {
      this.onSpin = null;
      return;
    }
    this.onSpin = callback;
  }

  /**
   * Set the angle of the pointer which is used to determine the "winning" item.
   * 0 is north.
   */
  setPointerRotation(value = 0) {
    if (typeof value !== 'number') {
      this.pointerRotation = 0;
      return;
    }
    this.pointerRotation = value;
  }

  /**
   * Set the radius of the wheel as a percent of the container's smallest dimension.
   */
  setRadius(value = 0.95) {
    if (typeof value !== 'number') {
      this.radius = 0.95;
      return;
    }
    this.radius = value;
    this.resize();
  }

  /**
   * Set the rotation speed of the wheel.
   * Pass a positive number to spin clockwise, or a negative number to spin antiClockwise.
   * The further away from 0 the faster it will spin.
   */
  setRotationSpeed(value = 0) {

    // Limit speed to `this.maxRotationSpeed`
    let newSpeed = Math.min(value, this.maxRotationSpeed);
    newSpeed = Math.max(newSpeed, -this.maxRotationSpeed);

    this.rotationDirection = this.getRotationDirection(newSpeed);
    this.rotationSpeed = newSpeed;

  }

  /**
   * Set how much to reduce `rotationSpeed` by every second.
   */
  setRotationResistance(value = -35) {
    if (typeof value !== 'number') {
      this.rotation = -35;
      return;
    }
    this.rotationResistance = value;
  }

  /**
   * Set the rotation (angle in degrees) of the wheel.
   * 0 is north. `item[0]` will be drawn clockwise from this point.
   */
  setRotation(value = 0) {
    this.rotation = value;
  }

  /**
   * Get the angle (in degrees) of the given point from the center of the wheel.
   * 0 is north.
   */
  getAngleFromCenter(point = {x:0, y:0}) {
    return (util.getAngle(this.center.x, this.center.y, point.x, point.y) + 90) % 360;
  }

  /**
   * Enter the drag state.
   */
  dragStart(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas);

    this.isDragging = true; // Bool to indicate we are currently dragging.

    this.rotationSpeed = 0; // Stop the wheel from spinning.

    const a = this.getAngleFromCenter(p);

    this.dragDelta = util.addAngle(this.rotation, -a); // Used later in dragMove.
    this.dragMoves = []; // Initalise.
    this.dragLastPoint = {
      x: p.x,
      y: p.y,
    };

    this.refreshCursor();

  }

  /**
   * Animate the wheel to follow the pointer while dragging.
   * Save the drag events for later.
   */
  dragMove(point = {x:0, y:0}) {

    const p = util.translateXYToElement(point, this.canvas);
    const a = this.getAngleFromCenter(p);

    // Calc new rotation:
    const newRotation = util.addAngle(a, this.dragDelta);

    // Calc direction:
    const aFromLast = util.addAngle(a, -this.getAngleFromCenter(this.dragLastPoint));
    const direction = (aFromLast < 180) ? 1 : -1;

    // Calc distance:
    const distance = util.getDistanceBetweenPoints(p, this.dragLastPoint) * direction;

    // Save data for use in dragEnd event.
    this.dragMoves.unshift({
      distance,
      x: p.x,
      y: p.y,
      now:performance.now(),
    });

    this.dragMoves.length = 50; // Truncate array to keep it small.

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
    this.dragDelta = null;
    clearInterval(this.dragClearOldDistances);

    // Calc the drag distance:
    let dragDistance = 0;
    const now = performance.now();
    this.dragMoves = this.dragMoves.reduce((result, value) => {

      // Ignore old dragMove events (so the user can cancel the drag by not moving for a short time).
      if (value !== undefined && now - value.now < 250) {
        dragDistance += value.distance * 1.5;
        result.push(value);
      }

      return result;

    }, []);

    // Spin the wheel:
    if (dragDistance !== 0) {

      this.setRotationSpeed(dragDistance);

      this.onSpin?.({
        event: 'spin',
        direction: this.rotationDirection,
        rotationSpeed: this.rotationSpeed,
        dragMoves: this.dragMoves,
      });

    }

    this.refreshCursor();

  }

}
