/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {BrowserUtils} from '../../utils';
import {SubMenu} from './SubMenu';

const Class = {
    CHECKABLE: 'scxMenuItemCheckable',
    CHECKED: 'scxMenuItemChecked',
    DISABLED: 'disabled',
    DROP_DOWN_MENU: 'dropdown-menu',
    WITH_SUB_MENU: 'scxMenuItemWithSubMenu',
    CONTEXT_MENU:'scxContextMenu',
};

export interface IContextMenuConfig {
    menuContainer?: JQuery; // MA compile typescript - make it optional
    showOnClick?: boolean; // MA compile typescript - make it optional
    onItemSelected: (selectedMenu: JQuery, isChecked?: boolean) => void;
    onShow?: () => void;
}

export class ContextMenu {
    private _config: IContextMenuConfig;
    private _isShown = false;

    constructor(config: IContextMenuConfig, targetDomObject?: JQuery) {
        this._config = config;
        let body = $('body');

        if (targetDomObject) {
            targetDomObject.on('contextmenu', (e: JQueryEventObject) => {
                this.show(e);
                return false;
            });

            if (config.showOnClick) {
                targetDomObject.on('click', (e: JQueryEventObject) => {
                    this.show(e);
                    return false;
                });
            }
        }

        $(document).on('click', () => {
            if (this._isShown)
                this.hide();
        });

        body.on('closeallcontextmenu', () => {
            if (this._isShown)
                this.hide();
        });
    }

    hide(): void {
        this._isShown = false;
        this.closeAllSubMenu();
        this._config.menuContainer.hide();
    }

    private closeAllSubMenu() {
        $('body').trigger('closeallsubmenu');
    }

    private closeAnyOpenedContextMenu() {
        $('body').trigger('closeallcontextmenu');
    }

    show(e: JQueryEventObject): void {
        this.closeAnyOpenedContextMenu();

        if (this._config.onShow)
            this._config.onShow();

        if (!this._config.menuContainer)
            return;

        this._config.menuContainer
            .data('target', $(e.target))
            .show()
            .css({
                left: this._getLeftLocation(e),
                right: this._getRightLocation(e),
                top: this._getTopLocation(e)
            })
            .off('click')
            .on('click', (e: JQueryEventObject) => {
                if (!this._config.onItemSelected)
                    return false;

                let selectedMenuItem =$(e.target).is("li") ? $(e.target): $(e.target).parent('li');

                let hasSubMenu = selectedMenuItem.hasClass(Class.WITH_SUB_MENU) || selectedMenuItem.hasClass(Class.WITH_SUB_MENU);
                if (selectedMenuItem.hasClass(Class.DISABLED) || hasSubMenu || !selectedMenuItem.is('li'))
                    return false;

                if (selectedMenuItem.hasClass(Class.CHECKABLE)) {
                    let isChecked = selectedMenuItem.hasClass(Class.CHECKED);
                    !isChecked
                        ? selectedMenuItem.addClass(Class.CHECKED)
                        : selectedMenuItem.removeClass(Class.CHECKED);

                    this._config.onItemSelected(selectedMenuItem, !isChecked);
                }
                else {
                    this._config.onItemSelected(selectedMenuItem);
                }

                e.preventDefault();
                this.hide();
            })
            .find('.' + Class.WITH_SUB_MENU).each(function () {
                let subMenu = new SubMenu($(this));
                $(this).on('mouseenter', () => {
                    subMenu._onMouseEnter();
                });
                $(this).on('mouseleave', () => {
                    subMenu._onMouseLeave();
                });
                $(this).on('click', () => {
                    subMenu._onClick();
                });
            });

        this._isShown = true;
    }

    private _getLeftLocation(e: JQueryEventObject): number {
        let mouseWidth = e.pageX;
        let pageWidth = $(window).width();
        let menuWidth = this._config.menuContainer.width();

        if (mouseWidth + menuWidth > pageWidth && menuWidth < mouseWidth)
            return mouseWidth - menuWidth;

        return mouseWidth;
    }

    private _getRightLocation(e: JQueryEventObject): number {
        let mouseWidth = e.pageX;
        let pageWidth = $(window).width();
        let menuWidth = this._config.menuContainer.width();

        let padding: number = 10;
        if (mouseWidth - menuWidth < padding)
            return pageWidth - menuWidth - padding;

        return pageWidth - mouseWidth;
    }

    private _getTopLocation(e: JQueryEventObject): number {
        let mouseHeight = e.pageY;
        let pageHeight = $(window).height();
        let menuHeight = this._config.menuContainer.height();
        let padding = 20;

        if (mouseHeight + menuHeight + 20 > pageHeight && menuHeight < mouseHeight)
            return pageHeight - menuHeight - padding;

        return mouseHeight;
    }

}
