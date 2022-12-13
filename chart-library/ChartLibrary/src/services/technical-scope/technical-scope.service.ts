import {Injectable} from '@angular/core';
import {Streamer} from '../streaming/streamer';
import {Company, Market} from '../loader';
import {Observable, Subject} from 'rxjs';
import {TechnicalScopeSignal} from './technical-scope-signal';
import {TechnicalScopeMessage} from '../streaming/shared';
import {Interval, TechnicalScopeLoader} from '../loader';
import {map} from 'rxjs/operators';

@Injectable()
export class TechnicalScopeService {

    private streamerSubscription: Subject<TechnicalScopeSignal> = new Subject();
    private subscribedTopics: { [topic: string]: number } = {};

    constructor(private streamer: Streamer, private technicalScopeLoader: TechnicalScopeLoader) {
        this.subscribeToStreamerMessages();
    }

    public getOnStreamDataSubscription(): Subject<TechnicalScopeSignal> {
        return this.streamerSubscription;
    }

    public loadHistoricalData(interval: Interval, market: Market): Observable<TechnicalScopeSignal[]> {
        return this.technicalScopeLoader.loadTechnicalScopeHistoricalData(this.getServerInterval(interval), market.abbreviation)
            .pipe(map(message => this.processHistoricalData(message)));
    }

    private processHistoricalData(messages: TechnicalScopeMessage[]): TechnicalScopeSignal[] {
        let historicalData: TechnicalScopeSignal[] = [];
        messages.forEach(message => {
            // if (this.marketsManager.hasCompany(message.symbol)) {
            //     historicalData.push(this.getTechnicalScopeMessage(message));
            // }
        });
        return historicalData;
    }

    public getTechnicalScopeStrategies(){
        return TechnicalScopeSignal.getTechnicalScopeStrategies();
    }

    public subscribeTopic(interval: Interval, marketAbbr: string) {
        let topic = this.getTopic(interval , marketAbbr);
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]++;
        } else {
            this.subscribedTopics[topic] = 1;
        }
        if (this.subscribedTopics[topic] == 1) {
            this.streamer.getGeneralPurposeStreamer().subscribeTechnicalScope(this.getServerInterval(interval), marketAbbr);
        }
    }

    public unsubscribeTopic(interval: Interval, marketAbbr: string) {
        let topic = this.getTopic(interval , marketAbbr);
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]--;
        }
        if (this.subscribedTopics[topic] == 0) {
            this.streamer.getGeneralPurposeStreamer().unSubscribeTechnicalScope(this.getServerInterval(interval) , marketAbbr);
        }
    }

    public getTopic(interval: Interval , marketAbbr: string): string{
        return this.getServerInterval(interval) + '.num-alerts.' + marketAbbr;
    }

    public getServerInterval(interval: Interval): string{
        return Interval.toAlertServerInterval(interval.type);
    }

    private subscribeToStreamerMessages() {
        this.streamer.getGeneralPurposeStreamer().getTechnicalScopeStreamer()
            .subscribe((message: TechnicalScopeMessage) => this.onStreamerMessage(message));
    }

    private onStreamerMessage(message: TechnicalScopeMessage) {
        this.streamerSubscription.next(this.getTechnicalScopeMessage(message));
    }

    private getTechnicalScopeMessage(message: TechnicalScopeMessage): TechnicalScopeSignal {
        // let company: Company = this.marketsManager.getCompanyBySymbol(message.symbol);
      let company = null;
        return TechnicalScopeSignal.formatTechnicalScopeSignal(company,message);
    }
}
