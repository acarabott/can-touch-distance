// prevent mobile scrolling
document.ontouchmove = function(event){ event.preventDefault(); };

class TouchDistance {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');

    this.min = 0.0;
    this.max = 1.0;
    this.value = 0.5;

    this.render();
  }

  appendTo(domElement) {
    domElement.appendChild(this.canvas);
  }

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'rgba(43, 156, 212, 1.0)';

    this.ctx.beginPath();
    this.ctx.arc(50, 50, 50, 0, Math.PI * 2, false);
    this.ctx.fill();

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
