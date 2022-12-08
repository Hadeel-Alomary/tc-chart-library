var DrawingCalculationUtil = (function () {
    function DrawingCalculationUtil() {
    }
    DrawingCalculationUtil.calculateLinearRegression = function (values) {
        var xAvg = 0, yAvg = 0, count = values.length;
        for (var i = 0; i < count; i++) {
            xAvg += i;
            yAvg += values[i];
        }
        xAvg = count === 0 ? 0 : xAvg / count;
        yAvg = count === 0 ? 0 : yAvg / count;
        var v1 = 0, v2 = 0;
        for (var i = 0; i < count; i++) {
            v1 += (i - xAvg) * (values[i] - yAvg);
            v2 += Math.pow(i - xAvg, 2);
        }
        var slope = v2 === 0 ? 0 : v1 / v2;
        var firstValue = yAvg - slope * xAvg;
        return {
            slope: slope,
            firstValue: firstValue
        };
    };
    DrawingCalculationUtil.calculateAngleBetweenTwoPointsInRadians = function (point1, point2) {
        var diffX = point2.x - point1.x;
        var diffY = point1.y - point2.y;
        return Math.atan2(diffY, diffX);
    };
    DrawingCalculationUtil.calculatePointFromAngleAndPoint = function (radians, point, distance) {
        if (distance === void 0) { distance = 1; }
        var x = distance * Math.cos(radians);
        var y = distance * Math.sin(radians);
        return {
            x: Math.floor(point.x + x),
            y: Math.floor(point.y - y)
        };
    };
    DrawingCalculationUtil.convertRadianToDegree = function (radians) {
        return radians * (180 / Math.PI);
    };
    DrawingCalculationUtil.convertDegreeToRadian = function (degrees) {
        return degrees * (Math.PI / 180);
    };
    DrawingCalculationUtil.calculateSlope = function (point1, point2) {
        if (point2.x == point1.x) {
            return 0;
        }
        return (point2.y - point1.y) / (point2.x - point1.x);
    };
    DrawingCalculationUtil.calculateDistanceBetweenTwoPoints = function (point1, point2) {
        var diffX = point1.x - point2.x;
        var diffY = point1.y - point2.y;
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
    };
    DrawingCalculationUtil.centerPointOfLine = function (linePoint1, linePoint2) {
        return {
            x: (linePoint1.x + linePoint2.x) / 2,
            y: (linePoint1.y + linePoint2.y) / 2
        };
    };
    return DrawingCalculationUtil;
}());
export { DrawingCalculationUtil };
//# sourceMappingURL=DrawingCalculationUtil.js.map