export interface ITimeFramePickerConfig {
    timeInterval: number;
    selectionChanged: (timeFrame: unknown) => void;
}
export declare class TimeFramePicker {
    private _config;
    private _rootDomElement;
    private _domObjects;
    private _isActive;
    private _hasCustomPicker;
    private _last;
    constructor(rootContainer: JQuery, config: ITimeFramePickerConfig);
    set(timeInterval: number): void;
    private _init;
    private _setValue;
    private _setPredefinedValue;
    private static _extractDataFromItem;
    private _activateItem;
    private _setLabels;
    private _setCustomPickerValues;
    private _toggleDropDown;
    private _showDropDown;
    private _hideDropDown;
    private _synchronizeWithCustomPicker;
    private _fire;
    private _getPickerIntervalValue;
    private _selectDistinctPredefinedPeriodicities;
    private static _getDomObjects;
}
//# sourceMappingURL=TimeFramePicker.d.ts.map