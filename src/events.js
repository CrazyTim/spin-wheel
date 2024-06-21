import * as util from './util.js';

export function register(wheel = {}) {

  registerPointerEvents(wheel);

  // Listen for when the window is resized.
  wheel._handler_onResize = util.getResizeObserver(wheel._canvasContainer, ({redraw = true}) => {
    wheel.resize();
    if (redraw) wheel.draw(performance.now());
  });

  // Listen for when window.devicePixelRatio changes.
  // For example, when the browser window is moved to a different screen.
  // Note: Chrome Version 116 raises the `resize` event when `window.devicePixelRatio` changes,
  // and so does Firefox 117 but sometimes it raises it twice (shrug).
  // However Safari 16.3 doesn't, hence we need to monitor this separately.
  const listenForDevicePixelRatioChange = () => {
    wheel._mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    wheel._mediaQueryList.addEventListener('change', wheel._handler_onDevicePixelRatioChange, {once: true});
  };
  wheel._handler_onDevicePixelRatioChange = () => {
    wheel.resize();
    listenForDevicePixelRatioChange();
  };
  listenForDevicePixelRatioChange();
}

export function unregister(wheel = {}) {

  const canvas = wheel.canvas;

  if ('PointerEvent' in window) {
    canvas.removeEventListener('pointerdown', wheel._handler_onPointerDown);
    canvas.removeEventListener('pointermove', wheel._handler_onPointerMoveRefreshCursor);
  } else {
    canvas.removeEventListener('touchstart', wheel._handler_onTouchStart);
    canvas.removeEventListener('mousedown', wheel._handler_onMouseDown);
    canvas.removeEventListener('mousemove', wheel._handler_onMouseMoveRefreshCursor);
  }

  wheel._handler_onResize.stop();
  wheel._mediaQueryList.removeEventListener('change', wheel._handler_onDevicePixelRatioChange);

}

function registerPointerEvents(wheel = {}) {
  // Adapted from https://glitch.com/~jake-in-the-box

  const canvas = wheel.canvas;

  wheel._handler_onPointerMoveRefreshCursor = (e = {}) => {
    const point = {
      x: e.clientX,
      y: e.clientY,
    };
    wheel._isCursorOverWheel = wheel.wheelHitTest(point);
    wheel.refreshCursor();
  };

  wheel._handler_onMouseMoveRefreshCursor = (e = {}) => {
    const point = {
      x: e.clientX,
      y: e.clientY,
    };
    wheel._isCursorOverWheel = wheel.wheelHitTest(point);
    wheel.refreshCursor();
  };

  wheel._handler_onPointerDown = (e = {}) => {

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
    canvas.addEventListener('pointerout', onPointerUp);

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
      canvas.removeEventListener('pointerout', onPointerUp);
      wheel.dragEnd();
    }

  };

  wheel._handler_onMouseDown = (e = {}) => {

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

  };

  wheel._handler_onTouchStart = (e = {}) => {

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

  };

  if ('PointerEvent' in window) {
    canvas.addEventListener('pointerdown', wheel._handler_onPointerDown);
    canvas.addEventListener('pointermove', wheel._handler_onPointerMoveRefreshCursor);
  } else {
    canvas.addEventListener('touchstart', wheel._handler_onTouchStart);
    canvas.addEventListener('mousedown', wheel._handler_onMouseDown);
    canvas.addEventListener('mousemove', wheel._handler_onMouseMoveRefreshCursor);
  }

}