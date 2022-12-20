import { Theme } from './Theme';
import { ThemeType } from './ThemeType';
import { Geometry } from './Graphics/Geometry';
var DEVIATION = Geometry.DEVIATION;
import { BrowserUtils } from '../../utils';
var defaultWidth = BrowserUtils.isMobile() ? 12 : DEVIATION;
var SelectionMarker = (function () {
    function SelectionMarker(config) {
        this._width = null;
        config = config || {};
        this._chart = config.chart;
        this.width = config.width;
    }
    Object.defineProperty(SelectionMarker.prototype, "chart", {
        get: function () {
            return this._chart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionMarker.prototype, "width", {
        get: function () {
            return this._width || defaultWidth;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(SelectionMarker.prototype, "actualTheme", {
        get: function () {
            return this._chart.getThemeType() == ThemeType.Light ? Theme.Light.pointerPoint.selectionMarker : Theme.Dark.pointerPoint.selectionMarker;
        },
        enumerable: true,
        configurable: true
    });
    SelectionMarker.prototype.draw = function (context, point, theme) {
        var width = this.width;
        if (BrowserUtils.isMobile()) {
            theme = this.actualTheme;
        }
        if (Array.isArray(point)) {
            context.scxApplyFillTheme(theme.fill);
            context.scxApplyStrokeTheme(theme.line);
            for (var _i = 0, point_1 = point; _i < point_1.length; _i++) {
                var item = point_1[_i];
                context.beginPath();
                context.arc(item.x + 0.5, item.y + 0.5, width, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            }
        }
        else {
            context.beginPath();
            context.arc(point.x + 0.5, point.y + 0.5, width, 0, 2 * Math.PI);
            context.scxFill(theme.fill);
            context.scxStroke(theme.line);
        }
    };
    return SelectionMarker;
}());
export { SelectionMarker };
//# sourceMappingURL=SelectionMarker.js.map