var DATA_VALUE = 'data-scxValue';
var DATA_TYPE = 'data-type';
var ToolbarDropDownButton = (function () {
    function ToolbarDropDownButton(rootElement, config) {
        this._body = $('body');
        this._canToggle = true;
        this._hasChildren = false;
        this._isActivated = false;
        this._isActive = false;
        this._config = config;
        this._rootElement = rootElement;
        this._init();
    }
    ToolbarDropDownButton.prototype.selectItem = function (val, fire) {
        this._setValue(val, fire);
    };
    ToolbarDropDownButton.prototype.deactivate = function () {
        this._deactivateButton();
    };
    ToolbarDropDownButton.prototype._init = function () {
        var _this = this;
        this._btnWrapper = this._rootElement.find('.scxToolbarButton-buttonWrapper');
        this._btnActivate = this._rootElement.find('.scxToolbarButton-activateBtn');
        this._btn_toggleDropDown = this._rootElement.find('.scxToolbarButton-toggleDropdownBtn');
        this._itemsWrapper = this._rootElement.find('.scxToolbarButton-dropdownWrapper');
        this._items = this._rootElement.find('.scxToolbarButton-dropdownElement');
        this._canToggle = this._rootElement.hasClass('scxToolbarCanToggle');
        this._canFireFromHead = this._rootElement.hasClass('scxToolbarCanFireFromHead');
        if (this._rootElement.hasClass('scxToolbarButtonWithDropdown') &&
            this._btn_toggleDropDown.length > 0 &&
            this._items.length > 0) {
            this._hasChildren = true;
        }
        this._btnWrapper.on('click', function (e) {
            var target = $(e.target);
            if (target.is(_this._btnActivate)) {
                if (_this._canToggle) {
                    _this._toggleButton(e);
                }
                else if (_this._canFireFromHead) {
                    _this._fireFromHead();
                }
                else if (_this._hasChildren && !_this._canToggle && !_this._canFireFromHead) {
                    _this._toggleDropDown();
                }
            }
            else if (target.is(_this._btn_toggleDropDown)) {
                _this._toggleDropDown();
            }
            else if (_this._hasChildren) {
                _this._toggleDropDown();
            }
        });
        this._btnActivate.focus(function (e) {
            $(e.currentTarget).blur();
        });
        this._body.bind('scxToolbarButton-otherButtonActivated', function (e, target) {
            _this._triggerActiveButton(target);
        });
        if (this._hasChildren) {
            this._itemsWrapper
                .hide()
                .addClass(this._rootElement.attr(DATA_TYPE))
                .appendTo(this._body);
            this._body.bind('scxToolbarButton-otherDropdownActivated', function () {
                _this._hideDropDown();
                _this._deactivateButton();
            });
            if (!this._canFireFromHead) {
                this._btnActivate.attr(DATA_VALUE, this._items.first().attr(DATA_VALUE));
            }
            this._btn_toggleDropDown.focus(function (e) {
                $(e.currentTarget).blur();
            });
            this._body.click(function (evt) {
                if (_this._isActive && $(evt.target).parents(_this._rootElement.selector).length === 0) {
                    _this._hideDropDown();
                }
            });
            this._items.click(function (e) {
                var val = $(e.currentTarget).attr(DATA_VALUE);
                _this._setValue(val);
            });
            if (this._config.selectedItem) {
                this._setValue(this._config.selectedItem);
            }
        }
    };
    ;
    ToolbarDropDownButton.prototype._setValue = function (val, fire) {
        this._deactivateButton(fire);
        this._items.removeClass('active');
        if (!this._canFireFromHead) {
            this._items.parent()
                .find("[" + DATA_VALUE + "=\"" + val + "\"]")
                .addClass('active');
            this._btnActivate.attr(DATA_VALUE, val);
        }
        this._activateButton(fire, val);
        this._hideDropDown();
    };
    ;
    ToolbarDropDownButton.prototype._triggerActiveButton = function (target) {
        if (!$(target).is(this._btnActivate) && this._canToggle) {
            this._deactivateButton();
        }
    };
    ToolbarDropDownButton.prototype._activateButton = function (fire, dataValue) {
        this._isActivated = true;
        if (this._canToggle) {
            this._rootElement.addClass('activated');
            this._itemsWrapper.addClass('activated');
            this._body.trigger('scxToolbarButton-otherButtonActivated', this._btnActivate);
        }
        if (this._canFireFromHead) {
            this._config.selectionChanged(dataValue, this._isActivated);
        }
        else if (fire !== false && this._config.selectionChanged) {
            this._config.selectionChanged(this._btnActivate.attr(DATA_VALUE), this._isActivated);
        }
    };
    ;
    ToolbarDropDownButton.prototype._deactivateButton = function (fire) {
        if (this._isActivated) {
            this._isActivated = false;
            if (this._canToggle) {
                this._rootElement.removeClass('activated');
                this._itemsWrapper.removeClass('activated');
            }
            if (fire !== false && this._config.selectionChanged && !this._canFireFromHead) {
                this._config.selectionChanged(this._btnActivate.attr(DATA_VALUE), this._isActivated);
            }
        }
    };
    ;
    ToolbarDropDownButton.prototype._toggleButton = function (e) {
        if (this._isActivated)
            this._deactivateButton();
        else
            this._activateButton();
        e.stopPropagation();
    };
    ;
    ToolbarDropDownButton.prototype._fireFromHead = function () {
        if (this._isActive) {
            this._hideDropDown();
        }
        else {
            var val = this._btnActivate.attr(DATA_VALUE);
            this._config.selectionChanged(val);
        }
    };
    ;
    ToolbarDropDownButton.prototype._showDropDown = function () {
        this._body.trigger('scxToolbarButton-otherDropdownActivated');
        this._rootElement.addClass('active');
        this._itemsWrapper.css({
            top: this._rootElement.outerHeight(true) + this._rootElement.offset().top,
            left: this._rootElement.offset().left
        }).show();
        this._isActive = true;
    };
    ;
    ToolbarDropDownButton.prototype._hideDropDown = function () {
        this._itemsWrapper.hide();
        this._rootElement.removeClass('active');
        this._isActive = false;
    };
    ;
    ToolbarDropDownButton.prototype._toggleDropDown = function () {
        if (this._isActive)
            this._hideDropDown();
        else
            this._showDropDown();
    };
    ;
    return ToolbarDropDownButton;
}());
export { ToolbarDropDownButton };
//# sourceMappingURL=ToolbarDropDownButton.js.map