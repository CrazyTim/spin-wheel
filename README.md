<div>
  <img alt="thumbnail" src="https://crazytim.github.io/roulette-wheel/repo-thumbnail.jpg" width=350px />
  <br>
</div>

# Roulette Wheel

## Motivation

- Easy to read code.
- Vanilla JS, modular, simple API, no dependencies.
- Easy to implement and skin ([see examples](https://crazytim.github.io/roulette-wheel/)).
- Interactive with mouse/touch gestures.

## Features

- [x] No dependencies. 
- [x] Simple, easy to read API.
- [x] Realistic wheel rotation (no easing, just momentum and drag).
- [x] Resize the canvas automatically to fit inside it's container.
- [x] Implements `requestAnimationFrame` instead of `setTimeout`.
- [x] Items can have their own weight (size can be adjusted proportionally).
- [x] Adjust the appearance of individual labels and backgrounds, and apply repeating colour sets.
- [x] Callbacks for certain events.
- [x] Support for clockwise and anticlockwise spinning.
- [x] Spin the wheel using click-drag/touch-flick.
- [x] Click region is localised to the shape of the wheel.
- [x] Setting to allow clicking the wheel to spin it, otherwise you can manually call `spin()`.
- [x] Draw an image over the wheel and canvas (easily themeable).
- [ ] Realistic pointer that moves when it hits pins on the spinning wheel.
- [ ] Each item can have its own image.

## Getting Started

Host the files on a web server, or if you have Node.js run:

```shell
npm install
npm start
```

## Methods for `RouletteWheel` 

Method                           | Description
-------------------------------- | ---------------------------
`init(settings:object)`          | Initialise the instance with the given settings (see settings below).
`spin(speed:number)`             | Spin the wheel and raise the `onSpin` event. `speed` is added to `rotationSpeed` ±30% (randomised to make it realistic and less predictable).
`setRotationSpeed(speed:number)` | Set the rotation speed of the wheel.
`setRotation(rotation:number)`   | Set the rotation of the wheel.

## Settings for `RouletteWheel.init()` 

The only setting that is required is `items`.

See the [example settings](https://github.com/CrazyTim/roulette-wheel/blob/master/js/roulette-example-settings.js).

![settings diagram](https://crazytim.github.io/roulette-wheel/settings-diagram.svg)

Setting                     | Default Value               | Description
--------------------------- | --------------------------- | ---------------------------
`image`                     | `null`                      | The url of an image to draw on the centre of the wheel. This image will rotate with the wheel. Useful for skinning.
`imageOverlay`              | `null`                      | The url of an image to draw over the entire canvas (centred and resized to fit). This image will not move when the wheel spins. Useful for skinning.
`isInteractive`             | `true`                      | Allow the user to spin the wheel using click-drag/touch-flick (otherwise you need to manually call `RouletteWheel.spin()`).
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
`items`                     | `[]`                        | The `items` to show on the wheel.
`maxRotationSpeed`          | `250`                       | The maximum rotation speed that the wheel can reach.
`onRest`                    | `null`                      | The callback function for the `onRest` event (see below).
`onSpin`                    | `null`                      | The callback function for the `onSpin` event (see below).
`pointerRotation`           | `0`                         | The angle of the pointer that is used to determine the "winning" item (see the `onRest` event). `0°` is north.
`radius`                    | `.95`                       | Radius of the wheel as a percent of the canvas' smallest dimension.
`rotation`                  | `0`                         | The initial angle that the wheel is rotated. `0°` is north. `item[0]` will be drawn clockwise from this point. Note: the rotation can also be changed by calling `setRotation()`.
`rotationResistance`        | `-35`                       | The amount that `rotationSpeed` will reduce by every second.
`rotationSpeed`             | `0`                         | The rotation speed of the wheel.

## Events

#### `onRest(e:object)`            

Raised when the wheel comes to a rest after spinning. 

Key                         | Value
--------------------------- | ---------------------------
`event`                     | `'rest'`
`item`                      | The item that the `pointer` was pointing at when the wheel stopped spinning (see the `pointerRotation` setting).

#### `onSpin(e:object)`

Raised when the wheel has been spun by the user (via click-drag/touch-flick), or after calling `spin()`.

Key                         | Value
--------------------------- | --------------------------- 
`event`                     | `'spin'`
`direction`                 | The direction that the wheel is spinning; `1` for clockwise, `-1` for anticlockwise.
`rotationSpeed`             | The rotation speed of the wheel.

## Acknowledgements

Inspired by [random-wheel](https://github.com/njradford/random-wheel).
