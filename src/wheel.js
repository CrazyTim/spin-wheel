import * as util from './wheel.util.js';
import * as enums from './wheel.enums.js';
import * as drag from './wheel.drag.js';

export default class Wheel {

  constructor(container) {
    this.canvasContainer = container;
    this.initCanvas();

    this.rotation = 0;
    this.rotationSpeed = 0;
  }

  initCanvas() {

    // Remove any existing children:
    while (this.canvasContainer.firstChild) {
       this.canvasContainer.removeChild(this.canvasContainer.firstChild);
    }

    this.canvas = document.createElement('canvas');
    this.canvasContainer.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');
    this.defaultCanvasWidth = 500; // So we can scale fonts.

    this.registerEvents();

  }

  /**
   * Initialise the instance with the given properties.
   */
  init(props = {}) {

    // Destructure properties, define defaults:
    // See README.md for property descriptions.
    ({
      isInteractive:       this.isInteractive = true,
      itemColorSet:        this.itemColorSet = [],
      itemLabelAlign:      this.itemLabelAlign = enums.AlignText.right,
      itemLabelColor:      this.itemLabelColor = '#000',
      itemLabelColorSet:   this.itemLabelColorSet = [],
      itemLabelFont:       this.itemLabelFont = 'sans-serif',
      itemLabelFontMaxSize:this.itemLabelFontMaxSize = 100,
      itemLabelLineHeight: this.itemLabelLineHeight = 0,
      itemLabelMaxRadius:  this.itemLabelMaxRadius = 0.2,
      itemLabelRadius:     this.itemLabelRadius = 0.85,
      itemLabelRotation:   this.itemLabelRotation = 0,
      itemLineColor:       this.itemLineColor = '#000',
      itemLineWidth:       this.itemLineWidth = 1,
      maxRotationSpeed:    this.maxRotationSpeed = 250,
      pointerRotation:     this.pointerRotation = 0,
      radius:              this.radius = 0.95,
      rotationResistance:  this.rotationResistance = -35,
      offset:              this.offset = {x: 0, y: 0},
    } = props);

    this.setOnRest(props.onRest);
    this.setOnSpin(props.onSpin);
    this.setItems(props.items);
    this.setRotation(props.rotation);
    this.setRotationSpeed(props.rotationSpeed);
    this.setImage(props.image);
    this.setOverlayImage(props.overlayImage);

    this.handleWindowResize(); // This will initalise the canvas width/height and start the animation loop.

  }

  registerEvents() {
    window.onresize = () => this.handleWindowResize();
    drag.registerEvents(this);
  }

  /**
   * Resize `canvas` to fit (contain) inside `canvasContainer`.
   */
  handleWindowResize() {

    window.cancelAnimationFrame(this.frameRequestId); // Cancel previous animation loop.

    // Get the smallest dimension of `canvasContainer`:
    const [w, h] = [this.canvasContainer.clientWidth, this.canvasContainer.clientHeight];
    const size = Math.min(w, h);

    // Resize canvas element:
    this.canvasSize = size;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w;
    this.canvas.height = h;

    this.center = {
      x: w / 2 + this.offset.x,
      y: h / 2 + this.offset.y,
    };

    this.wheelRadius = (size / 2) * this.radius;

    // Adjust the font size of labels so they all fit inside `wheelRadius`:
    this.itemLabelFontSize = this.itemLabelFontMaxSize * (size / this.defaultCanvasWidth);
    const maxLabelWidth = this.wheelRadius * (this.itemLabelRadius - this.itemLabelMaxRadius);
    this.items.forEach((i) => {
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

    ctx.strokeStyle = this.itemLineColor;
    ctx.lineWidth = this.itemLineWidth;
    ctx.lineJoin = 'bevel';

    // Draw wedges:
    lastItemAngle = this.rotation;
    for (let i = 0; i < this.items.length; i++) {

      itemAngle = this.items[i].weight * this.weightedItemAngle;
      const startAngle = lastItemAngle;
      const endAngle = lastItemAngle + itemAngle;

      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.arc(
        this.center.x,
        this.center.y,
        this.wheelRadius,
        util.degRad(startAngle + enums.arcAdjust),
        util.degRad(endAngle + enums.arcAdjust)
      );
      ctx.closePath();

      ctx.fillStyle = this.items[i].color;
      ctx.fill();

      if (this.itemLineWidth > 0) {
        ctx.stroke();
      }

      lastItemAngle += itemAngle;

      if (util.isAngleBetween(this.pointerRotation, startAngle % 360, endAngle % 360)) {
        currentItem = this.items[i];
      }

    }

    // Set font:
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.itemLabelAlign;
    ctx.font = this.itemLabelFontSize + 'px ' + this.itemLabelFont;
    ctx.fillStyle = this.itemLabelColor;

    ctx.save();

    // Draw item labels:
    lastItemAngle = this.rotation;
    for (let i = 0; i < this.items.length; i++) {

      itemAngle = this.items[i].weight * this.weightedItemAngle;

      ctx.save();
      ctx.beginPath();

      if (this.items[i].labelColor !== undefined) {
        ctx.fillStyle = this.items[i].labelColor;
      }

      const angle = lastItemAngle + (itemAngle / 2) + this.itemLabelLineHeight;

      ctx.translate(
        this.center.x + Math.cos(util.degRad(angle + enums.arcAdjust)) * (this.wheelRadius * this.itemLabelRadius),
        this.center.y + Math.sin(util.degRad(angle + enums.arcAdjust)) * (this.wheelRadius * this.itemLabelRadius)
      );

      ctx.rotate(util.degRad(angle + enums.arcAdjust + this.itemLabelRotation));

      if (this.items[i].label !== undefined) {
        ctx.fillText(this.items[i].label, 0, 0);
      }

      ctx.restore();

      lastItemAngle += itemAngle;

    }

    // Draw image:
    // Fit image to canvas dimensions.
    if (this.image) {

      ctx.save();

      ctx.translate( // Move to centre of canvas.
        this.canvas.width / 2,
        this.canvas.height / 2,
      );

      ctx.rotate(util.degRad(this.rotation)); // Rotate.

      ctx.drawImage(
        this.image,
        -(this.canvasSize / 2),
        -(this.canvasSize / 2),
        this.canvasSize,
        this.canvasSize,
        );

      ctx.restore();

    }

    // Draw overlay image:
    // Fit image to canvas dimensions.
    if (this.overlayImage) {

      ctx.drawImage(
        this.overlayImage,
        (this.canvas.width / 2) - (this.canvasSize / 2),
        (this.canvas.height / 2) - (this.canvasSize / 2),
        this.canvasSize,
        this.canvasSize
        );

    }

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
    return util.isPointInCircle(p, this.center.x, this.center.y, this.wheelRadius);
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

  setImage(url = '') {

    if (!url) {
      this.image = null;
      return
    }

    this.image = new Image();
    this.image.src = url;

  }

  setOverlayImage(url = '') {

    if (!url) {
      this.overlayImage = null;
      return
    }

    this.overlayImage = new Image();
    this.overlayImage.src = url;

  }

  setItems(items = []) {

    if(!Array.isArray(items)) {
      this.items = [];
      this.weightedItemAngle = 0;
      return;
    }

    this.items = items;

    if (this.itemColorSet.length) {
      // Fill any empty colors with a repeating color set:
      for (let i = 0; i < items.length; i++) {
        const c = this.itemColorSet[i % this.itemColorSet.length];
        if (!items[i].color) {
          items[i].color = c;
        }
      }
    } else {
      // Fill any empty colors with white:
      for (let i = 0; i < items.length; i++) {
        if (!items[i].color) {
          items[i].color = '#fff';
        }
      }
    }

    // Set a default weight for items that don't have it:
    for (let i = 0; i < items.length; i++) {
      if (items[i].weight === undefined) {
        items[i].weight = 1;
      };
    }

    // Apply repeating label colors:
    if (this.itemLabelColorSet.length) {
      for (let i = 0; i < items.length; i++) {
        const c = this.itemLabelColorSet[i % this.itemLabelColorSet.length];
        if (!items[i].labelColor) {
          items[i].labelColor = c;
        }
      }
    }

    this.weightedItemAngle = 360 / util.sumObjArray(this.items, 'weight');

  }

  setOnRest(callback = null) {
    if (typeof callback !== 'function') {
      this.onRest = null;
      return;
    }
    this.onRest = callback;
  }

  setOnSpin(callback = null) {
    if (typeof callback !== 'function') {
      this.onSpin = null;
      return;
    }
    this.onSpin = callback;
  }

  /**
   * Set the rotation speed of the wheel.
   * Pass a positive number to spin clockwise, and a negative number to spin antiClockwise.
   * The further away from 0 the faster it will spin.
   */
  setRotationSpeed(speed = 0) {

    // Limit speed to `this.maxRotationSpeed`
    let newSpeed = Math.min(speed, this.maxRotationSpeed);
    newSpeed = Math.max(newSpeed, -this.maxRotationSpeed);

    this.rotationDirection = this.getRotationDirection(newSpeed);
    this.rotationSpeed = newSpeed;

  }

  /**
   * Set the rotation (angle in degrees) of the wheel.
   * 0 is north.
   */
  setRotation(rotation = 0) {
    this.rotation = rotation;
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
