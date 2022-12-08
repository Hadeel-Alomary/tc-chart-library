import { SubMenu } from './SubMenu';
var Class = {
    CHECKABLE: 'scxMenuItemCheckable',
    CHECKED: 'scxMenuItemChecked',
    DISABLED: 'disabled',
    DROP_DOWN_MENU: 'dropdown-menu',
    WITH_SUB_MENU: 'scxMenuItemWithSubMenu',
    CONTEXT_MENU: 'scxContextMenu',
};
var ContextMenu = (function () {
    function ContextMenu(config, targetDomObject) {
        var _this = this;
        this._isShown = false;
        this._config = config;
        var body = $('body');
        if (targetDomObject) {
            targetDomObject.on('contextmenu', function (e) {
                _this.show(e);
                return false;
            });
            if (config.showOnClick) {
                targetDomObject.on('click', function (e) {
                    _this.show(e);
                    return false;
                });
            }
        }
        $(document).on('click', function () {
            if (_this._isShown)
                _this.hide();
        });
        body.on('closeallcontextmenu', function () {
            if (_this._isShown)
                _this.hide();
        });
    }
    ContextMenu.prototype.hide = function () {
        this._isShown = false;
        this.closeAllSubMenu();
        this._config.menuContainer.hide();
    };
    ContextMenu.prototype.closeAllSubMenu = function () {
        $('body').trigger('closeallsubmenu');
    };
    ContextMenu.prototype.closeAnyOpenedContextMenu = function () {
        $('body').trigger('closeallcontextmenu');
    };
    ContextMenu.prototype.show = function (e) {
        var _this = this;
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
            .on('click', function (e) {
            if (!_this._config.onItemSelected)
                return false;
            var selectedMenuItem = $(e.target).is("li") ? $(e.target) : $(e.target).parent('li');
            var hasSubMenu = selectedMenuItem.hasClass(Class.WITH_SUB_MENU) || selectedMenuItem.hasClass(Class.WITH_SUB_MENU);
            if (selectedMenuItem.hasClass(Class.DISABLED) || hasSubMenu || !selectedMenuItem.is('li'))
                return false;
            if (selectedMenuItem.hasClass(Class.CHECKABLE)) {
                var isChecked = selectedMenuItem.hasClass(Class.CHECKED);
                !isChecked
                    ? selectedMenuItem.addClass(Class.CHECKED)
                    : selectedMenuItem.removeClass(Class.CHECKED);
                _this._config.onItemSelected(selectedMenuItem, !isChecked);
            }
            else {
                _this._config.onItemSelected(selectedMenuItem);
            }
            e.preventDefault();
            _this.hide();
        })
            .find('.' + Class.WITH_SUB_MENU).each(function () {
            var subMenu = new SubMenu($(this));
            $(this).on('mouseenter', function () {
                subMenu._onMouseEnter();
            });
            $(this).on('mouseleave', function () {
                subMenu._onMouseLeave();
            });
            $(this).on('click', function () {
                subMenu._onClick();
            });
        });
        this._isShown = true;
    };
    ContextMenu.prototype._getLeftLocation = function (e) {
        var mouseWidth = e.pageX;
        var pageWidth = $(window).width();
        var menuWidth = this._config.menuContainer.width();
        if (mouseWidth + menuWidth > pageWidth && menuWidth < mouseWidth)
            return mouseWidth - menuWidth;
        return mouseWidth;
    };
    ContextMenu.prototype._getRightLocation = function (e) {
        var mouseWidth = e.pageX;
        var pageWidth = $(window).width();
        var menuWidth = this._config.menuContainer.width();
        var padding = 10;
        if (mouseWidth - menuWidth < padding)
            return pageWidth - menuWidth - padding;
        return pageWidth - mouseWidth;
    };
    ContextMenu.prototype._getTopLocation = function (e) {
        var mouseHeight = e.pageY;
        var pageHeight = $(window).height();
        var menuHeight = this._config.menuContainer.height();
        var padding = 20;
        if (mouseHeight + menuHeight + 20 > pageHeight && menuHeight < mouseHeight)
            return pageHeight - menuHeight - padding;
        return mouseHeight;
    };
    return ContextMenu;
}());
export { ContextMenu };
//# sourceMappingURL=ContextMenu.js.map