var LiquidityPoint = (function () {
    function LiquidityPoint(time, inflowAmount, inflowVolume, outflowAmount, outflowVolume, percentage, netVolume, netAmount) {
        this.time = time;
        this.inflowAmount = inflowAmount;
        this.inflowVolume = inflowVolume;
        this.outflowAmount = outflowAmount;
        this.outflowVolume = outflowVolume;
        this.percentage = percentage;
        this.netVolume = netVolume;
        this.netAmount = netAmount;
    }
    LiquidityPoint.fromLoaderData = function (data) {
        var results = [];
        var fieldsList = data[0];
        var timeIndex;
        var inflowAmountIndex;
        var inflowVolumeIndex;
        var outflowAmountIndex;
        var outflowVolumeIndex;
        var percentageIndex;
        var netVolumeIndex;
        var netAmountIndex;
        for (var i = 0, n = fieldsList.length; i < n; i++) {
            var fieldName = fieldsList[i];
            switch (fieldName) {
                case 'time':
                    timeIndex = i;
                    break;
                case 'inf-amnt':
                    inflowAmountIndex = i;
                    break;
                case 'inf-vol':
                    inflowVolumeIndex = i;
                    break;
                case 'outf-amnt':
                    outflowAmountIndex = i;
                    break;
                case 'outf-vol':
                    outflowVolumeIndex = i;
                    break;
                case 'prcnt':
                    percentageIndex = i;
                    break;
                case 'net-vol':
                    netVolumeIndex = i;
                    break;
                case 'net-amnt':
                    netAmountIndex = i;
                    break;
            }
        }
        for (var i = 1, n = data.length; i < n; i++) {
            var liquidityEntry = data[i];
            results.push(new LiquidityPoint(liquidityEntry[timeIndex], +liquidityEntry[inflowAmountIndex], +liquidityEntry[inflowVolumeIndex], +liquidityEntry[outflowAmountIndex], +liquidityEntry[outflowVolumeIndex], +liquidityEntry[percentageIndex], +liquidityEntry[netVolumeIndex], +liquidityEntry[netAmountIndex]));
        }
        return results;
    };
    LiquidityPoint.fromLiquidityMessage = function (message) {
        return new LiquidityPoint(message.time, +message.inflowAmount, +message.inflowVolume, +message.outflowAmount, +message.outflowVolume, +message.percent, +message.netVolume, +message.netAmount);
    };
    return LiquidityPoint;
}());
export { LiquidityPoint };
//# sourceMappingURL=liquidity-point.js.map