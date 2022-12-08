import { Field } from "./Field";
import { Recordset } from "./Recordset";
import { MovingAverage } from "./MovingAverage";
var General = (function () {
    function General() {
    }
    General.prototype.highMinusLow = function (pOHLCV, Alias) {
        var Field1;
        var Results = new Recordset();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) - pOHLCV.getField('Low').value(Record));
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.medianPrice = function (pOHLCV, Alias) {
        var Field1;
        var Results = new Recordset();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) + pOHLCV.getField('Low').value(Record)) / 2;
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.typicalPrice = function (pOHLCV, Alias) {
        var Field1;
        var Results = new Recordset();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) + pOHLCV.getField('Low').value(Record) + pOHLCV.getField('Close').value(Record)) / 3;
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.weightedClose = function (pOHLCV, Alias) {
        var Field1;
        var Results = new Recordset();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) + pOHLCV.getField('Low').value(Record) + (pOHLCV.getField('Close').value(Record) * 2)) / 4;
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.volumeROC = function (Volume, Periods, Alias) {
        var Field1;
        var Results = new Recordset();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        var Start = 0;
        var PrevVolume = 0;
        RecordCount = Volume.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = Periods + 1;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            PrevVolume = Volume.value(nav - Periods);
            if (!!PrevVolume) {
                Value = ((Volume.value(nav) - PrevVolume) / PrevVolume) * 100;
            }
            Field1.setValue(Record, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.priceROC = function (pSource, Periods, Alias) {
        var Field1;
        var Results = new Recordset();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        var Start = 0;
        var PrevPrice = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = Periods + 1;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            PrevPrice = pSource.value(nav - Periods);
            Value = ((pSource.value(nav) - PrevPrice) / PrevPrice) * 100;
            Field1.setValue(Record, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.correlationAnalysis = function (pSource1, pSource2) {
        var Record = 0;
        var RecordCount = 0;
        var Total = 0;
        var A = 0;
        var B = 0;
        RecordCount = pSource1.recordCount;
        for (Record = 2; Record < RecordCount + 1; Record++) {
            A = (pSource1.value(Record) - pSource1.value(Record - 1));
            B = (pSource2.value(Record) - pSource2.value(Record - 1));
            if (A < 0) {
                A = -1 * A;
            }
            if (B < 0) {
                B = -1 * B;
            }
            Total += (A * B);
        }
        Total = Total / (RecordCount - 2);
        return 1 - Total;
    };
    General.prototype.standardDeviation = function (pSource, Periods, StandardDeviations, MAType, Alias) {
        var Results = null;
        var MA = new MovingAverage();
        var Field1;
        var Period = 0;
        var RecordCount = 0;
        var Record = 0;
        var Start = 0;
        var Sum = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Results = MA.movingAverageSwitch(pSource, Periods, MAType, 'Temp');
        Start = Periods + 1;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Sum = 0;
            Value = Results.value('Temp', nav);
            for (Period = 1; Period < Periods + 1; Period++) {
                Sum += (pSource.value(nav) - Value) * (pSource.value(nav) - Value);
                nav--;
            }
            nav += Periods;
            Value = StandardDeviations * Math.sqrt(Sum / Periods);
            Field1.setValue(nav, Value);
            nav++;
        }
        if (Results != null) {
            Results.addField(Field1);
        }
        Results.removeField('Temp');
        return Results;
    };
    General.prototype.HHV = function (High, Periods, Alias) {
        var Results = new Recordset();
        var MA = new MovingAverage();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Max = 0;
        RecordCount = High.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = Periods; Record <= RecordCount; Record++) {
            Max = High.value(Record);
            for (var N = Record - 1; N > Record - Periods; N--) {
                if (High.value(N) > Max) {
                    Max = High.value(N);
                }
            }
            Field1.setValue(Record, Max);
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.LLV = function (Low, Periods, Alias) {
        var Results = new Recordset();
        var MA = new MovingAverage();
        var Field1;
        var RecordCount = 0;
        var Record = 0;
        var Min = 0;
        RecordCount = Low.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = Periods; Record <= RecordCount; Record++) {
            Min = Low.value(Record);
            for (var N = Record - 1; N > Record - Periods; N--) {
                if (Low.value(N) < Min) {
                    Min = Low.value(N);
                }
            }
            Field1.setValue(Record, Min);
        }
        Results.addField(Field1);
        return Results;
    };
    General.prototype.MAXV = function (Volume, Periods, Alias) {
        var Results = new Recordset();
        var HHV = this.HHV(Volume, Periods, Alias);
        Results.addField(HHV.getField(Alias));
        return Results;
    };
    General.prototype.isPrime = function (number) {
        var divisor = 0;
        var increment = 0;
        var maxDivisor = 0;
        if (number > 3) {
            if (!(number % 2)) {
                return false;
            }
            if (!(number % 3)) {
                return false;
            }
        }
        divisor = 5;
        increment = 2;
        maxDivisor = Math.sqrt(number) + 1;
        while (divisor <= maxDivisor) {
            if (!(number % divisor)) {
                return false;
            }
            divisor += increment;
            increment = 6 - increment;
        }
        return true;
    };
    General.prototype.logOfBase10 = function (Start, pSource) {
        var Logs = new Field();
        Logs.initialize(pSource.recordCount, 'LOGS');
        for (var i = 1; i < Start; i++) {
            Logs.setValue(i, Number.NaN);
        }
        for (var Record = Start; Record < pSource.recordCount + 1; Record++) {
            var Value = Math.log(pSource.value(Record) / pSource.value(Record - 1)) / Math.log(10);
            Logs.setValue(Record, Value);
        }
        return Logs;
    };
    General.prototype.sum = function (pSource, Periods) {
        var Field1 = new Field();
        Field1.initialize(pSource.recordCount, 'Sum');
        var sum = 0;
        for (var Record = 1; Record < pSource.recordCount + 1; Record++) {
            if (isNaN(pSource.value(Record)))
                continue;
            sum += pSource.value(Record);
            if (Record <= Periods + 1) {
                Field1.setValue(Record, Number.NaN);
            }
            else {
                if (!isNaN(pSource.value(Record - Periods - 1))) {
                    sum -= pSource.value(Record - Periods - 1);
                    Field1.setValue(Record, sum);
                }
            }
        }
        return Field1;
    };
    General.prototype.copyField = function (pSource) {
        var copyField = new Field();
        copyField.initialize(pSource.recordCount, 'Copy');
        for (var Record = 1; Record < pSource.recordCount + 1; Record++) {
            copyField.setValue(Record, pSource.value(Record));
        }
        return copyField;
    };
    General.prototype.ref = function (pSource, Periods) {
        Periods = -1 * Periods;
        var referencedField = new Field(), recordCount = pSource.recordCount;
        referencedField.initialize(recordCount, pSource.name);
        for (var i = recordCount + 1 + Math.min(Periods - 1, -1); i >= Math.max(0, Periods); i--) {
            referencedField.setValue(i, pSource.value(i - Periods));
        }
        if (Periods < 0) {
            for (var j = recordCount; j >= recordCount + 1 + Periods; j--) {
                referencedField.setValue(j, 0);
            }
        }
        else if (Periods <= recordCount) {
            for (var j = Periods - 1; j >= 0; j--) {
                referencedField.setValue(j, 0);
            }
        }
        return referencedField;
    };
    return General;
}());
export { General };
//# sourceMappingURL=General.js.map