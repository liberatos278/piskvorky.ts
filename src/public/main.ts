interface playground {
    size: number
}

interface evaluation {
    crosses: boolean,
    rounds: boolean
}

class Game {
    readonly winLimit: number;
    public startSymbol: boolean; // false = X; true = O
    public actualSymbol: boolean;
    readonly playgroundSpecs: playground;

    constructor(a: number, b: boolean, c: playground) {
        this.winLimit = a;
        this.startSymbol = b;
        this.actualSymbol = b;
        this.playgroundSpecs = c;
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

    setSquare(id: string): void {

        const square = document.getElementById(id) as HTMLDivElement;
        const squareLogo = square.children[0] as HTMLSpanElement;
        const symbol = this.getSymbol();

        squareLogo.setAttribute('class', '');
        squareLogo.classList.add('fa', `fa-${symbol.name}`, 'fa-3x');
        squareLogo.style.color = symbol.color;

        square.dataset.type = symbol.name;

        this.switchSymbol('current');
        this.checkCombinations(id);
    }

    checkCombinations(lastSquare: string) {

        const x = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(0));
        const y = Number(((Number(lastSquare) < 10 ? '0' : '') + lastSquare).charAt(1));

        // this.horizontalComb(x);
    }
}

const GameLogic = new Game(5, false, { size: 10 });
window.onload = () => {
    GameLogic.generate();
}