import { Recordset } from "./Recordset";
import { Field } from "./Field";
import { General } from "./General";
import { MovingAverage } from "./MovingAverage";
import { Const } from "./TASdk";
import { Oscillator } from "./Oscillator";
var Index = (function () {
    function Index() {
    }
    Index.prototype.moneyFlowIndex = function (pOHLCV, Periods, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Period = 0;
        var Start = 0;
        var Price1 = 0;
        var Price2 = 0;
        var V = 0;
        var PosFlow = 0;
        var NegFlow = 0;
        var MoneyIndex = 0;
        var MoneyRatio = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        if (Periods < 1 || Periods > RecordCount) {
            return null;
        }
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = Periods + 2;
        var nav = Start;
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
    };
    Index.prototype.tradeVolumeIndex = function (pSource, Volume, MinTickValue, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Direction = 0;
        var LastDirection = 0;
        var Change = 0;
        var TVI = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
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
    };
    Index.prototype.swingIndex = function (pOHLCV, LimitMoveValue, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Cy = 0;
        var Ct = 0;
        var Oy = 0;
        var Ot = 0;
        var Hy = 0;
        var Ht = 0;
        var Ly = 0;
        var Lt = 0;
        var K = 0;
        var R = 0;
        var A = 0;
        var B = 0;
        var C = 0;
        var Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        if (LimitMoveValue <= 0) {
            return null;
        }
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
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
    };
    Index.prototype.accumulativeSwingIndex = function (pOHLCV, LimitMoveValue, Alias) {
        var Results = new Recordset();
        var RawSI;
        var Field1;
        var SI = new Index();
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        RawSI = SI.swingIndex(pOHLCV, LimitMoveValue, 'SI');
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Value = RawSI.value('SI', nav) + Field1.value(nav - 1);
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    Index.prototype.relativeStrengthIndex = function (pSource, Periods, Alias) {
        var Results = new Recordset();
        var Field1;
        var AU;
        var AD;
        var RecordCount = 0;
        var Record = 0;
        var Period = 0;
        var Start = 0;
        var UT = 0;
        var DT = 0;
        var UpSum = 0;
        var DownSum = 0;
        var RS = 0;
        var RSI = 0;
        var value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        AU = new Field();
        AU.initialize(RecordCount, 'AU');
        AD = new Field();
        AD.initialize(RecordCount, 'AD');
        var nav = 2;
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
    };
    Index.prototype.comparativeRelativeStrength = function (pSource1, pSource2, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Value = 0;
        RecordCount = pSource1.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        var nav = 1;
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
    };
    Index.prototype.stochasticRelativeStrength = function (pSource, Periods, Alias) {
        var Results = new Recordset();
        var general = new General();
        var RecordCount = pSource.recordCount;
        var RS;
        var HHV;
        var LLV;
        var RSI = new Field();
        var Field1 = new Field();
        RSI.initialize(RecordCount, 'RSI');
        Field1.initialize(RecordCount, Alias);
        RS = this.relativeStrengthIndex(pSource, Periods, 'RSI');
        RSI = RS.getField('RSI');
        RS.removeField('RSI');
        RS = general.HHV(RSI, Periods, 'HHV');
        HHV = RS.getField('HHV');
        RS.removeField('HHV');
        RS = general.LLV(RSI, Periods, 'LLV');
        LLV = RS.getField('LLV');
        RS.removeField('LLV');
        for (var start = Periods + 1; start < RecordCount + 1; start++) {
            var value = (RSI.value(start) - LLV.value(start)) / (HHV.value(start) - LLV.value(start));
            Field1.setValue(start, value);
        }
        Results.addField(Field1);
        return Results;
    };
    Index.prototype.priceVolumeTrend = function (pSource, Volume, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Value = (((pSource.value(nav) - pSource.value(nav - 1)) / pSource.value(nav - 1)) * Volume.value(nav)) + Field1.value(nav - 1);
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    Index.prototype.positiveVolumeIndex = function (pSource, Volume, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
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
    };
    Index.prototype.negativeVolumeIndex = function (pSource, Volume, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
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
    };
    Index.prototype.performance = function (pSource, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var FirstPrice = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
        FirstPrice = pSource.value(1);
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Value = ((pSource.value(nav) - FirstPrice) / FirstPrice) * 100;
            Field1.setValue(nav, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    Index.prototype.onBalanceVolume = function (pSource, Volume, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = 2;
        var nav = Start;
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
    };
    Index.prototype.massIndex = function (pOHLCV, Periods, Alias) {
        var Results = new Recordset();
        var Field1;
        var GE = new General();
        var MA = new MovingAverage();
        var Temp;
        var HML;
        var EMA1;
        var EMA2;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Period = 0;
        var Sum = 0;
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
        var nav = Start;
        for (Record = Start; Record < RecordCount + 2; Record++) {
            Sum = 0;
            nav = Record - Periods;
            for (Period = 1; Period < Periods + 1; Period++) {
                var EMA2val = EMA2.value('EMA', nav);
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
    };
    Index.prototype.chaikinMoneyFlow = function (pOHLCV, Periods, Alias) {
        var Results = new Recordset();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Value = 0;
        var MFM = 0, MFV = 0, SumV = 0, Sum = 0;
        var a = 0, b = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = Periods + 1; Record < RecordCount + 1; Record++) {
            Sum = 0;
            SumV = 0;
            MFV = 0;
            MFM = 0;
            for (var n = 0; n < Periods; ++n) {
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
    };
    Index.prototype.commodityChannelIndex = function (pOHLCV, Periods, Alias) {
        var GN = new General();
        var MA = new MovingAverage();
        var Results = new Recordset();
        var TPrs;
        var MArs;
        var Field1;
        var dMeanDeviation = 0;
        var dTmp = 0;
        var Count = 0;
        var RecordCount = 0;
        var Record = 0;
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
    };
    Index.prototype.stochasticMomentumIndex = function (pOHLCV, KPeriods, KSmooth, KDoubleSmooth, DPeriods, MAType, PctD_MAType) {
        var MA = new MovingAverage();
        var Results = new Recordset();
        var Temp = null;
        var GN = new General();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        var LLV = null;
        var HHV = null;
        var CHHLL = null;
        var HHLL = null;
        var Field1 = null;
        var Field2 = null;
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
            var a = CHHLL.value(Record);
            var b = (0.5 * HHLL.value(Record));
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
    };
    Index.prototype.historicalVolatility = function (pSource, Periods, BarHistory, StandardDeviations, Alias) {
        var Results = new Recordset();
        var general = new General();
        var Field1 = new Field();
        var RecordCount = pSource.recordCount;
        var Record = 0;
        var Start = 2;
        Field1.initialize(RecordCount, 'TEMP');
        var Logs = general.logOfBase10(Start, pSource);
        Field1 = general.sum(Logs, Periods);
        for (Record = Start; Record < RecordCount + 1; Record++) {
            var value = (Field1.value(Record) / Periods) - Logs.value(Record);
            value = Math.pow(value, 2);
            Field1.setValue(Record, value);
        }
        var copyField = general.copyField(Field1);
        Field1 = general.sum(copyField, Periods);
        for (Record = Start; Record < RecordCount + 1; Record++) {
            var value = Math.sqrt(Field1.value(Record) / Periods);
            var valueWithStandardDeviations = value * StandardDeviations;
            var valueWithBarHistory = valueWithStandardDeviations * Math.sqrt(BarHistory);
            Field1.setValue(Record, valueWithBarHistory);
        }
        Field1.name = Alias;
        Results.addField(Field1);
        return Results;
    };
    Index.prototype.elderForceIndex = function (pOHLCV, Alias) {
        var Results = new Recordset();
        var RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var field1 = new Field();
        field1.initialize(RecordCount, Alias);
        var pClose = pOHLCV.getField('Close');
        var pVolume = pOHLCV.getField('Volume');
        for (var record = 2; record < RecordCount + 1; record++) {
            field1.setValue(record, (pClose.value(record - 1) - pClose.value(record)) * pVolume.value(record));
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.elderThermometer = function (pOHLCV, Alias) {
        var Results = new Recordset();
        var RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var field1 = new Field();
        field1.initialize(RecordCount, Alias);
        var pHigh = pOHLCV.getField('High');
        var pLow = pOHLCV.getField('Low');
        for (var record = 2; record < RecordCount + 1; record++) {
            var hmh = Math.abs(pHigh.value(record) - pHigh.value(record - 1));
            var lml = Math.abs(pLow.value(record - 1) - pLow.value(record));
            var value = Math.max(hmh, lml);
            field1.setValue(record, value);
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.marketFacilitationIndex = function (pOHLCV, Alias) {
        var Results = new Recordset();
        var RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var field1 = new Field();
        field1.initialize(RecordCount, Alias);
        var pHigh = pOHLCV.getField('High');
        var pLow = pOHLCV.getField('Low');
        var pVolume = pOHLCV.getField('Volume');
        for (var record = 2; record < RecordCount + 1; record++) {
            field1.setValue(record, (pHigh.value(record) - pLow.value(record)) / (pVolume.value(record) / 100000000));
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.qStick = function (pOHLCV, Periods, MAType, Alias) {
        var Results = new Recordset();
        var RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var field1 = new Field();
        field1.initialize(RecordCount, Alias);
        var pHigh = pOHLCV.getField('High');
        var pLow = pOHLCV.getField('Low');
        for (var record = 1; record < RecordCount + 1; record++) {
            field1.setValue(record, (pHigh.value(record) - pLow.value(record)));
        }
        var ma = new MovingAverage();
        return ma.movingAverageSwitch(field1, Periods, MAType, Alias);
    };
    Index.prototype.gopalakrishnanRangeIndex = function (pOHLCV, Periods, Alias) {
        var Results = new Recordset();
        var recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var field1 = new Field();
        field1.initialize(recordCount, Alias);
        var g = new General();
        var hhv = g.HHV(pOHLCV.getField('High'), Periods, 'x').getField('x');
        var llv = g.LLV(pOHLCV.getField('Low'), Periods, 'x').getField('x');
        for (var record = 1; record < recordCount + 1; record++) {
            field1.setValue(record, Math.log(hhv.value(record) - llv.value(record)) / Math.log(Periods));
        }
        for (var record = 1; record < Periods + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.intradayMomentumIndex = function (pOHLCV, Periods, Alias) {
        var MA = new MovingAverage();
        var Results = new Recordset();
        var recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var field1 = new Field();
        field1.initialize(recordCount, Alias);
        var pOpen = pOHLCV.getField('Open');
        var pClose = pOHLCV.getField('Close');
        var maxField = new Field();
        maxField.initialize(recordCount, Alias);
        var minField = new Field();
        minField.initialize(recordCount, Alias);
        for (var i = 2; i <= pClose.recordCount; i++) {
            maxField.setValue(i, Math.max(pClose.value(i) - pOpen.value(i), 0));
            minField.setValue(i, Math.abs(Math.min(pClose.value(i) - pOpen.value(i), 0)));
        }
        for (var record = 2; record < recordCount + 1; record++) {
            var MAForMax = MA.simpleMovingAverage(maxField, Periods, Alias);
            var MAForMin = MA.simpleMovingAverage(minField, Periods, Alias);
            field1.setValue(record, 100 * (MAForMax.getField(Alias).value(record) / (MAForMax.getField(Alias).value(record) + MAForMin.getField(Alias).value(record))));
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.RAVI = function (pSource, ShortCycle, LongCycle, Alias) {
        var Results = new Recordset();
        var recordCount = pSource.recordCount;
        var field1 = new Field();
        field1.initialize(recordCount, Alias);
        var ma = new MovingAverage();
        var sc = ma.VIDYA(pSource, ShortCycle, 0.65, 'x').getField('x');
        var lc = ma.VIDYA(pSource, LongCycle, 0.65, 'x').getField('x');
        for (var record = 1; record < recordCount + 1; record++) {
            field1.setValue(record, 100 * (Math.abs(sc.value(record) - lc.value(record)) / lc.value(record)));
        }
        for (var record = 1; record < LongCycle + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.randomWalkIndex = function (pOHLCV, Periods, Alias) {
        var Results = new Recordset();
        var recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var hirwi = new Field();
        hirwi.initialize(recordCount, Alias + ' High');
        var lowrwi = new Field();
        lowrwi.initialize(recordCount, Alias + ' Low');
        var pHigh = pOHLCV.getField('High');
        var pLow = pOHLCV.getField('Low');
        var ma = new MovingAverage();
        var o = new Oscillator();
        var atr = ma.simpleMovingAverage(o.trueRange(pOHLCV, 'x').getField('x'), Periods, 'x').getField('x');
        for (var record = Periods; record < recordCount + 1; record++) {
            for (var n = record - 1; n > record - Periods; --n) {
                hirwi.setValue(record, (pHigh.value(record) - pLow.value(n)) / (atr.value(n) * Math.sqrt(n)));
                lowrwi.setValue(record, (pHigh.value(n) - pLow.value(record)) / (atr.value(n) * Math.sqrt(n)));
            }
        }
        for (var record = 1; record < Periods * 2; record++) {
            hirwi.setValue(record, 0);
            lowrwi.setValue(record, 0);
        }
        Results.addField(hirwi);
        Results.addField(lowrwi);
        return Results;
    };
    Index.prototype.trendIntensityIndex = function (pSource, ShortCycle, LongCycle, Alias) {
        var Results = new Recordset();
        var recordCount = pSource.recordCount;
        var field1 = new Field();
        field1.initialize(recordCount, Alias);
        var ma = new MovingAverage();
        var sc = ma.VIDYA(pSource, ShortCycle, 0.65, 'x').getField('x');
        var lc = ma.VIDYA(pSource, LongCycle, 0.65, 'x').getField('x');
        for (var record = 1; record < recordCount + 1; record++) {
            field1.setValue(record, 100 * (Math.abs(sc.value(record) - lc.value(record)) / lc.value(record)));
        }
        for (var record = 1; record < LongCycle + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.twiggsMoneyFlow = function (pOHLCV, Periods, Alias) {
        var Results = new Recordset();
        var recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var field1 = new Field();
        field1.initialize(recordCount, Alias);
        var pHigh = pOHLCV.getField('High');
        var pLow = pOHLCV.getField('Low');
        var pClose = pOHLCV.getField('Close');
        var pVolume = pOHLCV.getField('Volume');
        var ma = new MovingAverage();
        var ema = ma.exponentialMovingAverage(pOHLCV.getField('Volume'), Periods, 'x').getField('x');
        var th = new Field();
        var tl = new Field();
        tl.initialize(recordCount, 'x');
        th.initialize(recordCount, 'x');
        for (var record = 2; record < recordCount + 1; record++) {
            th.setValue(record, Math.max(pHigh.value(record), pClose.value(record - 1)));
            tl.setValue(record, Math.min(pLow.value(record), pClose.value(record - 1)));
        }
        for (var record = 2; record < recordCount + 1; record++) {
            field1.setValue(record, ((pClose.value(record) - tl.value(record)) - (th.value(record) - pClose.value(record))) / (th.value(record) - tl.value(record)) * pVolume.value(record));
        }
        field1 = ma.exponentialMovingAverage(field1, Periods, Alias).getField(Alias);
        for (var record = 2; record < recordCount + 1; record++) {
            field1.setValue(record, field1.value(record) / ema.value(record));
        }
        for (var record = 1; record < Periods + 1; record++) {
            field1.setValue(record, 0);
        }
        Results.addField(field1);
        return Results;
    };
    Index.prototype.directionalMovementAverage = function (pSource, ShortCycle, LongCycle, period) {
        var Results = new Recordset();
        var MA = new MovingAverage();
        var RecordCount = pSource.recordCount;
        var RS;
        var Field1;
        var Field2;
        var DDD;
        var AMA;
        DDD = new Field();
        DDD.initialize(RecordCount, 'DDD');
        RS = MA.simpleMovingAverage(pSource, ShortCycle, 'MA1');
        Field1 = RS.getField('MA1');
        RS.removeField('MA1');
        RS = MA.simpleMovingAverage(pSource, LongCycle, 'MA2');
        Field2 = RS.getField('MA2');
        RS.removeField('MA2');
        for (var Record = 1; Record < RecordCount + 1; Record++) {
            DDD.setValue(Record, Field1.value(Record) - Field2.value(Record));
        }
        RS = MA.simpleMovingAverage(DDD, period, 'AMA');
        AMA = RS.getField('AMA');
        RS.removeField('AMA');
        Results.addField(DDD);
        Results.addField(AMA);
        return Results;
    };
    Index.prototype.directionalDivergenceIndex = function (pOHLCV, period1, period2, period3, period4) {
        var Results = new Recordset();
        var general = new General();
        var MA = new MovingAverage();
        var High = pOHLCV.getField('High');
        var Low = pOHLCV.getField('Low');
        var RecordCount;
        var RS;
        var DMZ;
        var DMF;
        var DDI;
        var ADDI;
        var AD;
        var DmzSum;
        var DmfSum;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        DMZ = new Field();
        DMF = new Field();
        DDI = new Field();
        DMZ.initialize(RecordCount, 'DMZ');
        DMF.initialize(RecordCount, 'DMF');
        DDI.initialize(RecordCount, 'DDI');
        for (var Record = 1; Record < RecordCount + 1; Record++) {
            var dmzValue = (High.value(Record) + Low.value(Record)) <= (High.value(Record - 1) + Low.value(Record - 1)) ? 0 :
                Math.max(Math.abs(High.value(Record) - High.value(Record - 1)), Math.abs(Low.value(Record) - Low.value(Record - 1)));
            var dmfValue = (High.value(Record) + Low.value(Record)) >= (High.value(Record - 1) + Low.value(Record - 1)) ? 0 :
                Math.max(Math.abs(High.value(Record) - High.value(Record - 1)), Math.abs(Low.value(Record) - Low.value(Record - 1)));
            DMZ.setValue(Record, dmzValue);
            DMF.setValue(Record, dmfValue);
        }
        DmzSum = general.sum(DMZ, period1);
        DmfSum = general.sum(DMF, period1);
        for (var Record = period1 + 2; Record < RecordCount + 1; Record++) {
            var DIZ = DmzSum.value(Record) / (DmzSum.value(Record) + DmfSum.value(Record));
            var DIF = DmfSum.value(Record) / (DmfSum.value(Record) + DmzSum.value(Record));
            DDI.setValue(Record, DIZ - DIF);
        }
        RS = MA.dynamicMovingAverage(DDI, period2, period3 / period2, 'ADDI');
        ADDI = RS.getField('ADDI');
        RS.removeField('ADDI');
        RS = MA.simpleMovingAverage(ADDI, period4, 'AD');
        AD = RS.getField('AD');
        RS.removeField('AD');
        Results.addField(DDI);
        Results.addField(AD);
        Results.addField(ADDI);
        return Results;
    };
    Index.prototype.directionalMovementIndex = function (pOHLCV, period) {
        var Results = new Recordset();
        var general = new General();
        var MA = new MovingAverage();
        var RS;
        var High = pOHLCV.getField('High');
        var Low = pOHLCV.getField('Low');
        var Close = pOHLCV.getField('Close');
        var RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var Field1 = new Field();
        var Field2 = new Field();
        var Field3 = new Field();
        var Field4 = new Field();
        var PDI = new Field();
        var MDI = new Field();
        var ADXR = new Field();
        var TR;
        var DMP;
        var DMM;
        var ADX;
        Field1.initialize(RecordCount, 'TRTemp');
        Field2.initialize(RecordCount, 'DMPTemp');
        Field3.initialize(RecordCount, 'DMMTemp');
        Field4.initialize(RecordCount, 'ADXTemp');
        PDI.initialize(RecordCount, 'PDI');
        MDI.initialize(RecordCount, 'MDI');
        ADXR.initialize(RecordCount, 'ADXR');
        for (var Record = 1; Record < RecordCount + 1; Record++) {
            var highLowDiff = High.value(Record) - Low.value(Record), highPrevCloseDiff = Math.abs(High.value(Record) - Close.value(Record - 1)), lowPrevCloseDiff = Math.abs(Low.value(Record) - Close.value(Record - 1)), maxValue1 = Math.max(highLowDiff, highPrevCloseDiff), maxValue2 = Math.max(maxValue1, lowPrevCloseDiff);
            Field1.setValue(Record, maxValue2);
            var highDiff = High.value(Record) - High.value(Record - 1), lowDiff = Low.value(Record - 1) - Low.value(Record), DMPValue = highDiff > 0 && highDiff > lowDiff ? highDiff : 0, DMMValue = lowDiff > 0 && lowDiff > highDiff ? lowDiff : 0;
            Field2.setValue(Record, DMPValue);
            Field3.setValue(Record, DMMValue);
        }
        TR = general.sum(Field1, period - 1);
        DMP = general.sum(Field2, period - 1);
        DMM = general.sum(Field3, period - 1);
        for (var Record = 1; Record < RecordCount + 1; Record++) {
            var PDIValue = DMP.value(Record) * 100 / TR.value(Record), MDIValue = DMM.value(Record) * 100 / TR.value(Record), AdxValue = (Math.abs(PDIValue - MDIValue) / (PDIValue + MDIValue)) * 100;
            PDI.setValue(Record, PDIValue);
            MDI.setValue(Record, MDIValue);
            Field4.setValue(Record, AdxValue);
        }
        RS = MA.simpleMovingAverage(Field4, 1, 'ADX');
        ADX = RS.getField('ADX');
        RS.removeField('ADX');
        for (var Record = 1; Record < RecordCount + 1; Record++) {
            ADXR.setValue(Record, (ADX.value(Record) + ADX.value(Record - 1)) / 2);
        }
        Results.addField(PDI);
        Results.addField(MDI);
        Results.addField(ADX);
        Results.addField(ADXR);
        return Results;
    };
    return Index;
}());
export { Index };
//# sourceMappingURL=Index.js.map