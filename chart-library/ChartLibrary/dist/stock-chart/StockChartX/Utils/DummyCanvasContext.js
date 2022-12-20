import { HtmlUtil } from "./HtmlUtil";
var DummyCanvasContext = (function () {
    function DummyCanvasContext() {
    }
    Object.defineProperty(DummyCanvasContext, "context", {
        get: function () {
            if (!DummyCanvasContext._context)
                DummyCanvasContext._context = $('<canvas></canvas>')[0].getContext('2d');
            return DummyCanvasContext._context;
        },
        enumerable: true,
        configurable: true
    });
    DummyCanvasContext.applyTextTheme = function (theme) {
        this.context.scxApplyTextTheme(theme);
    };
    DummyCanvasContext.textWidth = function (text, textTheme) {
        var context = this.context;
        if (textTheme)
            context.scxApplyTextTheme(textTheme);
        return context.measureText(text).width;
    };
    DummyCanvasContext.measureText = function (text, textTheme) {
        return {
            width: Math.round(this.textWidth(text, textTheme)),
            height: Math.round(HtmlUtil.getFontSize(textTheme) + 1)
        };
    };
    return DummyCanvasContext;
}());
export { DummyCanvasContext };
//# sourceMappingURL=DummyCanvasContext.js.map