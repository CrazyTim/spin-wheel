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
- [x] Items can have their own weight.
- [x] Adjust item labels appearance.
- [x] Change item background color.
- [x] Click region is localised to the shape of the wheel.
- [x] Callbacks for certain events.
- [x] Support for clockwise and anticlockwise spinning.
- [x] Setting to allow clicking the wheel to spin it, otherwise you can manually call `spin()`.
- [x] Draw an image over the canvas (easily themeable).
- [x] Drag the wheel around to spin it (click/drag or touch/flick).
- [ ] Realistic pointer that moves when it hits pins on the spinning wheel.
- [ ] Each item can have its own image.
- [ ] Display an image on the wheel which will rotate with the wheel.
- [ ] Allow stroke effects on the lines between each item (example: dashes).


## Methods for `RouletteWheel` 

Name                        | Description
--------------------------- | ---------------------------
`init(settings: object)`    | Initialise the instance with the given settings (see settings below).
`spin(speed: number)`       | Spin the wheel. Add `speed` to `rotationSpeed` ±30% (randomised to make it realistic and less predictable).


## Settings for `RouletteWheel.init()` 

Refer to the [example settings](https://github.com/CrazyTim/roulette-wheel/blob/master/js/roulette-example-settings.js).

<div>
  <img alt="thumbnail" src="https://crazytim.github.io/roulette-wheel/settings-diagram.png" width=520px />
  <br>
  <br>
</div>


Key                                 | Default Value               | Description
--------------------------- | --------------------------- | ---------------------------
`callback_rest`             | `null`                      | A function to call when the wheel comes to a rest after spinning.
`callback_spin`             | `null`                      | A function to call when the wheel has been spun.
`isInteractive`             | `true`                      | Allow the user to click-drag/swipe the wheel to spin it (otherwise you need to manually call `RouletteWheel.spin()`).
`itemColorSet`              | `[]`                        | Pattern of background colors that will be used for each `item`. Can be overridden by `item.color`. Example: `['#fff','#000']`.
`itemLabelAlign`            | `right`                     | `left`|`center`|`right`. If you change this to `left`, you will also need to set `itemLabelRotation` to `180°`.
`itemLabelColor`            | `'#000'`                    | The color of each `item.label`. Can be overridden by `itemColorSet`, or `item.color`.
`itemLabelColorSet`         | `[]`                        | Pattern of colors that will be used for each `item.label`. Can be overridden by `item.labelColor`. Example: `['#fff','#000']`.
`itemLabelFont`             | `'sans-serif'`              | The font family of each `item.label`.
`itemLabelFontMaxSize`      | `20`                        | The maximum font size to draw each `item.label`. The actual font size may smaller than this to accommodate `itemLabelMaxRadius`.
`itemLabelLineHeight`       | `0`                         | Use this to adjust the line height of the font.
`itemLabelMaxRadius`        | `.2`                        | A point along the radius (as a percent, starting from the inside of the circle) to resize each `item.label` (to fit) if it is too wide.
`itemLabelRadius`           | `.85`                       | A point along the radius (as a percent, starting from the inside of the circle) to start drawing each `item.label`.
`itemLabelRotation`         | `0`                         | Use this to flip `item.label` `180°` when changing `itemLabelAlign`.
`itemLineColor`             | `'#000'`                    | Color of the line that separates each `item.label`.
`itemLineWidth`             | `1`                         | Size of the line that separates each `item.label`.
`items`                     | `[]`                        | The `items` to show on the wheel.
`maxRotationSpeed`          | `250`                       | The maximum rotation speed that the wheel can reach.
`overlayImageUrl`           | `null`                      | The url of an image to be overlayed over the entire canvas (centred). This image will not spin with the wheel.
`radius`                    | `.95`                       | Radius of the wheel as a percent of the canvas' smallest dimension.
`rotation`                  | `0`                         | The angle that the wheel is rotated. `0°` is north. `item[0]' will be drawn clockwise. 
`rotationResistance`        | `-35`                       | The amount that `rotationSpeed` will reduce by every second.
`rotationSpeed`             | `0`                         | The rotation speed of the wheel.

## Acknowledgements

Inspired by [random-wheel](https://github.com/njradford/random-wheel).
