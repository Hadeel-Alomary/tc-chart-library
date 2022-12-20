import { Periodicity, TimeFrame } from "../StockChartX/Data/TimeFrame";
var DATA_INTERVAL = 'data-scxValue';
var DATA_PERIODICITY = 'data-scxUnits';
var TimeFramePicker = (function () {
    function TimeFramePicker(rootContainer, config) {
        this._isActive = false;
        this._hasCustomPicker = false;
        this._last = new TimeFrame(Periodicity.MINUTE, 1);
        this._rootDomElement = rootContainer;
        this._config = config;
        this._init();
    }
    TimeFramePicker.prototype.set = function (timeInterval) {
        this._setValue(TimeFrame.timeIntervalToTimeFrame(timeInterval));
    };
    TimeFramePicker.prototype._init = function () {
        var _this = this;
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
            .keyup(function (e) {
            if (e.which === 13) {
                _this._hideDropDown();
            }
        });
        if (!this._domObjects.dropdown.inputPeriodicity.children().length) {
            var periodicities = this._selectDistinctPredefinedPeriodicities();
            var items = [];
            for (var i in Periodicity) {
                if (Periodicity.hasOwnProperty(i)) {
                    if (periodicities.indexOf(Periodicity[i]) >= 0) {
                        var value = TimeFrame.periodicityToString(Periodicity[i]);
                        items.push($("<option value=\"" + Periodicity[i] + "\">" + value + "</option>"));
                    }
                }
            }
            this._domObjects.dropdown.inputPeriodicity.empty().append(items);
        }
        this._domObjects.dropdown.inputPeriodicity.selectpicker({ container: 'body' });
        this._domObjects.head.dropdownToggler.click(function (e) {
            _this._toggleDropDown();
            $(e.currentTarget).blur();
        });
        this._domObjects.head.activator.click(function () {
            _this._domObjects.head.dropdownToggler.click();
        });
        $('body').click(function (evt) {
            if (_this._isActive
                && $(evt.target).parents(_this._rootDomElement.selector).length === 0
                && $(evt.target).parents('.scxTimeFramePickerDropDown').length === 0
                && $(evt.target).parents('.scxTimeFramePicker-CustomValueUnits').length === 0) {
                _this._hideDropDown();
            }
        });
        this._domObjects.predefinedItems.click(function (e) {
            _this._setPredefinedValue($(e.currentTarget).index());
        });
        if (this._hasCustomPicker) {
            this._domObjects.dropdown.btnPlus.click(function (e) {
                _this._domObjects.predefinedItems.removeClass('active');
                $(e.currentTarget).blur();
                _this._domObjects.dropdown.inputInterval.scxNumericField('setValue', _this._getPickerIntervalValue() + 1);
            });
            this._domObjects.dropdown.btnMinus.click(function (e) {
                _this._domObjects.predefinedItems.removeClass('active');
                $(e.currentTarget).blur();
                var val = _this._getPickerIntervalValue();
                if (val > 1) {
                    _this._domObjects.dropdown.inputInterval.scxNumericField('setValue', val - 1);
                }
            });
        }
        this._setValue(TimeFrame.timeIntervalToTimeFrame(this._config.timeInterval));
    };
    TimeFramePicker.prototype._setValue = function (timeFrame) {
        this._domObjects.predefinedItems.removeClass('active');
        this._last = timeFrame;
        this._setCustomPickerValues();
        this._setLabels();
        this._hideDropDown();
    };
    TimeFramePicker.prototype._setPredefinedValue = function (index) {
        var item = this._domObjects.predefinedItems.eq(index);
        this._activateItem(item);
        this._last = TimeFramePicker._extractDataFromItem(item);
        this._setCustomPickerValues();
        this._setLabels();
        this._hideDropDown();
        this._fire();
    };
    TimeFramePicker._extractDataFromItem = function (item) {
        return new TimeFrame(item.attr(DATA_PERIODICITY), parseInt(item.attr(DATA_INTERVAL), 10));
    };
    TimeFramePicker.prototype._activateItem = function (item) {
        this._domObjects.predefinedItems.removeClass('active');
        item.addClass('active');
    };
    TimeFramePicker.prototype._setLabels = function () {
        this._domObjects.head.labelInterval.text(this._last.interval);
        this._domObjects.head.labelPeriodicity.text(this._last.periodicity);
    };
    TimeFramePicker.prototype._setCustomPickerValues = function () {
        if (this._hasCustomPicker) {
            this._domObjects.dropdown.inputInterval.scxNumericField('setValue', this._last.interval);
            this._domObjects.dropdown.inputPeriodicity.selectpicker('val', this._last.periodicity);
        }
    };
    TimeFramePicker.prototype._toggleDropDown = function () {
        this._isActive ? this._hideDropDown() : this._showDropDown();
    };
    TimeFramePicker.prototype._showDropDown = function () {
        this._rootDomElement.addClass('active');
        this._domObjects.dropdown.wrapper.css({
            top: this._rootDomElement.outerHeight(true) + this._rootDomElement.offset().top - 1,
            left: this._rootDomElement.offset().left
        }).show();
        this._isActive = true;
    };
    TimeFramePicker.prototype._hideDropDown = function () {
        this._domObjects.dropdown.wrapper.hide();
        this._rootDomElement.removeClass('active');
        this._isActive = false;
        this._synchronizeWithCustomPicker();
    };
    TimeFramePicker.prototype._synchronizeWithCustomPicker = function () {
        if (!this._hasCustomPicker)
            return;
        var pickerInterval = this._getPickerIntervalValue();
        var pickerPeriodicity = this._domObjects.dropdown.inputPeriodicity.val();
        if (pickerInterval !== this._last.interval || pickerPeriodicity !== this._last.periodicity) {
            this._last.interval = pickerInterval;
            this._last.periodicity = pickerPeriodicity;
            this._setLabels();
            this._fire();
        }
    };
    TimeFramePicker.prototype._fire = function () {
        if (typeof this._config.selectionChanged === 'function') {
            this._config.selectionChanged(this._last);
        }
    };
    TimeFramePicker.prototype._getPickerIntervalValue = function () {
        var text = $('<div></div>').text(this._domObjects.dropdown.inputInterval.scxNumericField('getValue')).html();
        return parseInt(text, 10);
    };
    TimeFramePicker.prototype._selectDistinctPredefinedPeriodicities = function () {
        var periodicities = [];
        var periodicity;
        this._domObjects.predefinedItems.each(function (index, item) {
            periodicity = $(item).attr(DATA_PERIODICITY).toLowerCase();
            try {
                TimeFrame.periodicityToString(periodicity);
            }
            catch (ex) {
                periodicity = null;
            }
            if (periodicity !== null && periodicities.indexOf(periodicity) < 0) {
                periodicities.push(periodicity);
            }
        });
        return periodicities;
    };
    TimeFramePicker._getDomObjects = function (root) {
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
    };
    return TimeFramePicker;
}());
export { TimeFramePicker };
//# sourceMappingURL=TimeFramePicker.js.map