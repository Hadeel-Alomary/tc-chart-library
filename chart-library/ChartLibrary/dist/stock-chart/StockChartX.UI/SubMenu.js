import { BrowserUtils } from '../../utils';
var Class = {
    DROP_DOWN_MENU: 'dropdown-menu',
};
var SubMenu = (function () {
    function SubMenu(subMenuElement) {
        var _this = this;
        this.inControl = false;
        this.container = subMenuElement;
        $('body').on('closeallsubmenu', function () {
            _this.hide();
        });
    }
    SubMenu.prototype.show = function () {
        this.closeAllSubMenu();
        this.container.addClass('expand');
    };
    SubMenu.prototype.hide = function () {
        this.container.removeClass('expand');
    };
    SubMenu.prototype.closeAllSubMenu = function () {
        $('body').trigger('closeallsubmenu');
    };
    SubMenu.prototype._onClick = function () {
        var _this = this;
        if (BrowserUtils.isDesktop()) {
            return;
        }
        this.inControl = !this.inControl;
        window.setTimeout(function () {
            if (!_this.inControl) {
                _this.hide();
            }
            else {
                _this.show();
                _this._setSubMenuDropdownStyle();
            }
        }, 200);
    };
    SubMenu.prototype._onMouseEnter = function () {
        var _this = this;
        if (BrowserUtils.isMobile()) {
            return;
        }
        this.inControl = true;
        window.setTimeout(function () {
            if (!_this.inControl) {
                return;
            }
            _this._setSubMenuDropdownStyle();
            _this.show();
        }, 200);
    };
    SubMenu.prototype._onMouseLeave = function () {
        var _this = this;
        if (BrowserUtils.isMobile()) {
            return;
        }
        this.inControl = false;
        window.setTimeout(function () {
            if (!_this.inControl) {
                _this.hide();
            }
        }, 200);
    };
    SubMenu.prototype._setSubMenuDropdownStyle = function () {
        this.container
            .find('.' + Class.DROP_DOWN_MENU)
            .css({
            'top': '-4px',
            'right': this.container.parent().width() + 'px',
            'left': 0 - this.container.parent().width() + 'px',
        });
        this.forceElementWithinScreenBounds();
    };
    SubMenu.prototype.forceElementWithinScreenBounds = function () {
        var dropdownSubMenu = this.container.find('.' + Class.DROP_DOWN_MENU);
        var PADDING = 20;
        if (dropdownSubMenu.offset().left < PADDING) {
            var outOfScreenWidth = PADDING - dropdownSubMenu.offset().left;
            var newRight = parseInt(dropdownSubMenu.css('right')) - outOfScreenWidth;
            dropdownSubMenu.css('right', newRight + 'px');
        }
        if (window.innerHeight < (this.container.offset().top + dropdownSubMenu.height() + PADDING)) {
            var top_1 = 0 - (this.container.offset().top + dropdownSubMenu.height() - window.innerHeight + PADDING);
            dropdownSubMenu.css('top', top_1 + 'px');
        }
    };
    return SubMenu;
}());
export { SubMenu };
//# sourceMappingURL=SubMenu.js.map