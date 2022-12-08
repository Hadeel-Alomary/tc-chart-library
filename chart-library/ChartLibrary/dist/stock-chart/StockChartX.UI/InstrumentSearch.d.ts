import { IInstrument } from "../StockChartX/Chart";
export interface IInstrumentSearchConfig {
    value?: string;
    instruments?: IInstrument[];
    onChange?(instrument: IInstrument): void;
}
export declare class InstrumentSearch {
    private static DATA_SYMBOL;
    private static CLASS_ACTIVE;
    private static SEARCH_DELAY_TIMER_DURATION;
    private _config;
    private _value;
    private _inputField;
    private _isDropDownVisible;
    private _resultsCount;
    private _currentText;
    private _searchDelayTimer;
    private _resultsDropDown;
    private _noResults;
    constructor(rootContainer: JQuery, config: IInstrumentSearchConfig);
    setText(text: string): void;
    getSymbol(): IInstrument;
    private _init;
    private _getInputValue;
    private _highlightDropDownItem;
    private _setValue;
    private _hideDropDown;
    private _showDropDown;
    private _generateSearchResults;
    private _generateListElement;
    private _highlightHTMLText;
    private _searchTextPositions;
    private _search;
    private _getInstrumentBySymbol;
    private _getInstruments;
    private _initFields;
}
//# sourceMappingURL=InstrumentSearch.d.ts.map