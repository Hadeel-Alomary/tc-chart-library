import {Injectable} from '@angular/core';
import {Market} from '../loader';
import {Streamer} from '../streaming/streamer';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class TechnicalIndicatorQuoteService {

    private technicalIndicatorUpdateStream: Subject<Object>;
    private subscribedTopics: { [topic: string]: number } = {};

    constructor(private streamer: Streamer) {
        this.technicalIndicatorUpdateStream = new BehaviorSubject<Object>(null);
        // this.loader.getMarketStream().subscribe(response => this.onMarketData(response),
        //     error => {});
    }

    public getTechnicalIndicatorUpdateStream(): Subject<Object> {
        return this.technicalIndicatorUpdateStream;
    }

    private onMarketData(market: Market) {
        this.streamer.getTechnicalIndicatorStream(market.abbreviation).getTechnicalIndicator()
            .subscribe(message => this.onReceivingTechnicalIndicatorMessage(message));
    }

    private onReceivingTechnicalIndicatorMessage(message: Object) {
        this.technicalIndicatorUpdateStream.next(message);
    }

    public subscribeTopic(market: string, colTopic: string) {
        let topic =  'I.' + colTopic + '.' + market;
        if(Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]++;
        }else {
            this.subscribedTopics[topic] = 1;
        }
        if(this.subscribedTopics[topic] == 1 ){
            this.streamer.getTechnicalIndicatorStream(market).subscribeTechnicalIndicatorTopic(topic);
        }
    }

    public unSubscribeTopic(market: string, colTopic: string) {
        let topic =  'I.' + colTopic + '.' + market;
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]--;
        }
        if (this.subscribedTopics[topic] == 0) {
            this.streamer.getTechnicalIndicatorStream(market).unSubscribeTechnicalIndicatorTopic(topic);
            delete this.subscribedTopics[topic];
        }
    }
}
