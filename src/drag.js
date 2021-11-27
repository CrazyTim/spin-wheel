/**
 * Register drag events for the wheel.
 * Adapted from https://glitch.com/~jake-in-the-box
 */
export function registerEvents(wheel = {}) {

  const canvas = wheel.canvas;

  if ('PointerEvent' in window) {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMoveRefreshCursor);
  } else {
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMoveRefreshCursor);
  }

  function onPointerMoveRefreshCursor(e = {}) {
    const point = {
      x: e.clientX,
      y: e.clientY,
    };
    wheel.isCursorOverWheel = wheel.wheelHitTest(point);
    wheel.refreshCursor();
  }

  function onMouseMoveRefreshCursor(e = {}) {
    const point = {
      x: e.clientX,
      y: e.clientY,
    };
    wheel.isCursorOverWheel = wheel.wheelHitTest(point);
    wheel.refreshCursor();
  }

  function onPointerDown(e = {}) {

    const point = {
      x: e.clientX,
      y: e.clientY,
    };

    if (!wheel.isInteractive) return;
    if (!wheel.wheelHitTest(point)) return;

    e.preventDefault();
    wheel.dragStart(point);
    canvas.setPointerCapture(e.pointerId);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    function onPointerMove(e = {}) {
      e.preventDefault();
      wheel.dragMove({
        x: e.clientX,
        y: e.clientY,
      });
    }

    function onPointerUp(e = {}) {
      e.preventDefault();
      canvas.releasePointerCapture(e.pointerId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      wheel.dragEnd();
    }

  }

  function onMouseDown(e = {}) {

    const point = {
      x: e.clientX,
      y: e.clientY,
    };

    if (!wheel.isInteractive) return;
    if (!wheel.wheelHitTest(point)) return;

    wheel.dragStart(point);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(e = {}) {
      e.preventDefault();
      wheel.dragMove({
        x: e.clientX,
        y: e.clientY,
      });
    }

    function onMouseUp(e = {}) {
      e.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      wheel.dragEnd();
    }

  }

  function onTouchStart(e = {}) {

    const point = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };

    if (!wheel.isInteractive) return;
    if (!wheel.wheelHitTest(point)) return;

    e.preventDefault();
    wheel.dragStart(point);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);

    function onTouchMove(e = {}) {
      e.preventDefault();
      wheel.dragMove({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    }

    function onTouchEnd(e = {}) {
      e.preventDefault();
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      wheel.dragEnd();
    }

  }

}
