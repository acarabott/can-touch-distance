// prevent mobile scrolling
document.ontouchmove = function(event){ event.preventDefault(); };

class TouchDistance {
  constructor() {
    this.canvas = document.createElement('canvas');
    {
      const resize = event => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      };
      document.body.addEventListener('resize', resize);
      resize();
    }

    this.ctx = this.canvas.getContext('2d');

    this.min = 0.0;
    this.max = 1.0;
    this._value = 0.5;

    this.origin = undefined; // the points we will use
    this.extent = undefined; // the points we will use

    this.origin = new Point(0.5, 0.5);

    Hammer.on(this.canvas, 'touchstart', event => {
      event.preventDefault();
      if (event.touches.length > 0) {
        this.origin = this.getNormTouch(event.touches[0]);
      }
      if (event.touches.length > 1) {
        this.extent = this.getNormTouch(event.touches[1]);
      }
      this.update();
    });

    Hammer.on(this.canvas, 'touchend', event => {
      if (event.touches.length === 1) {
        this.origin = this.getNormTouch(event.touches[0]);
        this.extent = undefined;
      }
      if (event.touches.length === 0) {
        this.origin = undefined;
        this.extent = undefined;
      }
      this.update();
    });

    this.render();
  }

  getNormTouch(touch) {
    const bb = this.canvas.getBoundingClientRect();
    const x = (touch.clientX - bb.left) / this.canvas.width;
    const y = (touch.clientY - bb.top) / this.canvas.height;
    return new Point(x, y);
  }

  update() {
    this.value = Math.random();
  }

  get value() { return this._value; }

  set value(value) {

    this._value = value;
    if (this.output !== undefined) { this.output.value = value; }
    this.render();
  }

  appendTo(domElement) {
    domElement.appendChild(this.canvas);
  }

  set outputElement(domElement) {
    this.output = domElement;
  }

  get dims() { return [this.canvas.width, this.canvas.height]; }

  renderTouch(point, style) {
    const radius = 120;
    this.ctx.fillStyle = style;
    this.ctx.beginPath();
    this.ctx.arc(...point.mul(...this.dims), radius, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const touchRadius = 100;
    if (this.origin !== undefined) {
      this.renderTouch(this.origin, 'rgba(43, 156, 212, 1.0)');
    }

    if (this.extent !== undefined) {
      this.renderTouch(this.extent, 'rgba(249, 182, 118, 1.0)');
    }

    this.ctx.restore();
  }
}

function createOutput(input, parent = document.body) {
  const output = document.createElement('input');
  output.value = input.value;
  output.classList.add('output');
  parent.appendChild(output);
  input.outputElement = output;
}

const box = document.getElementById('container');

const dist = new TouchDistance();

dist.min = 0;
dist.max = 100;

createOutput(dist, box);
dist.appendTo(box);
