import { DateUtils } from '../../utils';
var VolumeProfilerRequestBuilder = (function () {
    function VolumeProfilerRequestBuilder() {
    }
    VolumeProfilerRequestBuilder.prototype.prepareSessionBasedVolumeProfilerRequest = function (requesterId, symbol, interval, volumeProfilerSettings, from, to) {
        to = this.removeSecondsFromDateTime(to);
        from = this.removeTimeFromDateTime(from);
        return this.prepareVolumeProfilerRequest(requesterId, symbol, interval, volumeProfilerSettings, from, to, true);
    };
    VolumeProfilerRequestBuilder.prototype.prepareHistoricalVolumeProfilerRequest = function (requesterId, symbol, interval, volumeProfilerSettings, from, to) {
        to = this.removeSecondsFromDateTime(to);
        from = this.removeSecondsFromDateTime(from);
        return this.prepareVolumeProfilerRequest(requesterId, symbol, interval, volumeProfilerSettings, from, to, false);
    };
    VolumeProfilerRequestBuilder.prototype.prepareVolumeProfilerRequest = function (requesterId, symbol, interval, volumeProfilerSettings, from, to, segmentPerSession) {
        var durationInDays = moment(to, 'YYYY-MM-DD HH:mm:ss').diff(moment(from, 'YYYY-MM-DD HH:mm:ss'), 'days');
        return {
            requestedId: requesterId,
            symbol: symbol,
            requestedInterval: interval,
            volumeProfilerSettings: volumeProfilerSettings,
            from: from,
            to: to,
            durationInDays: durationInDays,
            segmentPerSession: segmentPerSession,
            market: null,
            company: null,
        };
    };
    VolumeProfilerRequestBuilder.prototype.removeTimeFromDateTime = function (time) {
        return DateUtils.toDate(time) + ' 00:00:00';
    };
    VolumeProfilerRequestBuilder.prototype.removeSecondsFromDateTime = function (time) {
        return time.substr(0, 'YYYY-MM-DD HH:mm'.length) + ':00';
    };
    return VolumeProfilerRequestBuilder;
}());
export { VolumeProfilerRequestBuilder };
//# sourceMappingURL=volume-profiler-request-builder.js.map