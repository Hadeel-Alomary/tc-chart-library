/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Recordset} from "./Recordset";
import {Field} from "./Field";
import {General} from "./General";
import {MovingAverage} from "./MovingAverage";
import {Const} from "./TASdk";
import {Oscillator} from "./Oscillator";

export class Index {

    moneyFlowIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Period = 0;
        let Start = 0;
        let Price1 = 0;
        let Price2 = 0;
        let V = 0;
        let PosFlow = 0;
        let NegFlow = 0;
        let MoneyIndex = 0;
        let MoneyRatio = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        if (Periods < 1 || Periods > RecordCount) {
            return null;
        }
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = Periods + 2;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 2; Record++) {
            PosFlow = 0;
            NegFlow = 0;
            nav = Record - Periods;
            for (Period = 1; Period < Periods + 1; Period++) {
                nav--;
                Price1 = (pOHLCV.getField('High').value(nav) + pOHLCV.getField('Low').value(nav) + pOHLCV.getField('Close').value(nav)) / 3;
                nav++;
                V = pOHLCV.getField('Volume').value(nav);
                if (V < 1) {
                    V = 1;
                }
                Price2 = (pOHLCV.getField('High').value(nav) + pOHLCV.getField('Low').value(nav) + pOHLCV.getField('Close').value(nav)) / 3;
                if (Price2 > Price1) {
                    PosFlow += Price2 * V;
                }
                else if (Price2 < Price1) {
                    NegFlow += Price2 * V;
                }
                nav++;
            }
            nav--;
            if (!!PosFlow && !!NegFlow) {
                MoneyRatio = PosFlow / NegFlow;
                MoneyIndex = 100 - (100 / (1 + MoneyRatio));
                Field1.setValue(nav, MoneyIndex);
            }
        }
        Results.addField(Field1);
        return Results;
    }

    tradeVolumeIndex(pSource: Field, Volume: Field, MinTickValue: number, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Direction = 0;
        let LastDirection = 0;
        let Change = 0;
        let TVI = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Change = pSource.value(nav) - pSource.value(nav - 1);
            if (Change > MinTickValue) {
                Direction = 1;
            }
            else if (Change < -MinTickValue) {
                Direction = -1;
            }
            if (Change <= MinTickValue && Change >= -MinTickValue) {
                Direction = LastDirection;
            }
            LastDirection = Direction;
            if (Direction === 1) {
                TVI = TVI + Volume.value(nav);
            }
            else if (Direction === -1) {
                TVI = TVI - Volume.value(nav);
            }
            Field1.setValue(nav, TVI);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    swingIndex(pOHLCV: Recordset, LimitMoveValue: number, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Cy = 0;
        let Ct = 0;
        let Oy = 0;
        let Ot = 0;
        let Hy = 0;
        let Ht = 0;
        let Ly = 0;
        let Lt = 0;
        let K = 0;
        let R = 0;
        let A = 0;
        let B = 0;
        let C = 0;
        let Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        if (LimitMoveValue <= 0) {
            return null;
        }
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Oy = pOHLCV.getField('Open').value(nav - 1);
            Ot = pOHLCV.getField('Open').value(nav);
            Hy = pOHLCV.getField('High').value(nav - 1);
            Ht = pOHLCV.getField('High').value(nav);
            Ly = pOHLCV.getField('Low').value(nav - 1);
            Lt = pOHLCV.getField('Low').value(nav);
            Cy = pOHLCV.getField('Close').value(nav - 1);
            Ct = pOHLCV.getField('Close').value(nav);
            if (Math.abs(Ht - Cy) > Math.abs(Lt - Cy)) {
                K = Math.abs(Ht - Cy);
            }
            else if (Math.abs(Lt - Cy) > Math.abs(Ht - Cy)) {
                K = Math.abs(Lt - Cy);
            }
            else {
                K = Math.abs(Ht - Cy);
            }
            A = Math.abs(Ht - Cy);
            B = Math.abs(Lt - Cy);
            C = Math.abs(Ht - Lt);
            if (A > B && A > C) {
                R = Math.abs(Ht - Cy) - 0.5 * Math.abs(Lt - Cy) + 0.25 * Math.abs(Cy - Oy);
            }
            else if (B > A && B > C) {
                R = Math.abs(Lt - Cy) - 0.5 * Math.abs(Ht - Cy) + 0.25 * Math.abs(Cy - Oy);
            }
            else if (C > A && C > B) {
                R = Math.abs(Ht - Lt) + 0.25 * Math.abs(Cy - Oy);
            }
            if (R > 0 && LimitMoveValue > 0) {
                Value = 50 * ((Ct - Cy) + 0.5 * (Ct - Ot) + 0.25 * (Cy - Oy)) / R * K / LimitMoveValue;
            }
            else {
                Value = 0;
            }
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    accumulativeSwingIndex(pOHLCV: Recordset, LimitMoveValue: number, Alias: string): Recordset {
        let Results = new Recordset();
        let RawSI: Recordset;
        let Field1: Field;
        let SI = new Index();
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        RawSI = SI.swingIndex(pOHLCV, LimitMoveValue, 'SI');
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Value = RawSI.value('SI', nav) + Field1.value(nav - 1);
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    relativeStrengthIndex(pSource: Field, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let AU: Field;
        let AD: Field;
        let RecordCount = 0;
        let Record = 0;
        let Period = 0;
        let Start = 0;
        let UT = 0;
        let DT = 0;
        let UpSum = 0;
        let DownSum = 0;
        let RS = 0;
        let RSI = 0;
        let value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        AU = new Field();
        AU.initialize(RecordCount, 'AU');
        AD = new Field();
        AD.initialize(RecordCount, 'AD');
        let nav = 2;
        for (Period = 1; Period < Periods + 1; Period++) {
            UT = 0;
            DT = 0;
            if (value !== Const.nullValue) {
                if (value > pSource.value(nav - 1)) {
                    UT = pSource.value(nav) - pSource.value(nav - 1);
                    UpSum += UT;
                }
                else if (pSource.value(nav) < pSource.value(nav - 1)) {
                    DT = pSource.value(nav - 1) - pSource.value(nav);
                    DownSum += DT;
                }
            }
            nav++;
        }
        nav--;
        UpSum = UpSum / Periods;
        AU.setValue(nav, UpSum);
        DownSum = DownSum / Periods;
        AD.setValue(nav, DownSum);
        RS = UpSum / DownSum;
        RSI = 100 - (100 / (1 + RS));
        Start = Periods + 3;
        for (Record = Start; Record < RecordCount + 2; Record++) {
            nav = Record - Periods;
            UpSum = 0;
            DownSum = 0;
            for (Period = 1; Period < Periods + 1; Period++) {
                UT = 0;
                DT = 0;
                value = pSource.value(nav);
                if (value !== Const.nullValue) {
                    if (value > pSource.value(nav - 1)) {
                        UT = pSource.value(nav) - pSource.value(nav - 1);
                        UpSum += UT;
                    }
                    else if (pSource.value(nav) < pSource.value(nav - 1)) {
                        DT = pSource.value(nav - 1) - pSource.value(nav);
                        DownSum += DT;
                    }
                }
                nav++;
            }
            nav--;
            UpSum = ((AU.value(nav - 1) * (Periods - 1)) + UT) / Periods;
            DownSum = ((AD.value(nav - 1) * (Periods - 1)) + DT) / Periods;
            AU.setValue(nav, UpSum);
            AD.setValue(nav, DownSum);
            if (!DownSum) {
                DownSum = UpSum;
            }
            if (!UpSum) {
                RS = 0;
            }
            else {
                RS = UpSum / DownSum;
            }
            RS = UpSum / DownSum;
            RSI = 100 - (100 / (1 + RS));
            Field1.setValue(nav, RSI);
        }
        Results.addField(Field1);
        return Results;
    }

    comparativeRelativeStrength(pSource1: Field, pSource2: Field, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Value = 0;
        RecordCount = pSource1.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        let nav = 1;
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = pSource1.value(nav) / pSource2.value(nav);
            if (Value === 1) {
                Value = Const.nullValue;
            }
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    stochasticRelativeStrength(pSource: Field , Periods: number , Alias: string ): Recordset {
        let Results = new Recordset();
        let general = new General();
        let RecordCount = pSource.recordCount;
        let RS: Recordset;
        let HHV: Field;
        let LLV: Field;
        let RSI = new Field();
        let Field1 = new Field();

        RSI.initialize(RecordCount , 'RSI');
        Field1.initialize(RecordCount , Alias);

        RS = this.relativeStrengthIndex(pSource , Periods , 'RSI');
        RSI = RS.getField('RSI');
        RS.removeField('RSI');
        RS = general.HHV(RSI , Periods , 'HHV');
        HHV = RS.getField('HHV');
        RS.removeField('HHV');
        RS = general.LLV(RSI , Periods , 'LLV');
        LLV = RS.getField('LLV');
        RS.removeField('LLV');

        for(let start = Periods + 1 ; start < RecordCount + 1 ; start++) {
            let value = (RSI.value(start)  - LLV.value(start)) / (HHV.value(start) - LLV.value(start));
            Field1.setValue(start , value);
        }

        Results.addField(Field1);
        return Results;
    }

    priceVolumeTrend(pSource: Field, Volume: Field, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Value = (((pSource.value(nav) - pSource.value(nav - 1)) / pSource.value(nav - 1)) * Volume.value(nav)) + Field1.value(nav - 1);
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    positiveVolumeIndex(pSource: Field, Volume: Field, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        Field1.setValue(1, 1);
        for (Record = Start; Record < RecordCount + 1; Record++) {
            if (Volume.value(nav) > Volume.value(nav - 1)) {
                Value = Field1.value(nav - 1) + (pSource.value(nav) - pSource.value(nav - 1)) / pSource.value(nav - 1) * Field1.value(nav - 1);
            }
            else {
                Value = Field1.value(nav - 1);
            }
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    negativeVolumeIndex(pSource: Field, Volume: Field, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        Field1.setValue(1, 1);
        for (Record = Start; Record < RecordCount + 1; Record++) {
            if (Volume.value(nav) < Volume.value(nav - 1)) {
                Value = Field1.value(nav - 1) + (pSource.value(nav) - pSource.value(nav - 1)) / pSource.value(nav - 1) * Field1.value(nav - 1);
            }
            else {
                Value = Field1.value(nav - 1);
            }
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    performance(pSource: Field, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let FirstPrice = 0;
        let Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        FirstPrice = pSource.value(1);
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Value = ((pSource.value(nav) - FirstPrice) / FirstPrice) * 100;
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    onBalanceVolume(pSource: Field, Volume: Field, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            if (pSource.value(nav - 1) < pSource.value(nav)) {
                Value = Field1.value(nav - 1) + Volume.value(nav);
            }
            else if (pSource.value(nav) < pSource.value(nav - 1)) {
                Value = Field1.value(nav - 1) - Volume.value(nav);
            }
            else {
                Value = Field1.value(nav - 1);
            }
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    massIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let GE = new General();
        let MA = new MovingAverage();
        let Temp: Field;
        let HML: Recordset;
        let EMA1: Recordset;
        let EMA2: Recordset;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Period = 0;
        let Sum = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        if (Periods < 1 || Periods > RecordCount) {
            return null;
        }
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        HML = GE.highMinusLow(pOHLCV, 'HML');
        Temp = HML.getField('HML');
        EMA1 = MA.exponentialMovingAverage(Temp, 9, 'EMA');
        Temp = EMA1.getField('EMA');
        EMA2 = MA.exponentialMovingAverage(Temp, 9, 'EMA');
        Start = (Periods * 2) + 1;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 2; Record++) {
            Sum = 0;
            nav = Record - Periods;
            for (Period = 1; Period < Periods + 1; Period++) {
                let EMA2val = EMA2.value('EMA', nav);
                if (EMA2val != 0) {
                    Sum = Sum + (EMA1.value('EMA', nav) / EMA2val);
                }
                nav++;
            }
            nav--;
            Field1.setValue(nav, Sum);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    chaikinMoneyFlow(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Value = 0;
        let MFM = 0, MFV = 0, SumV = 0, Sum = 0;
        let a = 0, b = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = Periods + 1; Record < RecordCount + 1; Record++) {
            Sum = 0;
            SumV = 0;
            MFV = 0;  //needs to be reset, otherwise values get inflated
            MFM = 0;  //needs to be reset because in theory if a & b are both zero value gets carried to next iteration
            //iteration should be up to Periods
            for (let n = 0; n < Periods; ++n) {
                a = ((pOHLCV.value('Close', Record - n) - pOHLCV.value('Low', Record - n)) - (pOHLCV.value('High', Record - n) - pOHLCV.value('Close', Record - n)));
                b = (pOHLCV.value('High', Record - n) - pOHLCV.value('Low', Record - n));
                if (a != 0 && b != 0) {
                    MFM = (a / b);
                }
                MFV += MFM * pOHLCV.value('Volume', Record - n);
                SumV += pOHLCV.value('Volume', Record - n);
            }
            Value = (MFV / SumV);
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;

    }

    commodityChannelIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let GN = new General();
        let MA = new MovingAverage();
        let Results = new Recordset();
        let TPrs: Recordset;
        let MArs: Recordset;
        let Field1: Field;
        let dMeanDeviation = 0;
        let dTmp = 0;
        let Count = 0;
        let RecordCount = 0;
        let Record = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        TPrs = GN.typicalPrice(pOHLCV, 'TP');
        MArs = MA.simpleMovingAverage(TPrs.getField('TP'), Periods, 'TPMA');
        for (Record = 1; Record < (2 * Periods) + 1; ++Record) {
            Field1.setValue(Record, 0);
        }

        for (Record = (2 * Periods); Record < RecordCount + 1; ++Record) {
            dMeanDeviation = 0;
            for (Count = (Record - Periods) + 1; Count < Record + 1; ++Count) {
                dTmp = Math.abs(TPrs.getField('TP').value(Count) - MArs.getField('TPMA').value(Record));
                dMeanDeviation = dMeanDeviation + dTmp;
            }
            dMeanDeviation = dMeanDeviation / Periods;
            dTmp = (TPrs.getField('TP').value(Record) - MArs.getField('TPMA').value(Record)) / (dMeanDeviation * 0.015);
            Field1.setValue(Record, dTmp);
        }
        Results.addField(Field1);
        return Results;

    }

    stochasticMomentumIndex(pOHLCV: Recordset, KPeriods: number, KSmooth: number, KDoubleSmooth: number, DPeriods: number, MAType: number, PctD_MAType: number): Recordset {
        let MA = new MovingAverage();
        let Results = new Recordset();
        let Temp: Recordset = null;
        let GN = new General();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        let LLV: Field = null;
        let HHV: Field = null;
        let CHHLL: Field = null;
        let HHLL: Field = null;
        let Field1: Field = null;
        let Field2: Field = null;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, '%K');
        Temp = GN.HHV(pOHLCV.getField('High'), KPeriods, 'HHV');
        HHV = new Field();
        HHV.initialize(RecordCount, 'HHV');
        Temp.copyField(HHV, 'HHV');
        Temp = GN.LLV(pOHLCV.getField('Low'), KPeriods, 'LLV');
        LLV = new Field();
        LLV.initialize(RecordCount, 'LLV');
        Temp.copyField(LLV, 'LLV');
        HHLL = new Field();
        HHLL.initialize(RecordCount, 'HHLL');
        for (Record = 1; Record < RecordCount + 1; ++Record) {
            Value = HHV.value(Record) - LLV.value(Record);
            HHLL.setValue(Record, Value);
        }
        CHHLL = new Field();
        CHHLL.initialize(RecordCount, 'CHHLL');
        for (Record = 1; Record < RecordCount + 1; ++Record) {
            Value = pOHLCV.value('Close', Record) - (0.5 * (HHV.value(Record) + LLV.value(Record)));
            CHHLL.setValue(Record, Value);
        }
        if (KSmooth > 1) {
            Temp = MA.movingAverageSwitch(CHHLL, KSmooth, MAType, 'CHHLL');
            Temp.copyField(CHHLL, 'CHHLL');
        }
        if (KDoubleSmooth > 1) {
            Temp = MA.movingAverageSwitch(CHHLL, KDoubleSmooth, MAType, 'CHHLL');
            Temp.copyField(CHHLL, 'CHHLL');
        }
        if (KSmooth > 1) {
            Temp = MA.movingAverageSwitch(HHLL, KSmooth, MAType, 'HHLL');
            Temp.copyField(HHLL, 'HHLL');
        }
        if (KDoubleSmooth > 1) {
            Temp = MA.movingAverageSwitch(HHLL, KDoubleSmooth, MAType, 'HHLL');
            Temp.copyField(HHLL, 'HHLL');
        }
        for (Record = KPeriods + 1; Record < RecordCount + 1; ++Record) {
            let a = CHHLL.value(Record);
            let b = (0.5 * HHLL.value(Record));
            if (a !== b && !!b) {
                Value = 100 * (a / b);
            }
            Field1.setValue(Record, Value);
        }
        if (DPeriods > 1) {
            Temp = MA.movingAverageSwitch(Field1, DPeriods, PctD_MAType, '%D');
            Field2 = new Field();
            Field2.initialize(RecordCount, '%D');
            Temp.copyField(Field2, '%D');
            Results.addField(Field2);
        }
        Results.addField(Field1);
        return Results;
    }

    historicalVolatility(pSource: Field, Periods: number, BarHistory: number, StandardDeviations: number, Alias: string): Recordset {
        let Results = new Recordset();
        let general = new General();
        let Field1 = new Field();
        let RecordCount = pSource.recordCount;
        let Record = 0;
        let Start = 2;
        Field1.initialize(RecordCount, 'TEMP');

        let Logs = general.logOfBase10(Start, pSource);
        Field1 = general.sum(Logs, Periods);

        for (Record = Start; Record < RecordCount + 1; Record++) {
            let value = (Field1.value(Record) / Periods) - Logs.value(Record);
            value = Math.pow(value, 2);
            Field1.setValue(Record, value);
        }

        let copyField = general.copyField(Field1);
        Field1 = general.sum(copyField, Periods);

        for (Record = Start; Record < RecordCount + 1; Record++) {
            let value = Math.sqrt(Field1.value(Record) / Periods);
            let valueWithStandardDeviations = value * StandardDeviations;
            let valueWithBarHistory = valueWithStandardDeviations * Math.sqrt(BarHistory);
            Field1.setValue(Record, valueWithBarHistory);
        }

        Field1.name = Alias;
        Results.addField(Field1);
        return Results;
    }

    elderForceIndex(pOHLCV: Recordset, Alias: string): Recordset {
        let Results = new Recordset();
        let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let field1 = new Field();
        field1.initialize(RecordCount, Alias);
        let pClose = pOHLCV.getField('Close');
        let pVolume = pOHLCV.getField('Volume');
        for (let record = 2; record < RecordCount + 1; record++) {
            field1.setValue(record, (pClose.value(record - 1) - pClose.value(record)) * pVolume.value(record));
        }
        Results.addField(field1);
        return Results;
    }

    elderThermometer(pOHLCV: Recordset, Alias: string): Recordset {
        let Results = new Recordset();
        let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let field1 = new Field();
        field1.initialize(RecordCount, Alias);
        let pHigh = pOHLCV.getField('High');
        let pLow = pOHLCV.getField('Low');
        for (let record = 2; record < RecordCount + 1; record++) {
            let hmh = Math.abs(pHigh.value(record) - pHigh.value(record - 1));
            let lml = Math.abs(pLow.value(record - 1) - pLow.value(record));
            let value = Math.max(hmh, lml);
            field1.setValue(record, value);
        }
        Results.addField(field1);
        return Results;
    }

    marketFacilitationIndex(pOHLCV: Recordset, Alias: string): Recordset {
        let Results = new Recordset();
        let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let field1 = new Field();
        field1.initialize(RecordCount, Alias);
        let pHigh = pOHLCV.getField('High');
        let pLow = pOHLCV.getField('Low');
        let pVolume = pOHLCV.getField('Volume');
        for (let record = 2; record < RecordCount + 1; record++) {
            field1.setValue(record, (pHigh.value(record) - pLow.value(record)) / (pVolume.value(record) / 100000000));
        }
        Results.addField(field1);
        return Results;
    }

    qStick(pOHLCV: Recordset, Periods: number, MAType: number, Alias: string): Recordset {
        let Results = new Recordset();
        let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let field1 = new Field();
        field1.initialize(RecordCount, Alias);
        let pHigh = pOHLCV.getField('High');
        let pLow = pOHLCV.getField('Low');
        for (let record = 1; record < RecordCount + 1; record++) {
            field1.setValue(record, (pHigh.value(record) - pLow.value(record)));
        }
        let ma = new MovingAverage();
        return ma.movingAverageSwitch(field1, Periods, MAType, Alias);
    }

    gopalakrishnanRangeIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let field1 = new Field();
        field1.initialize(recordCount, Alias);
        let g = new General();
        let hhv = g.HHV(pOHLCV.getField('High'), Periods, 'x').getField('x');
        let llv = g.LLV(pOHLCV.getField('Low'), Periods, 'x').getField('x');
        for (let record = 1; record < recordCount + 1; record++) {
            field1.setValue(record, Math.log(hhv.value(record) - llv.value(record)) / Math.log(Periods));
        }
        for (let record = 1; record < Periods + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    }

    intradayMomentumIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let MA = new MovingAverage();
        let Results = new Recordset();
        let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let field1 = new Field();
        field1.initialize(recordCount, Alias);
        let pOpen = pOHLCV.getField('Open');
        let pClose = pOHLCV.getField('Close');

        let maxField = new Field();
        maxField.initialize(recordCount, Alias);

        let minField = new Field();
        minField.initialize(recordCount, Alias);

        for (let i = 2; i <= pClose.recordCount; i++) {
            maxField.setValue(i, Math.max(pClose.value(i) - pOpen.value(i), 0));
            minField.setValue(i, Math.abs(Math.min(pClose.value(i) - pOpen.value(i), 0)));
        }

        for (let record = 2; record < recordCount + 1; record++) {
            let MAForMax = MA.simpleMovingAverage(maxField, Periods, Alias);
            let MAForMin = MA.simpleMovingAverage(minField, Periods, Alias);

            field1.setValue(record, 100 * (MAForMax.getField(Alias).value(record) / (MAForMax.getField(Alias).value(record) + MAForMin.getField(Alias).value(record))));
        }

        Results.addField(field1);
        return Results;
    }

    RAVI(pSource: Field, ShortCycle: number, LongCycle: number, Alias: string): Recordset {
        let Results = new Recordset();
        let recordCount = pSource.recordCount;
        let field1 = new Field();
        field1.initialize(recordCount, Alias);
        let ma = new MovingAverage();
        let sc = ma.VIDYA(pSource, ShortCycle, 0.65, 'x').getField('x');
        let lc = ma.VIDYA(pSource, LongCycle, 0.65, 'x').getField('x');
        for (let record = 1; record < recordCount + 1; record++) {
            field1.setValue(record, 100 * (Math.abs(sc.value(record) - lc.value(record)) / lc.value(record)));
        }
        for (let record = 1; record < LongCycle + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    }

    randomWalkIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let hirwi = new Field();
        hirwi.initialize(recordCount, Alias + ' High');
        let lowrwi = new Field();
        lowrwi.initialize(recordCount, Alias + ' Low');
        let pHigh = pOHLCV.getField('High');
        let pLow = pOHLCV.getField('Low');
        let ma = new MovingAverage();
        let o = new Oscillator();
        let atr = ma.simpleMovingAverage(o.trueRange(pOHLCV, 'x').getField('x'), Periods, 'x').getField('x');
        for (let record = Periods; record < recordCount + 1; record++) {
            for (let n = record - 1; n > record - Periods; --n) {
                hirwi.setValue(record, (pHigh.value(record) - pLow.value(n)) / (atr.value(n) * Math.sqrt(n)));
                lowrwi.setValue(record, (pHigh.value(n) - pLow.value(record)) / (atr.value(n) * Math.sqrt(n)));
            }
        }
        for (let record = 1; record < Periods * 2; record++) {
            hirwi.setValue(record, 0);
            lowrwi.setValue(record, 0);
        }
        Results.addField(hirwi);
        Results.addField(lowrwi);
        return Results;
    }

    trendIntensityIndex(pSource: Field, ShortCycle: number, LongCycle: number, Alias: string): Recordset {
        let Results = new Recordset();
        let recordCount = pSource.recordCount;
        let field1 = new Field();
        field1.initialize(recordCount, Alias);
        let ma = new MovingAverage();
        let sc = ma.VIDYA(pSource, ShortCycle, 0.65, 'x').getField('x');
        let lc = ma.VIDYA(pSource, LongCycle, 0.65, 'x').getField('x');
        for (let record = 1; record < recordCount + 1; record++) {
            field1.setValue(record, 100 * (Math.abs(sc.value(record) - lc.value(record)) / lc.value(record)));
        }
        for (let record = 1; record < LongCycle + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    }

    twiggsMoneyFlow(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let field1 = new Field();
        field1.initialize(recordCount, Alias);
        let pHigh = pOHLCV.getField('High');
        let pLow = pOHLCV.getField('Low');
        let pClose = pOHLCV.getField('Close');
        let pVolume = pOHLCV.getField('Volume');
        let ma = new MovingAverage();
        let ema = ma.exponentialMovingAverage(pOHLCV.getField('Volume'), Periods, 'x').getField('x');
        let th = new Field();
        let tl = new Field();
        tl.initialize(recordCount, 'x');
        th.initialize(recordCount, 'x');
        for (let record = 2; record < recordCount + 1; record++) {
            th.setValue(record, Math.max(pHigh.value(record), pClose.value(record - 1)));
            tl.setValue(record, Math.min(pLow.value(record), pClose.value(record - 1)));
        }
        for (let record = 2; record < recordCount + 1; record++) {
            field1.setValue(record, ((pClose.value(record) - tl.value(record)) - (th.value(record) - pClose.value(record))) / (th.value(record) - tl.value(record)) * pVolume.value(record));
        }
        field1 = ma.exponentialMovingAverage(field1, Periods, Alias).getField(Alias);
        for (let record = 2; record < recordCount + 1; record++) {
            field1.setValue(record, field1.value(record) / ema.value(record));
        }
        for (let record = 1; record < Periods + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    }

    directionalMovementAverage(pSource: Field , ShortCycle: number, LongCycle: number, period: number): Recordset {
        let Results: Recordset = new Recordset();
        let MA = new MovingAverage();
        let RecordCount = pSource.recordCount;
        let RS: Recordset;
        let Field1: Field;
        let Field2: Field;
        let DDD: Field;
        let AMA: Field;

        DDD = new Field();
        DDD.initialize(RecordCount , 'DDD');
        RS = MA.simpleMovingAverage(pSource , ShortCycle , 'MA1');
        Field1 = RS.getField('MA1');
        RS.removeField('MA1');

        RS = MA.simpleMovingAverage(pSource , LongCycle , 'MA2');
        Field2 = RS.getField('MA2')
        RS.removeField('MA2');

        for(let Record = 1 ; Record < RecordCount + 1 ; Record++){
            DDD.setValue(Record , Field1.value(Record) - Field2.value(Record));
        }

        RS = MA.simpleMovingAverage(DDD , period , 'AMA');
        AMA = RS.getField('AMA');
        RS.removeField('AMA');

        Results.addField(DDD);
        Results.addField(AMA);

        return Results;
    }

    directionalDivergenceIndex(pOHLCV: Recordset, period1: number , period2: number, period3: number , period4: number): Recordset {
        let Results: Recordset = new Recordset();
        let general = new General();
        let MA = new MovingAverage();
        let High: Field = pOHLCV.getField('High');
        let Low: Field = pOHLCV.getField('Low');
        let RecordCount;
        let RS: Recordset;
        let DMZ: Field;
        let DMF: Field;
        let DDI: Field;
        let ADDI: Field;
        let AD: Field;
        let DmzSum: Field;
        let DmfSum: Field;

        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;

        DMZ = new Field();
        DMF = new Field();
        DDI = new Field();

        DMZ.initialize(RecordCount, 'DMZ');
        DMF.initialize(RecordCount, 'DMF');
        DDI.initialize(RecordCount,  'DDI');

        for (let Record = 1; Record < RecordCount + 1; Record++) {
            let dmzValue = (High.value(Record) + Low.value(Record)) <= (High.value(Record - 1) + Low.value(Record - 1)) ? 0 :
                Math.max(Math.abs(High.value(Record) - High.value(Record - 1)) , Math.abs(Low.value(Record) - Low.value(Record - 1)));

            let dmfValue = (High.value(Record) + Low.value(Record)) >= (High.value(Record - 1) + Low.value(Record - 1)) ? 0 :
                Math.max(Math.abs(High.value(Record) - High.value(Record - 1)) , Math.abs(Low.value(Record) - Low.value(Record - 1)));

            DMZ.setValue(Record , dmzValue);
            DMF.setValue(Record , dmfValue);
        }

        DmzSum = general.sum(DMZ, period1);
        DmfSum = general.sum(DMF, period1);

        for(let Record = period1 + 2; Record < RecordCount + 1; Record++) {
            let DIZ = DmzSum.value(Record) / (DmzSum.value(Record) + DmfSum.value(Record));
            let DIF = DmfSum.value(Record) / (DmfSum.value(Record) + DmzSum.value(Record));
            DDI.setValue(Record, DIZ - DIF);
        }

        RS = MA.dynamicMovingAverage(DDI,  period2 ,period3/period2 , 'ADDI');
        ADDI = RS.getField('ADDI');
        RS.removeField('ADDI');

        RS = MA.simpleMovingAverage(ADDI, period4,  'AD');
        AD = RS.getField('AD');
        RS.removeField('AD');

        Results.addField(DDI);
        Results.addField(AD);
        Results.addField(ADDI);

        return Results;
    }

    directionalMovementIndex(pOHLCV: Recordset , period: number): Recordset {
        let Results = new Recordset();
        let general = new General();
        let MA = new MovingAverage();
        let RS: Recordset;
        let High: Field = pOHLCV.getField('High');
        let Low: Field = pOHLCV.getField('Low');
        let Close: Field = pOHLCV.getField('Close');
        let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        let Field1: Field = new Field();
        let Field2: Field = new Field();
        let Field3: Field = new Field();
        let Field4: Field = new Field();
        let PDI: Field = new Field();
        let MDI: Field = new Field();
        let ADXR: Field = new Field();
        let TR: Field;
        let DMP: Field;
        let DMM: Field;
        let ADX: Field;

        Field1.initialize(RecordCount , 'TRTemp');
        Field2.initialize(RecordCount , 'DMPTemp');
        Field3.initialize(RecordCount , 'DMMTemp');
        Field4.initialize(RecordCount , 'ADXTemp');

        PDI.initialize(RecordCount ,  'PDI');
        MDI.initialize(RecordCount ,  'MDI');
        ADXR.initialize(RecordCount , 'ADXR');

        for (let Record = 1; Record < RecordCount + 1; Record++) {
            let highLowDiff = High.value(Record) - Low.value(Record),
                highPrevCloseDiff = Math.abs(High.value(Record) - Close.value(Record - 1)),
                lowPrevCloseDiff = Math.abs(Low.value(Record) - Close.value(Record - 1)),
                maxValue1 = Math.max(highLowDiff, highPrevCloseDiff),
                maxValue2 = Math.max(maxValue1, lowPrevCloseDiff);

            Field1.setValue(Record, maxValue2);

            let highDiff = High.value(Record) - High.value(Record - 1),
                lowDiff = Low.value(Record - 1) - Low.value(Record),
                DMPValue = highDiff > 0 && highDiff > lowDiff ? highDiff : 0,
                DMMValue = lowDiff > 0 && lowDiff > highDiff ? lowDiff : 0;

            Field2.setValue(Record, DMPValue);
            Field3.setValue(Record, DMMValue);
        }

        TR = general.sum(Field1, period - 1);
        DMP = general.sum(Field2, period - 1);
        DMM = general.sum(Field3, period - 1);

        for (let Record = 1; Record < RecordCount + 1; Record++) {
            let PDIValue = DMP.value(Record) * 100 / TR.value(Record),
                MDIValue = DMM.value(Record) * 100 / TR.value(Record),
                AdxValue = (Math.abs(PDIValue - MDIValue) / (PDIValue + MDIValue)) * 100;

            PDI.setValue(Record, PDIValue);
            MDI.setValue(Record, MDIValue);
            Field4.setValue(Record, AdxValue);
        }

        RS = MA.simpleMovingAverage(Field4,1, 'ADX');
        ADX = RS.getField( 'ADX');
        RS.removeField('ADX');

        for(let Record = 1; Record < RecordCount + 1; Record++){
           ADXR.setValue(Record, (ADX.value(Record) + ADX.value(Record - 1)) / 2);
        }

        Results.addField(PDI);
        Results.addField(MDI);
        Results.addField(ADX);
        Results.addField(ADXR);

        return Results;
    }
}
