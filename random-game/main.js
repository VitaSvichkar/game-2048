const c = {
  ctx: null,
  canvas: null,
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
  label: null,
  input: null,
  ico: null,
  name: null,
  table: null,
  tdName: null,
  tdScore: null,
  widthCanvas: 400,
  heightCanvas: 400,
  numberTile: 4,
  higherNum: 1,
  padding: 0,
  gap: 10,
  sum: 0,
  arrayValues: [],
  filteredArray: [],
  data: [],
  lastName: null,
  isMatch: false,
  isZero: true,
  audio: null,
  audioClick: null,
  audioError: null,
  audioBtn: null,
  audioWin: null,

  // START GAME

  init() {
    this.audioClick = new Audio('./audio/audioClick.mp3');
    this.audio = new Audio('./audio/audioTile.mp3');
    this.audioError = new Audio('./audio/audioError.mp3');
    this.audioBtn = new Audio('./audio/audioBtn.mp3');
    this.audioWin = new Audio('./audio/audioWin.mp3');
    // GAME CANVAS

    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.widthCanvas;
    this.canvas.height = this.heightCanvas;
    this.ctx = this.canvas.getContext('2d');

    // TABLE

    this.table = document.querySelector('.table');

    // GAME

    this.scoreNum = document.querySelector('.score-num');
    this.btnReset = document.querySelector('.btn-reset');
    this.btnReset.addEventListener('click', this.newGame.bind(this));

    // MODAL

    this.scoreResult = document.querySelector('.score-result');
    this.resultGameText = document.querySelector('.result-game');
    this.titleScore = document.querySelector('.modal-score');
    this.btnNewGame = document.querySelector('.btn_new-game');
    this.btnNewGame.addEventListener('click', () => {
      this.getName();
      this.newGame();
    });

    this.modalWrap = document.querySelector('.modal-wrap');
    this.modalWrap.addEventListener('keyup', (e) => {
      e.stopPropagation();
    });

    this.modal = document.querySelector('.modal');
    this.closeModal = document.querySelector('.close-modal');
    this.closeModal.addEventListener('click', this.newGame.bind(this));
    this.label = document.querySelector('.inp-label');
    this.input = document.getElementById('name');
    this.ico = document.querySelector('.ico');
    this.ico.addEventListener('click', this.getName.bind(this));
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.getName();
        this.newGame();
      }
    });

    this.showData();
    this.createMatrix();
    this.addTile();
    this.addTile();
    this.drawTile();
  },

  // DRAW TILE

  drawTile() {
    this.clearCanvas();
    const totalGap = this.gap * (this.numberTile - 1);
    const totalPad = this.gap * 2;
    const widthTile =
      (this.widthCanvas - totalGap - totalPad) / this.numberTile;
    const heightTile = widthTile;
    let x = 0;
    let y = 0;
    const highNum = this.getHigherNumber();
    const radius = 20;

    this.arrayValues.forEach((row, indY) => {
      y = indY * (widthTile + this.gap) + this.gap;
      row.forEach((val, indX) => {
        x = indX * (widthTile + this.gap) + this.gap;

        // create tile
        this.createTile(x, y, widthTile, heightTile, radius);
        this.ctx.fillStyle = 'rgb(239, 239, 239)';
        this.ctx.fill();

        if (val !== 0) {
          if (val === highNum) {
            this.colorScore = this.colorNumber(val);
            this.scoreNum.style.color = this.colorScore;
          }
          this.createTile(x, y, widthTile, heightTile, radius);
          this.ctx.fillStyle = this.colorNumber(val);
          this.ctx.fill();

          this.ctx.font = '40px Space Mono';
          this.ctx.fillStyle = 'white';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(`${val}`, x + widthTile / 2, y + heightTile / 2);
        }
      });
    });
  },

  // CREATE TILE

  createTile(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  },

  // CLEAR CANVAS

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.widthCanvas, this.heightCanvas);
    this.ctx.fillStyle = 'rgb(255, 255, 255)';
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
    const isZero = this.arrayValues.flat().some((el) => el === 0);
    this.isZero = isZero;
  },

  hasAdjacentMatches() {
    this.isMatch = false;

    for (let i = 0; i < this.arrayValues.length; i += 1) {
      for (let j = 0; j < this.arrayValues[i].length - 1; j += 1) {
        if (this.arrayValues[i][j] === this.arrayValues[i][j + 1]) {
          this.isMatch = true;
          return;
        }
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
    // checks
    if (isMove) {
      this.checkZero();
      if (this.isZero) {
        this.addTile();
        this.drawTile();
        this.audio.currentTime = 0;
        this.audio.play();
        this.checkGameOver();
      }
    }
    //  else {
    //   this.checkZero();
    // }
  },

  checkPossibleMoves() {
    this.hasAdjacentMatches();
    if (!this.isMatch) {
      this.transposeMatrix();
      this.hasAdjacentMatches();
      this.transposeMatrix();
      if (!this.isMatch) {
        this.showResults();
      }
    }
  },

  checkGameOver() {
    this.checkZero();
    if (!this.isZero) {
      this.checkPossibleMoves();

      if (!this.isMatch) {
        this.showResults();
      }
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
        return '#264653';
      case 8:
        return '#2A9D8F';
      case 16:
        return '#E9C46A';
      case 32:
        return '#F4A261';
      case 64:
        return '#E76F51';
      case 128:
        return '#D62828';
      case 256:
        return '#9D0208';
      case 512:
        return '#6A040F';
      case 1024:
        return '#370617';
      case 2048:
        return '#03071E';
      default:
        return '#0B090A';
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
    this.input.focus();
    this.scoreResult.textContent = this.sum;
    this.scoreResult.style.color = this.colorScore;

    if (this.higherNum === 2048) {
      this.audioWin.play();
      this.modal.classList.add('win');
      this.btnNewGame.classList.add('btn-win');
      this.resultGameText.textContent = `You won`;
      this.titleScore.style.backgroundScore = 'rgb(19, 167, 17)';
    } else {
      this.audioError.play();
      this.resultGameText.textContent = `Well done`;
    }
  },

  // NEW GAME

  newGame() {
    this.audio.currentTime = 0;
    this.audioClick.play();
    this.modalWrap.style.display = 'none';
    if (!this.name) {
      this.label.style.display = 'block';
    }
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
    this.audioBtn.play();
    let curName = this.input.value.trim();

    if (curName.length > 0) {
      this.name = curName;
    } else {
      const getLastName = localStorage.getItem('lastName');
      if (getLastName) {
        this.name = JSON.parse(getLastName);
      } else {
        this.name = 'noName :)';
      }
    }
    this.input.value = '';
    this.data.push({ name: this.name, sum: this.sum });
    this.lastName = this.name;
    this.saveDataLocaleStorage();
    this.updateTable();
  },

  // LOCALE STORAGE

  saveDataLocaleStorage() {
    localStorage.setItem('records', JSON.stringify(this.data));
    localStorage.setItem('lastName', JSON.stringify(this.lastName));
  },

  showData() {
    const getData = localStorage.getItem('records');
    if (getData) {
      this.data = JSON.parse(getData);
    }
    this.updateTable();
  },

  // UPDATE TABLE

  updateTable() {
    this.table.innerHTML = `
    <caption class="caption">TOP-10</caption>
        <tr>
          <th>Name</th>
          <th class="table-score">Score</th>
        </tr>`;
    this.sorting();
    this.data.forEach(({ name, sum }) => {
      const tr = document.createElement('tr');
      this.tdName = document.createElement('td');
      this.tdScore = document.createElement('td');
      this.tdName.textContent = name;
      this.tdScore.textContent = sum;
      tr.append(this.tdName, this.tdScore);
      this.table.append(tr);
    });
  },

  // SORT

  sorting() {
    this.data.sort((a, b) => b.sum - a.sum);
    this.data.splice(10);
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
document.addEventListener('keyup', c.move.bind(c));
