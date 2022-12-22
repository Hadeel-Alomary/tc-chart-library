import {BrowserUtils} from '../../utils';

const Class = {
    DROP_DOWN_MENU: 'dropdown-menu',
};

export class SubMenu {
    private inControl: boolean = false;
    private container: JQuery;

    constructor(subMenuElement: JQuery) {
        this.container = subMenuElement;

        // HA : if we open sub menu then click on another menu we should close opened sub menu .
        $('body').on('closeallsubmenu', () => {
            this.hide();
        });
    }

    private show() {
        // HA : in case we have more than one submenu in same menu , close previous one .
        this.closeAllSubMenu();
        this.container.addClass('expand');
    }

    private hide() {
        this.container.removeClass('expand');
    }

    private closeAllSubMenu() {
        $('body').trigger('closeallsubmenu');
    }

    _onClick() {
        if (BrowserUtils.isDesktop()) { return; }

        this.inControl = !this.inControl;
        window.setTimeout(() => {
            if (!this.inControl) {
                this.hide();
            } else {
                this.show();
                this._setSubMenuDropdownStyle();
            }
        }, 200);
    }

    _onMouseEnter() {
        if (BrowserUtils.isMobile()) { return; }

        this.inControl = true;
        window.setTimeout(() => {
            if (!this.inControl) { return; }

            this._setSubMenuDropdownStyle();
            this.show();
        }, 200);
    }

    _onMouseLeave() {
        if (BrowserUtils.isMobile()) { return; }

        this.inControl = false;
        window.setTimeout(() => {
            if (!this.inControl) {
                this.hide();
            }
        }, 200);
    }

    private _setSubMenuDropdownStyle(): void {
        this.container
            .find('.' + Class.DROP_DOWN_MENU)
            .css({
                'top': '-4px',
                'right': this.container.parent().width() + 'px',
                'left': 0 - this.container.parent().width() + 'px',
            });

        this.forceElementWithinScreenBounds();
    }


    private forceElementWithinScreenBounds() {
        let dropdownSubMenu = this.container.find('.' + Class.DROP_DOWN_MENU);
        let PADDING: number = 20;

        if (dropdownSubMenu.offset().left < PADDING) {
            let outOfScreenWidth: number = PADDING - dropdownSubMenu.offset().left;
            let newRight = parseInt(dropdownSubMenu.css('right')) - outOfScreenWidth;
            dropdownSubMenu.css('right', newRight + 'px');
        }

        if (window.innerHeight < (this.container.offset().top + dropdownSubMenu.height() + PADDING)) {
            let top = 0 - (this.container.offset().top + dropdownSubMenu.height() - window.innerHeight + PADDING);
            dropdownSubMenu.css('top', top + 'px');
        }
    }

}
