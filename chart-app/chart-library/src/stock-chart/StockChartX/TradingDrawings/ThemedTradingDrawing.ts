import {TradingDrawing} from './TradingDrawing';

export class ThemedTradingDrawing<T> extends TradingDrawing {

    private _theme: T;

    get theme(): T {
        return this._theme;
    }

    set theme(value: T) {
        this._theme = value;
    }

    get actualTheme(): T {
        return this.chart ? this.theme : null;
    }

}
