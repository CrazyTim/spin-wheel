<img src="https://crazytim.github.io/spin-wheel/repo-thumbnail.jpg" width="450px" alt="thumbnail">

# Spin Wheel

An easy to use, themeable component for randomising choices and prizes.

## Features

- Vanilla JavaScript (ES6).
- No dependencies.
- Simple, easy to use API.
- Realistic wheel rotation (no easing, just momentum and drag).
- Interactive - spin the wheel using click-drag/touch-flick, or you can manually call `spin()`.
- Easily themeable:
  - Give items their own color and weight.
  - Rotate labels and change alignment.
  - Draw images on items, the wheel, and the canvas.
  - Apply repeating colour sets.
- Callbacks for events like `onSpin` and `onRest`.
- Clockwise and anticlockwise spinning.
- Responsive layout - the wheel resizes automatically to fit it's container, making it easy to adjust.

## How to make your own wheel

```JavaScript
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

## Examples

- [Basic ESM usage](https://crazytim.github.io/spin-wheel/examples/esm)
- [Basic IIFE usage](https://crazytim.github.io/spin-wheel/examples/iife)
- [Themes](https://crazytim.github.io/spin-wheel/examples/themes)

## Configuration

For example configurations see [./examples/themes/js/props.js](https://github.com/CrazyTim/spin-wheel/blob/master/examples/themes/js/props.js).

Everything is easy to configure. The wheel is responsive and resizes automatically to fit it's container, so when the size of the container changes you don't have to worry about updating fiddly things like widths and font sizes. For that reason, some numeric properties are expressed as percentages, while others are expressed as pixels.

* **Percentage properties** are a percent of the size of the canvas. For example, a `Wheel.radius` of `0.9` means the wheel will fill `90%` of the canvas.

* **Pixel properties** are relative to a canvas size of `500px`. For example, a `Wheel.LineWidth` of `1` will be exactly `1px` when the canvas size is `500px`.

Labels are also simple to configure because the font size is calculated automatically. You can optionally set `Wheel.itemLabelFontSizeMax` (in pixels), but otherwise the largest item label will be sized to fit between `Wheel.itemLabelRadius` (percent) and  `Wheel.itemLabelRadiusMax` (percent).

Here's a handy diagram:

<img alt="diagram of props" src="https://crazytim.github.io/spin-wheel/props-diagram.svg" width="615px" />

## Methods for `Wheel`

Method                                             | Description
-------------------------------------------------- | ---------------------------
`constructor(container, props = {})`               | `container` parameter must be an Element.<br>`props` parameter must be an Object or null.
`init(props = {})`                                 | Initialise all properties.<br>If a value is not provided for a property then it will be given a default value.
`spin(speed = 0, randomAdjustmentPercent = 0.0)`   | Spin the wheel by setting `rotationSpeed` and raise the `onSpin` event.<br>Optionally apply a random adjustment to the speed within a range (percent), which can make the spin less predictable.
`getCurrentIndex()`                                | Get the index of the item that the Pointer is pointing at.<br>An item is considered "current" if `pointerAngle` is between it's start angle (inclusive) and it's end angle (exclusive).

## Properties for `Wheel`

Name                            | Default Value     | Description
------------------------------- | ------------------| ---------------------------
`borderColor`                   | `#000`            | The color of the line around the circumference of the wheel.
`borderWidth`                   | `0`               | The width (in pixels) of the line around the circumference of the wheel.
`debug`                         | `false`           | Show debugging info.<br>This is particularly helpful when fine-tuning labels.
`image`                         | `''`              | The url of an image that will be drawn over the center of the wheel which will rotate with the wheel.<br>It will be automatically scaled to fit `radius`.
`isInteractive`                 | `true`            | Allow the user to spin the wheel using click-drag/touch-flick.
`itemBackgroundColors`          | `['#fff']`        | The repeating pattern of background colors for all items.<br>Overridden by `Item.backgroundColor`.<br>Example: `['#fff','#000']`.
`itemLabelAlign`                | `'right'`         | The alignment of all item labels.<br>Accepted values: `'left'`|`'center'`|`'right'`.<br>You may need to set `itemLabelRotation` in combination with this.
`itemLabelBaselineOffset`       | `0`               | The offset of the baseline (or line height) of all item labels (as a percent of the label's height).
`itemLabelColors`               | `['#000']`        | The repeating pattern of colors for all item labels.<br>Overridden by `Item.labelColor`.<br>Example: `['#fff','#000']`.
`itemLabelFont`                 | `'sans-serif'`    | The font family for all item labels.<br>Example: `'sans-serif'`.
`itemLabelFontSizeMax`          | `100`             | The maximum font size (in pixels) for all item labels.
`itemLabelRadius`               | `0.85`            | The point along the radius (as a percent, starting from the center of the wheel) to start drawing all item labels.
`itemLabelRadiusMax`            | `0.2`             | The point along the radius (as a percent, starting from the center of the wheel) to calculate the maximum font size for all item labels.
`itemLabelRotation`             | `0`               | The rotation of all item labels.<b>Use this to flip the labels `180°` in combination with `itemLabelAlign`.
`items`                         | `[]`              | The items to show on the wheel.
`lineColor`                     | `'#000'`          | The color of the lines between the items.
`lineWidth`                     | `1`               | The width (in pixels) of the lines between the items.
`pixelRatio`                    | `0`               | The pixel ratio used to render the wheel.<br>Values above 0 will produce a sharper image at the cost of performance.<br>A value of `0` will cause the pixel ratio to be automatically determined using `window.devicePixelRatio`.
`radius`                        | `0.95`            | The radius of the wheel (as a percent of the container's smallest dimension).
`rotation`                      | `0`               | The rotation (angle in degrees) of the wheel.<br>The first item will be drawn clockwise from this point.
`rotationResistance`            | `-35`             | How much to reduce `rotationSpeed` by every second.
`rotationSpeed`                 | `0`               | How far (angle in degrees) the wheel should spin every 1 second.<br>Any number other than `0` will spin the wheel.<br>A positive number will spin clockwise, a negative number will spin antiClockwise.
`rotationSpeedMax`              | `250`             | The maximum value for `rotationSpeed`.<br>The wheel will not spin faster than this value.
`offset`                        | `{w: 0, h: 0}`    | The offset of the wheel relative to it's center (as a percent of the wheel's diameter).
`onCurrentIndexChange`          | `null`            | The callback for the `onCurrentIndexChange` event.
`onRest`                        | `null`            | The callback for the `onRest` event.
`onSpin`                        | `null`            | The callback for the `onSpin` event.
`overlayImage`                  | `''`              | The url of an image that will be drawn over the center of the wheel which will not rotate with the wheel.<br>It will be automatically scaled to fit the container's smallest dimension.<br>Use this to draw decorations around the wheel, such as a stand or pointer.
`pointerAngle`                  | `0`               | The angle of the Pointer which is used to determine the `currentIndex` (or the "winning" item).

## Events for `Wheel`

### `onCurrentIndexChange(event = {})`

Raised when a new item is pointed at. This can be used to change the color of the current item, or play a 'ticking' sound.

Key                         | Value
--------------------------- | ---------------------------
`event`                     | `'currentIndexChange'`
`currentIndex`              | The index of the item that the Pointer was pointing at.<br>See `Wheel.pointerAngle`.

### `onRest(event = {})`

Raised when the wheel comes to a rest after spinning.

Key                         | Value
--------------------------- | ---------------------------
`event`                     | `'rest'`
`currentIndex`              | The index of the item that the Pointer was pointing at.<br>See `Wheel.pointerAngle`.
`rotation`                  | The rotation of the wheel.<br>See `Wheel.rotation`.

### `onSpin(event = {})`

Raised when the wheel has been spun by the user (via click-drag/touch-flick), or after calling `Wheel.spin()`.

Key                         | Value
--------------------------- | ---------------------------
`event`                     | `'spin'`
`rotationSpeed`             | The rotation speed of the wheel.<br>See `Wheel.rotationSpeed`.
`dragEvents`                | An array of events that occurred during the interactive spin that was used to raise `onSpin`.<br>If the spin was not interactive then this will be an empty array.

## Properties for `Item`

Name                            | Default Value     | Description
------------------------------- | ----------------- | ---------------------------
`backgroundColor`               | `null`            | The background color of the item.<br>Falls back to `Wheel.itemBackgroundColors` when `null`.<br>Example: `'#fff'`.
`image`                         | `null`            | The url of an image that will be drawn on the item. Any part of the image that extends outside the item will be clipped.
`imageRadius`                   | `0.5`             | The point along the radius (as a percent, starting from the center of the wheel) to draw the center of `Item.image`.
`imageRotation`                 | `0`               | The rotation (angle in degrees) of `Item.image`.
`imageScale`                    | `1`               | The scale (as a percent) to resize `Item.image`.
`label`                         | `''`              | The text that will be drawn on the item.
`labelColor`                    | `null`            | The color of the label.<br>Falls back to `Wheel.itemLabelColors` when `null`.<br>Example: `'#000'`.
`value`                         | `null`            | Some value that has meaning to your application. For example, a reference to the object representing the item on the wheel, or a database id.
`weight`                        | `1`               | The proportional size of the item relative to other items on the wheel.<br>For example, if you have 2 items where `item[0]` has a weight of `1` and `item[1]` has a weight of `2`, then `item[0]` will take up 1/3 of the space on the wheel.

## Acknowledgements

Inspired by [random-wheel](https://github.com/njradford/random-wheel).
