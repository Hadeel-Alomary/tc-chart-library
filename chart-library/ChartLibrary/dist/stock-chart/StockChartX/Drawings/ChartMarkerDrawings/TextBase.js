var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { DummyCanvasContext } from '../../Utils/DummyCanvasContext';
import { ChartAccessorService } from '../../../../services/chart';
import { ThemedDrawing } from '../ThemedDrawing';
export var DrawingEvent;
(function (DrawingEvent) {
    DrawingEvent.TEXT_CHANGED = 'drawingTextChanged';
})(DrawingEvent || (DrawingEvent = {}));
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this.text = config && config.text;
        return _this;
    }
    Object.defineProperty(TextBase.prototype, "text", {
        get: function () {
            if (this._options.text == 'none') {
                return '';
            }
            return this._options.text || this.getDefaultText();
        },
        set: function (value) {
            value = value || '';
            this._setOption('text', value, DrawingEvent.TEXT_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, "textWrapWidth", {
        get: function () {
            if (this._options.textWrapWidth == undefined)
                this._options.textWrapWidth = 410;
            return this._options.textWrapWidth;
        },
        set: function (value) {
            this._options.textWrapWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    TextBase.prototype.getDefaultText = function () {
        return ChartAccessorService.instance.isArabic() ? 'النص' : 'Text';
    };
    Object.defineProperty(TextBase.prototype, "lines", {
        get: function () {
            if (!this.text)
                return [''];
            return this.text.split('\n');
        },
        enumerable: false,
        configurable: true
    });
    TextBase.prototype.getWrappedLines = function () {
        var lines = this.lines, theme = this.getDrawingTheme();
        var wrappedLines = [];
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            this.wrapLine(line, this.textWrapWidth, this.getDrawingTheme().text.fontSize).forEach(function (line) { return wrappedLines.push(line); });
        }
        return wrappedLines;
    };
    TextBase.prototype.getLines = function () {
        return this.getDrawingTheme().text.textWrapEnabled ? this.getWrappedLines() : this.lines;
    };
    TextBase.prototype.getLongestLineSize = function () {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        var longestLine = this.lines.reduce(function (left, right) {
            return left.length >= right.length ? left : right;
        });
        var theme = this.getDrawingTheme();
        var size = DummyCanvasContext.measureText(longestLine, this.getDrawingTheme().text);
        return size;
    };
    TextBase.prototype.wrapLine = function (text, maxWidth, lineHeight) {
        var words = text.split(' '), context = this.context, testLine, line = '';
        var result = [];
        for (var i = 0; i < words.length; i++) {
            testLine = words[i];
            var testLineWidth = context.measureText(testLine).width;
            while (testLineWidth > maxWidth) {
                testLine = testLine.substring(0, testLine.length - 1);
                testLineWidth = context.measureText(testLine).width;
            }
            if (words[i] != testLine) {
                words.splice(i + 1, 0, words[i].substr(testLine.length));
                words[i] = testLine;
            }
            testLine = line + words[i] + ' ';
            testLineWidth = context.measureText(testLine).width;
            if (testLineWidth > maxWidth && i > 0) {
                result.push(line);
                line = words[i] + ' ';
            }
            else {
                line = testLine;
            }
        }
        result.push(line);
        return result;
    };
    TextBase.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        this.showSettingsDialog();
    };
    return TextBase;
}(ThemedDrawing));
export { TextBase };
//# sourceMappingURL=TextBase.js.map