import { Environment } from '../Environment';
export var Geometry;
(function (Geometry) {
    Geometry.DEVIATION = Environment.isMobile ? 20 : 5;
    function length(point1, point2) {
        var xLen = Math.abs(point2.x - point1.x), yLen = Math.abs(point2.y - point1.y), len = Math.sqrt(xLen * xLen + yLen * yLen);
        return Math.round(len);
    }
    Geometry.length = length;
    function xProjectionLength(point1, point2) {
        return Math.abs(point1.x - point2.x);
    }
    Geometry.xProjectionLength = xProjectionLength;
    function yProjectionLength(point1, point2) {
        return Math.abs(point1.y - point2.y);
    }
    Geometry.yProjectionLength = yProjectionLength;
    function isValueNearValue(value1, value2) {
        return Math.abs(value1 - value2) <= this.DEVIATION;
    }
    Geometry.isValueNearValue = isValueNearValue;
    function isValueBetweenOrNearValues(value, value1, value2) {
        return (value >= Math.min(value1, value2) - this.DEVIATION) &&
            (value <= Math.max(value1, value2) + this.DEVIATION);
    }
    Geometry.isValueBetweenOrNearValues = isValueBetweenOrNearValues;
    function isPointNearPoint(point, checkPoint) {
        if (Array.isArray(checkPoint)) {
            for (var _i = 0, checkPoint_1 = checkPoint; _i < checkPoint_1.length; _i++) {
                var p = checkPoint_1[_i];
                if (this.isPointNearPoint(point, p))
                    return true;
            }
            return false;
        }
        return this.isValueNearValue(point.x, checkPoint.x) &&
            this.isValueNearValue(point.y, checkPoint.y);
    }
    Geometry.isPointNearPoint = isPointNearPoint;
    function isPointNearRectPoints(point, rectPoint1, rectPoint2) {
        var leftX = Math.min(rectPoint1.x, rectPoint2.x), rightX = Math.max(rectPoint1.x, rectPoint2.x), topY = Math.min(rectPoint1.y, rectPoint2.y), bottomY = Math.max(rectPoint1.y, rectPoint2.y);
        if (this.isPointNearLine(point, { x: leftX, y: bottomY }, { x: leftX, y: topY }))
            return true;
        if (this.isPointNearLine(point, { x: leftX, y: topY }, { x: rightX, y: topY }))
            return true;
        if (this.isPointNearLine(point, { x: rightX, y: topY }, { x: rightX, y: bottomY }))
            return true;
        return this.isPointNearLine(point, { x: rightX, y: bottomY }, { x: leftX, y: bottomY });
    }
    Geometry.isPointNearRectPoints = isPointNearRectPoints;
    function isPointInsideOrNearRect(point, rect) {
        return this.isValueBetweenOrNearValues(point.x, rect.left, rect.left + rect.width) &&
            this.isValueBetweenOrNearValues(point.y, rect.top, rect.top + rect.height);
    }
    Geometry.isPointInsideOrNearRect = isPointInsideOrNearRect;
    function isPointInsideOrNearRectPoints(point, rectPoint1, rectPoint2) {
        var leftX = Math.min(rectPoint1.x, rectPoint2.x), rightX = Math.max(rectPoint1.x, rectPoint2.x), topY = Math.min(rectPoint1.y, rectPoint2.y), bottomY = Math.max(rectPoint1.y, rectPoint2.y);
        return this.isValueBetweenOrNearValues(point.x, leftX, rightX) &&
            this.isValueBetweenOrNearValues(point.y, topY, bottomY);
    }
    Geometry.isPointInsideOrNearRectPoints = isPointInsideOrNearRectPoints;
    function isPointNearCircle(point, centerPoint, radius) {
        var r1 = this.length(centerPoint, point);
        var r2 = typeof radius === 'number' ? radius : this.length(centerPoint, radius);
        return this.isValueNearValue(r1, r2);
    }
    Geometry.isPointNearCircle = isPointNearCircle;
    function isPointInsideOrNearCircle(point, centerPoint, radius) {
        var r1 = this.length(centerPoint, point);
        var r2 = typeof radius === 'number' ? radius : this.length(centerPoint, radius);
        return this.isValueBetweenOrNearValues(r1, 0, r2);
    }
    Geometry.isPointInsideOrNearCircle = isPointInsideOrNearCircle;
    function isPointNearPolygon(point, polygonPoints) {
        if (polygonPoints.length < 2)
            return false;
        for (var i = 0; i < polygonPoints.length - 1; i++) {
            if (this.isPointNearLine(point, polygonPoints[i], polygonPoints[i + 1]))
                return true;
        }
        return this.isPointNearLine(point, polygonPoints[polygonPoints.length - 1], polygonPoints[0]);
    }
    Geometry.isPointNearPolygon = isPointNearPolygon;
    function isPointNearLine(point, linePoint1, linePoint2) {
        if (!this.isPointInsideOrNearRectPoints(point, linePoint1, linePoint2))
            return false;
        if (Math.abs(linePoint1.x - linePoint2.x) <= this.DEVIATION)
            return true;
        var k = (linePoint1.y - linePoint2.y) / (linePoint1.x - linePoint2.x);
        var a = Math.abs(Math.atan(k) * 180.0 / Math.PI);
        var isOrthogonal = Math.abs(a - 90.0) <= 10.0 || Math.abs(a - 270.0) <= 10.0;
        if (isOrthogonal) {
            var x = (point.y - (linePoint1.y - linePoint1.x * k)) / k;
            return this.isValueNearValue(x, point.x);
        }
        else {
            var y = linePoint1.y + k * (point.x - linePoint1.x);
            return this.isValueNearValue(y, point.y);
        }
    }
    Geometry.isPointNearLine = isPointNearLine;
    function isPointNearPolyline(point, polylinePoints) {
        for (var i = 0, count = polylinePoints.length; i < count - 1; i++) {
            if (this.isPointNearLine(point, polylinePoints[i], polylinePoints[i + 1]))
                return true;
        }
        return false;
    }
    Geometry.isPointNearPolyline = isPointNearPolyline;
    function isPointNearEllipse(point, centerPoint, radiusPoint) {
        var horRadius = Math.abs(radiusPoint.x - centerPoint.x), verRadius = Math.abs(radiusPoint.y - centerPoint.y);
        return this.isPointNearEllipseWithRadiuses(point, centerPoint, horRadius, verRadius);
    }
    Geometry.isPointNearEllipse = isPointNearEllipse;
    function isPointNearEllipseWithRadiuses(point, centerPoint, horRadius, verRadius) {
        var x = point.x - centerPoint.x, y = point.y - centerPoint.y, value = (x * x) / (horRadius * horRadius) + (y * y) / (verRadius * verRadius);
        return 0.8 < value && value < 1.3;
    }
    Geometry.isPointNearEllipseWithRadiuses = isPointNearEllipseWithRadiuses;
})(Geometry || (Geometry = {}));
//# sourceMappingURL=Geometry.js.map