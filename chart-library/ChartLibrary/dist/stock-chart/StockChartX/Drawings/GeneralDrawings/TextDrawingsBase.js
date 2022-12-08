import { __extends } from "tslib";
import { TextBase } from '../../Drawings/ChartMarkerDrawings/TextBase';
import { DummyCanvasContext } from '../../Utils/DummyCanvasContext';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
var TextDrawingsBase = (function (_super) {
    __extends(TextDrawingsBase, _super);
    function TextDrawingsBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._draggedWrappingPoint = null;
        return _this;
    }
    TextDrawingsBase.prototype.bounds = function () {
        var borderPadding = 10;
        var boundsRect = this.getTextRectangle();
        boundsRect.left -= borderPadding;
        boundsRect.top -= borderPadding;
        boundsRect.width += 2 * borderPadding;
        boundsRect.height += 2 * borderPadding;
        return boundsRect;
    };
    TextDrawingsBase.prototype.getTextRectangle = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        var size = this.getLongestLineSize();
        var boundsRect = {
            left: point.x,
            top: point.y,
            width: size.width,
            height: size.height * this.lines.length
        };
        var theme = this.getDrawingTheme();
        var result = {
            left: point.x,
            top: point.y,
            width: theme.text.textWrapEnabled ? this.textWrapWidth : boundsRect.width,
            height: theme.text.textWrapEnabled ? size.height * this.getWrappedLines().length : boundsRect.height,
        };
        return result;
    };
    TextDrawingsBase.prototype.hitTest = function (point) {
        var boundsRect = this.bounds();
        var result = boundsRect && Geometry.isPointInsideOrNearRect(point, boundsRect);
        return result;
    };
    TextDrawingsBase.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var rightPoint = this.rightCenterBorderPoint();
                if (Geometry.isPointNearPoint(event.pointerPosition, rightPoint)) {
                    this._draggedWrappingPoint = rightPoint;
                    return true;
                }
                break;
            case GestureState.CONTINUED:
                if (this._draggedWrappingPoint != null) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.textWrapWidth = this.textWrapWidth + (magnetChartPoint.x - this.rightCenterBorderPoint().x);
                    if (this.textWrapWidth <= 120) {
                        this.textWrapWidth = 120;
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._draggedWrappingPoint = null;
                break;
        }
        return false;
    };
    TextDrawingsBase.prototype.draw = function () {
        if (!this.visible)
            return;
        var lines = this.lines;
        if (lines.length === 0)
            return;
        var point = this.cartesianPoint(0);
        if (!point)
            return;
        this.drawBackgroundIfNeeded();
        this.drawBorderIfNeeded();
        this.drawText(lines, point);
        if (this.selected) {
            this.drawWrapBorderIfNeeded();
            this._drawSelectionMarkers(this.getMarkerPoints());
        }
    };
    TextDrawingsBase.prototype.drawText = function (lines, point) {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        var lineHeight = DummyCanvasContext.measureText(lines[0], this.getDrawingTheme().text).height;
        var textRectangleHeight = point.y;
        var x = this.xByTextDirection();
        for (var _i = 0, _a = this.getLines(); _i < _a.length; _i++) {
            var line = _a[_i];
            this.context.fillText(line, x, textRectangleHeight);
            textRectangleHeight += lineHeight;
        }
    };
    TextDrawingsBase.prototype.xByTextDirection = function () {
        var point = this.cartesianPoint(0);
        var x;
        var boundsRect = this.getTextRectangle();
        if (this.context.textAlign == 'right') {
            x = point.x + boundsRect.width;
        }
        else if (this.context.textAlign == 'center') {
            x = point.x + (boundsRect.width / 2);
        }
        else {
            x = point.x;
        }
        return x;
    };
    TextDrawingsBase.prototype.drawBackgroundIfNeeded = function () {
        if (this.getDrawingTheme().text.textBackgroundEnabled) {
            var rect = this.bounds();
            this.context.scxApplyFillTheme({ fillColor: this.getDrawingTheme().fill.fillColor });
            this.context.fillRect(rect.left, rect.top, rect.width, rect.height);
        }
    };
    TextDrawingsBase.prototype.drawBorderIfNeeded = function () {
        this.context.beginPath();
        if (this.getDrawingTheme().text.textBorderEnabled) {
            var rect = this.bounds();
            this.context.scxStroke(this.getDrawingTheme().borderLine);
            this.context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }
    };
    TextDrawingsBase.prototype.drawWrapBorderIfNeeded = function () {
        if (this.getDrawingTheme().text.textWrapEnabled && !this.getDrawingTheme().text.textBorderEnabled) {
            var textRect = this.bounds();
            this.context.scxStroke({ strokeColor: this.getDrawingTheme().text.fillColor, width: 1 });
            this.context.setLineDash([2]);
            this.context.strokeRect(textRect.left, textRect.top, textRect.width, textRect.height);
        }
    };
    TextDrawingsBase.prototype.getMarkerPoints = function () {
        var markers = [this.bottomCenterBorderPoint()];
        if (this.getDrawingTheme().text.textWrapEnabled) {
            markers.push(this.rightCenterBorderPoint());
        }
        return markers;
    };
    TextDrawingsBase.prototype.bottomCenterBorderPoint = function () {
        var rect = this.bounds();
        return {
            x: rect.left + rect.width / 2, y: rect.top + rect.height
        };
    };
    TextDrawingsBase.prototype.rightCenterBorderPoint = function () {
        var point = this.cartesianPoint(0), lines = this.lines, theme = this.getDrawingTheme();
        var rect = this.bounds();
        return {
            x: rect.left + rect.width,
            y: rect.top + rect.height / 2
        };
    };
    TextDrawingsBase.prototype.deleteDrawingIfNoTextExists = function () {
        return true;
    };
    return TextDrawingsBase;
}(TextBase));
export { TextDrawingsBase };
//# sourceMappingURL=TextDrawingsBase.js.map