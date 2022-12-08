import { INumberFormatState, NumberFormat } from './NumberFormat';
export interface IIntlNumberFormatState extends INumberFormatState {
    options: Intl.NumberFormatOptions;
}
export declare class IntlNumberFormat extends NumberFormat {
    static get className(): string;
    private _numberFormat;
    get options(): Intl.ResolvedNumberFormatOptions;
    set options(value: Intl.ResolvedNumberFormatOptions);
    constructor(locale?: string, options?: Intl.NumberFormatOptions);
    protected _onLocaleChanged(): void;
    private _createFormat;
    format(value: number): string;
    setDecimalDigits(value: number): void;
    saveState(): IIntlNumberFormatState;
    loadState(state: IIntlNumberFormatState): void;
}
//# sourceMappingURL=IntlNumberFormat.d.ts.map