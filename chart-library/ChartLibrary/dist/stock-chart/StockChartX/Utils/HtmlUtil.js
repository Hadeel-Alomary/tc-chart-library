var DEFAULT_LINE_WIDTH = 1;
var DEFAULT_FONT_SIZE = 12;
var HtmlUtil = (function () {
    function HtmlUtil() {
    }
    HtmlUtil.getLineWidth = function (theme) {
        if (theme && theme.strokeEnabled === false)
            return 0;
        return (theme && theme.width) || DEFAULT_LINE_WIDTH;
    };
    HtmlUtil.getFontSize = function (theme) {
        return (theme && theme.fontSize) || DEFAULT_FONT_SIZE;
    };
    HtmlUtil.isDarkColor = function (color) {
        if (!window.getComputedStyle) {
            return true;
        }
        if (color in HtmlUtil.colorTypeCache) {
            return HtmlUtil.colorTypeCache[color];
        }
        if (!HtmlUtil.colorDiv) {
            HtmlUtil.colorDiv = document.createElement('div');
            HtmlUtil.colorDiv.style.display = 'none';
            $("body").append(HtmlUtil.colorDiv);
        }
        HtmlUtil.colorDiv.style.color = color;
        var rgbColor = getComputedStyle(HtmlUtil.colorDiv).color;
        var rgbParts = rgbColor.substring(4, rgbColor.length - 1).replace(/ /g, '').split(',');
        var brightness = (+rgbParts[0] * 299 + +rgbParts[1] * 587 + +rgbParts[2] * 114) / 1000;
        HtmlUtil.colorTypeCache[color] = brightness < 128;
        return HtmlUtil.colorTypeCache[color];
    };
    HtmlUtil.setVisibility = function (control, visible) {
        control.css('visibility', visible ? 'visible' : 'hidden');
    };
    HtmlUtil.isHidden = function (control) {
        return control.css('visibility') != 'hidden';
    };
    HtmlUtil.colorTypeCache = {};
    return HtmlUtil;
}());
export { HtmlUtil };
//# sourceMappingURL=HtmlUtil.js.map