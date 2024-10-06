console.log('kjk');

const c = {
  ctx: null,
  canvas: null,
  widthCanvas: 400,
  heightCanvas: 400,
  numberTile: 4,
  arrayValues: [],
  init() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.widthCanvas;
    this.canvas.height = this.heightCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.widthCanvas, this.heightCanvas);

    this.createMatrix();
    this.drawTile();
  },

  drawTile() {
    this.addTile();
    const widthTile = this.widthCanvas / this.numberTile;
    const heightTile = widthTile;
    const arrNew = [];

    let x = 0;
    let y = 0;
    this.arrayValues.forEach((row, indY) => {
      y = indY * widthTile;
      row.forEach((val, indX) => {
        x = indX * widthTile;
        // this.ctx.strokeRect(x, y, widthTile, heightTile);
        if (val !== 0) {
          this.ctx.strokeRect(x, y, widthTile, heightTile);
          this.ctx.font = '40px Arial';
          this.ctx.fillStyle = 'red';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(`${val}`, x + widthTile / 2, y + heightTile / 2);
        }
      });
    });
  },

  addTile() {
    const row = this.getRandom();
    const col = this.getRandom();
    const r = Math.random() >= 0.5 ? 2 : 4;
    this.arrayValues[row][col] = r;
  },

  getRandom() {
    return Math.floor(Math.random() * 4);
  },

  createMatrix() {
    for (let i = 0; i < this.numberTile; i += 1) {
      this.arrayValues.push([]);
      for (let j = 0; j < this.numberTile; j += 1) {
        this.arrayValues[i].push(0);
      }
    }
  },

  changeMatrix(e) {
    if (e.key === 'ArrowLeft') {
      const filteredArray = this.arrayValues.map((row) => {
        return row.filter((el) => el);
      });

      filteredArray.forEach((row) => {
        for (let i = 0; i < row.length; i += 1) {
          if (row[i] === row[i + 1]) {
            row[i] += row[i + 1];
            row[i + 1] = null;
            i += 1;
          }
        }
      });

      filteredArray.forEach((row) => {
        row.filter((el) => el !== null);
      });

      filteredArray.forEach((row) => {
        for (let i = 0; i < this.numberTile; i += 1) {
          if (!row[i]) {
            row[i] = 0;
          }
        }
      });
      this.drawTile();
      console.log(filteredArray);
    }
  },

  move(e) {
    this.changeMatrix(e);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  c.init();
});

document.addEventListener('keydown', c.move.bind(c));
