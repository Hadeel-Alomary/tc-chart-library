import {INumberFormatState, NumberFormat, NumberFormatClasses} from './NumberFormat';
import {StringUtils} from '../../../utils';

export interface IValueScaleNumberFormat extends INumberFormatState {
    numberOfDigits: number;
}

export interface IValueScaleNumberFormatOptions {
    numberOfDigits: number;
}

export class ValueScaleNumberFormat extends NumberFormat {

    static get className(): string {
        return NumberFormatClasses.ValueScaleNumberFormat;
    }

    private _options: IValueScaleNumberFormatOptions;
    private _maxVisibleValue:number;

    constructor(locale?: string) {
        super(locale);
        this._maxVisibleValue = 100; // initial value
        this._options = {
            numberOfDigits: 3,
        };
    }

    format(value: number): string {
        let formattedValue: string = '';
        // for sub-panels, then use M for more 10 millions and above, and K for 100 thousands and above.
        let numberOfDigits = Math.ceil(this._maxVisibleValue).toString().length;
        if (numberOfDigits > 7) {
            formattedValue = StringUtils.formatMoney(value / 1000000, 2) + 'M';
        } else if (numberOfDigits > 5) {
            formattedValue = StringUtils.formatMoney(value / 1000, 2) + 'K';
        } else {
            formattedValue = StringUtils.formatMoney(value, this._options.numberOfDigits);
        }

        // MA canvas is set to RTL (because of Arabic text formatting in text drawing). However, this causes numbers to be formatted in
        // arabic way, as in M 100- (for -100M). To overcome this, I used markLeftToRightInRightToLeftContext for all numbers below.
        return StringUtils.markLeftToRightInRightToLeftContext(formattedValue);
    }

    formatAllDigits(value: number): string {
        return StringUtils.markLeftToRightInRightToLeftContext(StringUtils.formatMoney(value, this._options.numberOfDigits));
    }

    setDecimalDigits(value: number) {
        this._options.numberOfDigits = value;
    }

    setMaxVisibleValue(maxValue:number) {
        this._maxVisibleValue = maxValue;
    }

    saveState(): IValueScaleNumberFormat {
        let state = <IValueScaleNumberFormat>super.saveState();
        state.numberOfDigits = this._options.numberOfDigits;
        return state;
    }


    loadState(state: IValueScaleNumberFormat) {
        super.loadState(state);
        this._options.numberOfDigits = state.numberOfDigits;
    }
}

NumberFormat.register(ValueScaleNumberFormat);
