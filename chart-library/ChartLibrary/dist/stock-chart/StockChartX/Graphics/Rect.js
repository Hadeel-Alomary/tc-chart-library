var Rect = (function () {
    function Rect(rect) {
        this.left = null;
        this.top = null;
        this.width = null;
        this.height = null;
        rect = rect || {};
        this.left = rect.left || 0;
        this.top = rect.top || 0;
        this.width = rect.width || 0;
        this.height = rect.height || 0;
    }
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () {
            return this.top + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        get: function () {
            return this.left + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.clone = function () {
        return new Rect(this);
    };
    Rect.prototype.equals = function (rect) {
        return rect && this.left === rect.left && this.top === rect.top && this.width === rect.width && this.height === rect.height;
    };
    Rect.prototype.toString = function () {
        return "[left: " + this.left + ", top: " + this.top + ", width: " + this.width + ", height: " + this.height + "]";
    };
    Rect.prototype.containsPoint = function (point) {
        return point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom;
    };
    Rect.prototype.cropLeft = function (rect) {
        var rectRight = rect.right;
        if (this.left < rectRight) {
            this.width = this.right - rectRight;
            this.left = rectRight;
        }
    };
    Rect.prototype.cropRight = function (rect) {
        if (this.right >= rect.left) {
            this.width = rect.left - 1 - this.left;
        }
    };
    Rect.prototype.cropTop = function (rect) {
        var rectBottom = rect.bottom;
        if (this.top < rectBottom) {
            this.height = this.bottom - rectBottom;
            this.top = rectBottom;
        }
    };
    Rect.prototype.cropBottom = function (rect) {
        if (this.bottom > rect.top) {
            this.height = rect.top - this.top;
        }
    };
    Rect.prototype.copyFrom = function (rect) {
        this.left = rect.left;
        this.top = rect.top;
        this.width = rect.width;
        this.height = rect.height;
    };
    Rect.prototype.applyPadding = function (padding) {
        if (padding.left) {
            this.left += padding.left;
            this.width -= padding.left;
        }
        if (padding.top) {
            this.top += padding.top;
            this.height -= padding.top;
        }
        if (padding.right)
            this.width -= padding.right;
        if (padding.bottom)
            this.height -= padding.bottom;
    };
    return Rect;
}());
export { Rect };
//# sourceMappingURL=Rect.js.map