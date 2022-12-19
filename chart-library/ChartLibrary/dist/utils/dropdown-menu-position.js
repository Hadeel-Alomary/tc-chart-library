var DropdownMenuPosition = (function () {
    function DropdownMenuPosition() {
    }
    DropdownMenuPosition.prototype.position = function (nativeEl) {
        var elBCR = this.offset(nativeEl);
        var offsetParentBCR = { top: 0, left: 0, right: 0 };
        var offsetParent = this.parentOffsetEl(nativeEl);
        if (offsetParent !== this.document) {
            var offsetParentEl = offsetParent;
            offsetParentBCR = this.offset(offsetParentEl);
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }
        else {
            throw "expecting to have an offset parent for dropdown menu";
        }
        var boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left,
            right: offsetParentBCR.right - elBCR.right
        };
    };
    DropdownMenuPosition.prototype.offset = function (nativeEl) {
        var boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: boundingClientRect.top + (this.window.pageYOffset || this.document.documentElement.scrollTop),
            left: boundingClientRect.left + (this.window.pageXOffset || this.document.documentElement.scrollLeft),
            right: boundingClientRect.right
        };
    };
    Object.defineProperty(DropdownMenuPosition.prototype, "window", {
        get: function () {
            return window;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropdownMenuPosition.prototype, "document", {
        get: function () {
            return window.document;
        },
        enumerable: false,
        configurable: true
    });
    DropdownMenuPosition.prototype.getStyle = function (nativeEl, cssProp) {
        if (nativeEl.currentStyle) {
            return nativeEl.currentStyle[cssProp];
        }
        if (this.window.getComputedStyle) {
            return this.window.getComputedStyle(nativeEl)[cssProp];
        }
        return nativeEl.style[cssProp];
    };
    DropdownMenuPosition.prototype.isStaticPositioned = function (nativeEl) {
        return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
    };
    DropdownMenuPosition.prototype.parentOffsetEl = function (nativeEl) {
        var offsetParent = nativeEl.offsetParent || this.document;
        while (offsetParent && offsetParent !== this.document &&
            this.isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || this.document;
    };
    ;
    return DropdownMenuPosition;
}());
export { DropdownMenuPosition };
//# sourceMappingURL=dropdown-menu-position.js.map