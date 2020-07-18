import * as util from './roulette-util.js'

/**
 * Draw the wheel.
 */
export default class RouletteWheel {

  constructor(container) {

    this.canvasContainer = container;
    this.overlayImageLoaded = false;

    this.createCanvas();
    this.registerEvents();

    // Define callbacks:
    this.callback_rest = () => {};
    this.callback_spin = () => {};

  }

  createCanvas() {

    // Remove any existing children:
    while (this.canvasContainer.firstChild) {
       this.canvasContainer.removeChild(this.canvasContainer.firstChild);
    }

    this.canvas = document.createElement('canvas');
    this.canvasContainer.appendChild(this.canvas);

    // Create div overlay to capture pointer events (allow clicking on the wheel part only).
    this.clickRegion = document.createElement('div');
    this.clickRegion.style.position = 'absolute';
    this.canvasContainer.appendChild(this.clickRegion);

    this.context = this.canvas.getContext('2d');
    this.defaultCanvasWidth = 500; // So we can scale fonts.
    this.drawFrame(); // Start animation loop.

  }

  registerEvents() {
    window.onresize = () => this.handleResize_window();
  }

  /**
   * Initalise variables, allowing the wheel to be drawn.
   */
  init(settings = {}) {

    // Destructure settings, define defaults:
    ({
      items:               this.items = [],
      itemLabelRadius:     this.itemLabelRadius = .85, // Where to place the label along the radius (percent).
      itemLabelRotation:   this.itemLabelRotation = 180,
      itemLabelAlign:      this.itemLabelAlign = util.AlignTextEnum.left,
      itemLabelLineHeight: this.itemLabelLineHeight = 0, // Adjust the line height of the font.
      itemLabelColor:      this.itemLabelColor = '#000',
      itemLabelFont:       this.itemLabelFont = 'sans-serif',
      itemLabelSize:       this.itemLabelSize = 20,
      itemLineWidth:       this.itemLineWidth = 1,
      itemLineColor:       this.itemLineColor = '#000',
      itemColorSet:        this.itemColorSet = [],
      itemLabelColorSet:   this.itemLabelColorSet = [],
      radius:              this.radius = .95, // Radius of wheel relative to canvas dimensions (percent).
      rotationResistance:  this.rotationResistance = -35, // How fast the wheel slows down while spinning.
      maxRotationSpeed:    this.maxRotationSpeed = 250, // The max momentum of the wheel (Each spin will add to the momentum).
      rotation:            this.rotation = 0, // The initial wheel rotation.
      rotationSpeed:       this.rotationSpeed = 0, // The current momentum of the wheel.
      overlayImageUrl:     this.overlayImageUrl = null, // Image to be overlayed.
      spinSpeed:           this.spinSpeed = 190, // The max momentum that can be created by a single spin.
      clickToSpin:         this.clickToSpin = true, // Allow clicking on the wheel to spin it (otherwise you need to implement `spin()`).
    } = settings);

    if (typeof settings.callback_rest === 'function') {
      this.callback_rest = settings.callback_rest;
    }

    if (typeof settings.callback_spin === 'function') {
      this.callback_spin = settings.callback_spin;
    }

    if (this.clickToSpin) {
      this.clickRegion.style.cursor = 'pointer';
      this.clickRegion.onclick = () => this.spin(this.spinSpeed);
    }

    this.handleResize_window(); // Initalise canvas width/height.

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

    this.weightedItemAngle = 360 / util.sum(this.items, 'weight');
    this.pointerAngle = this.rotation;
    this.rotationDirection = 1; // 1 == clockwise, -1 == antiClockwise.

    // Initalise overlay image:
    if (this.overlayImageUrl) {
      this.overlayImageLoaded = false;
      this.overlayImage = new Image();
      this.overlayImage.onload = () => this.overlayImageLoaded = true;
      this.overlayImage.src = this.overlayImageUrl;
    } else {
      this.overlayImageLoaded = true;
    }

  }

  /**
   * Spin the wheel by increasing `rotationSpeed`.
   */
  spin(speed) {

    // Randomise `speed` slightly so we can't predict when the wheel will stop.
    let newRotationSpeed = this.rotationSpeed + util.getRandomInt(speed * 0.7, speed);
    newRotationSpeed = Math.min(this.maxRotationSpeed, newRotationSpeed);

    this.rotationDirection = (newRotationSpeed > 0) ? 1 : -1;
    this.rotationSpeed = newRotationSpeed;

    this.callback_spin({
      event: 'spin',
      direction: this.rotationDirection,
      speed: this.rotationSpeed,
    });

  }

  /**
   * Resize `canvas` and `clickRegion` to fit (contain) inside `canvasContainer`.
   */
  handleResize_window() {

    // Get the smallest dimension of canvasContainer:
    let size = Math.min(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);

    // Resize canvas:
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.canvas.width = size;
    this.canvas.height = size;

    // Resize clickRegion:
    if (this.clickRegion) {
      this.clickRegion.style.width = size + 'px';
      this.clickRegion.style.height = size + 'px';
      this.clickRegion.style.clipPath = `circle(${this.radius * 50}% at 50% 50%)`;
    }

    // Calc some things for use later on:
    this.canvasCenterX = size / 2;
    this.canvasCenterY = size / 2;
    this.wheelRadius = this.canvasCenterX * this.radius;
    this.itemLabelFontSize = this.itemLabelSize * (size / this.defaultCanvasWidth);

  }

  isReady() {
    return this.overlayImageLoaded;
  }

  /**
   * Main animation loop.
   */
  drawFrame() {

    let ctx = this.context;

    ctx.clearRect(0 ,0, this.canvas.width, this.canvas.height); // Clear canvas.

    if (this.isReady()) {

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

        ctx.rotate(util.degRad(angle + this.itemLabelRotation));

        if (this.items[i].label !== undefined) {
          ctx.fillText(this.items[i].label, 0, 0);
        }

        ctx.restore();

        lastItemAngle += itemAngle;

      }

      // Draw overlayImage:
      // Stretch image to fill canvas.
      if (this.overlayImageUrl) {
        ctx.drawImage(this.overlayImage, 0, 0, this.canvas.width, this.canvas.height);
      }

      if (this.rotationSpeed !== 0) {

        // Decrease rotation (simulate drag):
        this.rotationSpeed += (this.rotationResistance * delta) * this.rotationDirection;

        // Prevent rotation from going back the oposite way:
        if (this.rotationDirection == 1 && this.rotationSpeed < 0) {
          this.rotationSpeed = 0;
        } else if (this.rotationDirection == -1 && this.rotationSpeed >= 0) {
          this.rotationSpeed = 0;
        }

        if (this.rotationSpeed == 0) {
          this.callback_rest({
            event: 'finish',
            item: currentItem,
          });
        }

      }

    }

    // Wait until next frame.
    window.requestAnimationFrame(this.drawFrame.bind(this));

  }

}
