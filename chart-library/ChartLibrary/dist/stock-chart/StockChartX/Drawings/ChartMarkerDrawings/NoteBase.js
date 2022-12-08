import { __extends } from "tslib";
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { DummyCanvasContext } from '../../Utils/DummyCanvasContext';
import { TextBase } from './TextBase';
var NoteBase = (function (_super) {
    __extends(NoteBase, _super);
    function NoteBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rectangle = new NoteRectangle();
        _this.hover = false;
        return _this;
    }
    NoteBase.prototype.pointerBounds = function () {
        var point = this.cartesianPoints()[0];
        if (!point)
            return null;
        var pointerHeight = 19;
        var pointerWidth = 14;
        var x = point.x;
        return {
            left: x - pointerWidth / 2,
            top: point.y - pointerHeight,
            width: pointerWidth,
            height: pointerHeight
        };
    };
    NoteBase.prototype.hitTest = function (point) {
        return Geometry.isPointInsideOrNearRect(point, this.pointerBounds());
    };
    Object.defineProperty(NoteBase.prototype, "textWrapWidth", {
        get: function () {
            return 250;
        },
        set: function (value) {
        },
        enumerable: false,
        configurable: true
    });
    NoteBase.prototype._handleMouseHover = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this.hover = true;
                this.chartPanel.draw();
            case GestureState.CONTINUED:
                this.chartPanel.rootDiv.addClass('drawing-mouse-hover');
                break;
            case GestureState.FINISHED:
                this.chartPanel.rootDiv.addClass('drawing-mouse-hover');
                this.hover = false;
                this.chartPanel.draw();
                break;
        }
    };
    NoteBase.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint(0);
        if (!point) {
            return;
        }
        this.drawPointer();
        this.CoordinatesOfRectangleBasedOnLocation();
        if (this.selected || this.hover) {
            this.drawRect();
        }
        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    };
    NoteBase.prototype.drawPointer = function () {
        var point = this.cartesianPoint(0);
        var pointerHeight = 18.5;
        var startAngle = 40 * Math.PI / 180;
        var endAngle = 140 * Math.PI / 180;
        var context = this.context;
        var x = point.x;
        context.beginPath();
        context.arc(x, point.y - pointerHeight, 11, startAngle, endAngle, true);
        context.lineTo(x, point.y);
        context.closePath();
        context.scxFill({ fillColor: this.getDrawingTheme().borderLine.strokeColor });
        context.beginPath();
        context.arc(x, point.y - pointerHeight, 7, 0, 2 * Math.PI);
        context.scxFill({ fillColor: 'white' });
    };
    NoteBase.prototype.CoordinatesOfRectangleBasedOnLocation = function () {
        this.normalSituation();
        this.rectangleIsCloseToTheTop();
        this.rectangleIsCloseToTheRight();
        this.rectangleIsCloseToTheLeft();
    };
    NoteBase.prototype.normalSituation = function () {
        var point = this.cartesianPoint(0);
        var rect = this.basicRectData();
        var triangle = this.basicTriangleData();
        var pointer = this.pointerBounds();
        this.rectangle.rootX = point.x;
        this.rectangle.centerRightX = triangle.right;
        this.rectangle.centerLeftX = triangle.left;
        this.rectangle.rightX = rect.right;
        this.rectangle.leftX = rect.left;
        this.rectangle.rootY = point.y - (triangle.height + pointer.height);
        this.rectangle.bottomY = point.y - (triangle.height + pointer.height) - 10;
        this.rectangle.topY = (point.y - (triangle.height + pointer.height) - 10) - rect.height;
    };
    NoteBase.prototype.rectangleIsCloseToTheTop = function () {
        var point = this.cartesianPoint(0);
        var rect = this.basicRectData();
        var triangle = this.basicTriangleData();
        var pointer = this.pointerBounds();
        var frame = this.frame();
        if (point.y < frame.top + rect.height + triangle.height + pointer.height) {
            this.rectangle.rootY = point.y + (0.2 * pointer.height);
            this.rectangle.bottomY = point.y + (0.2 * pointer.height) + 10;
            this.rectangle.topY = (point.y + (0.2 * pointer.height) + 10) + rect.height;
        }
    };
    NoteBase.prototype.rectangleIsCloseToTheRight = function () {
        var point = this.cartesianPoint(0);
        var rect = this.basicRectData();
        var frame = this.frame();
        if (rect.right > frame.right) {
            this.rectangle.rootX = point.x;
            this.rectangle.rightX = frame.right;
            this.rectangle.leftX = frame.right - 270;
            if (point.x > frame.right - 8) {
                this.pointerIsCloseToRight();
            }
        }
    };
    NoteBase.prototype.pointerIsCloseToRight = function () {
        var frame = this.frame();
        this.rectangle.rootX = frame.right;
        this.rectangle.centerRightX = frame.right;
        this.rectangle.centerLeftX = frame.right;
        this.rectangle.rootY = this.rectangle.bottomY;
    };
    NoteBase.prototype.rectangleIsCloseToTheLeft = function () {
        var point = this.cartesianPoint(0);
        var rect = this.basicRectData();
        var frame = this.frame();
        if (point.x < frame.left + rect.width / 2) {
            this.rectangle.rootX = point.x;
            this.rectangle.rightX = frame.left + 270;
            this.rectangle.leftX = frame.left;
            if (point.x < frame.left + 8) {
                this.pointerIsCloseToLeft();
            }
        }
    };
    NoteBase.prototype.pointerIsCloseToLeft = function () {
        var frame = this.frame();
        this.rectangle.rootX = frame.left;
        this.rectangle.centerLeftX = frame.left;
        this.rectangle.centerRightX = frame.left;
        this.rectangle.rootY = this.rectangle.bottomY;
    };
    NoteBase.prototype.drawRect = function () {
        var context = this.context;
        var rect = this.rectangle;
        context.beginPath();
        context.moveTo(rect.rootX, rect.rootY);
        context.lineTo(rect.centerRightX, rect.bottomY);
        context.lineTo(rect.rightX, rect.bottomY);
        context.lineTo(rect.rightX, rect.topY);
        context.lineTo(rect.leftX, rect.topY);
        context.lineTo(rect.leftX, rect.bottomY);
        context.lineTo(rect.centerLeftX, rect.bottomY);
        context.closePath();
        if (this.getDrawingTheme().text.textBackgroundEnabled) {
            context.scxFill(this.getDrawingTheme().fill);
        }
        if (this.getDrawingTheme().text.textBorderEnabled) {
            context.scxStroke(this.getDrawingTheme().borderLine);
        }
        this.drawText();
    };
    NoteBase.prototype.drawText = function () {
        this.context.beginPath();
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        var line = this.getWrappedLines();
        for (var i = 0; i < this.getWrappedLines().length; i++) {
            this.context.fillText(line[i], this.xByTextDirection(), this.yByRectLocation(i));
        }
    };
    NoteBase.prototype.xByTextDirection = function () {
        var x;
        if (this.context.textAlign == 'right') {
            x = this.rectangle.rightX - 10;
        }
        else if (this.context.textAlign == 'center') {
            x = (this.rectangle.rightX + this.rectangle.leftX) / 2;
        }
        else {
            x = this.rectangle.leftX + 10;
        }
        return x;
    };
    NoteBase.prototype.yByRectLocation = function (i) {
        var point = this.cartesianPoint(0);
        var rect = this.rectangle;
        var textRectangleHeight;
        if (point.y < this.frame().top + this.basicRectData().height + this.basicTriangleData().height + this.pointerBounds().height) {
            textRectangleHeight = (rect.bottomY + 10 + this.lineHeight() + (i * this.lineHeight()));
        }
        else {
            textRectangleHeight = (rect.bottomY - 10) - (this.lineHeight() * ((this.getWrappedLines().length - i) - 1));
        }
        return textRectangleHeight;
    };
    NoteBase.prototype.lineHeight = function () {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return DummyCanvasContext.measureText(this.lines[0], this.getDrawingTheme().text).height;
    };
    NoteBase.prototype.frame = function () {
        var frame = this.chartPanel.contentFrame;
        return {
            right: frame.right - 15,
            left: frame.left + 15,
            top: frame.top + 15
        };
    };
    NoteBase.prototype.basicRectData = function () {
        var point = this.cartesianPoint(0);
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return {
            right: point.x + 270 / 2,
            left: point.x - 270 / 2,
            width: 270,
            height: (DummyCanvasContext.measureText(this.lines[0], this.getDrawingTheme().text).height * this.getWrappedLines().length) + 20,
        };
    };
    NoteBase.prototype.basicTriangleData = function () {
        var point = this.cartesianPoint(0);
        return {
            right: point.x + 7.5,
            left: point.x - 7.5,
            height: 15,
        };
    };
    return NoteBase;
}(TextBase));
export { NoteBase };
var NoteRectangle = (function () {
    function NoteRectangle() {
    }
    return NoteRectangle;
}());
//# sourceMappingURL=NoteBase.js.map