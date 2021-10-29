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
// 1. Define the wheel's properties. The only required property is `items`.
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

// 2. Decide where you want it to go:
const container = document.querySelector('.wheel-container');

// 3. Create the wheel in the container and initialise it with the props:
const wheel = new Wheel(container, props);
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

Labels are not given an absolute size either. Instead you set `itemLabelFont` (example `'Arial'`), `itemLabelFontSizeMax` (this is a relative size), and `itemLabelRadiusMax` (as a percent of the radius), and the actual size of the font is calculated automatically to fit in the available space.

## Methods for `Wheel`

Method                                       | Description
-------------------------------------------- | ---------------------------
`init(props = {})`                           | Initialise the instance with the given properties (see Properties below). If any properties are omitted, then default values will be applied.
`spin(speed = 0)`                            | Spin the wheel and raise the `onSpin` event. `speed` is added to `rotationSpeed` ±30% (randomised to make it realistic and less predictable).

## Properties for `Wheel`

You can set properties all at once by passing them as key-value pairs to `Wheel.init()`.

For example usage see [./example/js/props.js](https://github.com/CrazyTim/spin-wheel/blob/master/example/js/props.js).

<div>
  <img alt="diagram of props" src="https://crazytim.github.io/spin-wheel/props-diagram.svg" width=615px />
  <br>
  <br>
</div>

Name                            | Default Value     | Description
------------------------------- | ------------------| ---------------------------
`debug`                         | `false`           | Show debugging info. This is particularly helpful when fine-tuning labels.
`image`                         | `''`              | The url of an image that will be drawn over the centre of the wheel which will rotate with the wheel. It will be scaled to fit `radius`.
`isInteractive`                 | `true`            | Allow the user to spin the wheel using click-drag/touch-flick.
`itemBackgroundColors`          | `[]`              | The repeating pattern of colors that will be used for each `item.backgroundColor`. Is overridden by `item.backgroundColor`. Example: `['#fff','#000']`.
`itemLabelAlign`                | `'right'`         | The alignment of each `item.label`. Is overridden by `item.labelColor`. Accepted vlaues: `'left'`|`'center'`|`'right'`. If you change this to `'left'`, you will also need to set `itemLabelRotation` to `180°`.
`itemLabelBaselineOffset`       | `0`               | The offset of the baseline (or line height) of each `item.label` as a percentage of the label's height.
`itemLabelColors`               | `[]`              | The repeating pattern of colors that will be used for each `item.labelColor`. Is overridden by `item.labelColor`. Example: `['#fff','#000']`.
`itemLabelFont`                 | `''`              | The font family of each `item.labelFont`. Is overridden by `item.labelFont`. Example: `'sans-serif'`.
`itemLabelFontSizeMax`          | `100`             | The maximum font size to draw each `item.label`. The actual font size will be calculated dynamically so that the longest label of all the items fits within `itemLabelRadiusMax` and the font size is below `itemLabelFontSizeMax`.
`itemLabelRadius`               | `0.85`            | The point along the radius (as a percent, starting from the inside of the circle) to start drawing each `item.label`.
`itemLabelRadiusMax`            | `0.2`             | The point along the radius (as a percent, starting from the inside of the circle) to resize each `item.label` (to fit) if it is too wide.
`itemLabelRotation`             | `0`               | The rotation of each `item.label`. Use this to flip the labels `180°` when changing `itemLabelAlign`.
`items`                         | `[]`              | The `items` to show on the wheel.
`lineColor`                     | `'#000'`          | The color of the lines between each item.
`lineWidth`                     | `1`               | The width of the lines between each item.
`radius`                        | `0.95`            | The radius of the wheel as a percent of the container's smallest dimension.
`rotation`                      | `0`               | The rotation (angle in degrees) of the wheel. `0` is north. `item[0]` will be drawn clockwise from this point.
`rotationResistance`            | `-35`             | How much to reduce `rotationSpeed` by every second.
`rotationSpeed`                 | `0`               | The rotation speed of the wheel. Pass a positive number to spin clockwise, or a negative number to spin antiClockwise. The further away from 0 the faster it will spin.
`rotationSpeedMax`              | `250`             | The maximum value for `rotationSpeed`. The wheel will not spin faster than this value.
`offset`                        | `{w: 0, h: 0}`    | The offset of the wheel relative to it's centre as a percent of the wheels diameter, where `1` = 100%. This allows for simple positioning considering the wheel is always centred anyway.
`onRest`                        | `null`            | The callback for the `onRest` event (see below).
`onSpin`                        | `null`            | The callback for the `onSpin` event (see below).
`overlayImage`                  | `''`              | The url of an image that will be drawn over the centre of the wheel which will not rotate with the wheel. It will be scaled to fit a radius of 100%. Use this to draw decorations around the wheel, such as a stand or pointer.
`pointerRotation`               | `0`               | The angle of the pointer which is used to determine the "winning" item. 0 is north.

## Properties for items

Name                            | Default Value     | Description
------------------------------- | ----------------- | ---------------------------
`backgroundColor`               | `'#fff'`          | The background color of the item.
`label`                         | `''`              | The text you want to show in the item.
`labelColor`                    | `'#000'`          | The color of the label.
`weight`                        | `1`               | The size of the item. For example say you have 2 items, where `item[0]` has a weight of `1` and `item[1]` has a weight of `2`. This means `item[0]` will take up 1/3 of the space on the wheel and `item[1]` will take up 2/3 of the space.

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
