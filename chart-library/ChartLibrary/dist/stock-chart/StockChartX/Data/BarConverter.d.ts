import { IBarDataSeries, IOHLCDataSeries } from "./DataManager";
export declare class BarConverter {
    private static _setupOhlcDataSeries;
    private static _setupBarDataSeries;
    static convertToHeikinAshi(inDataSeries: IOHLCDataSeries, outDataSeries?: IOHLCDataSeries): IOHLCDataSeries;
    static convertToRenko(inDataSeries: IBarDataSeries, boxSize: number, outDataSeries?: IBarDataSeries): IBarDataSeries;
    static convertToLineBreak(inDataSeries: IBarDataSeries, lines: number, outDataSeries?: IBarDataSeries): IBarDataSeries;
    static convertToPointAndFigure(inDataSeries: IBarDataSeries, boxSize: number, reversalAmount: number, outDataSeries?: IBarDataSeries): IBarDataSeries;
    static convertToKagi(inDataSeries: IBarDataSeries, reversal: number, outDataSeries?: IBarDataSeries): IBarDataSeries;
}
//# sourceMappingURL=BarConverter.d.ts.map