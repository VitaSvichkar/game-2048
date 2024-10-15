console.log('kjk');

const c = {
  ctx: null,
  canvas: null,
  matrixCanvas: null,
  ctxM: null,
  scoreNum: null,
  colorScore: null,
  modalWrap: null,
  modal: null,
  closeModal: null,
  btnNewGame: null,
  btnReset: null,
  scoreResult: null,
  resultGameText: null,
  titleScore: null,
  input: null,
  ico: null,
  name: null,
  widthCanvas: 400,
  heightCanvas: 400,
  numberTile: 4,
  higherNum: 1,
  padding: 0,
  fontSize: 15,
  gap: 10,
  sum: 0,
  columns: 0,
  symbols: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  drops: [],
  arrayValues: [],
  filteredArray: [],
  isMatch: false,
  isZero: true,

  // START GAME

  init() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.widthCanvas;
    this.canvas.height = this.heightCanvas;
    this.ctx = this.canvas.getContext('2d');

    this.matrixCanvas = document.getElementById('matrix-canvas');
    this.ctxM = this.matrixCanvas.getContext('2d');
    this.matrixCanvas.width = window.innerWidth;
    this.matrixCanvas.height = window.innerHeight;
    console.log(this.matrixCanvas.width);

    this.input = document.getElementById('name');
    this.ico = document.querySelector('.ico');
    this.ico.addEventListener('click', this.getName.bind(this));

    this.scoreNum = document.querySelector('.score-num');
    console.log(this.scoreNum);

    this.modalWrap = document.querySelector('.modal-wrap');
    this.modal = document.querySelector('.modal');
    this.closeModal = document.querySelector('.close-modal');
    this.closeModal.addEventListener('click', this.newGame.bind(this));

    this.btnNewGame = document.querySelector('.btn_new-game');
    this.btnNewGame.addEventListener('click', this.newGame.bind(this));
    this.btnReset = document.querySelector('.btn-reset');
    this.btnReset.addEventListener('click', this.newGame.bind(this));

    this.scoreResult = document.querySelector('.score-result');
    console.log(this.scoreResult);
    this.resultGameText = document.querySelector('.result-game');
    this.titleScore = document.querySelector('.modal-score');

    this.columns = this.matrixCanvas.width / this.fontSize;
    this.drops = Array(Math.floor(this.columns)).fill(1);
    this.createMatrix();
    this.addTile();
    this.addTile();
    this.drawTile();
    this.animateMatrix();
  },

  // ANIMATION

  animateMatrix() {
    this.ctxM.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctxM.fillRect(0, 0, 1900, 1000);
    this.ctxM.fillStyle = 'green';
    this.ctxM.font = `${this.fontSize}px 'Space Mono'`;

    this.drops.forEach((drop, i) => {
      const symbol =
        this.symbols[Math.floor(Math.random() * this.symbols.length)];
      this.ctxM.fillText(symbol, i * this.fontSize, drop * this.fontSize);

      if (
        drop * this.fontSize > this.matrixCanvas.height &&
        Math.random() > 0.975
      ) {
        this.drops[i] = 0;
      }

      this.drops[i]++;
    });

    setTimeout(() => requestAnimationFrame(() => this.animateMatrix()), 60);
    // requestAnimationFrame(() => this.animateMatrix());
  },

  // DRAW TILE

  drawTile() {
    this.clearCanvas();
    const totalGap = this.gap * 3;
    const totalPad = this.gap * 2;
    const widthTile =
      (this.widthCanvas - totalGap - totalPad) / this.numberTile;
    // console.log(widthTile);
    const heightTile = widthTile;
    let x = 0;
    let y = 0;
    const highNum = this.getHigherNumber();
    this.arrayValues.forEach((row, indY) => {
      y = indY * (widthTile + this.gap) + this.gap;
      row.forEach((val, indX) => {
        x = indX * (widthTile + this.gap) + this.gap;
        if (val !== 0) {
          if (val === highNum) {
            this.colorScore = this.colorNumber(val);
            this.scoreNum.style.color = this.colorScore;
          }
          this.ctx.strokeStyle = this.colorNumber(val);
          this.ctx.lineWidth = '1px';
          this.ctx.strokeRect(x, y, widthTile, heightTile);
          this.ctx.font = '40px Arial';
          this.ctx.fillStyle = this.colorNumber(val);

          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(`${val}`, x + widthTile / 2, y + heightTile / 2);
        }
      });
    });
  },

  // CLEAR CANVAS

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.widthCanvas, this.heightCanvas);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.widthCanvas, this.heightCanvas);
  },

  // ADD TILE

  addTile() {
    let row = this.getRandom();
    let col = this.getRandom();

    const randomValue = Math.random() >= 0.5 ? 2 : 4;

    if (this.arrayValues.flat().some((val) => val === 0)) {
      while (this.arrayValues[row][col] !== 0) {
        row = this.getRandom();
        col = this.getRandom();
      }
      this.arrayValues[row][col] = randomValue;
    }
  },

  // ERROR

  checkZero() {
    this.isZero = true;
    for (let k = 0; k < this.arrayValues.length; k += 1) {
      for (let l = 0; l < this.arrayValues[k].length; l += 1) {
        if (this.arrayValues[k][l] === 0) {
          this.isZero = false;
          break;
        }
      }
      if (!this.isZero) {
        break;
      }
    }
  },

  checkMatch() {
    this.isMatch = false;
    if (!this.isZero) {
      console.log('есть нули я не могу проверить дальше');
      return;
    }
    console.log('смогла запуститься проверка , проверяю на совпадение');
    for (let i = 0; i < this.arrayValues.length; i += 1) {
      for (let j = 0; j < this.arrayValues[i].length - 1; j += 1) {
        if (this.arrayValues[i][j] === this.arrayValues[i][j + 1]) {
          this.isMatch = true;
          console.log(this.arrayValues[i][j]);
          break;
        }
      }
      if (this.isMatch) {
        break;
      }
    }
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

  // CHANGE MATRIX

  changeMatrix(e) {
    let isMove = false;

    if (e.key === 'ArrowLeft') {
      isMove = this.filterArray();
    }

    if (e.key === 'ArrowRight') {
      this.filteredArray = this.arrayValues.map((row) => {
        return row.reverse();
      });
      isMove = this.filterArray();
      this.filteredArray = this.filteredArray.map((row) => row.reverse());
    }

    if (e.key === 'ArrowUp') {
      this.transposeMatrix();
      isMove = this.filterArray();
      this.transposeMatrix();
    }

    if (e.key === 'ArrowDown') {
      this.transposeMatrix();
      this.filteredArray = this.arrayValues.map((row) => {
        return row.reverse();
      });
      isMove = this.filterArray();
      this.filteredArray = this.filteredArray.map((row) => row.reverse());
      this.transposeMatrix();
    }
    console.log('is move ' + isMove);

    // checks
    if (isMove) {
      this.checkZero();
      if (!this.isZero) {
        this.addTile();
        this.drawTile();
        console.log('ноль есть, его уже зарисовали');
      }
    } else {
      this.checkZero();
      if (!this.isZero) {
        console.log(
          'движения не было, но нули есть, значит клацни в другую сторону'
        );
        return;
      } else {
        this.checkError();
      }
    }
  },

  checkError() {
    console.log('должна запуститься проверка если нулей нет');
    this.checkMatch();
    console.log('запустили проверку');
    console.log('is match ' + this.isMatch);
    if (!this.isMatch) {
      console.log('is match ' + this.isMatch);
      console.log('cовпадений нет,вызов трансонирования');
      this.transposeMatrix();
      this.checkMatch();
      this.transposeMatrix();
      if (!this.isMatch) {
        console.log('ты проиграл');
        this.showResults();
      } else {
        console.log('совпадения есть');
        return;
      }
    } else {
      console.log(this.isMatch);
      console.log('совпадение есть без трансформации');
    }
  },

  // TRANSPOSE MATRIX

  transposeMatrix() {
    for (let i = 0; i < this.numberTile; i += 1) {
      for (let j = i; j < this.numberTile; j += 1) {
        const temp = this.arrayValues[i][j];
        this.arrayValues[i][j] = this.arrayValues[j][i];
        this.arrayValues[j][i] = temp;
      }
    }
  },

  // COLOR NUMBER

  colorNumber(num) {
    switch (num) {
      case 4:
        return '#66FF66';
      case 8:
        return '#00FFFF';
      case 16:
        return '#9933FF';
      case 32:
        return '#FFFF00';
      case 64:
        return '#FF80E0';
      case 128:
        return '#FF33CC';
      case 256:
        return '#FF6666';
      case 512:
        return '#0000FF';
      case 1024:
        return '#800080';
      case 2048:
        return '#FFFFFF';
      default:
        return '#ABADCA';
    }
  },

  // GET HIGHER NUMBER

  getHigherNumber() {
    const sorting = [...this.arrayValues.flat().sort((a, b) => a - b)];
    this.higherNum = sorting[sorting.length - 1];
    this.scoreNum.textContent = this.sum;
    return sorting[sorting.length - 1];
  },

  // FILTER ARRAY

  filterArray() {
    let isChange = false;
    // remove zeros between values
    this.filteredArray = this.arrayValues.map((row) => {
      return row.filter((el) => el !== 0);
    });

    // sum the values
    this.filteredArray.forEach((row) => {
      for (let i = 0; i < this.numberTile; i += 1) {
        if (isNaN(row[i])) {
          row[i] = 0;
        }
        if (row[i] === row[i + 1]) {
          isChange = true;
          row[i] += row[i + 1];
          this.sum += row[i];
          row[i + 1] = 0;
          i += 1;
        }
      }
    });

    // remove zeros between values
    this.filteredArray.forEach((row, i) => {
      this.filteredArray[i] = row.filter((el) => el !== 0);
    });

    // add zeros at the end
    this.filteredArray.forEach((row) => {
      for (let i = 0; i < this.numberTile; i += 1) {
        if (!row[i]) {
          isChange = true;
          row[i] = 0;
        }
      }
    });
    if (
      JSON.stringify(this.arrayValues) === JSON.stringify(this.filteredArray)
    ) {
      isChange = false;
    }

    this.arrayValues = this.filteredArray;
    return isChange;
  },

  // MODAL WITH RESULTS

  showResults() {
    this.modal.classList.remove('win');
    this.btnNewGame.classList.remove('btn-win');

    this.modalWrap.style.display = 'block';
    this.scoreResult.textContent = this.sum;
    // console.log(sum);
    this.scoreResult.style.color = this.colorScore;

    if (this.higherNum === 2048) {
      this.modal.classList.add('win');
      this.btnNewGame.classList.add('btn-win');
      this.resultGameText.textContent = 'You won';
      this.titleScore.style.backgroundScore = 'rgb(19, 167, 17)';
    } else {
      this.resultGameText.textContent = 'You lost';
    }
  },

  newGame() {
    this.modalWrap.style.display = 'none';
    this.clearCanvas();
    this.arrayValues = [];
    this.sum = 0;
    this.createMatrix();
    this.addTile();
    this.addTile();
    this.drawTile();
  },

  //  GET NAME

  getName() {
    this.name = this.input.value;
    console.log(this.name);
    this.input.value = '';
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

window.addEventListener('resize', () => {
  // c.matrixCanvas.width = window.innerWidth;
  // c.matrixCanvas.height = window.innerHeight;
  // c.columns = c.matrixCanvas.width / c.fontSize;
  // c.drops = Array(Math.floor(c.columns)).fill(1);
});
