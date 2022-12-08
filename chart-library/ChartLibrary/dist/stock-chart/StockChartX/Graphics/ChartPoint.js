export var XPointBehavior = {
    X: 'x',
    X_PERCENT: 'xPercent',
    RECORD: 'record',
    DATE: 'date'
};
Object.freeze(XPointBehavior);
export var YPointBehavior = {
    Y: 'y',
    Y_PERCENT: 'yPercent',
    VALUE: 'value'
};
Object.freeze(YPointBehavior);
var ChartPoint = (function () {
    function ChartPoint(config) {
        config = config || {};
        if (config.x != null)
            this.x = config.x;
        if (config.y != null)
            this.y = config.y;
        if (config.xPercent != null)
            this.xPercent = config.xPercent;
        if (config.yPercent != null)
            this.yPercent = config.yPercent;
        if (config.date != null) {
            if (typeof config.date === 'string')
                this.date = new Date(config.date);
            else
                this.date = config.date;
        }
        if (config.value != null)
            this.value = config.value;
        if (config.record != null)
            this.record = config.record;
    }
    ChartPoint.convert = function (point, behavior, projection) {
        var config = {};
        switch (behavior.x) {
            case XPointBehavior.X:
                config.x = point.x;
                break;
            case XPointBehavior.RECORD:
                config.record = projection.recordByX(point.x, false);
                break;
            case XPointBehavior.DATE:
                config.date = projection.dateByX(point.x);
                break;
            case XPointBehavior.X_PERCENT:
                config.xPercent = projection.percentageByX(point.x);
                break;
            default:
                throw new Error("Unknown X point behavior: " + behavior.x);
        }
        switch (behavior.y) {
            case YPointBehavior.Y:
                config.y = point.y;
                break;
            case YPointBehavior.VALUE:
                config.value = projection.valueByY(point.y);
                break;
            case YPointBehavior.Y_PERCENT:
                config.yPercent = projection.percentageByY(point.y);
                break;
            default:
                throw new Error("Unknown Y point behavior: " + behavior.y);
        }
        return new ChartPoint(config);
    };
    ChartPoint.prototype.clear = function () {
        if (this.x != null)
            this.x = undefined;
        if (this.y != null)
            this.y = undefined;
        if (this.xPercent != null)
            this.xPercent = undefined;
        if (this.yPercent != null)
            this.yPercent = undefined;
        if (this.date != null)
            this.date = undefined;
        if (this.value != null)
            this.value = undefined;
        if (this.record != null)
            this.record = undefined;
    };
    ChartPoint.prototype.getX = function (projection) {
        if (this.x != null)
            return this.x;
        if (this.xPercent != null)
            return projection.xByPercentage(this.xPercent);
        if (this.date != null)
            return projection.xByDate(this.date);
        if (this.record != null)
            return projection.xByRecord(this.record, false);
        throw new Error("Point is not initialized.");
    };
    ChartPoint.prototype.getY = function (projection) {
        if (this.y != null)
            return this.y;
        if (this.yPercent != null)
            return projection.yByPercentage(this.yPercent);
        if (this.value != null)
            return projection.yByValue(this.value);
        throw new Error("Point is not initialized.");
    };
    ChartPoint.prototype.toPoint = function (projection) {
        return {
            x: this.getX(projection),
            y: this.getY(projection)
        };
    };
    ChartPoint.prototype.moveTo = function (x, y, projection) {
        return this
            .moveToX(x, projection)
            .moveToY(y, projection);
    };
    ChartPoint.prototype.moveToPoint = function (point, projection) {
        return this.moveTo(point.x, point.y, projection);
    };
    ChartPoint.prototype.moveToX = function (x, projection) {
        if (this.x != null)
            this.x = x;
        if (this.xPercent != null)
            this.xPercent = projection.percentageByX(x);
        else if (this.date != null)
            this.date = projection.dateByX(x);
        else if (this.record != null)
            this.record = projection.recordByX(x, false);
        else
            throw new Error("Point is not initialized.");
        return this;
    };
    ChartPoint.prototype.moveToY = function (y, projection) {
        if (this.y != null)
            this.y = y;
        else if (this.yPercent != null)
            this.yPercent = projection.percentageByY(y);
        else if (this.value != null)
            this.value = projection.valueByY(y);
        else
            throw new Error("Point is not initialized.");
        return this;
    };
    ChartPoint.prototype.translate = function (dx, dy, projection) {
        var newX = this.getX(projection) + dx, newY = this.getY(projection) + dy;
        return this.moveTo(newX, newY, projection);
    };
    ChartPoint.prototype.isPercentBasedChartPoint = function () {
        return typeof this.xPercent !== 'undefined' && typeof this.yPercent !== 'undefined';
    };
    return ChartPoint;
}());
export { ChartPoint };
//# sourceMappingURL=ChartPoint.js.map