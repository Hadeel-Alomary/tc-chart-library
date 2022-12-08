import { Field } from './Field';
import { Recordset } from "./Recordset";
var SupportAndResistance = (function () {
    function SupportAndResistance() {
    }
    SupportAndResistance.prototype.zigZag = function (maxField, minField, periods, Alias) {
        var recordSet = new Recordset();
        var zigZagField = new Field();
        zigZagField.initialize(minField.recordCount, Alias);
        var min = Infinity;
        var max = -Infinity;
        var minIndex = -1;
        var maxIndex = -1;
        var zigZagDirection = 3;
        zigZagField.setValue(1, minField.value(1));
        zigZagField.setValue(minField.recordCount, minField.value(minField.recordCount));
        for (var i = 1; i < minField.recordCount + 1; i++) {
            var maxValue = maxField.value(i);
            var minValue = minField.value(i);
            if (maxValue !== 0 && minValue !== 0) {
                if (maxValue > max) {
                    max = maxValue;
                    maxIndex = i;
                }
                if (minValue < min) {
                    min = minValue;
                    minIndex = i;
                }
                var shouldGoDown = i > 1 && zigZagDirection !== 1 && i != minIndex && (maxValue / min > (1 + periods / 100) || i == minField.recordCount);
                var shouldGoUp = i > 1 && zigZagDirection !== 2 && i != maxIndex && (minValue / max < (1 - periods / 100) || i == maxField.recordCount);
                if (shouldGoDown) {
                    min = Infinity;
                    max = -Infinity;
                    zigZagDirection = 1;
                    zigZagField.setValue(minIndex, minField.value(minIndex));
                    if (i == minField.recordCount) {
                        zigZagField.setValue(i, maxValue);
                    }
                    else {
                        i = minIndex;
                    }
                }
                else if (shouldGoUp) {
                    min = Infinity;
                    max = -Infinity;
                    zigZagDirection = 2;
                    zigZagField.setValue(maxIndex, maxField.value(maxIndex));
                    if (i == maxField.recordCount) {
                        zigZagField.setValue(i, minValue);
                    }
                    else {
                        i = maxIndex;
                    }
                }
            }
        }
        recordSet.addField(zigZagField);
        return recordSet;
    };
    SupportAndResistance.prototype.zigZagLabel = function (maxField, minField, Periods, Alias) {
        return this.zigZag(maxField, minField, Periods, Alias);
    };
    return SupportAndResistance;
}());
export { SupportAndResistance };
//# sourceMappingURL=SupportAndResistance.js.map