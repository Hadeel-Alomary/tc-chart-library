import { IConstructor } from "../Utils/ClassRegistrar";
import { IStateProvider } from "./IStateProvider";
export interface INumberFormat extends IStateProvider<INumberFormatState> {
    locale: string;
    format(value: number): string;
    setDecimalDigits(value: number): void;
}
export interface INumberFormatState {
    className: string;
    locale: string;
}
export declare enum NumberFormatClasses {
    IntlNumberFormat = "StockChartX.IntlNumberFormat",
    ValueScaleNumberFormat = "StockChartX.ValueScaleNumberFormat"
}
export declare abstract class NumberFormat implements INumberFormat {
    static get className(): string;
    static registeredFormatters: Object;
    static register: (typeOrClassName: string | typeof NumberFormat, constructor?: IConstructor<INumberFormat>) => void;
    static deserialize: (state: INumberFormatState) => INumberFormat;
    private _locale;
    get locale(): string;
    set locale(value: string);
    constructor(locale?: string);
    protected _onLocaleChanged(): void;
    abstract format(value: number): string;
    abstract setDecimalDigits(value: number): void;
    saveState(): INumberFormatState;
    loadState(state: INumberFormatState): void;
}
//# sourceMappingURL=NumberFormat.d.ts.map