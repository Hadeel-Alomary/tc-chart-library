import {Company, Market} from '../../loader/index';
import {Broker, BrokerAccount, BrokerType} from './broker';
// import {GridBoxType} from '../../../components/shared/grid-box/grid-box-type';
import {BehaviorSubject, Subject} from 'rxjs/index';
import {ChannelRequester, ChannelRequestType, SharedChannel} from '../../shared-channel';
import {
    VirtualTradingOrder,
    VirtualTradingOrdersService, VirtualTradingOrderType,
    VirtualTradingPosition,
    VirtualTradingPositionsService,
    VirtualTradingService
} from '../virtual-trading';
import {TradingOrder, TradingPosition} from './models';

export class VirtualTradingBroker implements Broker {

    private sessionStream: BehaviorSubject<boolean>;
    private positionsLoadedStream: Subject<void>;
    private refreshStream: Subject<void>;
    private cancelStream: Subject<void>;

    private tradingOrders: TradingOrder[];
    private tradingPositions: TradingPosition[];

    constructor(private vtService:VirtualTradingService,
                private virtualTradingPositionsService: VirtualTradingPositionsService,
                private virtualTradingOrdersService: VirtualTradingOrdersService,
                private sharedChannel:SharedChannel){

        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();

        this.vtService.getAccountStream()
            .subscribe(account => {
                this.sessionStream.next(account != null);
            });

        this.virtualTradingPositionsService.getPositionsLoadedStream()
            .subscribe(() => {
                this.positionsLoadedStream.next();
            });

        this.virtualTradingPositionsService.getPositionsStream()
            .subscribe((positions: VirtualTradingPosition[]) => {
                this.tradingPositions = [];
                if(positions) {
                    this.tradingPositions = TradingPosition.fromVirtualTradingPositions(positions);
                }
                this.refreshStream.next();
            });

        this.virtualTradingOrdersService.getOrdersStream()
            .subscribe((orders: VirtualTradingOrder[]) => {
                this.tradingOrders = [];
                if(orders) {
                    this.tradingOrders = TradingOrder.fromVirtualTradingOrders(orders);
                }
                this.refreshStream.next();
            });

    }

    public deactivate(): void {
        this.vtService.disconnectFromVirtualTrading();
    }

    public getBrokerType(): BrokerType {
        return BrokerType.VirtualTrading;
    }

    public isStopOrderSupported(): boolean {
        return true;
    }

    public isSupportedMarket(market: Market): boolean {
        return this.vtService.isSupportedMarket(market);
    }

    public onBoundPositionClicked(position:TradingPosition):void {
        return;
    };

    public onClosePosition(position:TradingPosition):void {
        return;
    };

    public onReversePosition(position:TradingPosition):void {
        return;
    };

    public hasReversePositionOption() : boolean {
        return false;
    }

    public hasClosePositionOption():boolean{
        return false;
    }

    public needToConcatSideTextWithTypeText():boolean {
        return false;
    }

    public useDarkLightTextColor():boolean {
        return false;
    }

    public openBuyScreen(market:Market,company: Company, price?: number): void {
        this.openVTBuyAndSale('BUY',market, company, price, null, VirtualTradingOrderType.fromValue('LIMIT'))
    }

    public openSellScreen(market:Market,company: Company, price?: number): void {
        this.openVTBuyAndSale('SELL',market, company, price, null, VirtualTradingOrderType.fromValue('LIMIT'))
    }

    public openStopScreen(market:Market,company: Company, price?: number): void {
        this.openVTBuyAndSale('SELL', market,company, price, null, VirtualTradingOrderType.fromValue('STOP'))
    }

    public openSellAllSharesScreen(market:Market,company: Company): void {
        let positions = this.virtualTradingPositionsService.getPositionsStream().getValue();
        let position = positions.find(position => position.symbol == company.symbol);
        if(position) {
            this.openVTBuyAndSale('SELL', market,company, null, position.quantity, VirtualTradingOrderType.fromValue('LIMIT'));
        }
    }

    public openEditOrderScreen(orderId: string, price?: number, requester?: ChannelRequester): void {
        let orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        let order = orders.find(order => order.id == orderId);
        let openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            price: price,
            requester: requester
        };

        this.sharedChannel.request(openRequest);
    }

    public openEditTakeProfitScreen(orderId: string, takeProfit: number, requester?: ChannelRequester): void {
        let orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        let order = orders.find(order => order.id == orderId);
        order.takeProfit = takeProfit;

        let openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            requester: requester
        };

        this.sharedChannel.request(openRequest);
    }

    public openEditStopLossScreen(orderId: string, stopLoss: number, requester?: ChannelRequester): void {
        let orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        let order = orders.find(order => order.id == orderId);
        order.stopPrice = stopLoss;

        let openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            requester: requester
        };

        this.sharedChannel.request(openRequest);
    }

    public cancelOrder(orderId: string): void {
        // HA : I saw if deleteOrder/updateOrder take order id will be better .
        let orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        let order = orders.find(order => order.id == orderId);
        this.virtualTradingOrdersService.deleteOrder(order);
    }

    public cancelTakeProfit(orderId: string): void {
        let orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        let order = orders.find(order => order.id == orderId);
        order.takeProfit = null;
        this.virtualTradingOrdersService.updateOrder(order).subscribe();
    }

    public cancelStopLoss(orderId: string): void {
        let orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        let order = orders.find(order => order.id == orderId);
        order.stopPrice = null;
        this.virtualTradingOrdersService.updateOrder(order).subscribe();
    }

    public hasCancelOrderOption(): boolean {
        return true;
    }

    public canMoveOrder(orderId: string): boolean {
        return true;
    }

    // public getTradingOrdersGridBoxType(): GridBoxType {
    //     return GridBoxType.VirtualTradingOrders;
    // }
    //
    // public getTradingPositionsGridBoxType(): GridBoxType {
    //     return GridBoxType.VirtualTradingPositions;
    // }
    //
    // getTradingAccountBalanceGridBoxType(): GridBoxType {
    //     return undefined;
    // }

    public getSessionStream(): BehaviorSubject<boolean> {
        return this.sessionStream;
    }

    private openVTBuyAndSale(side: string,market:Market, company: Company, price: number, quantity?: number, orderType?: VirtualTradingOrderType): void {
        let accountId: number = this.vtService.getAccountStream().getValue().id;
        let commission: number = this.vtService.getAccountStream().getValue().commission;
        let order = VirtualTradingOrder.newOrder(side, company.symbol, company.name, accountId, commission, market);
        if(quantity) {
            order.quantity = quantity;
        }
        if(orderType) {
            order.orderType = orderType;
        }

        let openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            price: price
        };
        this.sharedChannel.request(openRequest);
    }

    activate(isReconnectMode: boolean): void {
        this.vtService.activateSettings();
    }

    displaysSettings(): boolean {
        return true;
    }

    displayAccountTransactions(): boolean {
        return true;
    }

    displayAccountBalances():boolean {
        return false;
    }

    displaysAccount(): boolean {
        return true;
    }

    onLogout(): void {
        // nothing to do on Logout
    }

    getPositionsLoadedStream(): Subject<void> {
        return this.positionsLoadedStream;
    }

    getRefreshStream(): Subject<void> {
        return this.refreshStream;
    }

    getCancelStream() : Subject<void> {
        return this.cancelStream;
    }

    getTradingOrders(): TradingOrder[] {
        return this.tradingOrders;
    }

    getTradingPositions(): TradingPosition[] {
        return this.tradingPositions;
    }

    getAccounts(): BrokerAccount[] {
        let accounts:BrokerAccount[] = [];
        if(this.vtService.getAccount()) {
            accounts.push({id: this.vtService.getAccount().id.toString(), name: this.vtService.getAccount().name});
        }
        return accounts;
    }

    getPositionSymbols(account: BrokerAccount): string[] {
        let symbols:string[] = [];
        this.virtualTradingPositionsService.getPositionsStream().getValue().forEach(position => {
            symbols.push(position.symbol);
        });
        return symbols;
    }

}
