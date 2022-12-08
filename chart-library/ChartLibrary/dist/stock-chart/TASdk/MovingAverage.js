import { Recordset } from "./Recordset";
import { Field } from "./Field";
import { LinearRegression } from "./LinearRegression";
import { Const } from "./TASdk";
var MovingAverage = (function () {
    function MovingAverage() {
    }
    MovingAverage.prototype.simpleMovingAverage = function (pSource, iPeriods, sAlias) {
        var dAvg = 0;
        var iPeriod = 0;
        var Field1;
        var Results = new Recordset();
        var iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        var iStart = iPeriods + 1;
        var nav = iStart;
        for (var iRecord = iStart; iRecord < iRecordCount + 1; iRecord++) {
            dAvg = 0;
            for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
                dAvg += pSource.value(nav);
                nav--;
            }
            nav += iPeriods;
            dAvg /= iPeriods;
            Field1.setValue(nav, dAvg);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.exponentialMovingAverage = function (pSource, iPeriods, sAlias) {
        var dPrime = 0;
        var iRecord = 0;
        var Field1;
        var Results = new Recordset();
        var iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        var dExp = 2 / (iPeriods + 1);
        for (iRecord = 1; iRecord < iPeriods + 1; iRecord++) {
            dPrime += pSource.value(iRecord);
        }
        dPrime /= iPeriods;
        var dValue = (pSource.value(iRecord) * (1 - dExp)) + (dPrime * dExp);
        Field1.setValue(iPeriods, dValue);
        for (iRecord = iPeriods + 1; iRecord < iRecordCount + 1; iRecord++) {
            dValue = (Field1.value(iRecord - 1) * (1 - dExp)) + (pSource.value(iRecord) * dExp);
            Field1.setValue(iRecord, dValue);
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.doubleExponentialMovingAverage = function (pSource, iPeriods, sAlias) {
        var iRecord;
        var Field1;
        var Results = new Recordset();
        var iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        var dValue;
        var EMA = this.exponentialMovingAverage(pSource, iPeriods, 'EMA');
        var EMA2 = this.exponentialMovingAverage(EMA.getField('EMA'), iPeriods, 'EMA');
        for (iRecord = iPeriods + 1; iRecord < iRecordCount + 1; iRecord++) {
            dValue = 2 * EMA.value('EMA', iRecord) - EMA2.value('EMA', iRecord);
            Field1.setValue(iRecord, dValue);
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.tripleExponentialMovingAverage = function (pSource, iPeriods, sAlias) {
        var Results = new Recordset();
        var RS;
        var EMA1;
        var EMA2;
        var EMA3;
        var Field1 = new Field();
        var iRecordCount = pSource.recordCount;
        Field1.initialize(iRecordCount, sAlias);
        RS = this.exponentialMovingAverage(pSource, iPeriods, 'EMA1');
        EMA1 = RS.getField('EMA1');
        RS.removeField('EMA1');
        RS = this.exponentialMovingAverage(EMA1, iPeriods, 'EMA2');
        EMA2 = RS.getField('EMA2');
        RS.removeField('EMA2');
        RS = this.exponentialMovingAverage(EMA2, iPeriods, 'EMA3');
        EMA3 = RS.getField('EMA3');
        RS.removeField('EMA3');
        var dValue;
        for (var iRecord = iPeriods; iRecord < iRecordCount + 1; iRecord++) {
            dValue = (3 * EMA1.value(iRecord)) - (3 * EMA2.value(iRecord)) + EMA3.value(iRecord);
            Field1.setValue(iRecord, dValue);
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.hullMovingAverage = function (pSource, iPeriods, MAType, sAlias) {
        var Results = new Recordset();
        var Field1 = new Field();
        var RecordCount = pSource.recordCount;
        var Start = 0;
        var dValue = 0;
        var MA1 = this.movingAverageSwitch(pSource, Math.round(iPeriods / 2), MAType, "MA");
        var MA2 = this.movingAverageSwitch(pSource, iPeriods, MAType, "MA");
        Field1.initialize(RecordCount, "TEMP");
        Start = iPeriods + 1;
        for (var Record = Start; Record < RecordCount + 1; Record++) {
            dValue = (2 * MA1.value("MA", Record)) - MA2.value("MA", Record);
            Field1.setValue(Record, dValue);
        }
        var HMA = this.movingAverageSwitch(Field1, Math.round(Math.sqrt(iPeriods)), MAType, sAlias);
        Results.addField(HMA.getField(sAlias));
        return Results;
    };
    MovingAverage.prototype.timeSeriesMovingAverage = function (pSource, iPeriods, sAlias) {
        var LR = new LinearRegression();
        var Value = 0;
        var Field1;
        var RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, sAlias);
        var Results = LR.regression(pSource, iPeriods);
        for (var Record = 1; Record < RecordCount + 1; Record++) {
            Value = Results.value('Forecast', Record);
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.variableMovingAverage = function (pSource, iPeriods, sAlias) {
        var CMO = 0;
        var VMA = 0;
        var PrevVMA = 0;
        var Price = 0;
        var Field1;
        var Results;
        var RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, sAlias);
        Results = this.chandeMomentumOscillator(pSource, 9, 'CMO');
        var Start = 2;
        for (var Record = Start; Record < RecordCount + 1; Record++) {
            PrevVMA = Field1.value(Record - 1);
            CMO = Results.value('CMO', Record) / 100;
            Price = pSource.value(Record);
            if (CMO < 0) {
                CMO = -1 * CMO;
            }
            VMA = (CMO * Price) + (1 - CMO) * PrevVMA;
            Field1.setValue(Record, VMA);
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.triangularMovingAverage = function (pSource, Periods, Alias) {
        var Record = 0;
        var RecordCount = 0;
        var Start = 0;
        var Period = 0;
        var MA1 = 0;
        var MA2 = 0;
        var Avg = 0;
        var Field1;
        var Field2;
        var Results = new Recordset();
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, 'MA1');
        Field2 = new Field();
        Field2.initialize(RecordCount, Alias);
        if ((Periods % 2) > 0) {
            MA1 = parseInt((Periods / 2).toString()) + 1;
            MA2 = MA1;
        }
        else {
            MA1 = Periods / 2;
            MA2 = MA1 + 1;
        }
        Start = Periods + 1;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Avg = 0;
            for (Period = 1; Period < MA1 + 1; Period++) {
                Avg += pSource.value(nav);
                nav--;
            }
            nav += parseInt(MA1.toString());
            Avg = Avg / MA1;
            Field1.setValue(nav, Avg);
            nav++;
        }
        nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Avg = 0;
            for (Period = 1; Period < MA2 + 1; Period++) {
                Avg += Field1.value(nav);
                nav--;
            }
            nav += parseInt(MA2.toString());
            Avg = Avg / MA2;
            Field2.setValue(nav, Avg);
            nav++;
        }
        Results.addField(Field2);
        return Results;
    };
    MovingAverage.prototype.weightedMovingAverage = function (pSource, Periods, Alias) {
        var Total = 0;
        var Weight = 0;
        var Period = 0;
        var Start = 0;
        var Record = 0;
        var RecordCount = 0;
        var Field1;
        var Results = new Recordset();
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Period = 1; Period < Periods + 1; Period++) {
            Weight += Period;
        }
        Start = Periods + 1;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            Total = 0;
            for (Period = Periods; Period > 0; Period--) {
                Total += Period * pSource.value(nav);
                nav--;
            }
            nav += Periods;
            Total = Total / Weight;
            Field1.setValue(nav, Total);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.VIDYA = function (pSource, Periods, R2Scale, Alias) {
        var Record = 0;
        var RecordCount = 0;
        var Start = 0;
        var R2Scaled = 0;
        var PreviousValue = 0;
        var Field1;
        var LR = new LinearRegression();
        var Results;
        R2Scale /= 100;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Results = LR.regression(pSource, Periods);
        Start = 2;
        var nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            PreviousValue = pSource.value(nav - 1);
            R2Scaled = Results.value('RSquared', nav) * R2Scale;
            Field1.setValue(nav, R2Scaled * pSource.value(nav) + (1 - R2Scaled) * PreviousValue);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.wellesWilderSmoothing = function (pSource, Periods, Alias) {
        var Field1;
        var Results = new Recordset();
        var Record = 0;
        var RecordCount = 0;
        var Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 2; Record < RecordCount + 1; ++Record) {
            Value = Field1.value(Record - 1) + 1 / Periods * (pSource.value(Record) - Field1.value(Record - 1));
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.dynamicMovingAverage = function (pSource, Periods, Percentage, Alias) {
        var Field1 = new Field();
        Field1.initialize(pSource.recordCount, Alias);
        var Result = new Recordset();
        var Sum = 0;
        for (var i = 2; i < Periods + 2; i++) {
            Sum += pSource.value(i);
        }
        if (Periods > 0 && Periods <= pSource.recordCount)
            Field1.setValue(Periods - 1, Sum / Periods);
        for (var i = Periods + 1; i <= pSource.recordCount; i++) {
            if (i > 0) {
                if (pSource.value(i) !== 0) {
                    if (Field1.value(i - 1) != 0) {
                        var val = (pSource.value(i) * Percentage) + Field1.value(i - 1) * (1 - Percentage);
                        Field1.setValue(i, val);
                    }
                    else {
                        Field1.setValue(i, pSource.value(i));
                    }
                }
                else {
                    Field1.setValue(i, 0);
                }
            }
            else {
                Field1.setValue(i, pSource.value(i));
            }
        }
        Result.addField(Field1);
        return Result;
    };
    MovingAverage.prototype.movingAverageSwitch = function (field, periods, maType, alias) {
        var ret = null;
        switch (maType) {
            case 0:
                ret = this.simpleMovingAverage(field, periods, alias);
                break;
            case 1:
                ret = this.exponentialMovingAverage(field, periods, alias);
                break;
            case 2:
                ret = this.timeSeriesMovingAverage(field, periods, alias);
                break;
            case 3:
                ret = this.triangularMovingAverage(field, periods, alias);
                break;
            case 4:
                ret = this.variableMovingAverage(field, periods, alias);
                break;
            case 7:
                ret = this.weightedMovingAverage(field, periods, alias);
                break;
            case 5:
                ret = this.VIDYA(field, periods, 0.65, alias);
                break;
            case 6:
                ret = this.wellesWilderSmoothing(field, periods, alias);
                break;
            case 8:
                ret = this.dynamicMovingAverage(field, periods, 1 / periods, alias);
            case 9:
                ret = this.doubleExponentialMovingAverage(field, periods, alias);
        }
        return ret;
    };
    MovingAverage.prototype.chandeMomentumOscillator = function (pSource, iPeriods, sAlias) {
        var Field1;
        var Results = new Recordset();
        var iRecord = 0;
        var iRecordCount = 0;
        var iPeriod = 0;
        var dToday = 0;
        var dYesterday = 0;
        var dUpSum = 0;
        var dDownSum = 0;
        var dValue = 0;
        iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        var nav = 1;
        for (iRecord = iPeriods + 2; iRecord < iRecordCount + 2; iRecord++) {
            nav = iRecord - iPeriods;
            dUpSum = 0;
            dDownSum = 0;
            for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
                dYesterday = pSource.value(nav - 1);
                dToday = pSource.value(nav);
                if (dToday > dYesterday) {
                    dUpSum += (dToday - dYesterday);
                }
                else if (dToday < dYesterday) {
                    dDownSum += (dYesterday - dToday);
                }
                nav++;
            }
            if (!!(dUpSum + dDownSum)) {
                dValue = 100 * (dUpSum - dDownSum) / (dUpSum + dDownSum);
            }
            else {
                dValue = Const.nullValue;
            }
            Field1.setValue(nav - 1, dValue);
        }
        Results.addField(Field1);
        return Results;
    };
    MovingAverage.prototype.volumeWeightedAveragePrice = function (pOHLCV, pDate, iAnchor, sAlias) {
        var Results = new Recordset();
        var Field1 = new Field();
        Field1.initialize(pOHLCV.getField('High').recordCount, sAlias);
        var iRecordCount = pOHLCV.getField('High').recordCount;
        var sumVolume = 0;
        var sumTpriceVolume = 0;
        var lastDate = moment("1900-01-01");
        var curDate = moment("1900-01-01");
        var iRecord = 0;
        for (iRecord = 1; iRecord < iRecordCount + 1; iRecord++) {
            switch (iAnchor) {
                case 1:
                    curDate = moment(pDate.value(iRecord)).startOf('day');
                    if (curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 2:
                    curDate = moment(pDate.value(iRecord)).startOf('week');
                    if (curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 3:
                    curDate = moment(pDate.value(iRecord)).startOf('month');
                    if (curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 4:
                    curDate = moment(pDate.value(iRecord)).startOf('year');
                    if (curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 5:
                    var curMoment = moment(pDate.value(iRecord));
                    curMoment = curMoment.startOf('year');
                    curDate = curMoment.subtract(curMoment.year() % 10, "years");
                    if (curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
            }
            var high = pOHLCV.getField('High').value(iRecord);
            var low = pOHLCV.getField('Low').value(iRecord);
            var close_1 = pOHLCV.getField('Close').value(iRecord);
            var volume = pOHLCV.getField('Volume').value(iRecord);
            var tPrice = (high + low + close_1) / 3;
            var tPriceVolume = tPrice * volume;
            sumVolume += volume;
            sumTpriceVolume += tPriceVolume;
            Field1.setValue(iRecord, sumTpriceVolume / sumVolume);
        }
        Results.addField(Field1);
        return Results;
    };
    return MovingAverage;
}());
export { MovingAverage };
//# sourceMappingURL=MovingAverage.js.map