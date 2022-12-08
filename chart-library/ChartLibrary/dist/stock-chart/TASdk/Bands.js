import { Field } from "./Field";
import { Recordset } from "./Recordset";
import { Oscillator } from "./Oscillator";
import { MovingAverage } from "./MovingAverage";
import { General } from "./General";
import { Const } from "./TASdk";
var Bands = (function () {
    function Bands() {
    }
    Bands.prototype.bollingerBands = function (pSource, Periods, StandardDeviations, MAType) {
        var MA = new MovingAverage();
        var Results = null;
        var Field1 = null;
        var Field2 = null;
        var Period = 0;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Sum = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        if (MAType < Const.mA_START || MAType > Const.mA_END) {
            return null;
        }
        if (Periods < 1 || Periods > RecordCount) {
            return null;
        }
        if (StandardDeviations < 0 || StandardDeviations > 100) {
            return null;
        }
        Field1 = new Field();
        Field1.initialize(RecordCount, 'Bollinger Band Bottom');
        Field2 = new Field();
        Field2.initialize(RecordCount, 'Bollinger Band Top');
        Results = MA.movingAverageSwitch(pSource, Periods, MAType, 'Bollinger Band Median');
        Start = Periods + 1;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Sum = 0;
            Value = Results.value('Bollinger Band Median', nav);
            for (Period = 1; Period < Periods + 1; Period++) {
                Sum += (pSource.value(nav) - Value) * (pSource.value(nav) - Value);
                nav--;
            }
            nav += Periods;
            Value = StandardDeviations * Math.sqrt(Sum / Periods);
            Field1.setValue(nav, Results.value('Bollinger Band Median', nav) - Value);
            Field2.setValue(nav, Results.value('Bollinger Band Median', nav) + Value);
            nav++;
        }
        if (Results != null) {
            Results.addField(Field1);
            Results.addField(Field2);
        }
        return Results;
    };
    Bands.prototype.movingAverageEnvelope = function (pSource, Periods, MAType, Shift) {
        var MA = new MovingAverage();
        var Results = null;
        var Field1 = null;
        var Field2 = null;
        var RecordCount = 0;
        var Record = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        if (MAType < Const.mA_START || MAType > Const.mA_END) {
            return null;
        }
        if (Periods < 1 || Periods > RecordCount) {
            return null;
        }
        if (Shift < 0 || Shift > 100) {
            return null;
        }
        Field1 = new Field();
        Field1.initialize(RecordCount, 'Envelope Top');
        Field2 = new Field();
        Field2.initialize(RecordCount, 'Envelope Bottom');
        Results = MA.movingAverageSwitch(pSource, Periods, MAType, 'Envelope Median');
        var nav = 1;
        Shift = Shift / 100;
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = Results.value('Envelope Median', nav);
            Field1.setValue(nav, Value + (Value * Shift));
            Value = Results.value('Envelope Median', nav);
            Field2.setValue(nav, Value - (Value * Shift));
            nav++;
        }
        if (Results != null) {
            Results.addField(Field1);
            Results.addField(Field2);
        }
        return Results;
    };
    Bands.prototype.highLowBands = function (HighPrice, LowPrice, ClosePrice, Periods) {
        var MA = new MovingAverage();
        var Results = new Recordset();
        var RS1;
        var RS2;
        var RS3;
        if (Periods < 6 || Periods > HighPrice.recordCount) {
            return null;
        }
        RS1 = MA.VIDYA(HighPrice, Periods, 0.8, 'High Low Bands Top');
        RS2 = MA.VIDYA(ClosePrice, parseInt((Periods / 2).toString()), 0.8, 'High Low Bands Median');
        RS3 = MA.VIDYA(LowPrice, Periods, 0.8, 'High Low Bands Bottom');
        Results.addField(RS1.getField('High Low Bands Top'));
        Results.addField(RS2.getField('High Low Bands Median'));
        Results.addField(RS3.getField('High Low Bands Bottom'));
        RS1.removeField('High Low Bands Top');
        RS2.removeField('High Low Bands Median');
        RS3.removeField('High Low Bands Bottom');
        return Results;
    };
    Bands.prototype.fractalChaosBands = function (pOHLCV, Periods) {
        var MA = new MovingAverage();
        var Results = new Recordset();
        var RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var Record = 0;
        if (Periods < 1) {
            Periods = 100;
        }
        var rsFractals = null;
        var fHiFractal = new Field();
        fHiFractal.initialize(RecordCount, 'Fractal High');
        var fLoFractal = new Field();
        fLoFractal.initialize(RecordCount, 'Low High');
        var fHLM = new Field();
        fHLM.initialize(RecordCount, 'HLM');
        var fH = pOHLCV.getField('High');
        var fL = pOHLCV.getField('Low');
        var fFR = new Field();
        fFR.initialize(RecordCount, 'FR');
        var fH1 = new Field();
        fH1.initialize(RecordCount, 'High 1');
        var fH2 = new Field();
        fH2.initialize(RecordCount, 'High 2');
        var fH3 = new Field();
        fH3.initialize(RecordCount, 'High 3');
        var fH4 = new Field();
        fH4.initialize(RecordCount, 'High 4');
        var fL1 = new Field();
        fL1.initialize(RecordCount, 'Low 1');
        var fL2 = new Field();
        fL2.initialize(RecordCount, 'Low 2');
        var fL3 = new Field();
        fL3.initialize(RecordCount, 'Low 3');
        var fL4 = new Field();
        fL4.initialize(RecordCount, 'Low 4');
        for (Record = 5; Record < RecordCount + 1; ++Record) {
            fH1.setValue(Record, fH.value(Record - 4));
            fL1.setValue(Record, fL.value(Record - 4));
            fH2.setValue(Record, fH.value(Record - 3));
            fL2.setValue(Record, fL.value(Record - 3));
            fH3.setValue(Record, fH.value(Record - 2));
            fL3.setValue(Record, fL.value(Record - 2));
            fH4.setValue(Record, fH.value(Record - 1));
            fL4.setValue(Record, fL.value(Record - 1));
        }
        for (Record = 1; Record < RecordCount + 1; ++Record) {
            fHiFractal.setValue(Record, (fH.value(Record) + fL.value(Record)) / 3);
        }
        rsFractals = MA.simpleMovingAverage(fHiFractal, Periods, 'Fractal High');
        fHiFractal = rsFractals.getField('Fractal High');
        rsFractals.removeField('Fractal High');
        rsFractals = MA.simpleMovingAverage(fLoFractal, Periods, 'Fractal Low');
        fLoFractal = rsFractals.getField('Fractal Low');
        rsFractals.removeField('Fractal Low');
        for (Record = 1; Record < RecordCount + 1; ++Record) {
            fHiFractal.setValue(Record, fH3.value(Record) + fHiFractal.value(Record));
            fLoFractal.setValue(Record, fL3.value(Record) - fLoFractal.value(Record));
        }
        for (Record = 2; Record < RecordCount + 1; ++Record) {
            if ((fH3.value(Record) > fH1.value(Record)) && (fH3.value(Record) > fH2.value(Record)) && (fH3.value(Record) >= fH4.value(Record)) && (fH3.value(Record) >= fH.value(Record))) {
                fFR.setValue(Record, fHiFractal.value(Record));
            }
            else {
                fFR.setValue(Record, 0);
            }
            if (!fFR.value(Record)) {
                if ((fL3.value(Record) < fL1.value(Record)) && (fL3.value(Record) < fL2.value(Record)) && (fL3.value(Record) <= fL4.value(Record)) && (fL3.value(Record) <= fL.value(Record))) {
                    fFR.setValue(Record, fLoFractal.value(Record));
                }
                else {
                    fFR.setValue(Record, 0);
                }
            }
            if (fHiFractal.value(Record) === fFR.value(Record)) {
                fHiFractal.setValue(Record, fH3.value(Record));
            }
            else {
                fHiFractal.setValue(Record, fHiFractal.value(Record - 1));
            }
            if (fLoFractal.value(Record) === fFR.value(Record)) {
                fLoFractal.setValue(Record, fL3.value(Record));
            }
            else {
                fLoFractal.setValue(Record, fLoFractal.value(Record - 1));
            }
        }
        for (Record = 2; Record < RecordCount + 1; ++Record) {
            if (!fLoFractal.value(Record)) {
                fLoFractal.setValue(Record, Const.nullValue);
            }
            if (!fHiFractal.value(Record)) {
                fHiFractal.setValue(Record, Const.nullValue);
            }
        }
        Results.addField(fHiFractal);
        Results.addField(fLoFractal);
        return Results;
    };
    Bands.prototype.primeNumberBands = function (HighPrice, LowPrice) {
        var Results = new Recordset();
        var RecordCount = HighPrice.recordCount;
        var Record = 0;
        var fTop = new Field();
        fTop.initialize(RecordCount, 'Prime Bands Top');
        var fBottom = new Field();
        fBottom.initialize(RecordCount, 'Prime Bands Bottom');
        var GN = new General();
        var N = 0;
        var Value = 0;
        var Top = 0, Bottom = 0;
        for (Record = 1; Record < RecordCount + 1; ++Record) {
            Value = LowPrice.value(Record);
            if (Value < 10) {
                Value = Value * 10;
            }
            for (N = Value; N > 1; --N) {
                if (GN.isPrime(N)) {
                    Bottom = N;
                    break;
                }
            }
            fBottom.setValue(Record, Bottom);
            Value = HighPrice.value(Record);
            if (Value < 10) {
                Value = Value * 10;
            }
            for (N = Value; N < Value * 2; ++N) {
                if (GN.isPrime(N)) {
                    Top = N;
                    break;
                }
            }
            fTop.setValue(Record, Top);
        }
        Results.addField(fTop);
        Results.addField(fBottom);
        return Results;
    };
    Bands.prototype.keltner = function (pOHLCV, Periods, Factor, MAType, Alias) {
        var Results = new Recordset();
        var recordCount = pOHLCV.getFieldByIndex(0).recordCount;
        var top = new Field();
        top.initialize(recordCount, Alias + ' Top');
        var bottom = new Field();
        bottom.initialize(recordCount, Alias + ' Bottom');
        var os = new Oscillator();
        var tr = os.trueRange(pOHLCV, 'atr').getField('atr');
        var ma = new MovingAverage();
        var atr = ma.simpleMovingAverage(tr, Periods, 'atr').getField('atr');
        var median = ma.movingAverageSwitch(pOHLCV.getField('Close'), Periods, MAType, Alias + ' Median').getField(Alias + ' Median');
        for (var record = 1; record < recordCount + 1; record++) {
            var shift = Factor * atr.value(record);
            top.setValue(record, median.value(record) + shift);
            bottom.setValue(record, median.value(record) - shift);
        }
        Results.addField(top);
        Results.addField(median);
        Results.addField(bottom);
        return Results;
    };
    Bands.prototype.ichimoku = function (pOHLCV, ConversionLinePeriods, BaseLinePeriods, LoggingSpan2Periods) {
        var Results = new Recordset(), recordCount = pOHLCV.getFieldByIndex(0).recordCount, tenkanSen = new Field(), kijunSen = new Field(), chikouSpan = new Field(), senkouSpanB = new Field(), senkouSpanA = new Field(), fH = pOHLCV.getField('High'), fL = pOHLCV.getField('Low'), fC = pOHLCV.getField('Close');
        tenkanSen.initialize(recordCount, "Ichimoku Tenkan Sen");
        kijunSen.initialize(recordCount, "Ichimoku Kijun Sen");
        chikouSpan.initialize(recordCount, "Ichimoku Chikou Span");
        senkouSpanB.initialize(recordCount, "Ichimoku Senkou Span B");
        senkouSpanA.initialize(recordCount, "Ichimoku Senkou Span A");
        var parameters = {
            tenkanSen: ConversionLinePeriods,
            kijunSen: BaseLinePeriods,
            senkouSpanB: LoggingSpan2Periods
        };
        for (var record = recordCount + 1; record >= 0; record--) {
            var min = fL.value(record);
            var max = fH.value(record);
            var currentParameters = {
                chikouSpan: fC.value(record),
                tenkanSen: null,
                kijunSen: null,
                senkouSpanB: null,
                senkouSpanA: null
            };
            for (var i = 0; i < parameters.senkouSpanB && record - i >= 0; i++) {
                var position = i + 1;
                min = Math.min(min, fL.value(record - i));
                max = Math.max(max, fH.value(record - i));
                currentParameters.tenkanSen = position === parameters.tenkanSen ? (min + max) / 2 : currentParameters.tenkanSen;
                currentParameters.kijunSen = position === parameters.kijunSen ? (min + max) / 2 : currentParameters.kijunSen;
                currentParameters.senkouSpanB = position === parameters.senkouSpanB ? (min + max) / 2 : currentParameters.senkouSpanB;
            }
            currentParameters.senkouSpanA = currentParameters.tenkanSen !== null && currentParameters.kijunSen !== null
                ? (currentParameters.tenkanSen + currentParameters.kijunSen) / 2
                : null;
            tenkanSen.setValue(record, currentParameters.tenkanSen);
            kijunSen.setValue(record, currentParameters.kijunSen);
            chikouSpan.setValue(record, currentParameters.chikouSpan);
            senkouSpanB.setValue(record, currentParameters.senkouSpanB);
            senkouSpanA.setValue(record, currentParameters.senkouSpanA);
        }
        Results.addField(tenkanSen);
        Results.addField(kijunSen);
        Results.addField(chikouSpan);
        Results.addField(senkouSpanB);
        Results.addField(senkouSpanA);
        return Results;
    };
    return Bands;
}());
export { Bands };
//# sourceMappingURL=Bands.js.map