import * as util from './roulette-util.js'

/**
 * Draw the wheel.
 */
export default class RouletteWheel {

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

  }

  /**
   * Initialise the instance with the given settings.
   */
  init(settings = {}) {

    // Destructure settings, define defaults:
    // See README for a description on each setting.
    ({
      isInteractive:       this.isInteractive = true,
      itemColorSet:        this.itemColorSet = [],
      itemLabelAlign:      this.itemLabelAlign = util.AlignTextEnum.right,
      itemLabelColor:      this.itemLabelColor = '#000',
      itemLabelColorSet:   this.itemLabelColorSet = [],
      itemLabelFont:       this.itemLabelFont = 'sans-serif',
      itemLabelFontMaxSize:this.itemLabelFontMaxSize = 100,
      itemLabelLineHeight: this.itemLabelLineHeight = 0,
      itemLabelMaxRadius:  this.itemLabelMaxRadius = .2,
      itemLabelRadius:     this.itemLabelRadius = .85,
      itemLabelRotation:   this.itemLabelRotation = 0,
      itemLineColor:       this.itemLineColor = '#000',
      itemLineWidth:       this.itemLineWidth = 1,
      items:               this.items = [],
      maxRotationSpeed:    this.maxRotationSpeed = 250,
      pointerRotation:     this.pointerRotation = 0,
      radius:              this.radius = .95,
      rotationResistance:  this.rotationResistance = -35,
    } = settings);

    if (typeof settings.rotation === "number") {
      // Preserve the old value if a new one wasn't supplied so its possible to keep the wheel spinning after changing the skin.
      this.rotation = settings.rotation;
    }

    if (typeof settings.rotationSpeed === "number") {
      // Preserve the old value if a new one wasn't supplied so its possible to keep the wheel spinning after changing the skin.
      this.rotationSpeed = settings.rotationSpeed;
    }

    if (typeof settings.onRest === 'function') {
      this.onRest = settings.onRest;
    } else {
      this.onRest = () => {};
    }

    if (typeof settings.onSpin === 'function') {
      this.onSpin = settings.onSpin;
    } else {
      this.onSpin = () => {};
    }

    { // Clean items:

      let items = this.items;

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
          items[i].weight = 1
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

    }

    this.weightedItemAngle = 360 / util.sumObjArray(this.items, 'weight');
    this.setRotationSpeed(this.rotationSpeed);

    // Load image:
    this.image = null;
    if (settings.image) {
      this.image = new Image();
      this.image.src = settings.image;
    }

    // Load overlay image:
    this.imageOverlay = null;
    if (settings.imageOverlay) {
      this.imageOverlay = new Image();
      this.imageOverlay.src = settings.imageOverlay;
    }

    this.registerEvents();

    this.handleWindowResize(); // Initalise canvas width/height and start the animation loop.

  }

  registerEvents() {

    window.onresize = () => this.handleWindowResize();

    if (this.isInteractive) {

      this.canvas.onmousedown = e => this.handleCanvasMouseDown(e);
      this.canvas.onmouseup = e => this.handleCanvasMouseUp(e);
      this.canvas.onmousemove = e => this.handleCanvasMouseMove(e);
      this.canvas.onmouseenter = e => this.handleCanvasMouseEnter(e);
      this.canvas.onmouseout = e => this.handleCanvasMouseOut(e);
      this.canvas.ontouchstart = e => this.handleCanvasTouchStart(e);
      this.canvas.ontouchmove = e => this.handleCanvasTouchMove(e);
      this.canvas.ontouchend = e => this.handleCanvasTouchEnd(e);

    } else {

      this.canvas.onmousedown = null;
      this.canvas.onmouseup = null;
      this.canvas.onmousemove = null;
      this.canvas.onmouseenter = null;
      this.canvas.onmouseout = null;
      this.canvas.ontouchstart = null;
      this.canvas.ontouchmove = null;
      this.canvas.ontouchend = null;

    }

  }

  /**
   * Resize `canvas` to fit (contain) inside `canvasContainer`.
   */
  handleWindowResize() {

    window.cancelAnimationFrame(this.frameRequestId); // Cancel previous animation loop.

    // Get the smallest dimension of `canvasContainer`:
    const [w, h] = [this.canvasContainer.clientWidth, this.canvasContainer.clientHeight];
    const size = Math.min(w, h);

    // Resize canvas:
    this.canvasSize = size;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w;
    this.canvas.height = h;

    // Calc some things for later on:
    this.canvasCenterX = w / 2;
    this.canvasCenterY = h / 2;
    this.wheelRadius = (size / 2) * this.radius;

    // Adjust the font size of labels so they all fit inside `wheelRadius`:
    this.itemLabelFontSize = this.itemLabelFontMaxSize * (size / this.defaultCanvasWidth);
    const maxLabelWidth = this.wheelRadius * (this.itemLabelRadius - this.itemLabelMaxRadius)
    this.items.forEach((i) => {
      this.itemLabelFontSize = Math.min(this.itemLabelFontSize, util.getFontSizeToFit(i.label, this.itemLabelFont, maxLabelWidth, this.context));
    });

    this.frameRequestId = window.requestAnimationFrame(this.drawFrame.bind(this));

  }

  /**
   * Main animation loop.
   */
  drawFrame(now) {

    let ctx = this.context;

    ctx.clearRect(0 ,0, this.canvas.width, this.canvas.height); // Clear canvas.

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
      ctx.moveTo(this.canvasCenterX, this.canvasCenterY);
      ctx.arc(
        this.canvasCenterX,
        this.canvasCenterY,
        this.wheelRadius,
        util.degRad(startAngle + util.arcAdjust),
        util.degRad(endAngle + util.arcAdjust)
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

      let angle = lastItemAngle + (itemAngle / 2) + this.itemLabelLineHeight;

      ctx.translate(
        this.canvasCenterX + Math.cos(util.degRad(angle + util.arcAdjust)) * (this.wheelRadius * this.itemLabelRadius),
        this.canvasCenterY + Math.sin(util.degRad(angle + util.arcAdjust)) * (this.wheelRadius * this.itemLabelRadius)
      );

      ctx.rotate(util.degRad(angle + util.arcAdjust + this.itemLabelRotation));

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

    // Draw imageOverlay:
    // Fit image to canvas dimensions.
    if (this.imageOverlay) {

      ctx.drawImage(
        this.imageOverlay,
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
        this.onRest({
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
   * Add `speed` to `rotationSpeed` ±30% (randomised to make it realistically less predictable).
   */
  spin(speed) {

    const newSpeed = this.rotationSpeed + util.getRandomInt(speed * 0.85, speed * 0.15);

    this.setRotationSpeed(newSpeed);

    this.onSpin({
      event: 'spin',
      direction: this.rotationDirection,
      rotationSpeed: this.rotationSpeed,
    });

  }

  getRotationDirection(speed) {
     return (speed > 0) ? 1 : -1; // 1 == clockwise, -1 == antiClockwise.
  }

  wheelHitTest(x,y) {
    const pos = util.translateXYToCanvas(x, y, this.canvas);
    return util.isPointInCircle(pos.x, pos.y, this.canvasCenterX, this.canvasCenterY, this.wheelRadius);
  }

  setCursor() {
    if (this.isDragging) {
      this.canvas.style.cursor = 'grabbing';
    } else {
      if (this.isCursorOverWheel) {
        this.canvas.style.cursor = 'grab';
      } else {
      this.canvas.style.cursor = null;
      }
    }
  }

  setRotationSpeed(speed) {

    // Limit speed:
    let newSpeed = Math.min(speed, this.maxRotationSpeed);
    newSpeed = Math.max(newSpeed, -this.maxRotationSpeed);

    this.rotationDirection = this.getRotationDirection(newSpeed);
    this.rotationSpeed = newSpeed;

  }

  setRotation(rotation) {
    this.rotation = rotation;
  }

  handleCanvasMouseDown(e) {
    const [x, y] = [e.clientX, e.clientY];
    if (this.wheelHitTest(x, y)) this.dragStart(x, y);
    this.setCursor();
  }

  handleCanvasMouseMove(e) {
    const [x, y] = [e.clientX, e.clientY];
    if (this.isDragging) this.dragMove(x, y);
    this.isCursorOverWheel = this.wheelHitTest(x, y);
    this.setCursor();
  }

  handleCanvasMouseEnter(e) {

    // If mouse up event occurs outside of canvas, end the drag when we mouse enter again:
    if (this.isDragging && !util.getMouseButtonsPressed(e).includes(1)) {
      this.dragEnd();
    };

    this.setCursor();

  }

  handleCanvasMouseOut(e) {
    this.isCursorOverWheel = false;
    this.setCursor();
  }

  handleCanvasMouseUp(e) {
    if (this.isDragging) this.dragEnd();
    this.setCursor();
  }

  handleCanvasTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    const [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
    if (this.wheelHitTest(x, y)) this.dragStart(x, y);
  }

  handleCanvasTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();
    const [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
    if (this.isDragging) this.dragMove(x, y);
  }

  handleCanvasTouchEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.isDragging) this.dragEnd();
  }

  /*
   * Get the angle of the point from the center of the wheel.
   * 0° == north.
   */
  getAngleFromCenter(x,y) {
    return (util.getAngle(this.canvasCenterX, this.canvasCenterY, x, y) + 90) % 360;
  }

  dragStart(x, y) {

    const pos = util.translateXYToCanvas(x, y, this.canvas);

    this.isDragging = true; // Bool to indicate we are currently dragging.

    this.rotationSpeed = 0; // Stop the wheel from spinning.

    const a = this.getAngleFromCenter(pos.x, pos.y);

    this.dragDelta = util.addAngle(this.rotation, -a); // Used later in dragMove.
    this.dragMoves = []; // Initalise.
    this.dragLastPoint = {
      x: pos.x,
      y: pos.y,
    };

  }

  dragMove(x, y) {

    const pos = util.translateXYToCanvas(x, y, this.canvas);
    const a = this.getAngleFromCenter(pos.x, pos.y);

    // Calc new rotation:
    const newRotation = util.addAngle(a, this.dragDelta);

    // Calc direction:
    const aFromLast = util.addAngle(a, -this.getAngleFromCenter(this.dragLastPoint.x, this.dragLastPoint.y));
    const direction = (aFromLast < 180) ? 1 : -1;

    // Calc distance:
    let distance = util.distanceBetweenPoints(pos.x, pos.y, this.dragLastPoint.x, this.dragLastPoint.y) * direction;

    // Save data for use in dragEnd event.
    this.dragMoves.unshift({
      distance,
      x: pos.x,
      y: pos.y,
      now:performance.now(),
    });

    this.dragMoves.length = 50; // Truncate array to keep it small.

    this.rotation = newRotation; // Snap the rotation to the drag start point.

    this.dragLastPoint = {
      x: pos.x,
      y: pos.y,
    };

  }

  dragEnd() {

    this.isDragging = false;
    this.dragDelta = null;
    clearInterval(this.dragClearOldDistances);

    // Calc the drag distance:
    let dragDistance = 0;
    const now = performance.now();
    this.dragMoves = this.dragMoves.reduce( (result, value) => {

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

      this.onSpin({
        event: 'spin',
        direction: this.rotationDirection,
        rotationSpeed: this.rotationSpeed,
        dragMoves: this.dragMoves,
      });

    }

  }

}
