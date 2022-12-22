import {Broker, BrokerType} from './broker/broker';
import {ChannelRequestType, SharedChannel} from '../shared-channel';
import {EnumUtils} from '../../utils/enum.utils';
import {Watchlist, WatchlistService, WatchlistType} from "../../services";

export class BrokerWatchlistManager {

    constructor(private watchlistService:WatchlistService, private sharedChannel:SharedChannel){}

    public refreshTradingWatchlists(broker:Broker):void {

        let brokerWatchlists:Watchlist[] = this.buildBrokerWatchlists(broker);

        for(let brokerWatchlist of brokerWatchlists){
            let watchlist:Watchlist = this.watchlistService.get(brokerWatchlist.id);
            if(null == watchlist) {
                this.watchlistService.addTradingWatchlist(brokerWatchlist);
            } else {
                watchlist.name = brokerWatchlist.name;
                watchlist.symbols = brokerWatchlist.symbols;
                this.watchlistService.save();
            }
        }

        this.watchlistService.getTradingWatchlists().forEach(watchlist => {
            if(!brokerWatchlists.find(w => w.id == watchlist.id)){
                this.watchlistService.removeTradingWatchlist(watchlist); // non-existing trading watchlist, remove it
            }
        })

        this.sharedChannel.request({type: ChannelRequestType.WatchlistRefresh});

    }

    private buildBrokerWatchlists(broker:Broker):Watchlist[] {

        let brokerWatchlists: Watchlist[] = [];

        broker.getAccounts().forEach(account => {

            let watchlistId: string = 'broker-' + EnumUtils.enumValueToString(BrokerType, broker.getBrokerType()) + '-' + account.id;
            let symbols: { [symbol: string]: string } = {};

            broker.getPositionSymbols(account).forEach(symbol => symbols[symbol] = symbol);

            brokerWatchlists.push({
                id: watchlistId,
                name: account.name,
                type: WatchlistType.Trading,
                symbols: symbols
            });

        });

        return brokerWatchlists;

    }


}
