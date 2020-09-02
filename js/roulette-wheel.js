import * as util from './roulette-util.js'

/**
 * Draw the wheel.
 */
export default class RouletteWheel {

  constructor(container) {

    this.canvasContainer = container;

    this.createCanvas();
    this.registerEvents();

    // Define callbacks:
    this.callback_rest = () => {};
    this.callback_spin = () => {};

    this.init(); // This needs to be called again once the object has been created, passing the real settings.

  }

  createCanvas() {

    // Remove any existing children:
    while (this.canvasContainer.firstChild) {
       this.canvasContainer.removeChild(this.canvasContainer.firstChild);
    }

    this.canvas = document.createElement('canvas');
    this.canvasContainer.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');
    this.defaultCanvasWidth = 500; // So we can scale fonts.

  }

  registerEvents() {

    window.onresize = () => this.handleWindowResize();

    this.canvas.onmousedown = (e) => this.handleCanvasMouseDown(e);
    this.canvas.onmouseup = (e) => this.handleCanvasMouseUp(e);
    this.canvas.onmousemove = (e) => this.handleCanvasMouseMove(e);
    this.canvas.onmouseenter = (e) => this.handleCanvasMouseEnter(e);
    this.canvas.onmouseout = (e) => this.handleCanvasMouseOut(e);

    this.canvas.ontouchstart = (e) => this.handleCanvasTouchStart(e);
    this.canvas.ontouchmove = (e) => this.handleCanvasTouchMove(e);
    this.canvas.ontouchend = (e) => this.handleCanvasTouchEnd(e);

  }

  /**
   * Initalise variables, allowing the wheel to be drawn.
   */
  init(settings = {}) {

    // Destructure settings, define defaults:
    ({
      items:               this.items = [], // Array of item objects to show on the wheel.
      itemLabelRadius:     this.itemLabelRadius = .85, // Where to place the label along the radius (percent), starting from the inside of the circle.
      itemLabelMaxRadius:  this.itemLabelMaxRadius = 0, // Labels will be automatically resized to fit inside this radius (percent), starting from the inside of the circle.
      itemLabelRotation:   this.itemLabelRotation = 180, // Nessecary to flip the label upside down when changing `itemLabelAlign`.
      itemLabelAlign:      this.itemLabelAlign = util.AlignTextEnum.left,
      itemLabelLineHeight: this.itemLabelLineHeight = 0, // Adjust the line height of the font.
      itemLabelColor:      this.itemLabelColor = '#000',
      itemLabelFont:       this.itemLabelFont = 'sans-serif',
      itemLabelFontMaxSize:this.itemLabelFontMaxSize = 20, // Maximum font size, but font size may be resized further to fit `itemLabelMaxRadius`.
      itemLineWidth:       this.itemLineWidth = 1, // Width of the line that separates each item.
      itemLineColor:       this.itemLineColor = '#000', // Color of the line that separates each item.
      itemColorSet:        this.itemColorSet = [], // Pattern of colors that will be applied to items repeatedly.
      itemLabelColorSet:   this.itemLabelColorSet = [], // Pattern of colors that will be applied to items repeatedly.
      radius:              this.radius = .95, // Radius of wheel relative to canvas dimensions (percent).
      rotation:            this.rotation = 0, // The current rotation of the wheel.
      rotationSpeed:       this.rotationSpeed = 0, // The current speed of the wheel.
      maxRotationSpeed:    this.maxRotationSpeed = 250, // The max speed the wheel can reach (every spin will add to the speed).
      rotationResistance:  this.rotationResistance = -35, // How fast the wheel slows down while spinning.
      spinSpeed:           this.spinSpeed = 190, // The max speed that can be created by a single spin (speed is randomised, as low as 70% of this value).
      overlayImageUrl:     this.overlayImageUrl = null, // Image to be overlayed.
      clickToSpin:         this.clickToSpin = true, // Enable events so the user can click on the wheel to spin it (otherwise you need to manually implement `spin()`).
    } = settings);

    if (typeof settings.callback_rest === 'function') {
      this.callback_rest = settings.callback_rest;
    }

    if (typeof settings.callback_spin === 'function') {
      this.callback_spin = settings.callback_spin;
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
    this.pointerAngle = this.rotation;
    this.setRotationSpeed(this.rotationSpeed);

    // Load overlay image:
    if (this.overlayImageUrl) {
      this.overlayImage = new Image();
      this.overlayImage.src = this.overlayImageUrl;
    }

    this.handleWindowResize(); // Initalise canvas width/height and start the animation loop.

  }

  /**
   * Spin the wheel by increasing `rotationSpeed`.
   */
  spin(speed) {

    // Randomise `speed` slightly so we can't predict when the wheel will stop.
    const newSpeed = this.rotationSpeed + util.getRandomInt(speed * 0.7, speed);

    this.setRotationSpeed(newSpeed);

    this.callback_spin({
      event: 'spin',
      direction: this.rotationDirection,
      speed: this.rotationSpeed,
    });

  }

  getRotationDirection(speed) {
     return (speed > 0) ? 1 : -1; // 1 == clockwise, -1 == antiClockwise.
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
  drawFrame() {

    let ctx = this.context;

    ctx.clearRect(0 ,0, this.canvas.width, this.canvas.height); // Clear canvas.

    // Calculate delta since last frame:
    const now = Date.now();
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

        if (util.isAngleBetween(this.pointerAngle, startAngle % 360, endAngle % 360)) {
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

      // Draw overlayImage:
      // Stretch image to fill canvas.
      if (this.overlayImageUrl) {
        let pos = {
          x: (this.canvas.width / 2) - (this.canvasSize / 2),
          y: (this.canvas.height / 2) - (this.canvasSize / 2),
        }
        ctx.drawImage(this.overlayImage, pos.x, pos.y, this.canvasSize, this.canvasSize);
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
          this.callback_rest({
            event: 'finish',
            item: currentItem,
          });
        }

    }

    // Wait until next frame.
    this.frameRequestId = window.requestAnimationFrame(this.drawFrame.bind(this));

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
    newSpeed = Math.max(newSpeed, this.maxRotationSpeed * -1);

    this.rotationDirection = this.getRotationDirection(newSpeed);
    this.rotationSpeed = newSpeed;

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
    const [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
    if (this.wheelHitTest(x, y)) this.dragStart(x, y);
  }

  handleCanvasTouchMove(e) {
    const [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
    if (this.isDragging) this.dragMove(x, y);
  }

  handleCanvasTouchEnd(e) {
    if (this.isDragging) this.dragEnd();
  }

  /*
   * Get the angle of the point from the center of the wheel.
   * 0° = north.
   */
  getAngleFromCenter(x,y) {
    const pos = util.translateXYToCanvas(x, y, this.canvas);
    return (util.getAngle(this.canvasCenterX, this.canvasCenterY, pos.x, pos.y) + 90) % 360;
  }

  dragStart(x, y) {

    this.isDragging = true; // Bool to indicate we are currently dragging.

    this.rotationSpeed = 0; // Stop the wheel from rotating.

    const a = this.getAngleFromCenter(x,y);

    this.dragDelta = this.rotation - a; // Used later in touchMove event.
    this.dragDistances = []; // Initalise.
    this.dragLastPoint = {x,y}; // Used later in touchMove event.

    // Simulate the passing of time:
    this.dragClearOldDistances = setInterval(() => {
      this.dragDistances.pop();
    }, 50);

  }

  dragMove(x, y) {

    const a = this.getAngleFromCenter(x,y);

    const newRotation = (a + this.dragDelta) % 360; // Difference from delta.
    const direction = newRotation - this.rotation; // Use rotation to calc direction.
    let distance = util.distanceBetweenPoints(x,y, this.dragLastPoint.x, this.dragLastPoint.y);
    distance *= this.getRotationDirection(direction) // Add direction to distance.

    this.dragDistances.unshift(distance); // Used later in touchEnd event.
    this.rotation = newRotation;
    this.dragLastPoint = {x,y};

  }

  dragEnd() {

    this.isDragging = false;
    this.dragDelta = null;
    clearInterval(this.dragClearOldDistances);

    // Spin the wheel:
    const dragDistance = this.dragDistances.reduce((a, b) => a + b, 0) * 1.5;
    if (dragDistance !== 0) {

      this.setRotationSpeed(dragDistance);

      this.callback_spin({
        event: 'spin',
        direction: this.rotationDirection,
        speed: this.rotationSpeed,
      });

    }

    /*
    console.log({
      distancesCount: this.dragDistances.length,
      distances: this.dragDistances,
    });
    */

  }

}
