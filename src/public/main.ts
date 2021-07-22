interface playground {
    size: number
    ai: boolean
    timer: number
}

interface evaluator {
    horizontal: string[],
    vertical: string[],
    diagonalLP: string[],
    diagonalPL: string[]
}

class Game {
    public startSymbol: boolean; // false = X; true = O
    public actualSymbol: boolean;
    public timer: number;
    public killer: boolean;
    readonly playgroundSpecs: playground;
    readonly winLimit: number;

    constructor(a: number, b: boolean, c: playground) {
        this.winLimit = a;
        this.startSymbol = b;
        this.actualSymbol = b;
        this.playgroundSpecs = c;
        this.timer = 0;
        this.killer = false;
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

        if (this.killer) return;

        const playground = document.getElementsByClassName('playground')[0] as HTMLDivElement;
        playground.innerHTML = '';

        this.stopTimer(true);
        this.generate();
        this.switchSymbol('global');

        if (wipe) this.setScore(0, 0, true);
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

    startTimer(time: number, restart: boolean, color?: string) {
        const timer = document.getElementById('time')!;
        const text = timer.firstChild!;

        if (restart) this.stopTimer(true);

        text.textContent = `${time}  `;
        timer.style.color = !color ? 'white' : color;

        this.timer = window.setInterval(function () {

            let timerTime = Number(timer.textContent)
            timerTime--;

            text.textContent = `${timerTime}  `;

            if (timerTime < 6) timer.style.color = !color ? '#d92e2e' : color;
            if (timerTime < 1) {
                GameLogic.stopTimer(true)
                GameLogic.switchSymbol('current');
                GameLogic.startTimer(GameLogic.playgroundSpecs.timer, true);
            }
        }, 1000);
    }

    stopTimer(restart: boolean) {

        const timer = document.getElementById('time')!;

        clearInterval(this.timer);
        timer.style.color = 'white';

        if (restart) {

            timer.firstChild!.textContent = '30  ';
        }
    }

    setSquare(id: string): void {

        const square = document.getElementById(id) as HTMLDivElement;
        const squareLogo = square.children[0] as HTMLSpanElement;
        const symbol = this.getSymbol();

        if (square.dataset.type || this.killer) return;

        squareLogo.setAttribute('class', '');
        squareLogo.classList.add('fa', `fa-${symbol.name}`, 'fa-3x');
        squareLogo.style.color = symbol.color;

        square.dataset.type = symbol.name;

        this.startTimer(this.playgroundSpecs.timer, true);
        this.switchSymbol('current');
        this.checkCombinations(id);
    }

    reportWin(type: string | undefined): void {

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

    setScore(crosses: number, rounds: number, wipe: boolean): void {

        const scoreboard = document.getElementById('score')!;
        const score = scoreboard.innerText.split(':');
        let newScore = `${Number(score[0]) + crosses}:${Number(score[1]) + rounds}`;

        if (wipe) newScore = '0:0';
        scoreboard.innerText = newScore;
    }

    checkCombinations(lastSquare: string) {

        const x = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(0));
        const y = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(1));


        this.checkEmpty();
        this.evaluator(x, y);
    }

    highlightSquares(squares: string[]) {

        for (let id of squares) {

            const square = document.getElementById(id);
            if (square) {

                square.style.backgroundColor = '#d4c600';
            }
        }
    }

    evaluator(row: number, column: number) {

        let direction: string;
        let squares: evaluator = {
            horizontal: [],
            vertical: [],
            diagonalPL: [],
            diagonalLP: []
        }

        for (direction in squares) {

            const array = (squares as any)[direction];

            for (let i = -10; i < 10; i++) {

                let id: string = 'toCalc';
                
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
                if (!square) continue;

                (squares as any)[direction].push(id);
            }


            let currentSymbol;
            let result: { symbol: string | undefined, index: string[] } = {
                symbol: undefined,
                index: []
            }

            for (let id of array) {
                
                const square = document.getElementById(id)!;

                const squareSymbol = square.dataset.type;
                if (squareSymbol !== currentSymbol) {

                    currentSymbol = squareSymbol;
                    result.symbol = currentSymbol;
                    result.index = [];
                }

                if (result.symbol) result.index?.push(id);
                if (result.index?.length == this.winLimit) {

                    this.highlightSquares(result.index);
                    this.reportWin(result.symbol);
                }
            }
        }
    }

    checkEmpty(): void {

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