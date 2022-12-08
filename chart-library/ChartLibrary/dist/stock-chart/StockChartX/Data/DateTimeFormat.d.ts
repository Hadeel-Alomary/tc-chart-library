import { IStateProvider } from "./IStateProvider";
import { IConstructor } from "../Utils/ClassRegistrar";
export interface IDateTimeFormat extends IStateProvider<IDateTimeFormatState> {
    locale: string;
    format(date: Date, timeInterval?: number): string;
}
export interface IDateTimeFormatState {
    className: string;
    locale: string;
}
export declare abstract class DateTimeFormat implements IDateTimeFormat {
    static get className(): string;
    static registeredFormatters: Object;
    static register: (typeOrClassName: string | typeof DateTimeFormat, constructor?: IConstructor<IDateTimeFormat>) => void;
    static deserialize: (state: IDateTimeFormatState) => IDateTimeFormat;
    private _locale;
    get locale(): string;
    set locale(value: string);
    protected _onLocaleChanged(): void;
    abstract format(date: Date): string;
    saveState(): IDateTimeFormatState;
    loadState(state: IDateTimeFormatState): void;
}
//# sourceMappingURL=DateTimeFormat.d.ts.map