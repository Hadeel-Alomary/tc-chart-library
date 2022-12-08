import { Recordset } from "./Recordset";
import { Field } from "./Field";
export declare class MovingAverage {
    simpleMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset;
    exponentialMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset;
    doubleExponentialMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset;
    tripleExponentialMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset;
    hullMovingAverage(pSource: Field, iPeriods: number, MAType: number, sAlias: string): Recordset;
    timeSeriesMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset;
    variableMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset;
    triangularMovingAverage(pSource: Field, Periods: number, Alias: string): Recordset;
    weightedMovingAverage(pSource: Field, Periods: number, Alias: string): Recordset;
    VIDYA(pSource: Field, Periods: number, R2Scale: number, Alias: string): Recordset;
    wellesWilderSmoothing(pSource: Field, Periods: number, Alias: string): Recordset;
    dynamicMovingAverage(pSource: Field, Periods: number, Percentage: number, Alias: string): Recordset;
    movingAverageSwitch(field: Field, periods: number, maType: number, alias: string): Recordset;
    chandeMomentumOscillator(pSource: Field, iPeriods: number, sAlias: string): Recordset;
    volumeWeightedAveragePrice(pOHLCV: Recordset, pDate: Field, iAnchor: number, sAlias: string): Recordset;
}
//# sourceMappingURL=MovingAverage.d.ts.map