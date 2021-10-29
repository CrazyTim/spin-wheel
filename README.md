<div>
  <img alt="thumbnail" src="https://crazytim.github.io/spin-wheel/repo-thumbnail.jpg" width=350px />
  <br>
</div>

# Spin Wheel

## Features

- Vanilla JavaScript (ES6).
- No dependencies.
- Simple, easy to read API.
- Realistic wheel rotation (no easing, just momentum and drag).
- Interactive - spin the wheel using click-drag/touch-flick, or you can manually call `spin()`.
- Easily themeable ([see examples](https://crazytim.github.io/spin-wheel/example/)):
  - Adjust fonts and colors.
  - Draw an image over the wheel and canvas.
  - Apply repeating colour sets.
  - Items can have their own weight and be resized proportionally.
- Callbacks such as `onSpin` and `onRest`.
- Clockwise and anticlockwise spinning.
- The wheel resizes dynamically to fit inside its container element.
- Implements `requestAnimationFrame` instead of `setTimeout`.

## How to make your own spinner

```JavaScript
// 1. Create a new `Wheel` object, passing the DOM element where you want it to go:
const wheel = new Wheel(document.querySelector('.wheel-container'));

// 2. Define the wheel's properties. The only required property is `items`.
const props = {
  pointerRotation: 90,
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

// 3. Initialise the wheel with the properties:
wheel.init(props);
```

See below for more detail. Also see the [example code](https://github.com/CrazyTim/spin-wheel/blob/master/example/index.html).

To run the example, host the files on a web server, or if you have Node.js run:

```shell
npm install
npm start
```

## Configuring

Some numeric properties are specified as a percent. For example, instead of setting `wheel.radius` to an absolute value of `400px` you set it to `1.0` or 100%, meaning it will fill the available space in the container. This makes sense because the wheel always resizes itself to fit inside the container. This makes things easier because when the size of the container changes you don't have to worry about updating fiddly things like the font size - it happens automatically :grin:.

The same goes for `wheel.offset` which is measured as a percent from the center of the container. Setting `offset.w` to `-0.5` will move the wheel 50% off the left edge of the container.

Labels are not given an absolute size either. Instead you set `itemLabelFont` (example `'Arial'`), `itemLabelFontMaxSize` (this is a relative size), and `itemLabelMaxRadius` (as a percent of the radius), and the actual size of the font is calculated automatically to fit in the available space.

## Methods for `Wheel`

Method                                       | Description
-------------------------------------------- | ---------------------------
`init(props = {})`                           | Initialise the instance with the given properties (see Properties below). If any properties are omitted, then default values will be applied.
`spin(speed = 0)`                            | Spin the wheel and raise the `onSpin` event. `speed` is added to `rotationSpeed` ±30% (randomised to make it realistic and less predictable).
`setDebug(debug = false)`                    | Show/hide debugging info. This is particularly helpful when fine-tuning labels.
`setImage(url = '')`                         | Draw an image over the centre of the wheel, which will be scaled to fit the wheel diameter and rotate with the wheel.
`setItems(items = [])`                       | Set the `items` to show on the wheel.
`setItemBackgroundColors(colors = [])`       | Set the repeating pattern of colors that will be used for each `item.backgroundColor`. Is overridden by `item.backgroundColor`. Example: `['#fff','#000']`.
`setItemLabelColors(colors = [])`            | Set the repeating pattern of colors that will be used for each `item.labelColor`. Is overridden by `item.labelColor`. Example: `['#fff','#000']`.
`setItemLabelFont(font = '')`                | Set the font family of each `item.labelFont`. Is overridden by `item.labelFont`. Example: `'sans-serif'`.
`setItemLabelBaselineOffset(offset = 0)`     | Offset the baseline (or line height) of each `item.label` as a percentage of the label's height.
`setIsInteractive()`                         | Enable/disable the feature that lets the user spin the wheel using click-drag/touch-flick.
`setlineColor()`                             | Set the color of the lines between each item.
`setlineWidth()`                             | Set the width of the lines between each item.
`setMaxRotationSpeed(speed = 0)`             | Set a maximum value for `rotationSpeed`. The wheel will not spin faster than this value.
`setRadius(value = 0.95)`                    | Set the radius of the wheel as a percent of the container's smallest dimension.
`setRotationSpeed(speed = 0)`                | Set the rotation speed of the wheel. Pass a positive number to spin clockwise, or a negative number to spin antiClockwise. The further away from 0 the faster it will spin.
`setRotation(rotation = 0)`                  | Set the rotation (angle in degrees) of the wheel. `0` is north. `item[0]` will be drawn clockwise from this point.
`setRotationResistance(resistance = 0)`      | Set how much to reduce `rotationSpeed` by every second.
`setOffset(size = {w: 0, h: 0})`             | Set the offset of the wheel relative to it's centre as a percent of the wheels diameter, where `1` = 100%. This allows for simple positioning considering the wheel is always centred anyway.
`setOnRest(callback = null)`                 | Set a callback for the `onRest` event (see below).
`setOnSpin(callback = null)`                 | Set a callback for the `onSpin` event (see below).
`setOverlayImage(url = '')`                  | Draw an image over the centre of the wheel which will not rotate with the wheel. Use this to draw decorations around the wheel, such as a stand or pointer.
`setPointerRotation(value = 0)`              | Set the angle of the pointer which is used to determine the "winning" item. 0 is north.

## Properties for `Wheel`

You can set properties all at once by passing them as key-value pairs to `Wheel.init()`.

See [./example/js/props.js](https://github.com/CrazyTim/spin-wheel/blob/master/example/js/props.js).

<div>
  <img alt="diagram of props" src="https://crazytim.github.io/spin-wheel/props-diagram.svg" width=615px />
  <br>
  <br>
</div>

Key                         | Default Value               | Description
--------------------------- | --------------------------- | ---------------------------
`debug`                     | `false`                     | *
`image`                     | `null`                      | *
`isInteractive`             | `true`                      | *
`itemBackgroundColors`      | `[]`                        | *
`itemLabelAlign`            | `'right'`                   | `'left'`|`'center'`|`'right'`. If you change this to `'left'`, you will also need to set `itemLabelRotation` to `180°`.
`itemLabelColors`           | `[]`                        | *
`itemLabelFont`             | `'sans-serif'`              | *
`itemLabelFontMaxSize`      | `100`                       | The maximum font size to draw each `item.label`. The actual font size is calculated dynamically so that the longest label of all the items fits within `itemLabelMaxRadius` and the font size is below `itemLabelFontMaxSize`.
`itemLabelOffset`           | `0`                         | *
`itemLabelMaxRadius`        | `.2`                        | The point along the radius (as a percent, starting from the inside of the circle) to resize each `item.label` (to fit) if it is too wide.
`itemLabelRadius`           | `0.85`                      | The point along the radius (as a percent, starting from the inside of the circle) to start drawing each `item.label`.
`itemLabelRotation`         | `0`                         | Use this to flip `item.label` `180°` when changing `itemLabelAlign`.
`lineColor`                 | `'#000'`                    | *
`lineWidth`                 | `1`                         | *
`items`                     | `[]`                        | *
`maxRotationSpeed`          | `250`                       | *
`offset`                    | `{x: 0, y: 0}`              | *
`onRest`                    | `null`                      | *
`onSpin`                    | `null`                      | *
`overlayImage`              | `null`                      | *
`pointerRotation`           | `0`                         | *
`radius`                    | `0.95`                      | *
`rotation`                  | `0`                         | *
`rotationResistance`        | `-35`                       | *
`rotationSpeed`             | `0`                         | *

* = See method description above. Do not set this property directly. Use the equivalent `set` method instead.

## Properties for items

Key                         | Default Value               | Description
--------------------------- | --------------------------- | ---------------------------
`backgroundColor`           | `'#fff'`                    | The background color of the item.
`label`                     | `''`                        | The text you want to show in the item.
`labelColor`                | `'#000'`                    | The color of the label.
`weight`                    | `1`                         | The size of the item. For example say you have 2 items, where `item[0]` has a weight of `1` and `item[1]` has a weight of `2`. This means `item[0]` will take up 1/3 of the space on the wheel and `item[1]` will take up 2/3 of the space.

## Events

#### `onRest(e:object)`

Raised when the wheel comes to a rest after spinning. 

Key                         | Value
--------------------------- | ---------------------------
`event`                     | `'rest'`
`item`                      | The item that the `pointer` was pointing at when the wheel stopped spinning (see `pointerRotation`).

#### `onSpin(e:object)`

Raised when the wheel has been spun by the user (via click-drag/touch-flick), or after calling `spin()`.

Key                         | Value
--------------------------- | --------------------------- 
`event`                     | `'spin'`
`direction`                 | The direction that the wheel is spinning; `1` for clockwise, `-1` for anticlockwise.
`rotationSpeed`             | The rotation speed of the wheel.

## Acknowledgements

Inspired by [random-wheel](https://github.com/njradford/random-wheel).
