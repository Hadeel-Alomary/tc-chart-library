import { Recordset } from "./Recordset";
import { Field } from "./Field";
export declare class Index {
    moneyFlowIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    tradeVolumeIndex(pSource: Field, Volume: Field, MinTickValue: number, Alias: string): Recordset;
    swingIndex(pOHLCV: Recordset, LimitMoveValue: number, Alias: string): Recordset;
    accumulativeSwingIndex(pOHLCV: Recordset, LimitMoveValue: number, Alias: string): Recordset;
    relativeStrengthIndex(pSource: Field, Periods: number, Alias: string): Recordset;
    comparativeRelativeStrength(pSource1: Field, pSource2: Field, Alias: string): Recordset;
    stochasticRelativeStrength(pSource: Field, Periods: number, Alias: string): Recordset;
    priceVolumeTrend(pSource: Field, Volume: Field, Alias: string): Recordset;
    positiveVolumeIndex(pSource: Field, Volume: Field, Alias: string): Recordset;
    negativeVolumeIndex(pSource: Field, Volume: Field, Alias: string): Recordset;
    performance(pSource: Field, Alias: string): Recordset;
    onBalanceVolume(pSource: Field, Volume: Field, Alias: string): Recordset;
    massIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    chaikinMoneyFlow(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    commodityChannelIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    stochasticMomentumIndex(pOHLCV: Recordset, KPeriods: number, KSmooth: number, KDoubleSmooth: number, DPeriods: number, MAType: number, PctD_MAType: number): Recordset;
    historicalVolatility(pSource: Field, Periods: number, BarHistory: number, StandardDeviations: number, Alias: string): Recordset;
    elderForceIndex(pOHLCV: Recordset, Alias: string): Recordset;
    elderThermometer(pOHLCV: Recordset, Alias: string): Recordset;
    marketFacilitationIndex(pOHLCV: Recordset, Alias: string): Recordset;
    qStick(pOHLCV: Recordset, Periods: number, MAType: number, Alias: string): Recordset;
    gopalakrishnanRangeIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    intradayMomentumIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    RAVI(pSource: Field, ShortCycle: number, LongCycle: number, Alias: string): Recordset;
    randomWalkIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    trendIntensityIndex(pSource: Field, ShortCycle: number, LongCycle: number, Alias: string): Recordset;
    twiggsMoneyFlow(pOHLCV: Recordset, Periods: number, Alias: string): Recordset;
    directionalMovementAverage(pSource: Field, ShortCycle: number, LongCycle: number, period: number): Recordset;
    directionalDivergenceIndex(pOHLCV: Recordset, period1: number, period2: number, period3: number, period4: number): Recordset;
    directionalMovementIndex(pOHLCV: Recordset, period: number): Recordset;
}
//# sourceMappingURL=Index.d.ts.map