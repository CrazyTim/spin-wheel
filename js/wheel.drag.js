/**
 * Register drag events for the wheel.
 * Adapted from https://glitch.com/~jake-in-the-box
 */
export function registerEvents(wheel = {}) {

  const canvas = wheel.canvas;

  if ('PointerEvent' in window) {
    canvas.addEventListener('pointerdown', onPointerdown);
  } else {
    canvas.addEventListener('touchstart', onTouchstart);
    canvas.addEventListener('mousedown', onMousedown);
  }

  function dragStart(point) {
    //console.log(`drag start ${point.x}, ${point.y}`);
    if (wheel.wheelHitTest(point)) wheel.dragStart(point);
    wheel.setCursor();
  }

  function dragMove(point) {
    //console.log(`drag move ${point.x}, ${point.y}`);
    wheel.dragMove(point);
    wheel.isCursorOverWheel = wheel.wheelHitTest(point);
    wheel.setCursor();
  }

  function dragEnd() {
    //console.log('drag end');
    wheel.dragEnd();
    wheel.setCursor();
  }

  function onPointerdown(e) {
    if (!wheel.isInteractive) return;

    e.preventDefault();
    dragStart({
      x: e.clientX,
      y: e.clientY,
    });

    canvas.setPointerCapture(e.pointerId);
    canvas.addEventListener('pointermove', onPointermove);
    canvas.addEventListener('pointerup', onPointerup);
    canvas.addEventListener('pointercancel', onPointerup);

    function onPointermove(e) {
      e.preventDefault();
      dragMove({
        x: e.clientX,
        y: e.clientY,
      });
    }

    function onPointerup(e) {
      e.preventDefault();
      canvas.releasePointerCapture(e.pointerId);
      canvas.removeEventListener('pointermove', onPointermove);
      canvas.removeEventListener('pointerup', onPointerup);
      canvas.removeEventListener('pointercancel', onPointerup);
      dragEnd();
    }

  }

  function onMousedown(e) {
    if (!wheel.isInteractive) return;

    dragStart({
      x: e.clientX,
      y: e.clientY,
    });

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);

    function onMousemove(e) {
      e.preventDefault();
      dragMove({
        x: e.clientX,
        y: e.clientY,
      });
    }

    function onMouseup(e) {
      e.preventDefault();
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
      dragEnd();
    }

  }

  function onTouchstart(e) {
    if (!wheel.isInteractive) return;

    e.preventDefault();
    dragStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });

    canvas.addEventListener('touchmove', onTouchmove);
    canvas.addEventListener('touchend', onTouchend);
    canvas.addEventListener('touchcancel', onTouchend);

    function onTouchmove(e) {
      e.preventDefault();
      dragMove({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    }

    function onTouchend(e) {
      e.preventDefault();
      canvas.removeEventListener('touchmove', onTouchmove);
      canvas.removeEventListener('touchend', onTouchend);
      canvas.removeEventListener('touchcancel', onTouchend);
      dragEnd();
    }

  }

}
