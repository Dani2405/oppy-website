// Test via a getter in the options object to see if the passive property is accessed
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function () {
      supportsPassive = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {
}

class Swipe {
  constructor(element) {
    this.xDown = null;
    this.yDown = null;
    this.element = typeof (element) === 'string' ? document.querySelector(element) : element;

    this.element.addEventListener('touchstart', function (evt) {
      this.xDown = evt.touches[0].clientX;
      this.yDown = evt.touches[0].clientY;
    }.bind(this), supportsPassive ? {
      passive: true
    } : false);

    element.addEventListener('touchmove', function (evt) {
      this.handleTouchMove(evt);
    }.bind(this), supportsPassive ? {
      passive: true
    } : false);
  }

  onLeft(callback) {
    this.onLeft = callback;

    return this;
  }

  onRight(callback) {
    this.onRight = callback;

    return this;
  }

  onUp(callback) {
    this.onUp = callback;

    return this;
  }

  onDown(callback) {
    this.onDown = callback;

    return this;
  }

  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        if (typeof this.onLeft === "function") this.onLeft();
      } else {
        if (typeof this.onRight === "function") this.onRight();
      }
    } else {
      if (this.yDiff > 0) {
        if (typeof this.onUp === "function") this.onUp();
      } else {
        if (typeof this.onDown === "function") this.onDown();
      }
    }

    // Reset values.
    this.xDown = null;
    this.yDown = null;
  }
}