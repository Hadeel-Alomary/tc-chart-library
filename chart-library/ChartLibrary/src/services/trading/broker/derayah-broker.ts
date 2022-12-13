import {Broker, BrokerAccount, BrokerType} from './broker';
import {Company, Market} from '../../loader/index';
import {
    DerayahOrder,
    DerayahOrderDetails,
    DerayahOrderExecutionType,
    DerayahOrdersService,
    DerayahOrderStatus,
    DerayahOrderStatusGroupType,
    DerayahOrderType,
    DerayahPositionsService,
    DerayahService
} from '../derayah/index';
import {ChannelRequester, ChannelRequestType, SharedChannel} from '../../shared-channel/index';
import {DerayahUtils} from '../../../utils/index';
// import {GridBoxType} from '../../../components/shared/grid-box/grid-box-type';
import {BehaviorSubject, Subject} from 'rxjs/index';
import {DerayahPosition} from '../derayah/derayah-position/derayah-position';
import {TradingOrder, TradingOrderSide, TradingOrderStatus, TradingOrderTypeWrapper, TradingPosition} from './models';
import {TradingOrderSideType} from './models/trading-order-side';
import {TradingOrderType} from './models/trading-order-type';
import {TradingOrderStatusType} from './models/trading-order-status';
import {DerayahBuySellChannelRequest} from "../../../services/trading/derayah/derayah-channel-request";

export class DerayahBroker implements Broker {

    private sessionStream: BehaviorSubject<boolean>;
    private positionsLoadedStream: Subject<void>;
    private refreshStream: Subject<void>;
    private cancelStream: Subject<void>;

    constructor(private derayahService:DerayahService,
                private derayahPositionService:DerayahPositionsService,
                private derayahOrdersService:DerayahOrdersService,
                private sharedChannel:SharedChannel){

        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();

        this.derayahService.getPortfoliosStream()
            .subscribe(portfolios => {
                this.sessionStream.next(portfolios != null && 0 < Object.keys(portfolios).length);
            });

        this.derayahService.getCancelBrokerSelectionStream()
            .subscribe(( ) => {
                this.cancelStream.next();
            })

        // whenever portfolio changes, fire refresh stream
        this.derayahPositionService.getPositionsLoadedStream()
            .subscribe(portfolio => {
                this.positionsLoadedStream.next();
            });

        this.derayahPositionService.getPositionsStream().subscribe(() => {
            this.refreshStream.next();
        });

        this.derayahOrdersService.getOrdersStream().subscribe(() => {
            this.refreshStream.next();
        });

    }

    public deactivate(): void {
        this.derayahService.disconnectFromDerayah();
    }

    public getBrokerType(): BrokerType {
        return BrokerType.Derayah;
    }

    public isStopOrderSupported(): boolean {
        return false;
    }

    public isSupportedMarket(market: Market): boolean {
        return DerayahUtils.getAllowedMarketsAbbreviations().includes(market.abbreviation);
    }


    public openBuyScreen(market:Market ,company: Company, price?: number): void {
        this.openDerayahBuyAndSale(DerayahOrderType.Buy, company, price)
    }

    public openSellScreen(market:Market ,company: Company, price?: number): void {
        this.openDerayahBuyAndSale(DerayahOrderType.Sell, company, price)
    }

    public openStopScreen(market:Market ,company: Company, price?: number): void {
    }

    public openSellAllSharesScreen(market:Market ,company: Company): void {
        let derayahPosition = this.derayahPositionService.getPositions().find(position => position.symbol == company.symbol);
        if(derayahPosition) {
            let isNomuMarket:boolean = company.categoryId == 303;
            let openRequest:DerayahBuySellChannelRequest = {type: ChannelRequestType.DerayahSell, order: DerayahOrder.fromPosition(derayahPosition, company.name, isNomuMarket)};
            this.sharedChannel.request(openRequest);
        }
    }

    public openEditOrderScreen(orderId: string, price?: number, requester?: ChannelRequester): void {
        let order = this.derayahOrdersService.getOrders().find(order => order.id == orderId);
        if(order) {
            this.derayahOrdersService.getOrderDetails(order)
                .subscribe(
                    response => {
                        DerayahOrder.updateOrderWithOrderDetails(order, response.result as DerayahOrderDetails);
                        if (DerayahOrder.canEditOrder(order)) {
                            let editRequest:DerayahBuySellChannelRequest = {
                                type: order.type.type == DerayahOrderType.Buy ? ChannelRequestType.DerayahBuy : ChannelRequestType.DerayahSell,
                                order: order,
                                onDone: () => {
                                    if(requester) {
                                        requester.onRequestComplete();
                                    }
                                }
                            };
                            if(price) {
                                editRequest.price = price;
                            }
                            this.sharedChannel.request(editRequest);
                        }
                    });
        }
    }

    public openEditTakeProfitScreen(orderId: string, takeProfit: number, requester?: ChannelRequester): void {
        return;
    }

    public openEditStopLossScreen(orderId: string, stopLoss: number, requester?: ChannelRequester): void {
        return;
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

    public cancelOrder(orderId: string): void {
        let derayahOrder = this.derayahOrdersService.getOrders().find(order => order.id == orderId);
        if(derayahOrder) {
            this.derayahOrdersService.deleteOrder(derayahOrder).subscribe();
        }
    }

    public cancelTakeProfit(orderId: string): void {
        return;
    }

    public cancelStopLoss(orderId: string): void {
        return;
    }

    public hasCancelOrderOption(orderId: string): boolean {
        return true;
    }

    public canMoveOrder(orderId: string): boolean {
        return true;
    }

    // public getTradingOrdersGridBoxType(): GridBoxType {
    //     return GridBoxType.DerayahOrders;
    // }
    //
    // public getTradingPositionsGridBoxType(): GridBoxType {
    //     return GridBoxType.DerayahWallet;
    // }
    //
    // getTradingAccountBalanceGridBoxType(): GridBoxType {
    //     return undefined;
    // }

    public getSessionStream(): BehaviorSubject<boolean> {
        return this.sessionStream;
    }

    public getCancelStream() : Subject<void> {
        return this.cancelStream;
    }

    private openDerayahBuyAndSale(type: DerayahOrderType, company: Company, price: number): void {
        let portfolioNumber:string = this.derayahService.getPortfoliosStream().getValue()[0].portfolioNumber;
        let openRequest = {
            type: type == DerayahOrderType.Buy ? ChannelRequestType.DerayahBuy : ChannelRequestType.DerayahSell,
            order: DerayahOrder.newOrder(type, company.symbol, portfolioNumber, company.name, company.categoryId == 303),
            price: price
        };
        this.sharedChannel.request(openRequest);
    }

    activate(isReconnectMode: boolean): void {
        this.derayahService.activate(isReconnectMode);
    }

    displaysSettings(): boolean {
        return false;
    }

    displayAccountTransactions(): boolean {
        return false;
    }

    displayAccountBalances():boolean{
        return false;
    }

    displaysAccount(): boolean {
        return false;
    }

    onLogout(): void {
        this.derayahService.disconnectFromDerayah();
    }

    getPositionsLoadedStream(): Subject<void> {
        return this.positionsLoadedStream;
    }

    getRefreshStream(): Subject<void> {
        return this.refreshStream;
    }

    getTradingOrders(): TradingOrder[] {
        let tradingOrders:TradingOrder[] = [];
        this.derayahOrdersService.getOrders().filter(order =>
            DerayahOrderStatus.filterStatusType(order.status.type, DerayahOrderStatusGroupType.Executed) ||
            DerayahOrderStatus.filterStatusType(order.status.type, DerayahOrderStatusGroupType.OutStanding) ||
            order.execution.type != DerayahOrderExecutionType.Market
        ).forEach(derayahOrder => {
            tradingOrders.push({
                id:derayahOrder.id,
                symbol:derayahOrder.symbol,
                price:derayahOrder.price,
                quantity:derayahOrder.quantity,
                side: TradingOrderSide.fromType(derayahOrder.type.type == DerayahOrderType.Buy ? TradingOrderSideType.BUY : TradingOrderSideType.SELL),
                type:TradingOrderTypeWrapper.fromType(derayahOrder.execution.type == DerayahOrderExecutionType.Limit ? TradingOrderType.LIMIT : TradingOrderType.MARKET),
                status:TradingOrderStatus.fromType(DerayahOrderStatus.filterStatusType(derayahOrder.status.type, DerayahOrderStatusGroupType.OutStanding) ? TradingOrderStatusType.ACTIVE : TradingOrderStatusType.EXECUTED),
                takeProfit: 0,
                stopLoss: 0,
                executionPrice: 0,
                executionTime: null
            });
        });
        return tradingOrders;
    }

    getTradingPositions(): TradingPosition[] {

        let tradingPositions:TradingPosition[] = [];

        let tradingOrders:TradingOrder[] = [];

        this.derayahPositionService.getPositions().forEach(position => {
            tradingPositions.push({
                id: position.id,
                brokerType:BrokerType.Derayah,
                symbol: position.symbol,
                averagePrice: position.cost,
                quantity: position.quantity,
                totalCost: position.totalCost,
                currentTotalCost: position.currentTotalCost
            });
        })

        return tradingPositions;

    }

    getAccounts(): BrokerAccount[] {
        let accounts:BrokerAccount[] = [];
        this.derayahService.getPortfoliosStream().getValue().forEach(portfolio => {
            accounts.push({id: portfolio.portfolioNumber, name: portfolio.portfolioName});
        });
        return accounts;
    }

    getPositionSymbols(account: BrokerAccount): string[] {
        let symbols:string[] = [];
        let derayahPositions:{[portfolio:string]:DerayahPosition[]} = this.derayahPositionService.getPositionsStream().getValue();
        if(account.id in derayahPositions ) {
            derayahPositions[account.id].forEach(position => {
                symbols.push(position.symbol);
            })
        }
        return symbols;
    }
}
