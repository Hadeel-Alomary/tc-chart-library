var DrawingsHelper = (function () {
    function DrawingsHelper() {
    }
    DrawingsHelper.getExtendedLineEndPoint = function (point1, point2, chartPanel) {
        var deltaX = point2.x - point1.x;
        var deltaY = point2.y - point1.y;
        var x = point2.x;
        var y = point2.y;
        var panelFrame = chartPanel.contentFrame;
        if (deltaX < 0) {
            x = panelFrame.left;
        }
        else if (deltaX > 0) {
            x = panelFrame.right;
        }
        if (deltaX == 0) {
            if (deltaY > 0) {
                y = panelFrame.bottom;
            }
            else {
                y = panelFrame.top;
            }
        }
        else {
            y = (x - point2.x) / deltaX * deltaY + point2.y;
            if (y < panelFrame.top || y > panelFrame.bottom) {
                if (y > panelFrame.bottom) {
                    y = panelFrame.bottom;
                }
                else if (y < panelFrame.top) {
                    y = panelFrame.top;
                }
                if (deltaY !== 0) {
                    x = (y - point2.y) / deltaY * deltaX + point2.x;
                }
            }
        }
        return { x: x, y: y };
    };
    return DrawingsHelper;
}());
export { DrawingsHelper };
//# sourceMappingURL=DrawingsHelper.js.map