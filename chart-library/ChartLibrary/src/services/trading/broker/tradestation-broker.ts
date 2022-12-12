import {Broker, BrokerAccount, BrokerType} from './broker';
import {BehaviorSubject, Subject} from 'rxjs';
import {TradingOrder,TradingPosition} from './models';
// import {GridBoxType} from '../../../components/shared/grid-box/grid-box-type';
import {Company, Market} from '../../loader';
import {ChannelRequester, ChannelRequestType, SharedChannel} from '../../shared-channel';
import {
  TradestationOrder,
  TradestationOrdersService,
  TradestationOrderType,
  TradestationPositionsService,
  TradestationService,
  TradestationAccountsService,
  TradestationBuySellChannelRequest
} from '../tradestation';
import {TradestationUtils} from '../../../utils/tradestation.utils';
import {TradestationLogoutService} from '../tradestation/tradestation-logout-service';
import {TradestationPosition} from '../tradestation/tradestation-position/tradestation-position';
import {TradestationOrderSideType} from '../../trading/tradestation/tradestation-order/tradestation-order-side-type';

export class TradestationBroker implements Broker{

    private sessionStream: BehaviorSubject<boolean>;
    private positionsLoadedStream: Subject<void>;
    private refreshStream: Subject<void>;
    private cancelStream: Subject<void>;

    private tradingOrders: TradingOrder[] = [];
    private tradingPositions: TradingPosition[];

    constructor(private tradestationService:TradestationService, private sharedChannel:SharedChannel, private tradestationAccountsService: TradestationAccountsService,
                private tradestationLogoutService:TradestationLogoutService, private tradestationOrdersService:TradestationOrdersService,
                private tradestationPositionsService:TradestationPositionsService) {
        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();

        this.tradestationAccountsService.getSessionStream().subscribe((isActive: boolean) => {
                this.sessionStream.next(isActive);
            });

        this.tradestationLogoutService.getCancelBrokerSelectionStream()
            .subscribe(( ) => {
                this.cancelStream.next();
            });

        this.tradestationOrdersService.getOrdersStream()
            .subscribe((orders: TradestationOrder[]) => {
                this.tradingOrders = [];
                if(orders) {
                    let defaultAccountOrders = orders.filter(order => order.accountId == this.tradestationAccountsService.getDefaultAccount().name);
                    this.tradingOrders = TradingOrder.fromTradestationOrders(defaultAccountOrders);
                }
                this.refreshStream.next();
            });


        this.tradestationPositionsService.getPositionsStream()
            .subscribe((positions: TradestationPosition[]) => {
                this.tradingPositions = [];
                if(positions) {
                    let defaultAccountPositions = positions.filter(position => position.accountId == this.tradestationAccountsService.getDefaultAccount().name);
                    this.tradingPositions = TradingPosition.fromTradestationPositions(defaultAccountPositions);
                }
                this.refreshStream.next();
            });
    }

    activate(isReconnectMode: boolean): void {
        this.tradestationService.activate();
    }

    cancelOrder(orderId: string): void {
        let orders = this.tradestationOrdersService.getGroupedOrders();
        let order = orders.find(order => order.id == orderId);
        this.tradestationOrdersService.deleteOrderFromChart(order)
    }

    cancelStopLoss(orderId: string): void {
    }

    cancelTakeProfit(orderId: string): void {
    }

    public hasCancelOrderOption(orderId: string): boolean {
        return true;
    }

    public canMoveOrder(orderId: string): boolean {
        return true;
    }

    deactivate(): void {
        this.tradestationService.deactiveTradestation();
    }

    displaysAccount(): boolean {
        return false;
    }

    displayAccountBalances():boolean {
        return true;
    }

    displaysSettings(): boolean {
        return true;
    }

    displayAccountTransactions(): boolean {
        return false;
    }

    getAccounts(): BrokerAccount[] {
        return [];
    }

    getBrokerType(): BrokerType {
        return BrokerType.Tradestation;
    }

    getPositionSymbols(account: BrokerAccount): string[] {
        return [];
    }

    getPositionsLoadedStream(): Subject<void> {
        return this.positionsLoadedStream;
    }

    getRefreshStream(): Subject<void> {
        return this.refreshStream;
    }

    getSessionStream(): BehaviorSubject<boolean> {
        return this.sessionStream;
    }

    getCancelStream() : Subject<void> {
        return this.cancelStream;
    }

    getTradingOrders(): TradingOrder[] {
        return this.tradingOrders;
    }
    //
    // getTradingOrdersGridBoxType(): GridBoxType {
    //     return GridBoxType.TradestationOrders;
    // }
    //
    // getTradingAccountBalanceGridBoxType(): GridBoxType {
    //     return GridBoxType.TradestationAccountBalance;
    // }

    getTradingPositions(): TradingPosition[] {
            return this.tradingPositions;
    }

    // getTradingPositionsGridBoxType(): GridBoxType {
    //     return GridBoxType.TradestationPositions;
    // }

    isStopOrderSupported(): boolean {
        return true;
    }

    isSupportedMarket(market: Market): boolean {
       return TradestationUtils.getAllowedMarketsAbbreviations().includes(market.abbreviation);
    }

    onLogout(): void {
    }

    public hasReversePositionOption() : boolean {
        return true;
    }

    public hasClosePositionOption():boolean{
        return true;
    }

    public needToConcatSideTextWithTypeText():boolean {
        return true;
    }

    public useDarkLightTextColor():boolean {
        return true;
    }

    openEditOrderScreen(orderId: string, price?: number, requester?: ChannelRequester): void {
        let orders = this.tradestationOrdersService.getGroupedOrders();
        let order = orders.find(order => order.id == orderId);
        let openRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            price: this.isStopOrderType(order) ? 0 : price,
            stopPrice: this.isStopOrderType(order) ? price : 0,
            requester: requester
        };
        this.sharedChannel.request(openRequest);
    }

    openEditStopLossScreen(orderId: string, stopLoss: number, requester?: ChannelRequester): void {
        let orders = this.tradestationOrdersService.getGroupedOrders();
        let order = orders.find(order => order.id == orderId);
        order.stopLossPrice = stopLoss;

        let openRequest : TradestationBuySellChannelRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            requester: requester
        };

        this.sharedChannel.request(openRequest);
    }

    openEditTakeProfitScreen(orderId: string, takeProfit: number, requester?: ChannelRequester): void {
        let orders = this.tradestationOrdersService.getGroupedOrders();
        let order = orders.find(order => order.id == orderId);
        order.takeProfitPrice = takeProfit;

        let openRequest : TradestationBuySellChannelRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            requester: requester
        };

        this.sharedChannel.request(openRequest);
    }

    openSellAllSharesScreen(company: Company): void { }

    public onBoundPositionClicked(position:TradingPosition):void {
        let positions = this.tradestationPositionsService.getPositionsStream().getValue();
        let filteredPosition = positions.find(order => order.id == position.id);
        let openRequest: TradestationBuySellChannelRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: TradestationOrder.fromPosition(filteredPosition , TradestationOrderSideType.Sell , TradestationOrderType.Limit),
            closeQuantity: true
        };
        this.sharedChannel.request(openRequest);
    };

    public onClosePosition(position:TradingPosition):void {
        let positions = this.tradestationPositionsService.getPositionsStream().getValue();
        let filteredPosition = positions.find(order => order.id == position.id);
        this.tradestationPositionsService.onClosePosition([filteredPosition]);
    };

    public onReversePosition(position:TradingPosition):void {
        let positions = this.tradestationPositionsService.getPositionsStream().getValue();
        let filteredPosition = positions.find(order => order.id == position.id);
        this.tradestationPositionsService.onReversePosition(filteredPosition);
    };

    public openBuyScreen(company: Company, price?: number): void {
        this.openTradestationBuyAndSale('Buy', company, price , null , TradestationOrderType.Limit)
    }

    public openSellScreen(company: Company, price?: number): void {
        this.openTradestationBuyAndSale('Sell', company, price , null , TradestationOrderType.Limit)
    }

    public openStopScreen(company: Company, price?: number): void {
        this.openTradestationBuyAndSale('Sell', company, price , null , TradestationOrderType.StopMarket)
    }

    private openTradestationBuyAndSale(side: string, company: Company, price: number, quantity?: number, orderType?: TradestationOrderType): void {
        let order = TradestationOrder.newOrder(side, company.symbol, company.name);
        if (quantity) {
            order.quantity = quantity;
        }
        if (orderType) {
            order.type = orderType;
        }
        let openRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            price: this.isStopOrderType(order) ? 0 : price,
            stopPrice: this.isStopOrderType(order) ? price : 0
        };
        this.sharedChannel.request(openRequest);
    }

    private isStopOrderType(order: TradestationOrder): boolean {
        return TradestationOrder.isStopOrder(order);
    }

}
