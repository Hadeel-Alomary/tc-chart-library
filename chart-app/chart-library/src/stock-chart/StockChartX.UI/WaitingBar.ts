/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

export interface IWaitingBarConfig {
    text?: string;
    dotsCount?: number;
}

const Class = {
    CONTAINER: 'scxWaitingBarContainer',
    LOADING_TEXT: 'scxWaitingBarText',
    DOTS_CONTAINER: 'scxDotsContainer',
    DOT: 'scxWaitingBarDot'
};

export class WaitingBar {
    private _config: IWaitingBarConfig;
    private _parentContainer: JQuery;
    private _container: JQuery;
    private _isWorkingNow = false;

    constructor(container: JQuery) {
        this._parentContainer = container;
    }

    /**
     * Appends waiting bar's HTML to the DOM.
     * @method show
     * @param {IWaitingBarConfig} config Waiting bar configuration.
     * @memberOf .WaitingBar#
     */
    show(config: IWaitingBarConfig): void {
        if (this._isWorkingNow)
            return;

        this._config = $.extend({
            text: "Loading...",
            dotsCount: 7
        }, config);

        this._isWorkingNow = true;
        this._createDom();
        this._container.show();
    }

    /**
     * Removes waiting bar html from the DOM.
     * @method hide
     * @memberOf .WaitingBar#
     */
    hide(): void {
        this._isWorkingNow = false;
        this._destroy();
    }

    private _createDom(): void {
        this._container = $(`<div class="${Class.CONTAINER}"></div>`)
            .appendTo(this._parentContainer);
        $(`<span class="${Class.LOADING_TEXT}">${this._config.text}</span>`)
            .appendTo(this._container);

        let dotsContainer = $(`<div class="${Class.DOTS_CONTAINER}"></div>`)
            .appendTo(this._container);
        let dots: JQuery[] = [];

        for (let i = 0; i < this._config.dotsCount; i++)
            dots.push($(`<div class="${Class.DOT}"></div>`));

        dotsContainer.append(dots);
    }

    private _destroy(): void {
        this._container.remove();
        this._container = null;
    }
}
