export class Evaluator {
    constructor() {
        super();
    }
    horizontalComb(row) {
        let currentSymbol;
        let k = { symbol: undefined, index: 0 };
        for (let i = 0; i < 10; i++) {
            const id = String(((row !== 0 ? row : '') + '') + (i + ''));
            const squareData = document.getElementById(id);
            const filledWith = squareData.dataset.type;
            if (filledWith !== currentSymbol) {
                currentSymbol = filledWith;
                k.symbol = currentSymbol;
                k.index = 0;
            }
            if (k.symbol)
                k.index++;
            if (k.index == this.winLimit) {
                this.reportWin(currentSymbol);
            }
        }
    }
    verticalComb(column) {
        let currentSymbol;
        let k = { symbol: undefined, index: 0 };
        for (let i = 0; i < 10; i++) {
            const id = String(((i !== 0 ? i : '') + '') + (column + ''));
            const squareData = document.getElementById(id);
            const filledWith = squareData.dataset.type;
            if (filledWith !== currentSymbol) {
                currentSymbol = filledWith;
                k.symbol = currentSymbol;
                k.index = 0;
            }
            if (k.symbol)
                k.index++;
            if (k.index == this.winLimit) {
                this.reportWin(currentSymbol);
            }
        }
    }
}
