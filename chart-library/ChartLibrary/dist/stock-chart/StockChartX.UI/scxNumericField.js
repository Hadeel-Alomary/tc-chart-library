var dataSectorName = 'scxNumericField';
var Classes = {
    FIELD: 'scxNumericField',
    FIELD_WRAPPER: 'scxNumericField-wrapper',
    INVALID_VALUE: 'scxNumericField-invalidValue',
    ARROW_WRAPPER: 'scxNumericField-arrowWrapper',
    ARROW_UP: 'scxNumericField-arrowUp',
    ARROW_DOWN: 'scxNumericField-arrowDown',
    ARROW: 'scxNumericFieldArrow'
};
var methods = {
    init: function (options) {
        return this.each(function () {
            var $this = $(this);
            var oldValue = '';
            var oldCommaCount = 0;
            $this.attr('type', 'text').addClass(Classes.FIELD);
            $this.data(dataSectorName, {
                target: $this,
                settings: $.extend(true, {
                    canBeNegative: false,
                    priceDecimals: 0,
                    showArrows: false,
                    maxValue: null,
                    minValue: null,
                    value: 0,
                    onChange: null
                }, options)
            });
            if (options.showArrows) {
                var inputParent = $this.parent();
                var inputIndex = $this.index();
                var domObjects = generateFieldWithArrows($this);
                insertAt(inputParent, domObjects.wrapper, inputIndex);
                $this = domObjects.field;
                spinFactory($this, domObjects.arrowUp, domObjects.arrowDown);
            }
            $this.on('input', function () {
                var $thiss = $(this);
                var cursorPosition = getCursorPosition($thiss);
                var value = getValue($thiss, oldValue);
                var onlyDotInField = $thiss.val() === '.';
                if (options.priceDecimals === 0 && $thiss.val() === '') {
                    oldValue = options.minValue != null && options.minValue > 0 ? options.minValue : 0;
                    return;
                }
                if (options.priceDecimals > 0 && onlyDotInField) {
                    cursorPosition = 2;
                }
                var currentCommaCount = getCommaCount(value);
                if (currentCommaCount !== oldCommaCount)
                    cursorPosition += currentCommaCount - oldCommaCount;
                if (options.priceDecimals === 0 && !options.canBeNegative && $thiss.val().indexOf('-') > -1)
                    cursorPosition -= 1;
                oldValue = value === null
                    ? setValue($thiss, '-')
                    : setValue($thiss, value);
                setCursorPosition($thiss, cursorPosition);
                oldCommaCount = currentCommaCount;
            });
            $this.on('blur', function () {
                var $thiss = $(this);
                options.priceDecimals === 0 && $thiss.val() === ''
                    ? setValue($thiss, oldValue)
                    : setValue($thiss, getValue($thiss), true);
            });
            oldValue = setValue($this, options.value);
            oldCommaCount = getCommaCount(options.value);
        });
    },
    show: function () {
        return this.each(function () {
            getSettings(this).showArrows
                ? $(this).parent().show()
                : $(this).show();
        });
    },
    hide: function () {
        return this.each(function () {
            getSettings(this).showArrows
                ? $(this).parent().hide()
                : $(this).hide();
        });
    },
    disable: function () {
        return this.each(function () {
            $(this).attr('disabled', 'disabled');
        });
    },
    enable: function () {
        return this.each(function () {
            $(this).removeAttr('disabled');
        });
    },
    isDisabled: function () {
        var attr = $(this).attr('disabled');
        return typeof attr !== typeof undefined;
    },
    isEnabled: function () {
        var attr = $(this).attr('disabled');
        return !(typeof attr !== typeof undefined);
    },
    highlightInvalid: function () {
        return this.each(function () {
            $(this).addClass(Classes.INVALID_VALUE);
        });
    },
    unhighlightInvalid: function () {
        return this.each(function () {
            $(this).removeClass(Classes.INVALID_VALUE);
        });
    },
    setValue: function (val) {
        return this.each(function () {
            setValue($(this), val);
        });
    },
    getValue: function () {
        return getValue($(this));
    },
    setBounds: function (min, max) {
        return this.each(function () {
            if (min == null && max == null)
                return;
            var settings = getSettings(this);
            if (min != null)
                settings.minValue = min;
            if (max != null)
                settings.maxValue = max;
            $(this).trigger('input');
            setValue($(this), getValue($(this)), true);
        });
    },
    onChange: function (fn) {
        return this.each(function () {
            getSettings(this).onChange = fn;
        });
    }
};
$.fn.extend({
    scxNumericField: function (param) {
        if (methods[param]) {
            return methods[param].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof param === 'object' || !param) {
            return methods.init.apply(this, arguments);
        }
        $.error("Method " + param + " doesn't exist for jQuery.numericField");
    }
});
function getData(obj) {
    return $(obj).data(dataSectorName);
}
function getSettings(obj) {
    return getData(obj).settings;
}
function spinFactory(fieldObj, upObj, downObj) {
    var spinning;
    var delta;
    $(window).on('mouseup', stopSpin);
    function spin() {
        if (fieldObj.is("[disabled]"))
            return;
        setValue(fieldObj, getValue(fieldObj) + delta, true);
        spinning = window.setTimeout(spin, 200);
    }
    function spinUp() {
        delta = 1;
        spin();
    }
    function spinDown() {
        delta = -1;
        spin();
    }
    function stopSpin() {
        window.clearTimeout(spinning);
        delta = 0;
    }
    upObj.on('mousedown', spinUp);
    downObj.on('mousedown', spinDown);
}
function getCursorPosition(obj) {
    return obj[0].selectionStart;
}
function setCursorPosition(obj, pos) {
    obj[0].setSelectionRange(pos, pos);
}
function setValue(obj, val, applyBounds) {
    if (applyBounds === void 0) { applyBounds = false; }
    var settings = getSettings(obj);
    var value = '';
    if (val === '-') {
        value = settings.canBeNegative ? val : '';
    }
    else {
        if (!settings.canBeNegative && val < 0)
            val = 0;
        if (applyBounds) {
            if (settings.minValue != null && val < settings.minValue)
                val = settings.minValue;
            if (settings.maxValue != null && val > settings.maxValue)
                val = settings.maxValue;
        }
        if (typeof settings.onChange === 'function') {
            if (settings.value !== val)
                settings.onChange(val, obj);
        }
        settings.value = val;
        value = formatNumber(val, settings.priceDecimals);
    }
    obj.val(value);
    return value;
}
function getValue(obj, oldValue) {
    var settings = getData(obj).settings;
    var value = obj.val();
    var filteredValue = filterNumberString(value, settings.canBeNegative, settings.priceDecimals > 0);
    if (filteredValue === '-')
        return null;
    if (filteredValue.replace(/-/ig, '').length === 0)
        return null;
    if (filteredValue === '' || filteredValue === '.')
        filteredValue = '0';
    filteredValue = settings.priceDecimals > 0
        ? stringRemoveRedundantSymbols(filteredValue, oldValue)
        : stringRemoveRedundantSymbols(filteredValue);
    return parseFloat(filteredValue);
}
function formatNumber(value, priceDecimals, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (priceDecimals > 0 ? '\\.' : '$') + ')';
    if (value !== 0 && !value) {
        return '';
    }
    return value.toFixed(Math.max(0, ~~priceDecimals)).replace(new RegExp(re, 'g'), '$1,');
}
function filterNumberString(numberString, considerNegative, considerDot) {
    for (var i = numberString.length - 1; i >= 0; i--) {
        if (!isSymbolValid(numberString[i], considerNegative, considerDot))
            numberString = stringReplaceAt(numberString, i);
    }
    return numberString;
}
function stringRemoveRedundantSymbols(text, oldValue) {
    if (oldValue === void 0) { oldValue = ""; }
    if (text.indexOf('-') > -1) {
        text = '-' + text.replace(/-/g, "");
    }
    if (oldValue.length) {
        if (getAllIndexes(text, '.').length > 1) {
            var oldDotPositionFromStart = oldValue.indexOf('.'), oldDotPositionFromEnd = oldValue.length - oldDotPositionFromStart, oldDotNewPosition = void 0;
            oldDotNewPosition = text.substr(0, oldDotPositionFromStart) === oldValue.substr(0, oldDotPositionFromStart)
                ? oldDotPositionFromStart
                : text.length - oldDotPositionFromEnd;
            text = stringReplaceAt(text, oldDotNewPosition);
        }
    }
    return text.replace(/,/g, "");
}
function isSymbolValid(symbol, considerNegative, considerDot) {
    if (considerNegative === void 0) { considerNegative = false; }
    if (considerDot === void 0) { considerDot = false; }
    switch (symbol) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case ',':
            return true;
        case '.':
            return considerDot;
        case '-':
            return considerNegative;
        default:
            return false;
    }
}
function stringReplaceAt(text, index, character) {
    if (character === void 0) { character = ""; }
    var secondPartStartIndex = character.length === 0
        ? index + 1
        : index + character.length;
    return text.substr(0, index) + character + text.substr(secondPartStartIndex);
}
function getAllIndexes(str, val) {
    var indexes = [];
    var i = -1;
    while ((i = str.indexOf(val, i + 1)) !== -1)
        indexes.push(i);
    return indexes;
}
function getCommaCount(value) {
    if (value === null)
        return 0;
    if (typeof value === "string")
        value = parseInt(value, 10);
    return Math.ceil(value.toString().length / 3) - 1;
}
function generateFieldWithArrows(inputObj) {
    var wrapperObj = $("<div class=\"" + Classes.FIELD_WRAPPER + "\">");
    var arrowUp = $("<div class=\"" + Classes.ARROW_WRAPPER + " " + Classes.ARROW_UP + "\"><span class=\"" + Classes.ARROW + "\"></span></div>");
    var arrowDown = $("<div class=\"" + Classes.ARROW_WRAPPER + " " + Classes.ARROW_DOWN + "\"><span class=\"" + Classes.ARROW + "\"></span></div>");
    var height = inputObj.outerHeight(true);
    var width = inputObj.outerWidth();
    wrapperObj.height(height);
    arrowUp.height(Math.floor((height / 2) - 2));
    arrowDown.height(Math.floor((height / 2) - 2));
    wrapperObj.width(inputObj.width());
    inputObj.css('padding-right', Math.floor(width / 4));
    wrapperObj.append(inputObj).append(arrowUp).append(arrowDown);
    arrowUp.css('padding-top', Math.floor(height / 2 - 11));
    arrowDown.css('padding-top', Math.floor(height / 2 - 11));
    arrowUp.css('line-height', Math.floor((height / 2) - 2) + 'px');
    arrowDown.css('line-height', Math.floor((height / 2) - 2) + 'px');
    arrowDown.css('top', Math.ceil(height / 2));
    disableSelection(arrowUp);
    disableSelection(arrowDown);
    return {
        wrapper: wrapperObj,
        field: inputObj,
        arrowUp: arrowUp,
        arrowDown: arrowDown
    };
}
function insertAt(container, element, index) {
    var lastIndex = container.children().length - 1;
    if (index >= 0 && index <= lastIndex)
        container.children().eq(index).before(element);
    else
        container.append(element);
    return container;
}
function disableSelection(obj) {
    return obj
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', function () {
        return false;
    });
}
export {};
//# sourceMappingURL=scxNumericField.js.map