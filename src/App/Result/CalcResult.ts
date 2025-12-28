
import { evaluate } from 'mathjs';

export const ERROR_TEXT: string = 'ERROR';

export class CalcResult {

    public current: string | number = 0;
    public previous: string | number = 0;
    public onlyOnce: boolean = true;

    constructor(current: number | string = 0, previous: number | string = 0, onlyOnce: boolean = true) {
        this.current = current;
        this.previous = previous;
        this.onlyOnce = onlyOnce;
    }

    public setCurrent(tmpValue: string) {
        this.current = CalcResult.calculate(tmpValue);
        if (this.onlyOnce == true && this.current === ERROR_TEXT) {
            this.previous = ERROR_TEXT;
        }
        this.onlyOnce = false;
    }

    public setErrorValues() {
        this.current = ERROR_TEXT;
        this.previous = ERROR_TEXT;
        this.onlyOnce = false;
    }

    public setPrevEqCurrent() {
        this.previous = this.current;
    }

    public static calculate(mathExpression: string): number | string {
        mathExpression = mathExpression.replaceAll('÷', '/').replaceAll('×', '*').replaceAll('−', '-');
        if (mathExpression.length === 0) {
            return 0;
        }
        try {
            let result = evaluate(mathExpression);
            if (result == Number(result) || result == 0) {

                let positiveOrNegativeSymbol = result < 0 ? '-' : '';
                result = Math.abs(result);

                return result === Infinity || NaN ? ERROR_TEXT : Number(positiveOrNegativeSymbol + parseFloat(result.toFixed(4)).toString());
            } else { return ERROR_TEXT; };
        } catch (error: any) { return ERROR_TEXT; }
    }
}


export const calcResult = new CalcResult();