import { Point } from "./Point";

// prevent mobile scrolling
document.ontouchmove = function (event) {
  event.preventDefault();
};

const getContext = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");

  if (ctx === null) {
    throw new Error("Could not get context for canvas");
  }

  return ctx;
};

class TouchDistance {
  public min: number;
  public mul: number;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private _value: number;
  private origin: Point | undefined;
  private extent: Point | undefined;
  private output: HTMLInputElement | undefined;

  constructor() {
    this.canvas = document.createElement("canvas");
    {
      const resize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      };
      document.body.addEventListener("resize", resize);
      resize();
    }

    this.ctx = getContext(this.canvas);

    this.min = 0.0;
    this.mul = 1.0;
    this._value = 0.5;

    this.origin = undefined; // the points we will use for touches
    this.extent = undefined; // the points we will use for touches

    this.canvas.addEventListener("touchstart", (e) => this.updateTouches(e));
    this.canvas.addEventListener("touchend", (e) => this.updateTouches(e));
    this.canvas.addEventListener("touchmove", (e) => this.updateTouches(e));

    this.render();
  }

  updateTouches(event: TouchEvent) {
    event.preventDefault();
    (["origin", "extent"] as const).forEach((label, i) => {
      this[label] = event.touches.length > i ? this.getNormTouch(event.touches[i]) : undefined;
    });
    this.update();
  }

  getNormTouch(touch: Touch) {
    const bb = this.canvas.getBoundingClientRect();
    const x = (touch.clientX - bb.left) / this.canvas.width;
    const y = (touch.clientY - bb.top) / this.canvas.height;
    return new Point(x, y);
  }

  update() {
    this.value =
      this.origin !== undefined && this.extent !== undefined
        ? this.min + this.origin.distance(this.extent) * this.mul
        : this.value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    if (this.output !== undefined) {
      this.output.value = value.toFixed(1);
    }
    this.render();
  }

  appendTo(domElement: HTMLElement) {
    domElement.appendChild(this.canvas);
  }

  set outputElement(domElement: HTMLInputElement) {
    this.output = domElement;
  }

  get dims(): [number, number] {
    return [this.canvas.width, this.canvas.height];
  }

  renderTouch(point: Point, style: string) {
    const radius = Math.min(100, Math.min(this.canvas.width, this.canvas.height) * 0.15);
    this.ctx.fillStyle = style;
    this.ctx.beginPath();
    this.ctx.arc(...point.mul(...this.dims).vals, radius, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.origin !== undefined) {
      this.renderTouch(this.origin, "rgba(43, 156, 212, 1.0)");
    }

    if (this.extent !== undefined) {
      this.renderTouch(this.extent, "rgba(249, 182, 118, 1.0)");
    }

    this.ctx.restore();
  }
}

const container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);

const dist = new TouchDistance();
dist.min = 50;
dist.mul = 100;

const output = document.createElement("input");
output.value = dist.value.toString();
output.classList.add("output");
document.body.appendChild(output);

dist.outputElement = output;
dist.appendTo(container);
