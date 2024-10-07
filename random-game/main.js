console.log('kjk');

const c = {
  ctx: null,
  canvas: null,
  widthCanvas: 400,
  heightCanvas: 400,
  numberTile: 4,
  arrayValues: [],

  // START GAME

  init() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.widthCanvas;
    this.canvas.height = this.heightCanvas;
    this.ctx = this.canvas.getContext('2d');

    this.createMatrix();
    this.addTile();
  },

  // DRAW TILE

  drawTile() {
    this.ctx.clearRect(0, 0, this.widthCanvas, this.heightCanvas);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.widthCanvas, this.heightCanvas);
    const widthTile = this.widthCanvas / this.numberTile;
    const heightTile = widthTile;
    let x = 0;
    let y = 0;

    this.arrayValues.forEach((row, indY) => {
      y = indY * widthTile;
      row.forEach((val, indX) => {
        x = indX * widthTile;
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

  // ADD TILE

  addTile() {
    let row = this.getRandom();
    let col = this.getRandom();
    const r = Math.random() >= 0.5 ? 2 : 4;
    if (this.arrayValues.flat().some((val) => val === 0)) {
      while (this.arrayValues[row][col] !== 0) {
        row = this.getRandom();
        col = this.getRandom();
      }
    } else {
      window.alert('loser');
    }

    this.arrayValues[row][col] = r;
    this.drawTile();
  },

  // GET RANDOM NUMBER

  getRandom() {
    return Math.floor(Math.random() * this.numberTile);
  },

  // CREATE MATRIX

  createMatrix() {
    for (let i = 0; i < this.numberTile; i += 1) {
      this.arrayValues.push([]);
      for (let j = 0; j < this.numberTile; j += 1) {
        this.arrayValues[i].push(0);
      }
    }
  },

  // CHANGE MATRIX (filter array)

  changeMatrix(e) {
    if (e.key === 'ArrowLeft') {
      let filteredArray = this.arrayValues.map((row) => {
        return row.filter((el) => el !== 0);
      });
      console.log(filteredArray);
      filteredArray.forEach((row) => {
        for (let i = 0; i < this.numberTile; i += 1) {
          if (isNaN(row[i])) {
            row[i] = 0;
          }
          if (row[i] === row[i + 1]) {
            row[i] += row[i + 1];
            row[i + 1] = 0;
            i += 1;
          }
        }
      });
      console.log(filteredArray);

      filteredArray.forEach((row, index) => {
        filteredArray[index] = row.filter((el) => el !== 0);
      });
      // console.log(filteredArray);
      filteredArray.forEach((row) => {
        for (let i = 0; i < this.numberTile; i += 1) {
          if (!row[i]) {
            row[i] = 0;
          }
        }
      });
      this.arrayValues = [...filteredArray];
      this.addTile();
    }
  },

  // KEY

  move(e) {
    this.changeMatrix(e);
  },
};

// LOAD

document.addEventListener('DOMContentLoaded', () => {
  c.init();
});

// CLICK

document.addEventListener('keydown', c.move.bind(c));
