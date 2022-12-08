/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

const DATA_VALUE = 'data-scxValue';
const DATA_TYPE = 'data-type';

export interface IToolbarDropDownButtonConfig {
    selectedItem: string;
    selectionChanged: (dataValue: string, isActivated?: boolean) => void;
}

export class ToolbarDropDownButton {
    private _config: IToolbarDropDownButtonConfig;
    private _rootElement: JQuery;
    private _btnWrapper: JQuery;
    private _btnActivate: JQuery;
    private _body = $('body');
    private _canToggle = true;
    private _canFireFromHead: boolean;
    private _hasChildren = false;
    private _isActivated = false;
    private _isActive = false;
    private _btn_toggleDropDown: JQuery;
    private _itemsWrapper: JQuery;
    private _items: JQuery;


    constructor(rootElement: JQuery, config: IToolbarDropDownButtonConfig) {
        this._config = config;
        this._rootElement = rootElement;
        this._init();
    }

    public selectItem(val: string, fire: boolean): void {
        this._setValue(val, fire);
    }

    public deactivate(): void {
        this._deactivateButton();
    }

    private _init(): void {
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

        this._btnWrapper.on('click', (e: JQueryEventObject) => {
            let target = $(e.target);

            if (target.is(this._btnActivate)) {
                if (this._canToggle) {
                    this._toggleButton(e);
                }
                else if (this._canFireFromHead) {
                    this._fireFromHead();
                }
                else if (this._hasChildren && !this._canToggle && !this._canFireFromHead) {
                    this._toggleDropDown();
                }
            }

            else if (target.is(this._btn_toggleDropDown)) {
                this._toggleDropDown();
            }

            else if (this._hasChildren) {
                this._toggleDropDown();
            }
        });

        this._btnActivate.focus((e: JQueryEventObject) => {
            $(e.currentTarget).blur();
        });

        this._body.bind('scxToolbarButton-otherButtonActivated', (e: JQueryEventObject, target: Object) => {
            this._triggerActiveButton(target);
        });


        if (this._hasChildren) {

            this._itemsWrapper
                .hide()
                .addClass(this._rootElement.attr(DATA_TYPE))
                .appendTo(this._body);

            this._body.bind('scxToolbarButton-otherDropdownActivated', () => {
                this._hideDropDown();
                this._deactivateButton();
            });

            if (!this._canFireFromHead) {
                this._btnActivate.attr(DATA_VALUE, this._items.first().attr(DATA_VALUE));
            }

            this._btn_toggleDropDown.focus((e: JQueryEventObject) => {
                $(e.currentTarget).blur();
            });

            this._body.click((evt: JQueryEventObject) => {
                if (this._isActive && $(evt.target).parents(this._rootElement.selector).length === 0) {
                    this._hideDropDown();
                }
            });

            this._items.click((e: JQueryEventObject) => {
                let val = $(e.currentTarget).attr(DATA_VALUE);
                this._setValue(val);
            });

            if (this._config.selectedItem) {
                this._setValue(this._config.selectedItem);
            }
        }
    };

    private _setValue(val?: string, fire?: boolean): void {
        this._deactivateButton(fire);
        this._items.removeClass('active');

        if (!this._canFireFromHead) {
            this._items.parent()
                .find(`[${DATA_VALUE}="${val}"]`)
                .addClass('active');
            this._btnActivate.attr(DATA_VALUE, val);
        }

        this._activateButton(fire, val);
        this._hideDropDown();
    };

    private _triggerActiveButton(target: Object): void {
        if (!$(target).is(this._btnActivate) && this._canToggle) {
            this._deactivateButton();
        }
    }

    private _activateButton(fire?: boolean, dataValue?: string): void {
        this._isActivated = true;

        if (this._canToggle) {
            this._rootElement.addClass('activated');
            this._itemsWrapper.addClass('activated');
            this._body.trigger('scxToolbarButton-otherButtonActivated', this._btnActivate);
        }

        if (this._canFireFromHead) {
            this._config.selectionChanged(dataValue, this._isActivated);
        } else if (fire !== false && this._config.selectionChanged) {
            this._config.selectionChanged(this._btnActivate.attr(DATA_VALUE), this._isActivated);
        }
    };

    private _deactivateButton(fire?: boolean): void {
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

    private _toggleButton(e: JQueryEventObject): void {
        if (this._isActivated)
            this._deactivateButton();
        else
            this._activateButton();
        e.stopPropagation();
    };

    private _fireFromHead(): void {
        if (this._isActive) {
            this._hideDropDown();
        } else {
            let val = this._btnActivate.attr(DATA_VALUE);
            this._config.selectionChanged(val);
        }
    };

    private _showDropDown(): void {
        this._body.trigger('scxToolbarButton-otherDropdownActivated');
        this._rootElement.addClass('active');

        this._itemsWrapper.css({
            top: this._rootElement.outerHeight(true) + this._rootElement.offset().top,
            left: this._rootElement.offset().left
        }).show();

        this._isActive = true;
    };

    private _hideDropDown(): void {
        this._itemsWrapper.hide();
        this._rootElement.removeClass('active');
        this._isActive = false;
    };

    private _toggleDropDown(): void {
        if (this._isActive)
            this._hideDropDown();
        else
            this._showDropDown();
    };
}
