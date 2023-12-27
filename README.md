<img src="https://crazytim.github.io/spin-wheel/repo-thumbnail.jpg" width="450px" alt="thumbnail">

# Spin Wheel

An easy to use, themeable component for randomising choices and prizes.

## Features

- Vanilla JavaScript (ES6).
- No dependencies.
- Simple, easy to use API.
- Spin by applying momentum and drag, or animate to a specific angle with easing.
- Interactable with click-drag or touch-flick.
- Responsive layout (resizes automatically to fit it's container).
- Easily themeable:
  - Give items their own color and weight.
  - Rotate labels and change alignment.
  - Draw images on items, the wheel, and the foreground.
  - Apply repeating colour sets.
- Callbacks for events like `onSpin` and `onCurrentIndexChange`.
- Clockwise and anticlockwise spinning.

## Installation

### ESM

```javascript
import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@4.3.1/dist/spin-wheel-esm.js';
```

### IIFE

```html
<script src="https://cdn.jsdelivr.net/npm/spin-wheel@4.3.1/dist/spin-wheel-iife.js"></script>
```

### Local

```sh
npm install spin-wheel
```

## How to make your own wheel

```javascript
// 1. Configure the wheel's properties:
const props = {
  items: [
    {
      label: 'one',
    },
    {
      label: 'two',
    },
    {
      label: 'three',
    },
  ]
}

// 2. Decide where you want it to go:
const container = document.querySelector('.wheel-container');

// 3. Create the wheel in the container and initialise it with the props:
const wheel = new Wheel(container, props);
```

## How to spin the wheel

For multiplayer games or awarding prizes with actual value, the best way is to call `Wheel.spinToItem()`. The wheel will spin for a certain duration, and once finished the pointer will be pointing at the specified item. You should always calculate the winning item on the back-end, for example:

```javascript
const winningItemIndex = await fetchWinningItemIndex();
const duration = 4000;
const easing = easing.cubicOut;
wheel.spinToItem(winningItemIndex, duration, true, 2, 1, easing)
```

If precision is not important, you can use `Wheel.spin()` to immediately start spinning the wheel at a certain speed, which will be reduced over time according to `Wheel.rotationResistance`. You can also set `Wheel.isInteractive = true` to allow the user to spin the wheel themselves by dragging or flicking.

## Examples

- [Basic ESM](https://crazytim.github.io/spin-wheel/examples/esm)
- [Basic IIFE](https://crazytim.github.io/spin-wheel/examples/iife)
- [Basic Vue3/Vite](https://crazytim.github.io/spin-wheel/examples/vue3/dist)
- [Spin to a specific item](https://crazytim.github.io/spin-wheel/examples/spin-to-item)
- [Themes](https://crazytim.github.io/spin-wheel/examples/themes)
- [Developer playground (for testing and troubleshooting)](https://crazytim.github.io/spin-wheel/examples/playground)

## Configuration

Everything is easy to configure. The wheel is responsive and resizes automatically to fit it's container, so when the size of the container changes you don't have to worry about updating fiddly things like widths and font sizes. For that reason, some numeric properties are expressed as percentages, while others are expressed as pixels.

* **Percentage properties** are a percent of the container size. For example, a `Wheel.radius` of `0.9` means the wheel will fill `90%` of the container.

* **Pixel properties** are relative to a container size of `500px`. For example, a `Wheel.LineWidth` of `1` will be exactly `1px` when the container size is `500px`.

Labels are also simple to configure because the font size is calculated automatically. You can optionally set `Wheel.itemLabelFontSizeMax` (in pixels), but otherwise the largest item label will be sized to fit between `Wheel.itemLabelRadius` (percent) and  `Wheel.itemLabelRadiusMax` (percent).

Here's a handy diagram:

<img alt="diagram of props" src="https://crazytim.github.io/spin-wheel/props-diagram.svg" width="615px" />

## Methods for `Wheel`

Method                                                              | Description
------------------------------------------------------------------- | ---------------------------
`constructor(container, props = {})`                                | Create the wheel inside a container Element and initialise it with props.</p><p>`container` must be an Element.</p><p>`props` must be an Object or null.
`init(props = {})`                                                  | Initialise all properties.</p><The>If a value is not provided for a property then it will be given a default value.
`remove`                                                            | Remove the wheel from the DOM and unregister event handlers.
`spin(rotationSpeed = 0)`                                           | Spin the wheel by setting `rotationSpeed`. The wheel will immediately start spinning, and slow down over time depending on the value of `rotationResistance`.</p><p>A positive number will spin clockwise, a negative number will spin anticlockwise.
`spinTo(rotation = 0, duration = 0, easingFunction = null)`         | Spin the wheel to a particular rotation.</p><p>The animation will occur over the provided `duration` (milliseconds).<p>The animation can be adjusted by providing an optional `easingFunction` which accepts a single parameter n, where n is between 0 and 1 inclusive.</p><p>If no easing function is provided, the default easeSinOut will be used.</p><p>For example easing functions see [easing-utils](https://github.com/AndrewRayCode/easing-utils).
`spinToItem(itemIndex = 0, duration = 0, spinToCenter = true, numberOfRevolutions = 1, easingFunction = null)` | Spin the wheel to a particular item.</p><p>The animation will occur over the provided `duration` (milliseconds).</p><p>If `spinToCenter` is true, the wheel will spin to the center of the item, otherwise the wheel will spin to a random angle inside the item.</p><p>`numberOfRevolutions` controls how many times the wheel will rotate a full 360 degrees before resting on the item.</p><p>The animation can be adjusted by providing an optional `easingFunction` which accepts a single parameter n, where n is between 0 and 1 inclusive.</p><p>If no easing function is provided, the default easeSinOut will be used.</p><p>For example easing functions see [easing-utils](https://github.com/AndrewRayCode/easing-utils).
`stop()`                                                            | Immediately stop the wheel from spinning, regardless of which method was used to spin it.
`getCurrentIndex()`                                                 | Get the index of the item that the Pointer is pointing at.</p><p>An item is considered "current" if `pointerAngle` is between it's start angle (inclusive) and it's end angle (exclusive).

## Properties for `Wheel`

Note: setting a property to `undefined` will reset it to the default value.

Name                            | Default Value     | Description
------------------------------- | ------------------| ---------------------------
`borderColor`                   | `#000`            | The color of the line around the circumference of the wheel.
`borderWidth`                   | `0`               | The width (in pixels) of the line around the circumference of the wheel.
`debug`                         | `false`           | Show debugging info.</p><p>This is particularly helpful when fine-tuning labels.
`image`                         | `''`              | The url of an image that will be drawn over the center of the wheel which will rotate with the wheel.</p><p>It will be automatically scaled to fit `radius`.
`isInteractive`                 | `true`            | Allow the user to spin the wheel using click-drag/touch-flick. </p><p>User interaction will only be detected within the bounds of `Wheel.radius`.
`itemBackgroundColors`          | `['#fff']`        | The repeating pattern of background colors for all items.</p><p>Overridden by `Item.backgroundColor`.</p><p>Example: `['#fff','#000']`.
`itemLabelAlign`                | `'right'`         | The alignment of all item labels.</p><p>Accepted values: `'left'`,`'center'`,`'right'`.
`itemLabelBaselineOffset`       | `0`               | The offset of the baseline (or line height) of all item labels (as a percent of the label's height).
`itemLabelColors`               | `['#000']`        | The repeating pattern of colors for all item labels.</p><p>Overridden by `Item.labelColor`.</p><p>Example: `['#fff','#000']`.
`itemLabelFont`                 | `'sans-serif'`    | The font family for all item labels.</p><p>Example: `'sans-serif'`.
`itemLabelFontSizeMax`          | `100`             | The maximum font size (in pixels) for all item labels.
`itemLabelRadius`               | `0.85`            | The point along the radius (as a percent, starting from the center of the wheel) to start drawing all item labels.
`itemLabelRadiusMax`            | `0.2`             | The point along the radius (as a percent, starting from the center of the wheel) to calculate the maximum font size for all item labels.
`itemLabelRotation`             | `0`               | The rotation of all item labels.<p></p>Use this in combination with `itemLabelAlign` to flip the labels `180°`.
`itemLabelStrokeColor`          | `#fff`            | The color of the stroke applied to the outside of the label text.
`itemLabelStrokeWidth`          | `0`               | The width of the stroke applied to the outside of the label text.
`items`                         | `[]`              | The items to show on the wheel.
`lineColor`                     | `'#000'`          | The color of the lines between the items.
`lineWidth`                     | `1`               | The width (in pixels) of the lines between the items.
`pixelRatio`                    | `0`               | The pixel ratio used to render the wheel.</p><p>Values above 0 will produce a sharper image at the cost of performance.</p><p>A value of `0` will cause the pixel ratio to be automatically determined using `window.devicePixelRatio`.
`radius`                        | `0.95`            | The radius of the wheel (as a percent of the container's smallest dimension).
`rotation`                      | `0`               | The rotation (angle in degrees) of the wheel.</p><p>The first item will be drawn clockwise from this point.
`rotationResistance`            | `-35`             | The amount that `rotationSpeed` will be reduced by every second. Only in effect when `rotationSpeed !== 0`.</p><p>Set to `0` to spin the wheel infinitely.
`rotationSpeed`                 | `0`               | (Readonly) How far (angle in degrees) the wheel will spin every 1 second.</p><p>A positive number means the wheel is spinning clockwise, a negative number means anticlockwise, and `0` means the wheel is not spinning.
`rotationSpeedMax`              | `250`             | The maximum value for `rotationSpeed` (ignoring the wheel's spin direction).</p><p>The wheel will not spin faster than this value in any direction.
`offset`                        | `{w: 0, h: 0}`    | The offset of the wheel relative to it's center (as a percent of the wheel's diameter).
`onCurrentIndexChange`          | `null`            | The callback for the `onCurrentIndexChange` event.
`onRest`                        | `null`            | The callback for the `onRest` event.
`onSpin`                        | `null`            | The callback for the `onSpin` event.
`overlayImage`                  | `''`              | The url of an image that will be drawn over the center of the wheel which will not rotate with the wheel.</p><p>It will be automatically scaled to fit the container's smallest dimension.</p><p>Use this to draw decorations around the wheel, such as a stand or pointer.
`pointerAngle`                  | `0`               | The angle of the Pointer which is used to determine the `currentIndex` (or the "winning" item).

## Events for `Wheel`

### `onCurrentIndexChange(event = {})`

Raised when a new item is pointed at. This can be used to change the color of the current item, or play a 'ticking' sound.

Key                         | Value
--------------------------- | ---------------------------
`type`                      | `'currentIndexChange'`
`currentIndex`              | The index of the item that the Pointer was pointing at.</p><p>See `Wheel.pointerAngle`.

### `onRest(event = {})`

Raised when the wheel comes to a rest after spinning.

Key                         | Value
--------------------------- | ---------------------------
`type`                      | `'rest'`
`currentIndex`              | The index of the item that the Pointer was pointing at.</p><p>See `Wheel.pointerAngle`.
`rotation`                  | The rotation of the wheel.</p><p>See `Wheel.rotation`.

### `onSpin(event = {})`

Raised when the wheel has been spun.

Key                         | Value
--------------------------- | ---------------------------
`type`                      | `'spin'`
`duration`                  | the duration of the spin animation. Only set when `method = spinto` or `method = spintoitem`.
`method`                    | The method that was used to spin the wheel (`interact`, `spin`, `spinto`, `spintoitem`).
`rotationResistance`        | The value of `Wheel.rotationResistance` at the time the event was raised.</p><p>Only set when `method = interact` or `method = spin`.
`rotationSpeed`             | The value of `Wheel.rotationSpeed` at the time the event was raised.</p><p>Only set when `method = interact` or `method = spin`.
`targetItemIndex`           | The item that the Pointer will be pointing at once the spin animation has finished.</p><p>Only set when `method = spintoitem`.
`targetRotation`            | The value that `Wheel.rotation` will have once the spin animation has finished.</p><p>Only set when `method = spinto` or `method = spintoitem`.

## Methods for `Item`

Name                            | Description
------------------------------- | ---------------------------
`getCenterAngle()`              | Get the angle (in degrees) that this item ends at (exclusive), ignoring the current `rotation` of the wheel.
`getEndAngle()`                 | Get the angle (in degrees) that this item ends at (inclusive), ignoring the current `rotation` of the wheel.
`getIndex()`                    | Get the 0-based index of this item.
`getRandomAngle()`              | Return a random angle (in degrees) between this item's start angle (inclusive) and end angle (inclusive).
`getStartAngle()`               | Get the angle (in degrees) that this item starts at (inclusive), ignoring the current `rotation` of the wheel.
`init(props = {})`              | Initialise all properties.</p><p>If a value is undefined or invalid then that property will fall back to a default value.

## Properties for `Item`

Note: setting a property to `undefined` will reset it to the default value.

Name                            | Default Value     | Description
------------------------------- | ----------------- | ---------------------------
`backgroundColor`               | `null`            | The background color of the item.</p><p>When `null`, the actual color rendered will fall back to `Wheel.itemBackgroundColors`.</p><p>Example: `'#fff'`.
`image`                         | `null`            | The url of an image that will be drawn on the item. Any part of the image that extends outside the item will be clipped. The image will be drawn over the top of `Item.backgroundColor`.
`imageOpacity`                  | `1`               | The opacity (as a percent) of `Item.image`. Useful if you want to fade the image to make the item's label stand out.
`imageRadius`                   | `0.5`             | The point along the radius (as a percent, starting from the center of the wheel) to draw the center of `Item.image`.
`imageRotation`                 | `0`               | The rotation (angle in degrees) of `Item.image`.
`imageScale`                    | `1`               | The scale (as a percent) to resize `Item.image`.
`label`                         | `''`              | The text that will be drawn on the item.
`labelColor`                    | `null`            | The color of the label.</p><p>When `null`, the actual color rendered will fall back to `Wheel.itemLabelColors`.</p><p>Example: `'#000'`.
`value`                         | `null`            | Some value that has meaning to your application. For example, a reference to the object representing the item on the wheel, or a database id.
`weight`                        | `1`               | The proportional size of the item relative to other items on the wheel.</p><p>For example, if you have 2 items where `item[0]` has a weight of `1` and `item[1]` has a weight of `2`, then `item[0]` will take up 1/3 of the space on the wheel.

## Acknowledgements

Inspired by [random-wheel](https://github.com/njradford/random-wheel).
