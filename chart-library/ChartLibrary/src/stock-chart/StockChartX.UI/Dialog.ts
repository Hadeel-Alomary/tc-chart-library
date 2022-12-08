/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Chart} from "../StockChartX/Chart";

export interface IDialogConfig {
    chart: Chart;
}

export interface IDialog {
    show(config: IDialogConfig): void;

    hide(): void;
}

export interface IDialogContent {
    dialog: JQuery;
    root: JQuery;
    header: JQuery;
    body: JQuery;
    footer: JQuery;
}


const SETTING_OPTIONS = {
    APPLY_ONCE: 'applyOnce',
    MAKE_AS_DEFAULT: 'makeDefault',
    RESET_DEFAULT_SETTINGS: 'resetDefault'
};

export class Dialog implements IDialog {
    protected _isShown: boolean;
    protected _config: IDialogConfig;
    protected _dialog: JQuery;
    protected _dialogContent: IDialogContent;

    constructor(rootContainer: JQuery) {
        this._isShown = false;
        this._dialog = rootContainer;
        this._dialog.find('> .modal-dialog').draggable({handle: '.modal-header'});
        this._dialog.on('hidden.bs.modal', () => {
            this._isShown && this.hide();
        });

        this._initDialogContentObj();
    }

    public show(config: IDialogConfig): void {
        this._isShown = true;
        this._dialog.modal();
        this._adjustDialogHeight();
        $('.modal-backdrop').addClass('no-background');//NK to hide the black background for all chart modals (draggable)
    }

    public hide(): void {
        if (!this._isShown)
            return;

        this._isShown = false;
        this._dialog.modal('hide');
    }

    protected get settingOptions() {
        return SETTING_OPTIONS;
    }

    private _initDialogContentObj(): void {
        let dialog = this._dialog.find('> .modal-dialog');
        let root = dialog.find('> .modal-content');

        this._dialogContent = {
            dialog: dialog,
            root: root,
            header: root.find('> .modal-header'),
            body: root.find('> .modal-body'),
            footer: root.find('> .modal-footer')
        };
    }

    protected _adjustDialogHeight(): void {
        this._dialogContent.body.css('height', 'auto');

        let windowHeight = $(window).height();
        let dialogHeight = this._dialogContent.dialog.outerHeight(true);

        if (windowHeight < dialogHeight) {
            let dialogVerticalIndent = dialogHeight - this._dialogContent.dialog.height();
            let bodyVerticalIndent = this._dialogContent.body.outerHeight(true) - this._dialogContent.body.height();

            let headerHeight = this._dialogContent.header.outerHeight(true);
            let footerHeight = this._dialogContent.footer.outerHeight(true);

            let height = windowHeight - headerHeight - footerHeight - bodyVerticalIndent - dialogVerticalIndent;
            this._dialogContent.body.height(height);
        }
    }

    protected addOnChangeEventForNumericField(config: {[key:string]:unknown}) {
        if (!config['onChange']) {
            config['onChange'] = (value: number, obj: JQuery) => {
                //NK give the changed input time to update it's value so element.val() returns the correct value
                setTimeout(() => {
                    this.onChangeHandler();
                });
            };
        }
        return config;
    }

    protected _apply(applySaveSettings: boolean = true) {

    }

    protected onChangeHandler() {
        if (this._isShown) {
            this._apply(false);
        }
    }
}

