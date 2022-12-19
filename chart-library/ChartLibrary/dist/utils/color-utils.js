var ColorUtils = (function () {
    function ColorUtils() {
    }
    ColorUtils.getRandomDarkColorFromPallete = function () {
        ColorUtils.darkColorIndex += 1;
        ColorUtils.darkColorIndex %= ColorUtils.darkColorsPalette.length;
        return ColorUtils.darkColorsPalette[ColorUtils.darkColorIndex];
    };
    ColorUtils.generateRandomColor = function () {
        var randomR = Math.floor(Math.random() * (255 + 1));
        var randomG = Math.floor(Math.random() * (255 + 1));
        var randomB = Math.floor(Math.random() * (255 + 1));
        return "#" + ColorUtils.componentToHex(randomR) + ColorUtils.componentToHex(randomG) + ColorUtils.componentToHex(randomB);
    };
    ColorUtils.generateDarkRandomColor = function () {
        var color;
        while (true) {
            color = ColorUtils.generateRandomColor();
            var c = color.substring(1);
            var rgb = parseInt(c, 16);
            var r = (rgb >> 16) & 0xff;
            var g = (rgb >> 8) & 0xff;
            var b = (rgb >> 0) & 0xff;
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            if (luma < 75) {
                break;
            }
        }
        return color;
    };
    ColorUtils.componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    };
    ColorUtils.darkColorIndex = -1;
    ColorUtils.darkColorsPalette = [
        '#684d60',
        '#4c5a87',
        '#ce9f45',
        '#748052',
        '#8b424d',
        '#060c18',
        '#00382f',
        '#5d1f62'
    ];
    return ColorUtils;
}());
export { ColorUtils };
//# sourceMappingURL=color-utils.js.map