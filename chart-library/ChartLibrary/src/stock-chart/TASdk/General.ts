/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Field} from "./Field";
import {Recordset} from "./Recordset";
import {MovingAverage} from "./MovingAverage";

export class General {

    highMinusLow(pOHLCV: Recordset, Alias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) - pOHLCV.getField('Low').value(Record));
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    }

    medianPrice(pOHLCV: Recordset, Alias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) + pOHLCV.getField('Low').value(Record)) / 2;
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    }

    typicalPrice(pOHLCV: Recordset, Alias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) + pOHLCV.getField('Low').value(Record) + pOHLCV.getField('Close').value(Record)) / 3;
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    }

    weightedClose(pOHLCV: Recordset, Alias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        for (Record = 1; Record < RecordCount + 1; Record++) {
            Value = (pOHLCV.getField('High').value(Record) + pOHLCV.getField('Low').value(Record) + (pOHLCV.getField('Close').value(Record) * 2)) / 4;
            Field1.setValue(Record, Value);
        }
        Results.addField(Field1);
        return Results;
    }

    volumeROC(Volume: Field, Periods: number, Alias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        let Start = 0;
        let PrevVolume = 0;
        RecordCount = Volume.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = Periods + 1;
        let nav = Start;
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
    }

    priceROC(pSource: Field, Periods: number, Alias: string): Recordset {
        let Field1: Field;
        let Results = new Recordset();
        let Record = 0;
        let RecordCount = 0;
        let Value = 0;
        let Start = 0;
        let PrevPrice = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Start = Periods + 1;
        let nav = Start;
        for (Record = Start; Record < RecordCount + 1; Record++) {
            PrevPrice = pSource.value(nav - Periods);
            Value = ((pSource.value(nav) - PrevPrice) / PrevPrice) * 100;
            Field1.setValue(Record, Value);
            nav++;
        }
        Results.addField(Field1);
        return Results;
    }

    correlationAnalysis(pSource1: Field, pSource2: Field) {
        let Record = 0;
        let RecordCount = 0;
        let Total = 0;
        let A = 0;
        let B = 0;
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
    }

    standardDeviation(pSource: Field, Periods: number, StandardDeviations: number, MAType: number, Alias: string): Recordset {
        let Results: Recordset = null;
        let MA = new MovingAverage();
        let Field1: Field;
        let Period = 0;
        let RecordCount = 0;
        let Record = 0;
        let Start = 0;
        let Sum = 0;
        let Value = 0;
        RecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);
        Results = MA.movingAverageSwitch(pSource, Periods, MAType, 'Temp');
        Start = Periods + 1;
        let nav = Start;
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
    }

    HHV(High: Field, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let MA = new MovingAverage();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Max = 0;
        RecordCount = High.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);

        for (Record = Periods; Record <= RecordCount; Record++) {
            Max = High.value(Record);
            for (let N = Record - 1; N > Record - Periods; N--) {
                if (High.value(N) > Max) {
                    Max = High.value(N);
                }
            }
            Field1.setValue(Record, Max);
        }

        Results.addField(Field1);
        return Results;
    }

    LLV(Low: Field, Periods: number, Alias: string): Recordset {
        let Results = new Recordset();
        let MA = new MovingAverage();
        let Field1: Field;
        let RecordCount = 0;
        let Record = 0;
        let Min = 0;
        RecordCount = Low.recordCount;
        Field1 = new Field();
        Field1.initialize(RecordCount, Alias);

        for (Record = Periods; Record <= RecordCount; Record++) {
            Min = Low.value(Record);
            for (let N = Record - 1; N > Record - Periods; N--) {
                if (Low.value(N) < Min) {
                    Min = Low.value(N);
                }
            }
            Field1.setValue(Record, Min);
        }
        Results.addField(Field1);
        return Results;
    }

    MAXV(Volume: Field, Periods: number, Alias: string): Recordset{
        let Results = new Recordset();
        let HHV: Recordset = this.HHV(Volume, Periods , Alias);
        Results.addField(HHV.getField(Alias));
        return Results;
    }

    isPrime(number: number): boolean {
        let divisor = 0;
        let increment = 0;
        let maxDivisor = 0;
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
    }

    logOfBase10(Start: number, pSource: Field): Field {
        let Logs = new Field();
        Logs.initialize(pSource.recordCount, 'LOGS');

        for (let i = 1; i < Start; i++) {
            Logs.setValue(i, Number.NaN);
        }

        for (let Record = Start; Record < pSource.recordCount + 1; Record++) {
            let Value = Math.log(pSource.value(Record) / pSource.value(Record - 1)) / Math.log(10);
            Logs.setValue(Record, Value);
        }
        return Logs;
    }

    sum(pSource: Field, Periods: number): Field {
        let Field1 = new Field();
        Field1.initialize(pSource.recordCount, 'Sum');

        let sum = 0;
        for (let Record = 1; Record < pSource.recordCount + 1; Record++) {
            if (isNaN(pSource.value(Record)))
                continue;

            sum += pSource.value(Record);
            if (Record <= Periods + 1) {
                Field1.setValue(Record, Number.NaN);
            } else {
                if (!isNaN(pSource.value(Record - Periods - 1))) {
                    sum -= pSource.value(Record - Periods - 1);
                    Field1.setValue(Record, sum);
                }
            }
        }

        return Field1;
    }

    copyField(pSource: Field): Field {
        let copyField = new Field();
        copyField.initialize(pSource.recordCount, 'Copy');
        for (let Record = 1; Record < pSource.recordCount + 1; Record++) {
            copyField.setValue(Record, pSource.value(Record));
        }
        return copyField;
    }

    //NK References a previous or subsequent element in a DATA ARRAY. A positive PERIOD references n periods in the future; a negative PERIOD references n periods ago.
    ref(pSource: Field, Periods: number): Field {
        //NK depends on Abu5 changes on tickerchart live (Match with metastock and tickerchartlive)
        Periods = -1 * Periods;

        let referencedField = new Field(),
            recordCount = pSource.recordCount;
        referencedField.initialize(recordCount, pSource.name);

        for (let i = recordCount + 1 + Math.min(Periods - 1, -1); i >= Math.max(0, Periods); i--) {
            referencedField.setValue(i, pSource.value(i - Periods));
        }
        if (Periods < 0) {
            for (let j = recordCount; j >= recordCount + 1 + Periods; j--) {
                referencedField.setValue(j, 0);
            }
        } else if (Periods <= recordCount) {
            for (let j = Periods - 1; j >= 0; j--) {
                referencedField.setValue(j, 0);
            }
        }

        return referencedField;
    }
}
