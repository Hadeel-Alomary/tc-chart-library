import {Company, Interval, Market} from '../loader';
import {VolumeProfilerSettings} from './volume-profiler.service';
import {DateUtils} from '../../utils';

export class VolumeProfilerRequestBuilder {

    public constructor(){}

    public prepareSessionBasedVolumeProfilerRequest(requesterId: string,
                                                    symbol: string,
                                                    interval: Interval,
                                                    volumeProfilerSettings: VolumeProfilerSettings,
                                                    from: string,
                                                    to:string):VolumeProfilerRequest {

        to = this.removeSecondsFromDateTime(to);
        from = this.removeTimeFromDateTime(from); // Session based is on full days

        return this.prepareVolumeProfilerRequest(requesterId, symbol, interval, volumeProfilerSettings, from, to,  true);

    }


    public prepareHistoricalVolumeProfilerRequest(requesterId: string,
                                                  symbol: string,
                                                  interval: Interval,
                                                  volumeProfilerSettings: VolumeProfilerSettings,
                                                  from: string,
                                                  to: string):VolumeProfilerRequest {
        to = this.removeSecondsFromDateTime(to);
        from = this.removeSecondsFromDateTime(from);
        return this.prepareVolumeProfilerRequest(requesterId, symbol, interval, volumeProfilerSettings, from, to,  false)
    }


    private prepareVolumeProfilerRequest(requesterId: string,
                                         symbol: string,
                                         interval: Interval,
                                         volumeProfilerSettings: VolumeProfilerSettings,
                                         from: string,
                                         to: string,
                                         segmentPerSession: boolean): VolumeProfilerRequest {

        let durationInDays = moment(to, 'YYYY-MM-DD HH:mm:ss').diff(moment(from, 'YYYY-MM-DD HH:mm:ss'), 'days');

        return {
            requestedId: requesterId,
            symbol: symbol,
            requestedInterval: interval,
            volumeProfilerSettings: volumeProfilerSettings,
            from: from,
            to: to,
            durationInDays:durationInDays,
            segmentPerSession: segmentPerSession,
            market:null,
		    company:null,
        };

    }

    private removeTimeFromDateTime(time: string) {
        return DateUtils.toDate(time) + ' 00:00:00';
    }

    private removeSecondsFromDateTime(time: string) {
        return time.substr(0, 'YYYY-MM-DD HH:mm'.length) + ':00';
    }

}

export interface VolumeProfilerRequest {
    requestedId:string,
    symbol:string,
    requestedInterval:Interval,
    volumeProfilerSettings:VolumeProfilerSettings,
    from:string,
    to:string,
    durationInDays:number,
    segmentPerSession:boolean,

  market:Market,
  company:Company,
}
