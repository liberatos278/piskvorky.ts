"use strict";
class Game {
    constructor(a, b, c) {
        this.winLimit = a;
        this.startSymbol = b;
        this.actualSymbol = b;
        this.playgroundSpecs = c;
        this.timer = 0;
        this.killer = false;
    }
    generate() {
        for (let i = 0; i < Math.pow(this.playgroundSpecs.size, 2); i++) {
            const square = document.createElement('div');
            const icon = document.createElement('i');
            const playground = document.getElementsByClassName('playground')[0];
            icon.style.display = 'block';
            square.classList.add('square');
            square.setAttribute('id', i);
            square.setAttribute('onclick', 'GameLogic.setSquare(this.id)');
            this.switchSymbol('refreshonly');
            square.append(icon);
            playground.append(square);
        }
    }
    restart(wipe) {
        if (this.killer)
            return;
        const playground = document.getElementsByClassName('playground')[0];
        playground.innerHTML = '';
        this.stopTimer(true);
        this.generate();
        this.switchSymbol('global');
        if (wipe)
            this.setScore(0, 0, true);
    }
    switchSymbol(type) {
        const actualTurn = document.getElementById('actualTurnIco');
        if (type == 'current') {
            this.actualSymbol = !this.actualSymbol;
        }
        else if (type == 'global') {
            this.startSymbol = !this.startSymbol;
            this.actualSymbol = this.startSymbol;
        }
        const symbol = this.getSymbol();
        actualTurn.removeAttribute('class');
        actualTurn.classList.add('fa', `fa-${symbol.name}`);
        actualTurn.style.color = symbol.color;
    }
    getSymbol() {
        const symbol = {
            name: this.actualSymbol ? 'circle-o' : 'times',
            color: this.actualSymbol ? '#2e86d9' : '#d92e2e'
        };
        return symbol;
    }
    startTimer(time, restart, color) {
        const timer = document.getElementById('time');
        const text = timer.firstChild;
        if (restart)
            this.stopTimer(true);
        text.textContent = `${time}  `;
        timer.style.color = !color ? 'white' : color;
        this.timer = window.setInterval(function () {
            let timerTime = Number(timer.textContent);
            timerTime--;
            text.textContent = `${timerTime}  `;
            if (timerTime < 6)
                timer.style.color = !color ? '#d92e2e' : color;
            if (timerTime < 1) {
                GameLogic.stopTimer(true);
                GameLogic.switchSymbol('current');
                GameLogic.startTimer(GameLogic.playgroundSpecs.timer, true);
            }
        }, 1000);
    }
    stopTimer(restart) {
        const timer = document.getElementById('time');
        clearInterval(this.timer);
        timer.style.color = 'white';
        if (restart) {
            timer.firstChild.textContent = '30  ';
        }
    }
    setSquare(id) {
        const square = document.getElementById(id);
        const squareLogo = square.children[0];
        const symbol = this.getSymbol();
        if (square.dataset.type || this.killer)
            return;
        squareLogo.setAttribute('class', '');
        squareLogo.classList.add('fa', `fa-${symbol.name}`, 'fa-3x');
        squareLogo.style.color = symbol.color;
        square.dataset.type = symbol.name;
        this.startTimer(this.playgroundSpecs.timer, true);
        this.switchSymbol('current');
        this.checkCombinations(id);
    }
    reportWin(type) {
        this.setScore(type == 'times' ? 1 : 0, type == 'circle-o' ? 1 : 0, false);
        this.switchSymbol('current');
        this.killer = true;
        this.stopTimer(true);
        this.startTimer(5, true, '#66f542');
        setTimeout(() => {
            GameLogic.killer = false;
            GameLogic.restart(false);
        }, 5000);
    }
    setScore(crosses, rounds, wipe) {
        const scoreboard = document.getElementById('score');
        const score = scoreboard.innerText.split(':');
        let newScore = `${Number(score[0]) + crosses}:${Number(score[1]) + rounds}`;
        if (wipe)
            newScore = '0:0';
        scoreboard.innerText = newScore;
    }
    checkCombinations(lastSquare) {
        const x = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(0));
        const y = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(1));
        this.checkEmpty();
        this.evaluator(x, y);
    }
    highlightSquares(squares) {
        for (let id of squares) {
            const square = document.getElementById(id);
            if (square) {
                square.style.backgroundColor = '#d4c600';
            }
        }
    }
    evaluator(row, column) {
        var _a, _b;
        let direction;
        let squares = {
            horizontal: [],
            vertical: [],
            diagonalPL: [],
            diagonalLP: []
        };
        for (direction in squares) {
            const array = squares[direction];
            for (let i = -10; i < 10; i++) {
                let id = 'toCalc';
                switch (direction) {
                    case 'horizontal':
                        id = String(((row !== 0 ? row : '') + '') + (i + ''));
                        break;
                    case 'vertical':
                        id = String(((i !== 0 ? i : '') + '') + (column + ''));
                        break;
                    case 'diagonalLP':
                        id = String(row + i !== 0 ? row + i : '') + String(column + i);
                        break;
                    case 'diagonalPL':
                        id = String(row + i !== 0 ? row + i : '') + String(column - i);
                        break;
                }
                const square = document.getElementById(id);
                if (!square)
                    continue;
                squares[direction].push(id);
            }
            let currentSymbol;
            let result = {
                symbol: undefined,
                index: []
            };
            for (let id of array) {
                const square = document.getElementById(id);
                const squareSymbol = square.dataset.type;
                if (squareSymbol !== currentSymbol) {
                    currentSymbol = squareSymbol;
                    result.symbol = currentSymbol;
                    result.index = [];
                }
                if (result.symbol)
                    (_a = result.index) === null || _a === void 0 ? void 0 : _a.push(id);
                if (((_b = result.index) === null || _b === void 0 ? void 0 : _b.length) == this.winLimit) {
                    this.highlightSquares(result.index);
                    this.reportWin(result.symbol);
                }
            }
        }
    }
    checkEmpty() {
        const emptySquares = [];
        for (let i = 0; i < 100; i++) {
            const square = document.getElementById(String(i));
            const data = square.dataset.type;
            if (!data)
                emptySquares.push(i);
        }
        if (emptySquares.length <= 0) {
            alert('The game has no ways to continue.');
            this.switchSymbol('current');
            this.restart(false);
        }
    }
}
const GameLogic = new Game(5, false, { size: 10, ai: true, timer: 30 });
window.onload = () => {
    GameLogic.generate();
};
