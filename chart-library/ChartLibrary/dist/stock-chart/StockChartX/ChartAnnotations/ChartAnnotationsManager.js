var ChartAnnotationsManager = (function () {
    function ChartAnnotationsManager() {
        this.chartAnnotations = [];
    }
    ChartAnnotationsManager.prototype.register = function (object) {
        this.chartAnnotations.push(object);
        this.positionAnnotationsForPositionIndex(object.getPositionIndex());
    };
    ChartAnnotationsManager.prototype.removeByType = function (type) {
        this.chartAnnotations = this.chartAnnotations.filter(function (o) { return o.getAnnotationType() !== type; });
    };
    ChartAnnotationsManager.prototype.getChartAnnotations = function () {
        return this.chartAnnotations;
    };
    ChartAnnotationsManager.prototype.positionAnnotationsForPositionIndex = function (positionIndex) {
        var sameCandleObjects = this.chartAnnotations.filter(function (object) { return object.getPositionIndex() == positionIndex; });
        var aboveIndex = 0;
        var belowIndex = 0;
        sameCandleObjects.forEach(function (object) {
            object.setOffset(object.isBelowCandle() ? belowIndex++ : aboveIndex++);
        });
    };
    return ChartAnnotationsManager;
}());
export { ChartAnnotationsManager };
//# sourceMappingURL=ChartAnnotationsManager.js.map