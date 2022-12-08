import { Field } from "./Field";
import { Recordset } from "./Recordset";
export declare class General {
    highMinusLow(pOHLCV: Recordset, Alias: string): Recordset;
    medianPrice(pOHLCV: Recordset, Alias: string): Recordset;
    typicalPrice(pOHLCV: Recordset, Alias: string): Recordset;
    weightedClose(pOHLCV: Recordset, Alias: string): Recordset;
    volumeROC(Volume: Field, Periods: number, Alias: string): Recordset;
    priceROC(pSource: Field, Periods: number, Alias: string): Recordset;
    correlationAnalysis(pSource1: Field, pSource2: Field): number;
    standardDeviation(pSource: Field, Periods: number, StandardDeviations: number, MAType: number, Alias: string): Recordset;
    HHV(High: Field, Periods: number, Alias: string): Recordset;
    LLV(Low: Field, Periods: number, Alias: string): Recordset;
    MAXV(Volume: Field, Periods: number, Alias: string): Recordset;
    isPrime(number: number): boolean;
    logOfBase10(Start: number, pSource: Field): Field;
    sum(pSource: Field, Periods: number): Field;
    copyField(pSource: Field): Field;
    ref(pSource: Field, Periods: number): Field;
}
//# sourceMappingURL=General.d.ts.map