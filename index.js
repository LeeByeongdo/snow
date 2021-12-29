class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    window.addEventListener('resize', this.resize.bind(this), false);

    this.layers = [];
    for (let i = 0; i < 20; i++) {
      const layer = {};
      layer.wind = -1 * 0.1 * i;
      layer.downSpeed = 1 + 0.1 * i;
      this.layers.push(layer);
    }

    for (let i = 0; i < 20; i++) {
      const layer = {};
      layer.wind = 0.1 * i;
      layer.downSpeed = 1 + 0.1 * i;
      this.layers.push(layer);
    }

    this.resize();
    this.snows = [];
    this.run();
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  }

  run() {
    this.addSnows();
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.ctx.filter = 'blur(5px)';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)';

    this.ctx.beginPath();
    this.snows.forEach(snow => {
        this.drawSnow(snow);
      }
    );

    this.snows.forEach((snow, index) => {
        const nextY = snow.y + this.layers[snow.layer].downSpeed;
        if (nextY > this.stageHeight) {
          this.snows.splice(index, 1);
        } else {
          snow.y = nextY;
          snow.x = snow.x + this.layers[snow.layer].wind + randomLength(3);
        }
      }
    );

    this.ctx.stroke();
    window.requestAnimationFrame(this.run.bind(this));
  }

  drawSnow(snow) {
    snow.nodes.forEach(node => {
      let x = snow.x;
      let y = snow.y;
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + node[0].toX, y + node[0].toY);
      x = x + (node[0].toX / 2);
      y = y + (node[0].toY / 2);
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + node[1].toX, y + node[1].toY);
      x = x + (node[1].toX / 2);
      y = y + (node[1].toY / 2);
      this.ctx.lineTo(x + node[2].toX, y + node[2].toY);
    });
  }

  addSnows() {
    const snows = [];
    for (let i = 0; i < 1; i++) {
      snows.push(this.generateSnow());
    }
    this.snows = this.snows.concat(snows);
  }

  generateSnow() {
    const snow = {x: Math.random() * this.stageWidth, y: 0};
    snow.nodes = this.generateNodes(snow);
    snow.layer = Math.floor(Math.random() * this.layers.length);
    return snow;
  }

  generateNodes(pos) {
    const nodes = [];
    for (let i = 0; i < 6; i++) {
      nodes.push(this.generateNode(pos));
    }

    return nodes;
  }

  generateNode(pos) {
    const branch1 = {
      toX: randomLength(10),
      toY: randomLength(10),
    };

    const branch2 = {
      toX: randomLength(5),
      toY: randomLength(5),
    };

    const branch3 = {
      toX: randomLength(3),
      toY: randomLength(3),
    };

    return [branch1, branch2, branch3];
  }



}

const randomLength = (max = 10) => {
  const num = Math.floor(Math.random() * max);
  if (Math.floor(Math.random() * 2)) {
    return num;
  }

  return num * -1;
}

window.onload = () => {
  new App();
}

