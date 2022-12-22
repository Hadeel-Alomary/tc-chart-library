import {Field} from './Field';
import {Recordset} from "./Recordset";

export class SupportAndResistance {

    zigZag(maxField: Field, minField: Field, periods: number, Alias: string): Recordset {
        let recordSet: Recordset = new Recordset();
        let zigZagField: Field = new Field();
        zigZagField.initialize(minField.recordCount, Alias);

        let min: number = Infinity;
        let max: number = -Infinity;
        let minIndex: number = -1;
        let maxIndex: number = -1;

        let zigZagDirection: number = 3;

        zigZagField.setValue(1, minField.value(1));
        zigZagField.setValue(minField.recordCount, minField.value(minField.recordCount));
        for (let i = 1; i < minField.recordCount + 1; i++) {
            let maxValue = maxField.value(i);
            let minValue = minField.value(i);

            if (maxValue !== 0 && minValue !== 0) {

                if (maxValue > max) {
                    max = maxValue;
                    maxIndex = i;
                }

                if (minValue < min) {
                    min = minValue;
                    minIndex = i;
                }

                let shouldGoDown = i > 1 && zigZagDirection !== 1 && i != minIndex && (maxValue / min > (1 + periods / 100) || i == minField.recordCount);
                let shouldGoUp = i > 1 && zigZagDirection !== 2 && i != maxIndex && (minValue / max < (1 - periods / 100) || i == maxField.recordCount);

                if (shouldGoDown) {
                    min = Infinity;
                    max = -Infinity;
                    zigZagDirection = 1;
                    zigZagField.setValue(minIndex, minField.value(minIndex));

                    if (i == minField.recordCount) {
                        zigZagField.setValue(i, maxValue);
                    } else {
                        i = minIndex;
                    }

                } else if (shouldGoUp) {
                    min = Infinity;
                    max = -Infinity;
                    zigZagDirection = 2;
                    zigZagField.setValue(maxIndex, maxField.value(maxIndex));

                    if (i == maxField.recordCount) {
                        zigZagField.setValue(i, minValue);
                    } else {
                        i = maxIndex;
                    }
                }
            }
        }

        recordSet.addField(zigZagField);
        return recordSet;
    }

    zigZagLabel(maxField: Field, minField: Field, Periods: number, Alias: string): Recordset {
        return this.zigZag(maxField, minField, Periods, Alias);
    }
}