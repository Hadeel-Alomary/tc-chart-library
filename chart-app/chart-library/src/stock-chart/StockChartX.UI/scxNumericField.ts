/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 *
 *  Version 1.8
 */


/* tslint:disable:interface-name */

/* tslint:enable:interface-name */

interface INumericFieldSettingsData {
    target: JQuery;
    settings: INumericFieldSettings;
}

export interface INumericFieldSettings {
    canBeNegative: boolean;
    priceDecimals: number;
    showArrows: boolean;
    maxValue: number;
    minValue: number;
    value: number;
    onChange: (value: number, obj: JQuery) => unknown;
}

const dataSectorName = 'scxNumericField';
const Classes = {
    FIELD: 'scxNumericField',
    FIELD_WRAPPER: 'scxNumericField-wrapper',
    INVALID_VALUE: 'scxNumericField-invalidValue',
    ARROW_WRAPPER: 'scxNumericField-arrowWrapper',
    ARROW_UP: 'scxNumericField-arrowUp',
    ARROW_DOWN: 'scxNumericField-arrowDown',
    ARROW: 'scxNumericFieldArrow'
};

let methods = {
    init(options: INumericFieldSettings): JQuery {
        return this.each(function () {
            let $this = $(this);
            let oldValue: string | number = '';
            let oldCommaCount: number = 0;

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
                let inputParent: JQuery = $this.parent();
                let inputIndex: number = $this.index();
                let domObjects: { wrapper: JQuery; field: JQuery; arrowUp: JQuery; arrowDown: JQuery } = generateFieldWithArrows($this);

                insertAt(inputParent, domObjects.wrapper, inputIndex);
                $this = domObjects.field;
                spinFactory($this, domObjects.arrowUp, domObjects.arrowDown);
            }

            $this.on('input', function () {
                let $thiss: JQuery = $(this);
                let cursorPosition = getCursorPosition($thiss);
                let value: number = getValue($thiss, oldValue as string);
                let onlyDotInField: boolean = $thiss.val() === '.';

                if (options.priceDecimals === 0 && $thiss.val() === '') {
                    oldValue = options.minValue != null && options.minValue > 0 ? options.minValue : 0;
                    return;
                }

                if (options.priceDecimals > 0 && onlyDotInField) {
                    cursorPosition = 2;
                }

                let currentCommaCount = getCommaCount(value);
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
                let $thiss = $(this);
                options.priceDecimals === 0 && $thiss.val() === ''
                    ? setValue($thiss, oldValue)
                    : setValue($thiss, getValue($thiss), true);
            });

            oldValue = setValue($this, options.value);
            oldCommaCount = getCommaCount(options.value);
        });
    },
    show(): JQuery {
        return this.each(function () {
            getSettings(this).showArrows
                ? $(this).parent().show()
                : $(this).show();
        });
    },
    hide(): JQuery {
        return this.each(function () {
            getSettings(this).showArrows
                ? $(this).parent().hide()
                : $(this).hide();
        });
    },
    disable(): JQuery {
        return this.each(function () {
            $(this).attr('disabled', 'disabled');
        });
    },
    enable(): JQuery {
        return this.each(function () {
            $(this).removeAttr('disabled');
        });
    },
    isDisabled(): boolean {
        let attr: string = $(this).attr('disabled');
        return typeof attr !== typeof undefined;
    },
    isEnabled(): boolean {
        let attr: string = $(this).attr('disabled');
        return !(typeof attr !== typeof undefined);
    },
    highlightInvalid(): JQuery {
        return this.each(function () {
            $(this).addClass(Classes.INVALID_VALUE);
        });
    },
    unhighlightInvalid(): JQuery {
        return this.each(function () {
            $(this).removeClass(Classes.INVALID_VALUE);
        });
    },
    setValue(val: number): JQuery {
        return this.each(function () {
            setValue($(this), val);
        });
    },
    getValue(): number {
        return getValue($(this));
    },
    setBounds(min: number, max: number): JQuery {
        return this.each(function () {
            if (min == null && max == null)
                return;
            let settings = getSettings(this);
            if (min != null)
                settings.minValue = min;
            if (max != null)
                settings.maxValue = max;
            $(this).trigger('input');
            setValue($(this), getValue($(this)), true);
        });
    },
    onChange(fn: (value: number, obj: JQuery) => unknown): JQuery {
        return this.each(function () {
            getSettings(this).onChange = fn;
        });
    }
};

$.fn.extend({
    scxNumericField: function (param: string|object): JQuery {
        if (methods[param as string]) {
            return methods[param as string].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof param === 'object' || !param) {
            return methods.init.apply(this, arguments);
        }

        $.error("Method " + param + " doesn't exist for jQuery.numericField");
    }
});

function getData(obj: JQuery): INumericFieldSettingsData {
    return <INumericFieldSettingsData> $(obj).data(dataSectorName);
}

function getSettings(obj: JQuery): INumericFieldSettings {
    return getData(obj).settings;
}

function spinFactory(fieldObj: JQuery, upObj: JQuery, downObj: JQuery): void {
    let spinning: number;
    let delta: number;

    $(window).on('mouseup', stopSpin);

    function spin(): void {
        if (fieldObj.is("[disabled]"))
            return;
        setValue(fieldObj, getValue(fieldObj) + delta, true);
        spinning = window.setTimeout(spin, 200);
    }

    function spinUp(): void {
        delta = 1;
        spin();
    }

    function spinDown(): void {
        delta = -1;
        spin();
    }

    function stopSpin(): void {
        window.clearTimeout(spinning);
        delta = 0;
    }

    upObj.on('mousedown', spinUp);
    downObj.on('mousedown', spinDown);
}

function getCursorPosition(obj: JQuery): number {
    return (obj[0] as HTMLInputElement).selectionStart;
}

function setCursorPosition(obj: JQuery, pos: number): void {
    (obj[0] as HTMLInputElement).setSelectionRange(pos, pos);
}

function setValue(obj: JQuery, val: number | string, applyBounds: boolean = false): string {
    let settings: INumericFieldSettings = getSettings(obj);
    let value = '';

    if (val === '-') {
        value = settings.canBeNegative ? <string> val : '';
    } else {
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
                settings.onChange(<number> val, obj);
        }

        settings.value = <number> val;
        value = formatNumber(<number> val, settings.priceDecimals);
    }

    obj.val(value);
    return value;
}

function getValue(obj: JQuery, oldValue?: string): number {
    let settings: INumericFieldSettings = getData(obj).settings;
    let value = obj.val();
    let filteredValue = filterNumberString(value, settings.canBeNegative, settings.priceDecimals > 0);

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

function formatNumber(value: number, priceDecimals: number, x?: number): string {
    let re: string = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (priceDecimals > 0 ? '\\.' : '$') + ')';
    if (value !== 0 && !value) {
        return '';
    }
    return value.toFixed(Math.max(0, ~~priceDecimals)).replace(new RegExp(re, 'g'), '$1,');
}

function filterNumberString(numberString: string, considerNegative: boolean, considerDot: boolean): string {
    for (let i = numberString.length - 1; i >= 0; i--) {
        if (!isSymbolValid(numberString[i], considerNegative, considerDot))
            numberString = stringReplaceAt(numberString, i);
    }

    return numberString;
}

function stringRemoveRedundantSymbols(text: string, oldValue: string = ""): string {
    if (text.indexOf('-') > -1) {
        text = '-' + text.replace(/-/g, "");
    }

    if (oldValue.length) {
        if (getAllIndexes(text, '.').length > 1) {
            let oldDotPositionFromStart: number = oldValue.indexOf('.'),
                oldDotPositionFromEnd: number = oldValue.length - oldDotPositionFromStart,
                oldDotNewPosition: number;

            oldDotNewPosition = text.substr(0, oldDotPositionFromStart) === oldValue.substr(0, oldDotPositionFromStart)
                ? oldDotPositionFromStart
                : text.length - oldDotPositionFromEnd;

            text = stringReplaceAt(text, oldDotNewPosition);
        }
    }

    return text.replace(/,/g, "");
}

function isSymbolValid(symbol: string, considerNegative: boolean = false, considerDot: boolean = false): boolean {
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

function stringReplaceAt(text: string, index: number, character: string = ""): string {
    let secondPartStartIndex = character.length === 0
        ? index + 1
        : index + character.length;

    return text.substr(0, index) + character + text.substr(secondPartStartIndex);
}

function getAllIndexes(str: string, val: string): number[] {
    let indexes: number[] = [];
    let i: number = -1;
    while ((i = str.indexOf(val, i + 1)) !== -1)
        indexes.push(i);

    return indexes;
}

function getCommaCount(value: number | string): number {
    if (value === null)
        return 0;

    if (typeof value === "string")
        value = parseInt(<string> value, 10);

    return Math.ceil(value.toString().length / 3) - 1;
}

function generateFieldWithArrows(inputObj: JQuery): { wrapper: JQuery; field: JQuery; arrowUp: JQuery; arrowDown: JQuery } {
    let wrapperObj = $(`<div class="${Classes.FIELD_WRAPPER}">`);
    let arrowUp = $(`<div class="${Classes.ARROW_WRAPPER} ${Classes.ARROW_UP}"><span class="${Classes.ARROW}"></span></div>`);
    let arrowDown = $(`<div class="${Classes.ARROW_WRAPPER} ${Classes.ARROW_DOWN}"><span class="${Classes.ARROW}"></span></div>`);
    let height = inputObj.outerHeight(true);
    let width = inputObj.outerWidth();

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

function insertAt(container: JQuery, element: JQuery, index: number): JQuery {
    let lastIndex = container.children().length - 1;
    if (index >= 0 && index <= lastIndex)
        container.children().eq(index).before(element);
    else
        container.append(element);

    return container;
}

function disableSelection(obj: JQuery): JQuery {
    return obj
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', function () {
            return false;
        });
}
