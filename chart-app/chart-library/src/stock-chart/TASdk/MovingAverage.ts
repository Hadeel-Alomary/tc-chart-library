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
import {LinearRegression} from "./LinearRegression";
import {Oscillator} from "./Oscillator";
import {Const} from "./TASdk";

export class MovingAverage {

    simpleMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset {
        let dAvg = 0;
        let iPeriod = 0;
        let Field1: Field;
        let Results = new Recordset();
        let iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        let iStart = iPeriods + 1;
        let nav = iStart;
        for (let iRecord = iStart; iRecord < iRecordCount + 1; iRecord++) {
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
    }

    exponentialMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset {
        let dPrime = 0;
        let iRecord: number = 0;
        let Field1: Field;
        let Results = new Recordset();
        let iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        let dExp = 2 / (iPeriods + 1);
        for (iRecord = 1; iRecord < iPeriods + 1; iRecord++) {
            dPrime += pSource.value(iRecord);
        }
        dPrime /= iPeriods;
        let dValue = (pSource.value(iRecord) * (1 - dExp)) + (dPrime * dExp);
        Field1.setValue(iPeriods, dValue);
        for (iRecord = iPeriods + 1; iRecord < iRecordCount + 1; iRecord++) {
            dValue = (Field1.value(iRecord - 1) * (1 - dExp)) + (pSource.value(iRecord) * dExp);
            Field1.setValue(iRecord, dValue);
        }
        Results.addField(Field1);
        return Results;
    }

    doubleExponentialMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset {
        let iRecord: number;
        let Field1: Field;
        let Results = new Recordset();
        let iRecordCount = pSource.recordCount;

        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);

        let dValue: number;
        let EMA: Recordset = this.exponentialMovingAverage(pSource, iPeriods, 'EMA');
        let EMA2: Recordset = this.exponentialMovingAverage(EMA.getField('EMA'), iPeriods, 'EMA');

        for (iRecord = iPeriods + 1; iRecord < iRecordCount + 1; iRecord++) {
            dValue = 2*EMA.value('EMA', iRecord) - EMA2.value('EMA', iRecord);
            Field1.setValue(iRecord, dValue);
        }
        Results.addField(Field1);
        return Results;
    }

    tripleExponentialMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset {
        let Results = new Recordset();
        let RS: Recordset;
        let EMA1: Field;
        let EMA2: Field;
        let EMA3: Field;
        let Field1: Field = new Field();
        let iRecordCount = pSource.recordCount;
        Field1.initialize(iRecordCount , sAlias);

        RS = this.exponentialMovingAverage(pSource , iPeriods , 'EMA1');
        EMA1 = RS.getField('EMA1');
        RS.removeField('EMA1');
        RS = this.exponentialMovingAverage(EMA1 , iPeriods , 'EMA2');
        EMA2 = RS.getField('EMA2');
        RS.removeField('EMA2');
        RS = this.exponentialMovingAverage(EMA2 , iPeriods , 'EMA3');
        EMA3 = RS.getField('EMA3');
        RS.removeField('EMA3');

        let dValue: number;
        for (let iRecord = iPeriods; iRecord < iRecordCount + 1; iRecord++) {
            dValue = (3 * EMA1.value(iRecord)) - (3 * EMA2.value(iRecord)) + EMA3.value(iRecord);
            Field1.setValue(iRecord , dValue);
        }
        Results.addField(Field1);
        return Results;
    }

    hullMovingAverage(pSource: Field , iPeriods: number , MAType: number, sAlias: string ): Recordset {
        let Results = new Recordset();
        let Field1: Field = new Field();
        let RecordCount = pSource.recordCount;
        let Start: number = 0;
        let dValue: number = 0;

        let MA1: Recordset = this.movingAverageSwitch(pSource , Math.round(iPeriods / 2) , MAType , "MA");
        let MA2: Recordset = this.movingAverageSwitch(pSource , iPeriods , MAType , "MA");

        Field1.initialize(RecordCount , "TEMP");
        Start = iPeriods + 1;
        for (let Record = Start; Record < RecordCount + 1 ; Record++) {
            dValue = (2 * MA1.value("MA" , Record)) - MA2.value("MA" , Record);
            Field1.setValue(Record,dValue);
        }
        let HMA: Recordset = this.movingAverageSwitch(Field1, Math.round(Math.sqrt(iPeriods)), MAType, sAlias);
        Results.addField(HMA.getField(sAlias));
        return Results;
    }

    timeSeriesMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset {
        let LR = new LinearRegression();
        let Value = 0;
        let Field1: Field;
        let RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, sAlias);
        let Results = LR.regression(pSource, iPeriods);
        for (let Record = 1; Record < RecordCount + 1; Record++) {
            Value = Results.value('Forecast', Record);
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    }

    variableMovingAverage(pSource: Field, iPeriods: number, sAlias: string): Recordset {
        let CMO = 0;
        let VMA = 0;
        let PrevVMA = 0;
        let Price = 0;
        let Field1: Field;
        let Results: Recordset;
        let RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, sAlias);
        Results = this.chandeMomentumOscillator(pSource, 9, 'CMO');
        let Start = 2;
        for (let Record = Start; Record < RecordCount + 1; Record++) {
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
    }

    triangularMovingAverage(pSource: Field, Periods: number, Alias: string): Recordset {
        let Record = 0;
        let RecordCount = 0;
        let Start = 0;
        let Period = 0;
        let MA1 = 0;
        let MA2 = 0;
        let Avg = 0;
        let Field1: Field;
        let Field2: Field;
        let Results = new Recordset();
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
        let nav = Start;
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
    }

    weightedMovingAverage(pSource: Field, Periods: number, Alias: string): Recordset {
        let Total = 0;
        let Weight = 0;
        let Period = 0;
        let Start = 0;
        let Record = 0;
        let RecordCount = 0;
        let Field1: Field;
        let Results = new Recordset();
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Period = 1; Period < Periods + 1; Period++) {
            Weight += Period;
        }
        Start = Periods + 1;
        let nav = Start;
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
    }

    VIDYA(pSource: Field, Periods: number, R2Scale: number, Alias: string): Recordset {
        let Record = 0;
        let RecordCount = 0;
        let Start = 0;
        let R2Scaled = 0;
        let PreviousValue = 0;
        let Field1: Field;
        let LR = new LinearRegression();
        let Results: Recordset;

        R2Scale /= 100;

        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Results = LR.regression(pSource, Periods);
        Start = 2;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            PreviousValue = pSource.value(nav - 1);
            R2Scaled = Results.value('RSquared', nav) * R2Scale;
            Field1.setValue(nav, R2Scaled * pSource.value(nav) + (1 - R2Scaled) * PreviousValue);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    wellesWilderSmoothing(pSource: Field, Periods: number, Alias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 2; Record < RecordCount + 1; ++Record) {
            Value = Field1.value(Record - 1) + 1 / Periods * (pSource.value(Record) - Field1.value(Record - 1));
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    }

    //NK TickerChart Live is the source of this formula, Percentage must be less than one and more than zero
    dynamicMovingAverage(pSource: Field, Periods: number, Percentage: number, Alias: string): Recordset {
        let Field1: Field = new Field();
        Field1.initialize(pSource.recordCount, Alias);

        let Result: Recordset = new Recordset();

        let Sum: number = 0;
        for (let i = 2; i < Periods + 2; i++) {
            Sum += pSource.value(i);
        }

        if (Periods > 0 && Periods <= pSource.recordCount)
            Field1.setValue(Periods - 1, Sum / Periods);

        for (let i = Periods + 1; i <= pSource.recordCount; i++) {
            if (i > 0) {
                if (pSource.value(i) !== 0) {
                    if (Field1.value(i - 1) != 0) {
                        let val = (pSource.value(i) * Percentage) + Field1.value(i - 1) * (1 - Percentage);
                        Field1.setValue(i, val);
                    } else {
                        Field1.setValue(i, pSource.value(i));
                    }
                } else {
                    Field1.setValue(i, 0);
                }
            } else {
                Field1.setValue(i, pSource.value(i));
            }
        }
        Result.addField(Field1);
        return Result;
    }

    movingAverageSwitch(field: Field, periods: number, maType: number, alias: string): Recordset {
        let ret: Recordset = null;
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
    }

    //NK i moved this indicator here to break the circular dependencies between moving average and oscillator
    chandeMomentumOscillator(pSource: Field, iPeriods: number, sAlias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let iRecord = 0;
        let iRecordCount = 0;
        let iPeriod = 0;
        let dToday = 0;
        let dYesterday = 0;
        let dUpSum = 0;
        let dDownSum = 0;
        let dValue = 0;
        iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        let nav = 1;
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
    }

    volumeWeightedAveragePrice(pOHLCV: Recordset, pDate: Field, iAnchor: number, sAlias: string): Recordset {
        let Results = new Recordset();

        let Field1: Field = new Field();
        Field1.initialize(pOHLCV.getField('High').recordCount, sAlias);

        let iRecordCount: number = pOHLCV.getField('High').recordCount;

        let sumVolume: number = 0;
        let sumTpriceVolume: number = 0;

        let lastDate = moment("1900-01-01");
        let curDate = moment("1900-01-01");

        let iRecord: number = 0;
        for (iRecord = 1; iRecord < iRecordCount + 1; iRecord++) {

            switch (iAnchor) {
                case 1:
                    curDate = moment(pDate.value(iRecord)).startOf('day');
                    if(curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 2:
                    curDate = moment(pDate.value(iRecord)).startOf('week');
                    if(curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 3:
                    curDate = moment(pDate.value(iRecord)).startOf('month');
                    if(curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 4:
                    curDate = moment(pDate.value(iRecord)).startOf('year');
                    if(curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
                case 5:
                    let curMoment = moment(pDate.value(iRecord));
                    curMoment = curMoment.startOf('year');
                    curDate = curMoment.subtract(curMoment.year()%10,"years");
                    if(curDate > lastDate) {
                        sumVolume = 0;
                        sumTpriceVolume = 0;
                        lastDate = curDate;
                    }
                    break;
            }

            let high:number = pOHLCV.getField('High').value(iRecord);
            let low:number = pOHLCV.getField('Low').value(iRecord);
            let close:number = pOHLCV.getField('Close').value(iRecord);
            let volume: number = pOHLCV.getField('Volume').value(iRecord);

            let tPrice: number = (high+low+close)/3;
            let tPriceVolume: number = tPrice*volume;

            sumVolume += volume;
            sumTpriceVolume += tPriceVolume;

            Field1.setValue(iRecord, sumTpriceVolume/sumVolume);
        }
        Results.addField(Field1);
        return Results;
    }
}
