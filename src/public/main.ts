interface playground {
    size: number
    ai: boolean
    timer: number
}

class Game {
    public startSymbol: boolean; // false = X; true = O
    public actualSymbol: boolean;
    public timer: number;
    readonly playgroundSpecs: playground;
    readonly winLimit: number;

    constructor(a: number, b: boolean, c: playground) {
        this.winLimit = a;
        this.startSymbol = b;
        this.actualSymbol = b;
        this.playgroundSpecs = c;
        this.timer = 0;
    }

    generate(): void {

        for (let i: any = 0; i < Math.pow(this.playgroundSpecs.size, 2); i++) {
            const square = document.createElement('div') as HTMLDivElement;
            const icon = document.createElement('i')!;
            const playground = document.getElementsByClassName('playground')[0] as HTMLDivElement;

            icon.style.display = 'block';

            square.classList.add('square');
            square.setAttribute('id', i);
            square.setAttribute('onclick', 'GameLogic.setSquare(this.id)');

            this.switchSymbol('refreshonly');

            square.append(icon);
            playground.append(square);
        }
    }

    restart(wipe: boolean): void {

        const playground = document.getElementsByClassName('playground')[0] as HTMLDivElement;
        playground.innerHTML = '';

        this.generate();
        this.startTimer(this.playgroundSpecs.timer, true);
        this.switchSymbol('global');

        const scoreboard = document.getElementById('score') as HTMLSpanElement;

        if (wipe) {

            scoreboard.innerHTML = '0:0';
        }
    }

    switchSymbol(type: 'current' | 'global' | 'refreshonly'): void {

        const actualTurn = document.getElementById('actualTurnIco')!;

        if (type == 'current') {

            this.actualSymbol = !this.actualSymbol;
        } else if (type == 'global') {

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
        }

        return symbol;
    }

    startTimer(time: number, restart: boolean) {
        const timer = document.getElementById('time')!;
        const text = timer.firstChild!;

        if (restart) clearInterval(this.timer);

        text.textContent = `${time}  `;
        timer.style.color = 'white';
        
        this.timer = window.setInterval(function () {

            let timerTime = Number(timer.textContent)
            timerTime--;

            text.textContent = `${timerTime}  `;

            if (timerTime < 6) timer.style.color = '#d92e2e';
            if (timerTime < 1) {
                clearInterval(GameLogic.timer);
                GameLogic.switchSymbol('current');
                GameLogic.startTimer(GameLogic.playgroundSpecs.timer, true);
            }
        }, 1000);
    }

    setSquare(id: string): void {

        const square = document.getElementById(id) as HTMLDivElement;
        const squareLogo = square.children[0] as HTMLSpanElement;
        const symbol = this.getSymbol();

        if (square.dataset.type) return;

        squareLogo.setAttribute('class', '');
        squareLogo.classList.add('fa', `fa-${symbol.name}`, 'fa-3x');
        squareLogo.style.color = symbol.color;

        square.dataset.type = symbol.name;

        this.startTimer(this.playgroundSpecs.timer, true);
        this.switchSymbol('current');
        this.checkCombinations(id);
    }

    checkCombinations(lastSquare: string) {

        const x = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(0));
        const y = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(1));

        this.horizontalCheck(x);
        this.verticalCheck(y);
        this.crosswiseLPCheck(x, y);
        this.crosswisePLCheck(x, y);
        this.checkEmpty();
    }

    reportWin(type: string | undefined): void {
        
        const scoreboard = document.getElementById('score')!;
        const score = scoreboard.innerText.split(':');
        let newScore: string;

        if (type == 'times') newScore = `${Number(score[0]) + 1}:${score[1]}`; else newScore = `${score[0]}:${Number(score[1]) + 1}`;
        scoreboard.innerText = newScore;

        this.switchSymbol('current');
        this.restart(false);
    }

    horizontalCheck(row: number) {

        let currentSymbol;
        let k: {
            symbol: string | undefined,
            index: number | undefined
        } = { symbol: undefined, index: 0 };

        for (let i = 0; i < 10; i++) {
            const id = String(((row !== 0 ? row : '') + '') + (i + ''));
            const squareData = document.getElementById(id)!;

            const filledWith = squareData.dataset.type;

            if (filledWith !== currentSymbol) {

                currentSymbol = filledWith;
                k.symbol = currentSymbol;
                k.index = 0;
            }

            if (k.symbol) k.index!++;
            if (k.index == this.winLimit) {
                this.reportWin(currentSymbol);
            }
        }
    }

    verticalCheck(column: number) {

        let currentSymbol;
        let k: {
            symbol: string | undefined,
            index: number | undefined
        } = { symbol: undefined, index: 0 };

        for (let i = 0; i < 10; i++) {
            const id = String(((i !== 0 ? i : '') + '') + (column + ''));
            const squareData = document.getElementById(id)!;

            const filledWith = squareData.dataset.type;

            if (filledWith !== currentSymbol) {

                currentSymbol = filledWith;
                k.symbol = currentSymbol;
                k.index = 0;
            }

            if (k.symbol) k.index!++;
            if (k.index == this.winLimit) {
                this.reportWin(currentSymbol);
            }
        }
    }

    crosswiseLPCheck(row: number, column: number) {
        
        let currentSymbol;
        let k: {
            symbol: string | undefined,
            index: number | undefined
        } = { symbol: undefined, index: 0 };

        for (let i = -10; i < 10; i++) {
            const id = String(row + i !== 0 ? row + i : '') + String(column + i);
            const squareData = document.getElementById(String(id))!;

            if(!squareData) continue;

            const filledWith = squareData.dataset.type;

            if (filledWith !== currentSymbol) {

                currentSymbol = filledWith;
                k.symbol = currentSymbol;
                k.index = 0;
            }

            if (k.symbol) k.index!++;
            if (k.index == this.winLimit) {
                this.reportWin(currentSymbol);
            }
        }
    }

    crosswisePLCheck(row: number, column: number) {
        
        let currentSymbol;
        let k: {
            symbol: string | undefined,
            index: number | undefined
        } = { symbol: undefined, index: 0 };

        for (let i = -10; i < 10; i++) {
            const id = String(row + i !== 0 ? row + i : '') + String(column - i);
            const squareData = document.getElementById(String(id))!;

            if(!squareData) continue;

            const filledWith = squareData.dataset.type;

            if (filledWith !== currentSymbol) {

                currentSymbol = filledWith;
                k.symbol = currentSymbol;
                k.index = 0;
            }

            if (k.symbol) k.index!++;
            if (k.index == this.winLimit) {
                this.reportWin(currentSymbol);
            }
        }
    }

    checkEmpty() {

        const emptySquares = [];
        for (let i = 0; i < 100; i++) {
            const square = document.getElementById(String(i))!;
            const data = square.dataset.type;

            if (!data) emptySquares.push(i);
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
}