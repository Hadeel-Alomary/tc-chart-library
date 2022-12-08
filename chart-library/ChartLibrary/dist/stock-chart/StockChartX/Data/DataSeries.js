import { Field } from "../../TASdk/Field";
import { Const } from "../../TASdk/TASdk";
export var DataSeriesSuffix = {
    DATE: ".date",
    OPEN: ".open",
    HIGH: ".high",
    LOW: ".low",
    CLOSE: ".close",
    VOLUME: ".volume",
    HEIKIN_ASHI: '.heikin_ashi',
    RENKO: '.renko',
    LINE_BREAK: '.line_break',
    POINT_AND_FIGURE: '.point_and_figure',
    KAGI: 'kagi'
};
Object.freeze(DataSeriesSuffix);
var DataSeries = (function () {
    function DataSeries(config) {
        var name, values;
        if (!config) {
        }
        else if (typeof config === 'string') {
            name = config;
        }
        else if (typeof config === 'object') {
            name = config.name;
            values = config.values;
        }
        else {
            throw new TypeError('Unknown config.');
        }
        this.name = name;
        this.values = values;
    }
    Object.defineProperty(DataSeries.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value || '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSeries.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (value) {
            this._values = value || [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSeries.prototype, "length", {
        get: function () {
            return this._values.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSeries.prototype, "nameSuffix", {
        get: function () {
            var name = this.name, idx = name.lastIndexOf(".");
            return idx >= 0 ? name.substr(idx) : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSeries.prototype, "isValueDataSeries", {
        get: function () {
            return this.nameSuffix !== DataSeriesSuffix.DATE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSeries.prototype, "isDateDataSeries", {
        get: function () {
            return this.nameSuffix === DataSeriesSuffix.DATE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSeries.prototype, "firstValue", {
        get: function () {
            return this._values[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSeries.prototype, "lastValue", {
        get: function () {
            var values = this._values;
            return values[values.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    DataSeries.fromField = function (field, startIndex) {
        var series = new DataSeries();
        series.fromField(field, startIndex);
        return series;
    };
    DataSeries.prototype.valueAtIndex = function (index, value) {
        var values = this._values, oldValue = values[index];
        if (value !== undefined)
            values[index] = value;
        return oldValue;
    };
    DataSeries.prototype.itemsCountBetweenValues = function (startValue, endValue) {
        var count = 0;
        for (var _i = 0, _a = this._values; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value != null && value >= startValue && value <= endValue)
                count++;
        }
        return count;
    };
    DataSeries.prototype.add = function (value) {
        var values = this._values;
        if (Array.isArray(value))
            this._values = values.concat(value);
        else
            values.push(value);
    };
    DataSeries.prototype.updateLast = function (value) {
        var values = this._values;
        if (values.length > 0)
            values[values.length - 1] = value;
    };
    DataSeries.prototype.clear = function () {
        this._values.length = 0;
    };
    DataSeries.prototype.trim = function (maxLength) {
        var values = this._values, overhead = values.length - maxLength;
        if (overhead > 0)
            values.splice(0, overhead);
        else
            overhead = 0;
        return overhead;
    };
    DataSeries.prototype.minMaxValues = function (startIndex, count) {
        var values = this._values;
        if (startIndex == null || startIndex < 0)
            startIndex = 0;
        if (count == null)
            count = values.length - startIndex;
        var endIndex = Math.min(startIndex + count - 1, values.length - 1), value, result = {
            min: Infinity,
            max: -Infinity
        };
        for (var i = startIndex; i <= endIndex; i++) {
            value = values[i];
            if (value == null)
                continue;
            if (value < result.min)
                result.min = value;
            if (value > result.max)
                result.max = value;
        }
        return result;
    };
    DataSeries.prototype.floorIndex = function (searchValue) {
        var index = this.binaryIndexOf(searchValue);
        if (index === 0) {
            var values = this._values;
            if (values.length === 0)
                return -1;
            if (values[0] > searchValue) {
                return -1;
            }
        }
        return index >= 0 ? index : ~index;
    };
    DataSeries.prototype.ceilIndex = function (searchValue) {
        var index = this.binaryIndexOf(searchValue);
        return index >= 0 ? index : (~index) + 1;
    };
    DataSeries.prototype.binaryIndexOf = function (searchElement) {
        var values = this._values, minIndex = 0, maxIndex = values.length - 1, currentIndex, currentElement, resultIndex;
        while (minIndex <= maxIndex) {
            resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = values[currentIndex];
            if (currentElement < searchElement) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > searchElement) {
                maxIndex = currentIndex - 1;
            }
            else {
                return currentIndex;
            }
        }
        return ~maxIndex;
    };
    DataSeries.prototype.leftNearestVisibleValueIndex = function (index) {
        var values = this._values;
        index = Math.min(index, values.length - 1);
        if (index < 0) {
            return 0;
        }
        for (var i = index; i >= 0; i--) {
            if (values[i] != null)
                return i;
        }
        return 0;
    };
    DataSeries.prototype.rightNearestVisibleValueIndex = function (index) {
        var values = this._values, count = values.length;
        if (index < 0) {
            return 0;
        }
        for (var i = index; i < count; i++) {
            if (values[i] != null)
                return i;
        }
        return count - 1;
    };
    DataSeries.prototype.toField = function (name) {
        var field = new Field();
        field.name = name || this.name;
        field.recordCount = this._values.length;
        field._m_values = [0].concat(this._values);
        field._m_values.push(0);
        return field;
    };
    DataSeries.prototype.fromField = function (field, startIndex) {
        var count = field.recordCount, values = field._m_values.slice(1, startIndex + count), i;
        for (i = 0; i < startIndex - 1; i++)
            values[i] = null;
        while (i < count) {
            if (values[i] === Const.nullValue)
                values[i] = null;
            i++;
        }
        this._values = values;
    };
    return DataSeries;
}());
export { DataSeries };
//# sourceMappingURL=DataSeries.js.map