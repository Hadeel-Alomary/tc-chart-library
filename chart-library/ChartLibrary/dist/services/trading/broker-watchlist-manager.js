import { BrokerType } from './broker/broker';
import { ChannelRequestType } from '../shared-channel';
import { EnumUtils } from '../../utils/enum.utils';
import { WatchlistType } from "../../services";
var BrokerWatchlistManager = (function () {
    function BrokerWatchlistManager(watchlistService, sharedChannel) {
        this.watchlistService = watchlistService;
        this.sharedChannel = sharedChannel;
    }
    BrokerWatchlistManager.prototype.refreshTradingWatchlists = function (broker) {
        var _this = this;
        var brokerWatchlists = this.buildBrokerWatchlists(broker);
        for (var _i = 0, brokerWatchlists_1 = brokerWatchlists; _i < brokerWatchlists_1.length; _i++) {
            var brokerWatchlist = brokerWatchlists_1[_i];
            var watchlist = this.watchlistService.get(brokerWatchlist.id);
            if (null == watchlist) {
                this.watchlistService.addTradingWatchlist(brokerWatchlist);
            }
            else {
                watchlist.name = brokerWatchlist.name;
                watchlist.symbols = brokerWatchlist.symbols;
                this.watchlistService.save();
            }
        }
        this.watchlistService.getTradingWatchlists().forEach(function (watchlist) {
            if (!brokerWatchlists.find(function (w) { return w.id == watchlist.id; })) {
                _this.watchlistService.removeTradingWatchlist(watchlist);
            }
        });
        this.sharedChannel.request({ type: ChannelRequestType.WatchlistRefresh });
    };
    BrokerWatchlistManager.prototype.buildBrokerWatchlists = function (broker) {
        var brokerWatchlists = [];
        broker.getAccounts().forEach(function (account) {
            var watchlistId = 'broker-' + EnumUtils.enumValueToString(BrokerType, broker.getBrokerType()) + '-' + account.id;
            var symbols = {};
            broker.getPositionSymbols(account).forEach(function (symbol) { return symbols[symbol] = symbol; });
            brokerWatchlists.push({
                id: watchlistId,
                name: account.name,
                type: WatchlistType.Trading,
                symbols: symbols
            });
        });
        return brokerWatchlists;
    };
    return BrokerWatchlistManager;
}());
export { BrokerWatchlistManager };
//# sourceMappingURL=broker-watchlist-manager.js.map