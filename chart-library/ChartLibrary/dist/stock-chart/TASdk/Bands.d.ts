import { Field } from "./Field";
import { Recordset } from "./Recordset";
export declare class Bands {
    bollingerBands(pSource: Field, Periods: number, StandardDeviations: number, MAType: number): Recordset;
    movingAverageEnvelope(pSource: Field, Periods: number, MAType: number, Shift: number): Recordset;
    highLowBands(HighPrice: Field, LowPrice: Field, ClosePrice: Field, Periods: number): Recordset;
    fractalChaosBands(pOHLCV: Recordset, Periods: number): Recordset;
    primeNumberBands(HighPrice: Field, LowPrice: Field): Recordset;
    keltner(pOHLCV: Recordset, Periods: number, Factor: number, MAType: number, Alias: string): Recordset;
    ichimoku(pOHLCV: Recordset, ConversionLinePeriods: number, BaseLinePeriods: number, LoggingSpan2Periods: number): Recordset;
}
//# sourceMappingURL=Bands.d.ts.map