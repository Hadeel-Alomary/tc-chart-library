import { DashArray, FontDefaults, LineStyle, StrokeDefaults, StrokePriority } from "../Theme";
var _lineDashFunc;
$.extend(CanvasRenderingContext2D.prototype, {
    scxApplyStrokeTheme: function (theme) {
        if (!theme || theme.strokeEnabled === false)
            return this;
        switch (theme.strokePriority || StrokeDefaults.strokePriority) {
            case StrokePriority.COLOR:
                this.strokeStyle = theme.strokeColor || StrokeDefaults.strokeColor;
                break;
        }
        this.lineCap = theme.lineCap || StrokeDefaults.lineCap;
        this.lineJoin = theme.lineJoin || StrokeDefaults.lineJoin;
        this.lineWidth = theme.width || StrokeDefaults.width;
        this.textAlign = theme.textAlign || StrokeDefaults.textAlign;
        this.textBaseline = theme.textBaseline || StrokeDefaults.textBaseline;
        var dashArray;
        switch (theme.lineStyle || StrokeDefaults.lineStyle) {
            case LineStyle.DASH:
                dashArray = [DashArray.DASH[0] * this.lineWidth, DashArray.DASH[1] * this.lineWidth];
                break;
            case LineStyle.DOT:
                dashArray = [DashArray.DOT[0] * this.lineWidth, DashArray.DOT[1] * this.lineWidth];
                break;
            case LineStyle.DASH_DOT:
                dashArray = [DashArray.DASH_DOT[0] * this.lineWidth, DashArray.DASH_DOT[1] * this.lineWidth, DashArray.DASH_DOT[2] * this.lineWidth, DashArray.DASH_DOT[3] * this.lineWidth];
                break;
            default:
                dashArray = [];
                break;
        }
        getLineDashFunc.call(this).call(this, dashArray);
        return this;
    },
    scxApplyFillTheme: function (theme) {
        if (theme) {
            switch (theme.fillPriority) {
                default:
                    if (theme.fillColor) {
                        this.fillStyle = theme.fillColor || 'black';
                    }
                    break;
            }
        }
        return this;
    },
    scxApplyTextTheme: function (theme) {
        this.font = getFont(theme);
        if (!theme || theme.fillEnabled !== false)
            this.scxApplyFillTheme(theme);
        if (!theme || theme.strokeEnabled !== false)
            this.scxApplyStrokeTheme(theme);
        return this;
    },
    scxFill: function (theme, force) {
        if (force || (theme && theme.fillEnabled !== false)) {
            this.scxApplyFillTheme(theme);
            this.fill();
        }
        return this;
    },
    scxStroke: function (theme, force) {
        if (force || (theme && theme.strokeEnabled !== false)) {
            this.scxApplyStrokeTheme(theme);
            this.stroke();
        }
        return this;
    },
    scxFillStroke: function (fillTheme, strokeTheme) {
        this.scxFill(fillTheme);
        this.scxStroke(strokeTheme);
        return this;
    },
    scxStrokePolyline: function (points, theme) {
        var count = points.length;
        if (count < 2)
            throw new Error('Not enough points.');
        this.beginPath();
        this.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < count; i++) {
            this.lineTo(points[i].x, points[i].y);
        }
        this.scxStroke(theme);
        return this;
    },
    scxFillPolyLine: function (points, theme) {
        var count = points.length;
        if (count < 2)
            throw new Error('Not enough points.');
        this.beginPath();
        this.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < count; i++) {
            this.lineTo(points[i].x, points[i].y);
        }
        this.closePath();
        this.scxFill(theme);
        return this;
    },
    scxRounderRectangle: function (bounds, radius) {
        this.moveTo(bounds.left + radius, bounds.top);
        this.lineTo(bounds.left + bounds.width - radius, bounds.top);
        this.quadraticCurveTo(bounds.left + bounds.width, bounds.top, bounds.left + bounds.width, bounds.top + radius);
        this.lineTo(bounds.left + bounds.width, bounds.top + bounds.height - radius);
        this.quadraticCurveTo(bounds.left + bounds.width, bounds.top + bounds.height, bounds.left + bounds.width - radius, bounds.top + bounds.height);
        this.lineTo(bounds.left + radius, bounds.top + bounds.height);
        this.quadraticCurveTo(bounds.left, bounds.top + bounds.height, bounds.left, bounds.top + bounds.height - radius);
        this.lineTo(bounds.left, bounds.top + radius);
        this.quadraticCurveTo(bounds.left, bounds.top, bounds.left + radius, bounds.top);
        return this;
    },
    scxDrawAntiAliasingLine: function (point1, point2) {
        var translateValue = 0.5;
        this.moveTo(Math.floor(point1.x) + translateValue, Math.floor(point1.y) + translateValue);
        this.lineTo(Math.floor(point2.x) + translateValue, Math.floor(point2.y) + translateValue);
        return this;
    },
    scxDrawArrow: function (point, radians, width, height) {
        radians += 2 * (Math.PI - radians) + Math.PI / 2;
        this.save();
        this.beginPath();
        this.translate(point.x, point.y);
        this.rotate(radians);
        this.moveTo(0, 0);
        this.lineTo(width, height);
        this.moveTo(0, 0);
        this.lineTo(-width, height);
        this.restore();
        return this;
    }
});
function getFont(theme) {
    if (!theme) {
        return FontDefaults.fontSize + 'px ' + FontDefaults.fontFamily;
    }
    var fontStyle = theme.fontStyle || FontDefaults.fontStyle, fontVariant = theme.fontVariant || FontDefaults.fontVariant, fontWeight = theme.fontWeight || FontDefaults.fontWeight, fontSize = theme.fontSize || FontDefaults.fontSize, fontFamily = theme.fontFamily || FontDefaults.fontFamily;
    return fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + 'px ' + fontFamily;
}
function getLineDashFunc() {
    if (!_lineDashFunc) {
        if (this.setLineDash) {
            _lineDashFunc = function (dashArray) {
                this.setLineDash(dashArray);
            };
        }
        else if ('mozDash' in this) {
            _lineDashFunc = function (dashArray) {
                this.mozDash = dashArray;
            };
        }
        else if ('webkitLineDash' in this) {
            _lineDashFunc = function (dashArray) {
                this.webkitLineDash = dashArray;
            };
        }
        else {
            _lineDashFunc = function (dashArray) {
            };
        }
    }
    return _lineDashFunc;
}
//# sourceMappingURL=CanvasExtensions.js.map