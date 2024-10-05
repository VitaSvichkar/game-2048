console.log('kjk');

const c = {
  ctx: null,
  canvas: null,
  widthCanvas: 400,
  heightCanvas: 400,
  numberTile: 4,
  init() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.widthCanvas;
    this.canvas.height = this.heightCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.widthCanvas, this.heightCanvas);

    this.drawTile();
  },

  drawTile() {
    const widthTile = this.widthCanvas / this.numberTile;
    const heightTile = widthTile;
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.numberTile; i += 1) {
      y = i * widthTile;
      for (let j = 0; j < this.numberTile; j += 1) {
        x = j * widthTile;
        this.ctx.strokeRect(x, y, widthTile, heightTile);
        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('2', x + widthTile / 2, y + heightTile / 2);
      }
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  c.init();
});
