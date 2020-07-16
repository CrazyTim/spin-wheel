# Roulette Wheel

## Rational

I couldn't find a roulette wheel which was simple, looked nice, and had all the features I wanted.

## Features
- [x] No dependencies. 
- [x] Simple, easy to read API.
- [x] Realistic wheel rotation (no easing, just momentum and drag).
- [x] Canvas resizes automatically to fit inside its container.
- [x] Implements `requestAnimationFrame` instead of `setTimeout`.
- [x] Items can have their own weight.
- [x] Style and position each items label.
- [x] Change the background color of each item.
- [x] Easily change the appearance by overlaying a svg.
- [x] Click region is localised to the wheel.
- [x] Callbacks (`spin`, and `finish`).
- [x] Support clockwise and anticlockwise spinning.
- [x] Setting to allow clicking on the wheel to spin it, otherwise you can manually call `spin()`.
- [x] Draw a svg image over the canvas.
- [ ] Drag the edge of wheel to spin in that direction (or flick gesture).
- [ ] Realistic pointer that moves when it hits pins on the spinning wheel.
- [ ] Each item can also have an image, which can be positioned just as easily as the label.
- [ ] Draw a svg image on the wheel.
- [ ] Change appearance of the lines between each item.

## Acknowledgements

Inspired by [random-wheel](https://github.com/njradford/random-wheel).
