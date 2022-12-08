/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Periodicity, TimeFrame} from "../StockChartX/Data/TimeFrame";

export interface ITimeFramePickerConfig {
    timeInterval: number;
    selectionChanged: (timeFrame: unknown) => void;
}

interface IHeadObjectConfig {
    activator: JQuery;
    dropdownToggler: JQuery;
    labelInterval: JQuery;
    labelPeriodicity: JQuery;
}

interface IDropdownObjecConfig {
    wrapper: JQuery;
    customValueWrapper: JQuery;
    btnPlus: JQuery;
    btnMinus: JQuery;
    inputInterval: JQuery;
    inputPeriodicity: JQuery;
}

interface IDomObjectsConfig {
    head: IHeadObjectConfig;
    dropdown: IDropdownObjecConfig;
    predefinedItems: JQuery;
}

const DATA_INTERVAL = 'data-scxValue';
const DATA_PERIODICITY = 'data-scxUnits';

export class TimeFramePicker {
    private _config: ITimeFramePickerConfig;
    private _rootDomElement: JQuery;
    private _domObjects: IDomObjectsConfig;
    private _isActive: boolean = false;
    private _hasCustomPicker: boolean = false;

    private _last: TimeFrame = new TimeFrame(Periodicity.MINUTE, 1);

    constructor(rootContainer: JQuery, config: ITimeFramePickerConfig) {
        this._rootDomElement = rootContainer;
        this._config = config;
        this._init();
    }

    public set(timeInterval: number): void {
        this._setValue(TimeFrame.timeIntervalToTimeFrame(timeInterval));
    }

    private _init(): void {
        this._domObjects = TimeFramePicker._getDomObjects(this._rootDomElement);
        this._domObjects.dropdown.wrapper.appendTo('body');
        this._hasCustomPicker = this._domObjects.dropdown.customValueWrapper.length > 0;

        this._rootDomElement.addClass('activated');
        this._domObjects.dropdown.inputInterval
            .scxNumericField({
                showArrows: false,
                minValue: 1,
                value: 1
            })
            .keyup((e: JQueryEventObject) => {
                if (e.which === 13) {
                    this._hideDropDown();
                }
            });

        if (!this._domObjects.dropdown.inputPeriodicity.children().length) {
            let periodicities = this._selectDistinctPredefinedPeriodicities();
            let items: JQuery[] = [];
            for (let i in Periodicity) {
                if (Periodicity.hasOwnProperty(i)) {
                    if (periodicities.indexOf(Periodicity[i]) >= 0) {
                        let value = TimeFrame.periodicityToString(Periodicity[i]);

                        items.push($(`<option value="${Periodicity[i]}">${value}</option>`));
                    }
                }
            }
            this._domObjects.dropdown.inputPeriodicity.empty().append(items);
        }

        this._domObjects.dropdown.inputPeriodicity.selectpicker({container: 'body'});

        this._domObjects.head.dropdownToggler.click((e: JQueryEventObject) => {
            this._toggleDropDown();
            $(e.currentTarget).blur();
        });

        this._domObjects.head.activator.click(() => {
            this._domObjects.head.dropdownToggler.click();
        });

        $('body').click((evt: JQueryEventObject) => {
            if (this._isActive
                && $(evt.target).parents(this._rootDomElement.selector).length === 0
                && $(evt.target).parents('.scxTimeFramePickerDropDown').length === 0
                && $(evt.target).parents('.scxTimeFramePicker-CustomValueUnits').length === 0
            ) {
                this._hideDropDown();
            }
        });

        this._domObjects.predefinedItems.click((e: JQueryEventObject) => {
            this._setPredefinedValue($(e.currentTarget).index());
        });

        if (this._hasCustomPicker) {
            this._domObjects.dropdown.btnPlus.click((e: JQueryEventObject) => {
                this._domObjects.predefinedItems.removeClass('active');
                $(e.currentTarget).blur();
                this._domObjects.dropdown.inputInterval.scxNumericField('setValue', this._getPickerIntervalValue() + 1);
            });

            this._domObjects.dropdown.btnMinus.click((e: JQueryEventObject) => {
                this._domObjects.predefinedItems.removeClass('active');
                $(e.currentTarget).blur();
                let val = this._getPickerIntervalValue();
                if (val > 1) {
                    this._domObjects.dropdown.inputInterval.scxNumericField('setValue', val - 1);
                }
            });
        }

        this._setValue(TimeFrame.timeIntervalToTimeFrame(this._config.timeInterval));
    }

    private _setValue(timeFrame: TimeFrame): void {
        this._domObjects.predefinedItems.removeClass('active');

        this._last = timeFrame;

        this._setCustomPickerValues();
        this._setLabels();
        this._hideDropDown();
    }

    private _setPredefinedValue(index: number) {
        let item = this._domObjects.predefinedItems.eq(index);

        this._activateItem(item);

        this._last = TimeFramePicker._extractDataFromItem(item);

        this._setCustomPickerValues();
        this._setLabels();
        this._hideDropDown();

        this._fire();
    }

    private static _extractDataFromItem(item: JQuery): TimeFrame {
        return new TimeFrame(item.attr(DATA_PERIODICITY), parseInt(item.attr(DATA_INTERVAL), 10));
    }

    private _activateItem(item: JQuery): void {
        this._domObjects.predefinedItems.removeClass('active');
        item.addClass('active');
    }

    private _setLabels(): void {
        this._domObjects.head.labelInterval.text(this._last.interval);
        this._domObjects.head.labelPeriodicity.text(this._last.periodicity);
    }

    private _setCustomPickerValues(): void {
        if (this._hasCustomPicker) {
            this._domObjects.dropdown.inputInterval.scxNumericField('setValue', this._last.interval);
            this._domObjects.dropdown.inputPeriodicity.selectpicker('val', this._last.periodicity);
        }
    }

    private _toggleDropDown(): void {
        this._isActive ? this._hideDropDown() : this._showDropDown();
    }

    private _showDropDown(): void {
        this._rootDomElement.addClass('active');

        this._domObjects.dropdown.wrapper.css({
            top: this._rootDomElement.outerHeight(true) + this._rootDomElement.offset().top - 1,
            left: this._rootDomElement.offset().left
        }).show();

        this._isActive = true;
    }

    private _hideDropDown(): void {
        this._domObjects.dropdown.wrapper.hide();
        this._rootDomElement.removeClass('active');
        this._isActive = false;

        this._synchronizeWithCustomPicker();
    }

    private _synchronizeWithCustomPicker(): void {
        if (!this._hasCustomPicker)
            return;

        let pickerInterval = this._getPickerIntervalValue();
        let pickerPeriodicity = this._domObjects.dropdown.inputPeriodicity.val();

        if (pickerInterval !== this._last.interval || pickerPeriodicity !== this._last.periodicity) {
            this._last.interval = pickerInterval;
            this._last.periodicity = pickerPeriodicity;

            this._setLabels();
            this._fire();
        }
    }

    private _fire(): void {
        if (typeof this._config.selectionChanged === 'function') {
            this._config.selectionChanged(this._last);
        }
    }

    private _getPickerIntervalValue(): number {
        let text = $('<div></div>').text(this._domObjects.dropdown.inputInterval.scxNumericField('getValue')).html();

        return parseInt(text, 10);
    }

    private _selectDistinctPredefinedPeriodicities() {
        let periodicities: string[] = [];
        let periodicity: string;

        this._domObjects.predefinedItems.each((index: number, item: Element) => {
            periodicity = $(item).attr(DATA_PERIODICITY).toLowerCase();
            try {
                TimeFrame.periodicityToString(periodicity);
            } catch (ex) {
                periodicity = null;
            }

            if (periodicity !== null && periodicities.indexOf(periodicity) < 0) {
                periodicities.push(periodicity);
            }
        });
        return periodicities;
    }

    private static _getDomObjects(root: JQuery): IDomObjectsConfig {
        return {
            head: {
                activator: root.find('.scxToolbarButton-activateBtn'),
                dropdownToggler: root.find('.scxToolbarButton-toggleDropdownBtn'),
                labelInterval: root.find('.scxTimeFramePicker-button-value'),
                labelPeriodicity: root.find('.scxTimeFramePicker-button-units')
            },
            dropdown: {
                wrapper: root.find('.scxTimeFramePickerDropDown'),
                customValueWrapper: root.find('.scxTimeFramePicker-CustomValueWrapper'),
                btnPlus: root.find('.scxTimeFramePicker-CustomValuePlus'),
                btnMinus: root.find('.scxTimeFramePicker-CustomValueMinus'),
                inputInterval: root.find('.scxTimeFramePicker-CustomValueText'),
                inputPeriodicity: root.find('.scxTimeFramePicker-CustomValueUnits')
            },
            predefinedItems: root.find('.scxToolbarButton-dropdownElement')
        };
    }
}
