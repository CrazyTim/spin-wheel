<div>
  <img alt="thumbnail" src="https://crazytim.github.io/spin-wheel/repo-thumbnail.jpg" width="350px" />
  <br>
</div>

# Spin Wheel

## Features

- Vanilla JavaScript (ES6).
- No dependencies.
- Simple, easy to read API.
- Realistic wheel rotation (no easing, just momentum and drag).
- Interactive - spin the wheel using click-drag/touch-flick, or you can manually call `spin()`.
- [Easily themeable](https://crazytim.github.io/spin-wheel/examples/themes):
  - Items can have different sizes, fonts and colors.
  - Labels can be rotated and aligned.
  - Draw images on each item, the wheel, and the canvas.
  - Repeating colour sets.
- Callbacks for events like `onSpin` and `onRest`.
- Clockwise and anticlockwise spinning.
- Responsive layout - the wheel resizes automatically to fit it's container, making it easy to adjust.

## How to make your own wheel

```JavaScript
// 1. Define the wheel's properties:
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

Some numeric properties need to be specified using relative values because the wheel is responsive and resizes automatically to fit inside it's container. In some cases we need to specify a value that is a percent of the canvas size, and other times we specify pixels that will be scaled to a canvas size of `500px`. This makes it much faster to make a wheel because if the size of the container changes you don't have to worry about updating fiddly things like widths and positions.

For example, `wheel.radius` is expressed as a percent of the size of the canvas. So `0.9` means the wheel will fill 90% of the canvas. 

Another example is `LineWidth`, which is expressed in pixels and scaled to a canvas size of `500px`. Meaning a line width of `10` will be exactly 10px when the canvas size is 500px.

Labels are easy to configure because the font size is calculated automatically. You can optionally set `itemLabelFontSizeMax` (scaled to a canvas size of `500px`), but otherwise the font size of all the labels will be based on the largest label resized to fit between `itemLabelRadius` and  `itemLabelRadiusMax`.

For example configurations see [./examples/themes/js/props.js](https://github.com/CrazyTim/spin-wheel/blob/master/examples/themes/js/props.js).

<div>
  <img alt="diagram of props" src="https://crazytim.github.io/spin-wheel/props-diagram.svg" width="615px" />
  <br>
  <br>
</div>

## Methods for `Wheel`

Method                                             | Description
-------------------------------------------------- | ---------------------------
`init(props = {})`                                 | Initialise the instance with the given properties (see Properties below). If any properties are omitted, then default values will be applied.
`spin(speed = 0, randomAdjustmentPercent = 0.0)`   | Spin the wheel by setting `rotationSpeed` and raise the onSpin event. Optionally apply a random adjustment to the speed within a range (percent), which can make the spin less predictable.
`getCurrentIndex()`                                | Get the index of the item that the Pointer is pointing at. An item is considered "current" if the `pointerRotation` is between it's start angle (inclusive) and it's end angle (exclusive).

## Properties for `Wheel`

Name                            | Default Value     | Description
------------------------------- | ------------------| ---------------------------
`borderColor`                   | `#000`            | The color of the line around the circumference of the wheel.
`borderWidth`                   | `0`               | The width (in pixels) of the line around the circumference of the wheel. Scaled to a canvas size of 500px.
`debug`                         | `false`           | Show debugging info. This is particularly helpful when fine-tuning labels.
`image`                         | `''`              | The url of an image that will be drawn over the center of the wheel which will rotate with the wheel. It will be scaled to fit `radius`.
`isInteractive`                 | `true`            | Allow the user to spin the wheel using click-drag/touch-flick.
`itemBackgroundColors`          | `['#fff']`        | The repeating pattern of colors that will be used for each `item.backgroundColor`. Is overridden by `item.backgroundColor`. Example: `['#fff','#000']`.
`itemLabelAlign`                | `'right'`         | The alignment of each `item.label`. Is overridden by `item.labelColor`. Accepted vlaues: `'left'`|`'center'`|`'right'`. If you change this to `'left'`, you will also need to set `itemLabelRotation` to `180°`.
`itemLabelBaselineOffset`       | `0`               | The offset of the baseline (or line height) of each `item.label` as a percentage of the label's height.
`itemLabelColors`               | `['#000']`        | The repeating pattern of colors that will be used for each `item.labelColor`. Is overridden by `item.labelColor`. Example: `['#fff','#000']`.
`itemLabelFont`                 | `'sans-serif'`    | The font family of each `item.labelFont`. Is overridden by `item.labelFont`. Example: `'sans-serif'`.
`itemLabelFontSizeMax`          | `100`             | The maximum font size (in pixels) to draw each `item.label`. Scaled to a canvas size of 500px. The actual font size will be calculated automatically so that the longest label of all the items fits within `itemLabelRadiusMax` and the font size is below `itemLabelFontSizeMax`.
`itemLabelRadius`               | `0.85`            | The point along the radius (as a percent, starting from the inside of the circle) to start drawing each `item.label`.
`itemLabelRadiusMax`            | `0.2`             | The point along the radius (as a percent, starting from the inside of the circle) to calculate the font size of each `item.label` so that the largest label fits between it and `itemLabelRadius`.
`itemLabelRotation`             | `0`               | The rotation of each `item.label`. Use this to flip the labels `180°` when changing `itemLabelAlign`.
`items`                         | `[]`              | The `items` to show on the wheel.
`lineColor`                     | `'#000'`          | The color of the lines between each item.
`lineWidth`                     | `1`               | The width (in pixels) of the lines between each item. Scaled to a canvas size of 500px.
`radius`                        | `0.95`            | The radius of the wheel as a percent of the container's smallest dimension.
`rotation`                      | `0`               | The rotation (angle in degrees) of the wheel. `0` is north. `item[0]` will be drawn clockwise from this point.
`rotationResistance`            | `-35`             | How much to reduce `rotationSpeed` by every second.
`rotationSpeed`                 | `0`               | How far (angle in degrees) the wheel should spin every 1 second. Any number other than 0 will spin the wheel. Pass a positive number to spin clockwise, or a negative number to spin antiClockwise.
`rotationSpeedMax`              | `250`             | The maximum value for `rotationSpeed`. The wheel will not spin faster than this value.
`offset`                        | `{w: 0, h: 0}`    | The offset of the wheel relative to it's center as a percent of the wheels diameter, where `1` = 100%. This allows for simple positioning considering the wheel is always centered anyway.
`onCurrentIndexChange`          | `null`            | The callback for the `onCurrentIndexChange` event.
`onRest`                        | `null`            | The callback for the `onRest` event.
`onSpin`                        | `null`            | The callback for the `onSpin` event.
`overlayImage`                  | `''`              | The url of an image that will be drawn over the center of the wheel which will not rotate with the wheel. It will be scaled to fit a radius of 100%. Use this to draw decorations around the wheel, such as a stand or pointer.
`pointerRotation`               | `0`               | The angle of the Pointer which is used to determine the `currentIndex` (or the "winning" item). 0 is north.

## Properties for items

Name                            | Default Value     | Description
------------------------------- | ----------------- | ---------------------------
`backgroundColor`               | `null`            | The background color of the item. Example: `'#fff'`.
`label`                         | `''`              | The text you want to show in the item.
`labelColor`                    | `null`            | The color of the label. Example: `'#000'`.
`labelFont`                     | `null`            | The font of the label. Example: `'sans-serif'`.
`weight`                        | `1`               | The proportional size of the item. For example say you have 2 items, where `item[0]` has a weight of `1` and `item[1]` has a weight of `2`. This means `item[0]` will take up 1/3 of the space on the wheel and `item[1]` will take up 2/3 of the space.

## Events for `Wheel`

#### `onCurrentIndexChange(event = {})`

Raised when a new item is pointed at. This can be used to change the color of the current item, or play a 'ticking' sound. 

Key                         | Value
--------------------------- | ---------------------------
`event`                     | `'currentIndexChange'`
`currentIndex`              | The index of the item that the Pointer was pointing at (see `pointerRotation`).

#### `onRest(event = {})`

Raised when the wheel comes to a rest after spinning. 

Key                         | Value
--------------------------- | ---------------------------
`event`                     | `'rest'`
`currentIndex`              | The index of the item that the Pointer was pointing at (see `pointerRotation`).

#### `onSpin(event = {})`

Raised when the wheel has been spun by the user (via click-drag/touch-flick), or after calling `spin()`.

Key                         | Value
--------------------------- | --------------------------- 
`event`                     | `'spin'`
`rotationDirection`         | The direction that the wheel was spinning; `1` for clockwise, `-1` for anticlockwise.
`rotationSpeed`             | The rotation speed of the wheel.
`dragEvents`                | Array of drag events that occurred during the drag that was used to determine the outcome of the spin event.

## Acknowledgements

Inspired by [random-wheel](https://github.com/njradford/random-wheel).
