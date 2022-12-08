var DrawingMarkers = (function () {
    function DrawingMarkers() {
        this.valueMarkers = new DrawingValueMarkers();
        this.dateMarkers = new DrawingDateMarkers();
    }
    DrawingMarkers.prototype.drawSelectionValueMarkers = function (chart, points, context, projection, panelValueScale) {
        this.valueMarkers.draw(chart, points, context, projection, panelValueScale);
    };
    DrawingMarkers.prototype.drawSelectionDateMarkers = function (chart, points, context, projection) {
        this.dateMarkers.draw(chart, points, context, projection);
    };
    return DrawingMarkers;
}());
export { DrawingMarkers };
var DrawingDateMarkers = (function () {
    function DrawingDateMarkers() {
    }
    DrawingDateMarkers.prototype.draw = function (chart, points, context, projection) {
        this.drawValueMarkerIfRequired(chart, points, context, projection);
        this.fillValueScaleIfRequired(chart, points, context, projection);
    };
    DrawingDateMarkers.prototype.drawValueMarkerIfRequired = function (chart, points, context, projection) {
        for (var i = 0; i < points.length; i++) {
            this.drawValueScaleMarkerForEachPoint(chart, points[i].x, context, projection);
        }
    };
    DrawingDateMarkers.prototype.drawValueScaleMarkerForEachPoint = function (chart, x, context, projection) {
        var padding = 2;
        var text = chart.dateScale.formatDate(projection.dateByX(x));
        var textTheme = {
            fillColor: '#fff',
            fontFamily: chart.theme.dateScale.text.fontFamily,
            fontSize: chart.theme.dateScale.text.fontSize
        };
        var textWidth = context.measureText(text).width;
        context.beginPath();
        context.rect(x - textWidth / 2 - padding, 1, textWidth + padding * 2, chart.dateScale.bottomPanel.frame.height);
        context.scxFill({ fillColor: 'rgb(70,130,180)' });
        context.scxApplyTextTheme(textTheme);
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(text, x - textWidth / 2, chart.dateScale.bottomPanel.frame.height / 2);
    };
    DrawingDateMarkers.prototype.fillValueScaleIfRequired = function (chart, points, context, projection) {
        var sortedPoints = this.sortXOfPoints(points);
        for (var i = 1; i < sortedPoints.length; i++) {
            this.fillValueScaleDistanceBetweenPoints(chart, sortedPoints[i], sortedPoints[i - 1], context, projection);
        }
    };
    DrawingDateMarkers.prototype.fillValueScaleDistanceBetweenPoints = function (chart, X_currentPoint, X_prevPoint, context, projection) {
        var padding = 2;
        var prevTextWidth = this.textWidth(chart, context, projection, X_prevPoint);
        var currTextWidth = this.textWidth(chart, context, projection, X_currentPoint);
        var x_rect = X_prevPoint - prevTextWidth / 2 - padding;
        var rectWidth = (X_currentPoint + currTextWidth / 2 + padding) - (X_prevPoint - prevTextWidth / 2 - padding);
        var rectHeight = chart.dateScale.bottomPanel.frame.height;
        var markersOverlapped = (X_prevPoint - prevTextWidth / 2 - padding) <= (X_currentPoint + currTextWidth / 2 + padding);
        if (!markersOverlapped) {
            context.beginPath();
            context.rect(x_rect, 1, rectWidth, rectHeight);
            context.scxFill({ fillColor: 'rgba(70,130,180,0.3)' });
        }
    };
    DrawingDateMarkers.prototype.textWidth = function (chart, context, projection, x) {
        var text = chart.dateScale.formatDate(projection.dateByX(x));
        return context.measureText(text).width;
    };
    DrawingDateMarkers.prototype.sortXOfPoints = function (points) {
        var yValues = [];
        for (var i = 0; i < points.length; i++) {
            yValues.push(points[i].x);
        }
        return yValues.sort(function (a, b) { return b - a; });
    };
    return DrawingDateMarkers;
}());
var DrawingValueMarkers = (function () {
    function DrawingValueMarkers() {
    }
    DrawingValueMarkers.prototype.draw = function (chart, points, context, projection, panelValueScale) {
        this.drawValueMarkerIfRequired(chart, points, context, projection, panelValueScale);
        this.fillValueScaleIfRequired(chart, points, context, panelValueScale);
    };
    DrawingValueMarkers.prototype.drawValueMarkerIfRequired = function (chart, points, context, projection, panelValueScale) {
        for (var i = 0; i < points.length; i++) {
            this.drawValueScaleMarkerForEachPoint(chart, points[i].y, context, projection, panelValueScale);
        }
    };
    DrawingValueMarkers.prototype.drawValueScaleMarkerForEachPoint = function (chart, y, context, projection, panelValueScale) {
        var rightFrame = panelValueScale.rightFrame;
        var xTextOffset = chart.valueMarker.textOffset - 1;
        var padding = 2;
        var text = panelValueScale.formatValue(projection.valueByY(y));
        var textTheme = { fillColor: '#fff',
            fontFamily: chart.theme.valueScale.text.fontFamily,
            fontSize: chart.theme.valueScale.text.fontSize };
        var yOffset = textTheme.fontSize / 2 + padding;
        context.beginPath();
        context.rect(rightFrame.left, y - yOffset, rightFrame.right - rightFrame.left, yOffset * 2);
        context.scxFill({ fillColor: 'rgb(70,130,180)' });
        context.scxApplyTextTheme(textTheme);
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(text, rightFrame.left + xTextOffset, y);
    };
    DrawingValueMarkers.prototype.fillValueScaleIfRequired = function (chart, points, context, panelValueScale) {
        var sortedPoints = this.sortYOfPoints(points);
        for (var i = 1; i < sortedPoints.length; i++) {
            this.fillValueScaleDistanceBetweenPoints(chart, sortedPoints[i], sortedPoints[i - 1], context, panelValueScale);
        }
    };
    DrawingValueMarkers.prototype.fillValueScaleDistanceBetweenPoints = function (chart, Y_currentPoint, Y_prevPoint, context, panelValueScale) {
        var padding = 2;
        var rightFrame = panelValueScale.rightFrame;
        var textTheme = { fillColor: '#fff',
            fontFamily: chart.theme.valueScale.text.fontFamily,
            fontSize: chart.theme.valueScale.text.fontSize };
        var yOffset = textTheme.fontSize / 2 + padding;
        var rectHeight = (Math.max(Y_prevPoint, Y_currentPoint) - Math.min(Y_prevPoint, Y_currentPoint)) - yOffset * 2;
        context.beginPath();
        context.rect(rightFrame.left, Math.min(Y_prevPoint, Y_currentPoint) + yOffset, rightFrame.right - rightFrame.left, rectHeight);
        context.scxFill({ fillColor: 'rgba(70,130,180,0.1)' });
    };
    DrawingValueMarkers.prototype.sortYOfPoints = function (points) {
        var yValues = [];
        for (var i = 0; i < points.length; i++) {
            yValues.push(points[i].y);
        }
        return yValues.sort(function (a, b) { return b - a; });
    };
    return DrawingValueMarkers;
}());
//# sourceMappingURL=DrawingMarkers.js.map