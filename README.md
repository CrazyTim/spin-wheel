<div>
  <img alt="thumbnail" src="https://crazytim.github.io/spin-wheel/repo-thumbnail.jpg" width=350px />
  <br>
</div>

# Spin Wheel

## Features

- [x] Vanilla JavaScript (ES6).
- [x] No dependencies.
- [x] Simple, easy to read API.
- [x] Realistic wheel rotation (no easing, just momentum and drag).
- [x] Interactive - spin the wheel using click-drag/touch-flick, or you can manually call `spin()`.
- [x] Easily themeable ([see examples](https://crazytim.github.io/spin-wheel/example/)):
  - [x] Adjust fonts and colors.
  - [x] Draw an image over the wheel and canvas.
  - [x] Apply repeating colour sets.
  - [x] Items can have their own weight and be resized proportionally.
- [x] Callbacks such as `onSpin` and `onRest`.
- [x] Clockwise and anticlockwise spinning.
- [x] The wheel resizes dynamically to fit inside its container element.
- [x] Implements `requestAnimationFrame` instead of `setTimeout`.

## How to make your own spinner

```JavaScript
// 1. Create a new `Wheel` object, passing the DOM element where you want it to go:
const wheel = new Wheel(document.querySelector('.wheel-wrapper'));

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

## Methods for `Wheel`

Method                           | Description
-------------------------------- | ---------------------------
`init(props = {})`               | Initialise the wheel with the given properties (see Properties below).
`spin(speed = 0)`                | Spin the wheel and raise the `onSpin` event. `speed` is added to `rotationSpeed` ±30% (randomised to make it realistic and less predictable).
`setImage(url = '')`             | Draw an image over the wheel (centred and resized to fit) which will rotate with the wheel.
`setItems(items = [])`           | Set the `items` to show on the wheel.
`setRotationSpeed(speed = 0)`    | Set the rotation speed of the wheel. Pass a positive number to spin clockwise, or a negative number to spin antiClockwise. The further away from 0 the faster it will spin.
`setRotation(rotation = 0)`      | Set the rotation (angle in degrees) of the wheel. `0°` is north. `item[0]` will be drawn clockwise from this point.
`setOffset(point = {x: 0, y: 0})`| Set the offset of the wheel relative to it's centre as a percent of the wheels diameter, where `1` = 100%. This allows for simple positioning considering the wheel is always centred anyway.
`setOnRest(callback = null)`     | Set a callback for the `onRest` event (see below).
`setOnSpin(callback = null)`     | Set a callback for the `onSpin` event (see below).
`setOverlayImage(url = '')`      | Draw an image over the wheel (centred and resized to fit) which will not rotate with the wheel.

## Properties for `Wheel`

You can set properties all at once by passing them as key-value pairs to `Wheel.init()`.

See [./example/js/props.js](https://github.com/CrazyTim/spin-wheel/blob/master/example/js/props.js).

![props diagram](https://crazytim.github.io/spin-wheel/props-diagram.svg)

Key                         | Default Value               | Description
--------------------------- | --------------------------- | ---------------------------
`image`                     | `null`                      | *
`isInteractive`             | `true`                      | Allow the user to spin the wheel using click-drag/touch-flick (otherwise you need to manually call `spin()`).
`itemColorSet`              | `[]`                        | Pattern of background colors that will be used for each `item`. Can be overridden by `item.color`. Example: `['#fff','#000']`.
`itemLabelAlign`            | `right`                     | `left`|`center`|`right`. If you change this to `left`, you will also need to set `itemLabelRotation` to `180°`.
`itemLabelColor`            | `'#000'`                    | The color of each `item.label`. Can be overridden by `itemColorSet`, or `item.color`.
`itemLabelColorSet`         | `[]`                        | Pattern of colors that will be used for each `item.label`. Can be overridden by `item.labelColor`. Example: `['#fff','#000']`.
`itemLabelFont`             | `'sans-serif'`              | The font family of each `item.label`.
`itemLabelFontMaxSize`      | `100`                       | The maximum font size to draw each `item.label`. The actual font size is calculated dynamically so that the longest label of all the items fits within `itemLabelMaxRadius` and the font size is below `itemLabelFontMaxSize`.
`itemLabelLineHeight`       | `0`                         | Use this to adjust the line height of the font.
`itemLabelMaxRadius`        | `.2`                        | The point along the radius (as a percent, starting from the inside of the circle) to resize each `item.label` (to fit) if it is too wide.
`itemLabelRadius`           | `.85`                       | The point along the radius (as a percent, starting from the inside of the circle) to start drawing each `item.label`.
`itemLabelRotation`         | `0`                         | Use this to flip `item.label` `180°` when changing `itemLabelAlign`.
`itemLineColor`             | `'#000'`                    | Color of the line that separates each `item.label`.
`itemLineWidth`             | `1`                         | Size of the line that separates each `item.label`.
`items`                     | `[]`                        | *
`maxRotationSpeed`          | `250`                       | The maximum rotation speed that the wheel can reach.
`offset`                    | `{x: 0, y: 0}`              | *
`onRest`                    | `null`                      | The callback function for the `onRest` event (see below).
`onSpin`                    | `null`                      | The callback function for the `onSpin` event (see below).
`overlayImage`              | `null`                      | *
`pointerRotation`           | `0`                         | The angle of the pointer that is used to determine the "winning" item (see the `onRest` event). `0°` is north.
`radius`                    | `.95`                       | Radius of the wheel as a percent of the container's smallest dimension.
`rotation`                  | `0`                         | *
`rotationResistance`        | `-35`                       | The amount that `rotationSpeed` will reduce by every second.
`rotationSpeed`             | `0`                         | *

* = See method description above. Do not set this property directly. Use it's equivalent `set` method instead.

## Properties for items

Key                         | Default Value               | Description
--------------------------- | --------------------------- | ---------------------------
`label`                     | `''`                        | The text you want to show in the item.
`weight`                    | `1`                         | The size of the item. For example say you have 2 items, where `item[0]` has a weight of `1` and `item[1]` has a weight of `2`. This means `item[0]` will take up 1/3 of the space on the wheel and `item[1]` will take up 2/3 of the space.
`color`                     | `''`                        | Background color. Example: `#fff'`.
`labelColor`                | `''`                        | Example: `#fff'`.

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
