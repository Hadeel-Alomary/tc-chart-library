import { getAllInstruments } from "../StockChartX/Chart";
import { JsUtil } from "../StockChartX/Utils/JsUtil";
var InstrumentSearch = (function () {
    function InstrumentSearch(rootContainer, config) {
        this._inputField = rootContainer;
        this._config = config;
        this._value = config.value || "";
        this._config.onChange = config.onChange;
        if (config.instruments != null && Array.isArray(config.instruments) && config.instruments.length > 0) {
            this._config.instruments = config.instruments;
        }
        else {
            this._getInstruments = function () {
                return getAllInstruments();
            };
        }
        this._initFields();
        this._init();
    }
    InstrumentSearch.prototype.setText = function (text) {
        this._setValue(text);
    };
    InstrumentSearch.prototype.getSymbol = function () {
        return this._getInstrumentBySymbol(this._value);
    };
    InstrumentSearch.prototype._init = function () {
        var _this = this;
        this._inputField.addClass('scxInstrumentSearchInputField');
        this._inputField.attr('type', "text");
        if (this._config.value) {
            this._inputField.val(this._value);
            this._currentText = this._value;
        }
        else {
            this._inputField.val("");
        }
        var body = $('body');
        body.append(this._resultsDropDown);
        this._inputField.on('input', function () {
            window.clearTimeout(_this._searchDelayTimer);
            _this._searchDelayTimer = window.setTimeout(function () {
                var text = _this._getInputValue();
                if (text !== _this._currentText) {
                    _this._currentText = text;
                    _this._showDropDown();
                    var matchArray = _this._search(text);
                    _this._resultsCount = matchArray.length;
                    _this._generateSearchResults(text.toUpperCase(), matchArray);
                }
            }, InstrumentSearch.SEARCH_DELAY_TIMER_DURATION);
        });
        this._inputField.focus(function (e) {
            $(e.currentTarget).addClass(InstrumentSearch.CLASS_ACTIVE);
        });
        this._inputField.blur(function (e) {
            $(e.currentTarget).removeClass(InstrumentSearch.CLASS_ACTIVE);
        });
        $(window).scroll(function () {
            _this._hideDropDown;
        });
        this._inputField.keyup(function (e) {
            if (e.which === 27) {
                _this._inputField.val(_this._value);
                _this._hideDropDown();
                _this._inputField.blur();
            }
            if (e.which === 13) {
                var value = _this._getInputValue();
                if (_this._isDropDownVisible) {
                    var activeItem = _this._resultsDropDown.find(' > .' + InstrumentSearch.CLASS_ACTIVE);
                    if (activeItem.length > 0) {
                        value = activeItem.attr(InstrumentSearch.DATA_SYMBOL);
                    }
                }
                _this._setValue(value, true);
                _this._hideDropDown();
                _this._inputField.blur();
            }
            if (!_this._isDropDownVisible && (e.which === 40 || e.which === 38)) {
                _this._showDropDown();
                _this._generateSearchResults(_this._getInputValue().toUpperCase(), _this._search(_this._getInputValue()));
            }
            if (_this._resultsCount > 0) {
                if (e.which === 40) {
                    _this._highlightDropDownItem(false);
                }
                if (e.which === 38) {
                    _this._highlightDropDownItem(true);
                }
            }
            _this._resultsDropDown.on('click', '.scxInstrumentSearchItem', function (e) {
                _this._setValue($(e.currentTarget).attr(InstrumentSearch.DATA_SYMBOL), true);
                _this._hideDropDown();
            });
            _this._resultsDropDown.on('mouseover', '.scxInstrumentSearchItem', function (e) {
                $(e.currentTarget).parent().children().removeClass(InstrumentSearch.CLASS_ACTIVE);
                $(e.currentTarget).addClass(InstrumentSearch.CLASS_ACTIVE);
            });
            body.on('click', function (evt) {
                if (_this._isDropDownVisible &&
                    !$(evt.currentTarget).is(_this._inputField) &&
                    $(evt.currentTarget).parents('.scxInstrumentSearchResults').length === 0) {
                    _this._inputField.val(_this._value);
                    _this._hideDropDown();
                }
            });
        });
    };
    InstrumentSearch.prototype._getInputValue = function () {
        return $('<div></div>').text(this._inputField.val()).html();
    };
    InstrumentSearch.prototype._highlightDropDownItem = function (direction) {
        var activeItem = this._resultsDropDown.find(' > .' + InstrumentSearch.CLASS_ACTIVE), allItems = this._resultsDropDown.children();
        if (activeItem.length === 0) {
            if (direction) {
                allItems.last().addClass(InstrumentSearch.CLASS_ACTIVE);
            }
            else {
                allItems.first().addClass(InstrumentSearch.CLASS_ACTIVE);
            }
        }
        else {
            activeItem.removeClass(InstrumentSearch.CLASS_ACTIVE);
            if (direction) {
                if (activeItem.is(allItems.first())) {
                    allItems.last().addClass(InstrumentSearch.CLASS_ACTIVE);
                }
                else {
                    activeItem.prev().addClass(InstrumentSearch.CLASS_ACTIVE);
                }
            }
            else {
                if (activeItem.is(allItems.last())) {
                    allItems.first().addClass(InstrumentSearch.CLASS_ACTIVE);
                }
                else {
                    activeItem.next().addClass(InstrumentSearch.CLASS_ACTIVE);
                }
            }
        }
        activeItem = this._resultsDropDown.find(' > .' + InstrumentSearch.CLASS_ACTIVE);
        var itemTopOffset = activeItem.outerHeight() * activeItem.index(), itemBottomOffset = itemTopOffset + activeItem.outerHeight();
        if (itemTopOffset < this._resultsDropDown.scrollTop()) {
            this._resultsDropDown.scrollTop(itemTopOffset);
        }
        else if (itemBottomOffset > (this._resultsDropDown.scrollTop() + this._resultsDropDown.outerHeight())) {
            this._resultsDropDown.scrollTop(itemBottomOffset - this._resultsDropDown.height());
        }
    };
    InstrumentSearch.prototype._setValue = function (val, fire) {
        this._inputField.val(val);
        this._value = val;
        this._currentText = val;
        if (fire && JsUtil.isFunction(this._config.onChange)) {
            this._config.onChange(this._getInstrumentBySymbol(val));
        }
    };
    InstrumentSearch.prototype._hideDropDown = function () {
        this._isDropDownVisible = false;
        this._resultsDropDown.hide();
        this._currentText = this._inputField.val();
    };
    InstrumentSearch.prototype._showDropDown = function () {
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
    };
    InstrumentSearch.prototype._generateSearchResults = function (text, array) {
        this._noResults.detach();
        this._resultsDropDown.empty();
        if (array.length === 0) {
            this._noResults.appendTo(this._resultsDropDown);
            return;
        }
        var html = "";
        for (var i in array) {
            if (array.hasOwnProperty(i)) {
                html += this._generateListElement(text, array[i].symbol, array[i].company, array[i].exchange);
            }
        }
        if (html !== "")
            this._resultsDropDown.append($(html));
    };
    InstrumentSearch.prototype._generateListElement = function (text, symbol, company, exchange) {
        return "<div class=\"scxInstrumentSearchItem\" " + InstrumentSearch.DATA_SYMBOL + "=\"" + symbol + "\">" +
            '<div class="scxInstrumentSearchItem_SymbolContainer">' +
            ("<span class=\"scxInstrumentSearchItem_Symbol\">" + this._highlightHTMLText(text, symbol) + "</span>") +
            '</div>' +
            '<div class="scxInstrumentSearchItem_NameContainer">' +
            ("<span class=\"scxInstrumentSearchItem_Name\">" + this._highlightHTMLText(text, company) + "</span>") +
            '</div>' +
            '<div class="scxInstrumentSearchItem_ExchangeContainer">' +
            ("<span class=\"scxInstrumentSearchItem_Exchange\">" + exchange + "</span>") +
            '</div>' +
            '</div>';
    };
    InstrumentSearch.prototype._highlightHTMLText = function (searchText, fullText) {
        if (searchText === "")
            return fullText;
        var matchStartPositions = this._searchTextPositions(searchText, fullText), resultText = "", offset = 0;
        if (searchText.length === 1 && matchStartPositions.length > 1) {
            for (var i = matchStartPositions.length - 1; i > 0; i--) {
                if (matchStartPositions[i].pos - 1 === matchStartPositions[i - 1].pos) {
                    matchStartPositions[i - 1].len += 1;
                    matchStartPositions.splice(i, 1);
                }
            }
        }
        for (var i = 0; i < matchStartPositions.length; i++) {
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
    };
    InstrumentSearch.prototype._searchTextPositions = function (searchText, fullString) {
        var startIndex = 0, index, result = [], searchTextLength = searchText.length;
        searchText = searchText.toLowerCase();
        fullString = fullString.toLowerCase();
        while ((index = fullString.indexOf(searchText, startIndex)) > -1) {
            result.push({ pos: index, len: searchTextLength });
            startIndex = index + 1;
        }
        return result;
    };
    InstrumentSearch.prototype._search = function (text) {
        text = text.toLowerCase() || "";
        var result = [];
        var instruments = this._getInstruments();
        for (var i = 0; i < instruments.length; i++) {
            if (instruments[i].symbol.toLowerCase().indexOf(text) > -1 ||
                instruments[i].company.toLowerCase().indexOf(text) > -1) {
                result.push(instruments[i]);
            }
        }
        return result;
    };
    InstrumentSearch.prototype._getInstrumentBySymbol = function (symbol) {
        var instruments = this._getInstruments();
        for (var i = 0; i < instruments.length; i++) {
            if (instruments[i].symbol === symbol)
                return instruments[i];
        }
        return null;
    };
    InstrumentSearch.prototype._getInstruments = function () {
        return this._config.instruments;
    };
    InstrumentSearch.prototype._initFields = function () {
        this._isDropDownVisible = false;
        this._resultsCount = 0;
        this._currentText = "";
        this._searchDelayTimer = null;
        this._resultsDropDown = $('<div class="scxInstrumentSearchResults"></div>');
        this._noResults = $('<div class="scxInstrumentSearchNoResults">No results</div>');
    };
    InstrumentSearch.DATA_SYMBOL = 'data-scxinstrument';
    InstrumentSearch.CLASS_ACTIVE = 'active';
    InstrumentSearch.SEARCH_DELAY_TIMER_DURATION = 250;
    return InstrumentSearch;
}());
export { InstrumentSearch };
//# sourceMappingURL=InstrumentSearch.js.map