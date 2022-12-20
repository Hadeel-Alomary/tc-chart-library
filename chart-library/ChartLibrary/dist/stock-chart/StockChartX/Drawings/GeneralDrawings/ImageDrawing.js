var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Drawing } from '../Drawing';
import { Geometry } from "../../Graphics/Geometry";
import { ThemedDrawing } from '../ThemedDrawing';
export var DrawingEvent;
(function (DrawingEvent) {
    DrawingEvent.URL_CHANGED = 'drawingUrlChanged';
})(DrawingEvent || (DrawingEvent = {}));
var NoImageSize = {
    width: 10,
    height: 10
};
var ImageDrawing = (function (_super) {
    __extends(ImageDrawing, _super);
    function ImageDrawing(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._image = new Image();
        _this.url = config && config.url;
        _this.loadImage();
        return _this;
    }
    Object.defineProperty(ImageDrawing, "className", {
        get: function () {
            return 'image';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageDrawing.prototype, "url", {
        get: function () {
            return this._options.url || '';
        },
        set: function (value) {
            this._setOption('url', value, DrawingEvent.URL_CHANGED);
            this._image.src = value;
        },
        enumerable: true,
        configurable: true
    });
    ImageDrawing.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        if (this.url) {
            this._image.src = this.url;
        }
    };
    ImageDrawing.prototype.bounds = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        return {
            left: point.x,
            top: point.y,
            width: this._image.width || NoImageSize.width,
            height: this._image.height || NoImageSize.height
        };
    };
    ImageDrawing.prototype._markerPoints = function (point) {
        if (!point)
            point = this.cartesianPoint(0);
        var image = this._image, x = point.x, y = point.y;
        if (image.width > 0) {
            return [
                point,
                {
                    x: x + image.width,
                    y: y
                },
                {
                    x: x + image.width,
                    y: y + image.height
                },
                {
                    x: x,
                    y: y + image.height
                }
            ];
        }
        return {
            x: Math.round(x + NoImageSize.width / 2),
            y: Math.round(y + NoImageSize.height / 2)
        };
    };
    ImageDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        this.showSettingsDialog();
    };
    ImageDrawing.prototype.hitTest = function (point) {
        var bounds = this.bounds();
        return bounds && Geometry.isPointInsideOrNearRect(point, bounds);
    };
    ImageDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint(0);
        if (!point)
            return;
        var theme = this.getDrawingTheme();
        var context = this.context, x = point.x, y = point.y;
        if (this._image.width > 0) {
            context.drawImage(this._image, x, y);
        }
        if (this.selected)
            this._drawSelectionMarkers(this._markerPoints(point));
    };
    ImageDrawing.prototype.loadImage = function () {
        var _this = this;
        this._image.onload = function () {
            var panel = _this.chartPanel;
            if (panel)
                panel.setNeedsUpdate();
        };
        if (this.url) {
            this._image.src = this.url;
        }
    };
    return ImageDrawing;
}(ThemedDrawing));
export { ImageDrawing };
Drawing.register(ImageDrawing);
//# sourceMappingURL=ImageDrawing.js.map