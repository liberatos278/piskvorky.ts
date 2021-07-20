"use strict";
class Game {
    constructor(a, b, c) {
        this.winLimit = a;
        this.startSymbol = b;
        this.actualSymbol = b;
        this.playgroundSpecs = c;
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
        const playground = document.getElementsByClassName('playground')[0];
        playground.innerHTML = '';
        this.generate();
        this.switchSymbol('global');
        const scoreboard = document.getElementById('score');
        if (wipe) {
            scoreboard.innerHTML = '0:0';
        }
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
    setSquare(id) {
        const square = document.getElementById(id);
        const squareLogo = square.children[0];
        const symbol = this.getSymbol();
        squareLogo.setAttribute('class', '');
        squareLogo.classList.add('fa', `fa-${symbol.name}`, 'fa-3x');
        squareLogo.style.color = symbol.color;
        square.dataset.type = symbol.name;
        this.switchSymbol('current');
        this.checkCombinations(id);
    }
    checkCombinations(lastSquare) {
        const x = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(0));
        const y = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(1));
        // this.horizontalComb(x);
    }
}
const GameLogic = new Game(5, false, { size: 10 });
window.onload = () => {
    GameLogic.generate();
};
