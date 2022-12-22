/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {getAllInstruments, IInstrument} from "../StockChartX/Chart";
import {JsUtil} from "../StockChartX/Utils/JsUtil";

/**
 * Set instruments array by yourself if you want instrument selector do not to be dependent on .getAllInstruments();
 */
export interface IInstrumentSearchConfig {
    value?: string;
    instruments?: IInstrument[];

    onChange?(instrument: IInstrument): void;
}

export class InstrumentSearch {
    private static DATA_SYMBOL = 'data-scxinstrument';
    private static CLASS_ACTIVE = 'active';
    private static SEARCH_DELAY_TIMER_DURATION = 250;

    private _config: IInstrumentSearchConfig;
    private _value: string;
    private _inputField: JQuery;

    private _isDropDownVisible: boolean;
    private _resultsCount: number;
    private _currentText: string;
    private _searchDelayTimer: number;
    private _resultsDropDown: JQuery;
    private _noResults: JQuery;

    constructor(rootContainer: JQuery, config: IInstrumentSearchConfig) {
        this._inputField = rootContainer;
        this._config = config;
        this._value = config.value || "";
        this._config.onChange = config.onChange;

        if (config.instruments != null && Array.isArray(config.instruments) && config.instruments.length > 0) {
            this._config.instruments = config.instruments;
        } else {
            this._getInstruments = (): IInstrument[] => {
                return getAllInstruments();
            };
        }

        this._initFields();
        this._init();
    }

    public setText(text: string) {
        this._setValue(text);
    }

    public getSymbol(): IInstrument {
        return this._getInstrumentBySymbol(this._value);
    }

    private _init(): void {
        this._inputField.addClass('scxInstrumentSearchInputField');
        this._inputField.attr('type', "text");

        if (this._config.value) {
            this._inputField.val(this._value);
            this._currentText = this._value;
        }
        else {
            this._inputField.val("");
        }
        let body = $('body');
        body.append(this._resultsDropDown);

        this._inputField.on('input', () => {
            window.clearTimeout(this._searchDelayTimer);
            this._searchDelayTimer = window.setTimeout(() => {
                let text = this._getInputValue();
                if (text !== this._currentText) {
                    this._currentText = text;
                    this._showDropDown();
                    let matchArray = this._search(text);
                    this._resultsCount = matchArray.length;
                    this._generateSearchResults(text.toUpperCase(), matchArray);
                }
            }, InstrumentSearch.SEARCH_DELAY_TIMER_DURATION);
        });

        this._inputField.focus((e: JQueryEventObject) => {
            $(e.currentTarget).addClass(InstrumentSearch.CLASS_ACTIVE);
        });
        this._inputField.blur((e: JQueryEventObject) => {
            $(e.currentTarget).removeClass(InstrumentSearch.CLASS_ACTIVE);
        });
        $(window).scroll(() => {
            this._hideDropDown;
        });

        this._inputField.keyup((e: JQueryEventObject) => {
            if (e.which === 27) { // esc
                this._inputField.val(this._value);
                this._hideDropDown();
                this._inputField.blur();
            }

            if (e.which === 13) { // enter
                let value = this._getInputValue();

                if (this._isDropDownVisible) {
                    let activeItem = this._resultsDropDown.find(' > .' + InstrumentSearch.CLASS_ACTIVE);
                    if (activeItem.length > 0) {
                        value = activeItem.attr(InstrumentSearch.DATA_SYMBOL);
                    }
                }

                this._setValue(value, true);
                this._hideDropDown();
                this._inputField.blur();
            }

            if (!this._isDropDownVisible && (e.which === 40 || e.which === 38)) {
                this._showDropDown();
                this._generateSearchResults(this._getInputValue().toUpperCase(), this._search(this._getInputValue()));
            }

            if (this._resultsCount > 0) {
                if (e.which === 40) { // down
                    this._highlightDropDownItem(false);
                }
                if (e.which === 38) { // up
                    this._highlightDropDownItem(true);
                }
            }

            this._resultsDropDown.on('click', '.scxInstrumentSearchItem', (e: JQueryEventObject) => {
                this._setValue($(e.currentTarget).attr(InstrumentSearch.DATA_SYMBOL), true);
                this._hideDropDown();
            });

            this._resultsDropDown.on('mouseover', '.scxInstrumentSearchItem', (e: JQueryEventObject) => {
                $(e.currentTarget).parent().children().removeClass(InstrumentSearch.CLASS_ACTIVE);
                $(e.currentTarget).addClass(InstrumentSearch.CLASS_ACTIVE);
            });

            body.on('click', (evt: JQueryEventObject) => {
                if (this._isDropDownVisible &&
                    !$(evt.currentTarget).is(this._inputField) &&
                    $(evt.currentTarget).parents('.scxInstrumentSearchResults').length === 0) {
                    this._inputField.val(this._value);
                    this._hideDropDown();
                }
            });
        });
    }

    private _getInputValue(): string {
        return $('<div></div>').text(this._inputField.val()).html();
    }

    private _highlightDropDownItem(direction: boolean): void {
        let activeItem = this._resultsDropDown.find(' > .' + InstrumentSearch.CLASS_ACTIVE),
            allItems = this._resultsDropDown.children();
        if (activeItem.length === 0) {
            if (direction) { // up
                allItems.last().addClass(InstrumentSearch.CLASS_ACTIVE);
            } else { // down
                allItems.first().addClass(InstrumentSearch.CLASS_ACTIVE);
            }
        } else {
            activeItem.removeClass(InstrumentSearch.CLASS_ACTIVE);
            if (direction) { // up
                if (activeItem.is(allItems.first())) {
                    allItems.last().addClass(InstrumentSearch.CLASS_ACTIVE);
                } else {
                    activeItem.prev().addClass(InstrumentSearch.CLASS_ACTIVE);
                }
            } else { // down
                if (activeItem.is(allItems.last())) {
                    allItems.first().addClass(InstrumentSearch.CLASS_ACTIVE);
                } else {
                    activeItem.next().addClass(InstrumentSearch.CLASS_ACTIVE);
                }
            }
        }
        activeItem = this._resultsDropDown.find(' > .' + InstrumentSearch.CLASS_ACTIVE);

        let itemTopOffset = activeItem.outerHeight() * activeItem.index(),
            itemBottomOffset = itemTopOffset + activeItem.outerHeight();

        if (itemTopOffset < this._resultsDropDown.scrollTop()) {
            this._resultsDropDown.scrollTop(itemTopOffset);
        } else if (itemBottomOffset > (this._resultsDropDown.scrollTop() + this._resultsDropDown.outerHeight())) {
            this._resultsDropDown.scrollTop(itemBottomOffset - this._resultsDropDown.height());
        }
    }

    private _setValue(val: string, fire?: boolean): void {
        this._inputField.val(val);
        this._value = val;
        this._currentText = val;
        if (fire && JsUtil.isFunction(this._config.onChange)) {
            this._config.onChange(this._getInstrumentBySymbol(val));
        }
    }

    private _hideDropDown(): void {
        this._isDropDownVisible = false;
        this._resultsDropDown.hide();
        this._currentText = this._inputField.val();
    }

    private _showDropDown(): void {
        if (this._isDropDownVisible)
            return;
        this._isDropDownVisible = true;
        this._resultsDropDown.css({
            top: this._inputField.offset().top + this._inputField.outerHeight() + 2,
            left: this._inputField.offset().left,
            maxHeight: $(window).height() - this._inputField.offset().top - this._inputField.outerHeight() - 10
        });

        this._resultsDropDown.show();

        if (this._inputField.outerWidth(true) > this._resultsDropDown.width()) {
            this._resultsDropDown.width(this._inputField.outerWidth(true));
        }
    }

    private _generateSearchResults(text: string, array: IInstrument[]): void {
        this._noResults.detach();
        this._resultsDropDown.empty();
        if (array.length === 0) {
            this._noResults.appendTo(this._resultsDropDown);
            return;
        }

        let html = "";
        for (let i in array) {
            if (array.hasOwnProperty(i)) {
                html += this._generateListElement(text, array[i].symbol, array[i].company, array[i].exchange);
            }
        }
        if (html !== "")
            this._resultsDropDown.append($(html));
    }

    private _generateListElement(text: string, symbol: string, company: string, exchange: string): string {
        return `<div class="scxInstrumentSearchItem" ${InstrumentSearch.DATA_SYMBOL}="${symbol}">` +
            '<div class="scxInstrumentSearchItem_SymbolContainer">' +
            `<span class="scxInstrumentSearchItem_Symbol">${this._highlightHTMLText(text, symbol)}</span>` +
            '</div>' +
            '<div class="scxInstrumentSearchItem_NameContainer">' +
            `<span class="scxInstrumentSearchItem_Name">${this._highlightHTMLText(text, company)}</span>` +
            '</div>' +
            '<div class="scxInstrumentSearchItem_ExchangeContainer">' +
            `<span class="scxInstrumentSearchItem_Exchange">${exchange}</span>` +
            '</div>' +
            '</div>';
    }

    private _highlightHTMLText(searchText: string, fullText: string): string {
        if (searchText === "")
            return fullText;

        let matchStartPositions = this._searchTextPositions(searchText, fullText),
            resultText = "",
            offset = 0;

        if (searchText.length === 1 && matchStartPositions.length > 1) {

            for (let i = matchStartPositions.length - 1; i > 0; i--) {

                if (matchStartPositions[i].pos - 1 === matchStartPositions[i - 1].pos) {
                    matchStartPositions[i - 1].len += 1;
                    matchStartPositions.splice(i, 1);
                }
            }
        }

        for (let i = 0; i < matchStartPositions.length; i++) {

            resultText += fullText.substr(offset, matchStartPositions[i].pos - offset)
                + '<span class="scxHighlightedText">'
                + fullText.substr(matchStartPositions[i].pos, matchStartPositions[i].len)
                + '</span>';

            offset = matchStartPositions[i].pos + matchStartPositions[i].len;
        }

        if (offset < fullText.length) {
            resultText += fullText.substr(offset, fullText.length - offset);
        }

        return resultText;
    }

    // noinspection JSMethodCanBeStatic
    private _searchTextPositions(searchText: string, fullString: string): SearchTextPosition[] {
        let startIndex = 0,
            index: number,
            result: SearchTextPosition[] = [],
            searchTextLength = searchText.length;
        searchText = searchText.toLowerCase();
        fullString = fullString.toLowerCase();
        while ((index = fullString.indexOf(searchText, startIndex)) > -1) {
            result.push({pos: index, len: searchTextLength});
            startIndex = index + 1;
        }
        return result;
    }

    private _search(text: string): IInstrument[] {
        text = text.toLowerCase() || "";
        let result: IInstrument[] = [];
        let instruments = this._getInstruments();

        for (let i = 0; i < instruments.length; i++) {
            if (instruments[i].symbol.toLowerCase().indexOf(text) > -1 ||
                instruments[i].company.toLowerCase().indexOf(text) > -1) {
                result.push(instruments[i]);
            }
        }
        return result;
    }

    private _getInstrumentBySymbol(symbol: string): IInstrument {
        let instruments = this._getInstruments();
        for (let i = 0; i < instruments.length; i++) {
            if (instruments[i].symbol === symbol)
                return instruments[i];
        }
        return null;
    }

    private _getInstruments(): IInstrument[] {
        return this._config.instruments;
    }

    // MA compile typescript - duplicated code
    // private _getInstrumentBySymbol(symbol: string): IInstrument {
    //     var instruments = this._getInstruments();
    //     for (let i = 0; i < instruments.length; i++) {
    //         if (instruments[i].symbol === symbol)
    //             return instruments[i];
    //     }
    //     return null;
    // }

    private _initFields(): void {
        this._isDropDownVisible = false;
        this._resultsCount = 0;
        this._currentText = "";
        this._searchDelayTimer = null;
        this._resultsDropDown = $('<div class="scxInstrumentSearchResults"></div>');
        this._noResults = $('<div class="scxInstrumentSearchNoResults">No results</div>');
    }
}

interface SearchTextPosition {
    pos: number,
    len: number
}
