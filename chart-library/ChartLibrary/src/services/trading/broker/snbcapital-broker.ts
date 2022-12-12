import {Broker, BrokerAccount, BrokerType} from './broker';
import {Company, Market} from '../../loader/index';
import {
  SnbcapitalBuySellChannelRequest,
  SnbcapitalOrder,
  SnbcapitalOrderDetails,
  SnbcapitalOrderExecution,
  SnbcapitalOrdersService,
  SnbcapitalOrderStatus,
  SnbcapitalOrderStatusGroupType,
  SnbcapitalOrderType,
  SnbcapitalPortfolio,
  SnbcapitalPositionsService,
  SnbcapitalService
} from '../snbcapital/index';
import {ChannelRequester, ChannelRequestType, SharedChannel} from '../../shared-channel/index';
// import {GridBoxType} from '../../../components/shared/grid-box/grid-box-type';
import {BehaviorSubject, Subject} from 'rxjs/index';
import {SnbcapitalPosition} from '../snbcapital/snbcapital-position/snbcapital-position';
import {TradingOrder, TradingOrderSide, TradingOrderStatus, TradingOrderTypeWrapper, TradingPosition} from './models';
import {TradingOrderSideType} from './models/trading-order-side';
import {TradingOrderType} from './models/trading-order-type';
import {TradingOrderStatusType} from './models/trading-order-status';
import {MessageBoxRequest} from "../../../services/shared-channel/channel-request";

export class SnbcapitalBroker implements Broker {

    private sessionStream: BehaviorSubject<boolean>;
    private positionsLoadedStream: Subject<void>;
    private refreshStream: Subject<void>;
    private cancelStream: Subject<void>;

    constructor(private snbcapitalService:SnbcapitalService,
                private snbcapitalPositionService:SnbcapitalPositionsService,
                private snbcapitalOrdersService:SnbcapitalOrdersService,
                private sharedChannel:SharedChannel){

        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();

        this.snbcapitalService.getPortfoliosStream()
            .subscribe(portfolios => {
                this.sessionStream.next(portfolios != null && 0 < Object.keys(portfolios).length);
            });

        this.snbcapitalService.getCancelBrokerSelectionStream()
            .subscribe(( ) => {
                this.cancelStream.next();
            })

        // whenever portfolio changes, fire refresh stream
        this.snbcapitalPositionService.getPositionsLoadedStream()
            .subscribe(portfolio => {
                this.positionsLoadedStream.next();
            });

        this.snbcapitalPositionService.getPositionsStream().subscribe(() => {
            this.refreshStream.next();
        });

        this.snbcapitalOrdersService.getOrdersStream().subscribe(() => {
            this.refreshStream.next();
        });

    }

    public deactivate(): void {
        this.snbcapitalService.disconnectFromSnbcapital();
    }

    public getBrokerType(): BrokerType {
        return BrokerType.Snbcapital;
    }

    public isStopOrderSupported(): boolean {
        return false;
    }

    public isSupportedMarket(market: Market): boolean {
        return market.abbreviation == 'TAD';
    }


    public openBuyScreen(company: Company, price?: number): void {
        this.openSnbcapitalBuyAndSale(SnbcapitalOrderType.Buy, company, price)
    }

    public openSellScreen(company: Company, price?: number): void {
        this.openSnbcapitalBuyAndSale(SnbcapitalOrderType.Sell, company, price)
    }

    public openStopScreen(company: Company, price?: number): void {
    }

    public openSellAllSharesScreen(company: Company): void {
        let filteredPosition = this.snbcapitalPositionService.getPositions().find(position => position.symbol == company.symbol);;
        let openRequest:SnbcapitalBuySellChannelRequest = {type: ChannelRequestType.SnbcapitalBuySell, order: SnbcapitalOrder.fromPosition(filteredPosition, company.name)};

        this.sharedChannel.request(openRequest);
    }

    public openEditOrderScreen(orderId: string, price?: number, requester?: ChannelRequester): void {
        let order:SnbcapitalOrder = this.snbcapitalOrdersService.getOrders().find(order => order.id == orderId);
        if(order) {
            let portfolio: SnbcapitalPortfolio = this.snbcapitalService.getPortfolio(order.portfolioId)
            this.snbcapitalOrdersService.getOrderDetails(order, portfolio)
                .subscribe(
                    response => {
                        SnbcapitalOrder.updateOrderWithOrderDetails(order, response as SnbcapitalOrderDetails);
                        if (SnbcapitalOrder.canEditOrder(order)) {
                            let openRequest:SnbcapitalBuySellChannelRequest = {
                                type: ChannelRequestType.SnbcapitalBuySell,
                                order: order,
                                price:price,
                                requester: requester
                            };

                            this.sharedChannel.request(openRequest);
                        } else {
                            this.showMessageBox('لا يمكنك تعديل هذا الامر')
                        }
                    },
                    error => {
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
        return true;
    }

    public useDarkLightTextColor():boolean {
        return false;
    }

    public cancelOrder(orderId: string): void {
        let snbcapitalOrder = this.snbcapitalOrdersService.getOrders().find(order => order.id == orderId);
        if(snbcapitalOrder) {
            let portfolio:SnbcapitalPortfolio = this.snbcapitalService.getPortfolio(snbcapitalOrder.portfolioId);
            this.snbcapitalOrdersService.deleteOrder(snbcapitalOrder,portfolio)
                .subscribe(
                  (response:any) => {
                        this.showMessageBox('تم إرسال طلب الإلغاء بنجاح');
                        this.snbcapitalService.refreshPortfolioAfterSecond(portfolio);
                    },
                  (error:any) => {});
        }
    }

    private showMessageBox(message:string){
        let request:MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message};
        this.sharedChannel.request(request);
    }

    public cancelTakeProfit(orderId: string): void {
        return;
    }

    public cancelStopLoss(orderId: string): void {
        return;
    }

    public hasCancelOrderOption(orderId: string): boolean {
        let order = this.snbcapitalOrdersService.getOrders().find(order => order.id == orderId);
        if (order) {
            return order.isOpen;
        }
        return false;
    }

    public canMoveOrder(orderId: string): boolean {
        let order = this.snbcapitalOrdersService.getOrders().find(order => order.id == orderId);
        if(order){
            return order.priceCanBeModified;
        }
        return false;
    }

    // public getTradingOrdersGridBoxType(): GridBoxType {
    //     return GridBoxType.SnbcapitalOrders;
    // }
    //
    // public getTradingPositionsGridBoxType(): GridBoxType {
    //     return GridBoxType.SnbcapitalWallet;
    // }
    //
    // getTradingAccountBalanceGridBoxType(): GridBoxType {
    //     return GridBoxType.SnbcapitalAccountBalance;
    // }

    public getSessionStream(): BehaviorSubject<boolean> {
        return this.sessionStream;
    }

    public getCancelStream() : Subject<void> {
        return this.cancelStream;
    }

    private openSnbcapitalBuyAndSale(type: SnbcapitalOrderType, company: Company, price: number): void {
        let portfolios:SnbcapitalPortfolio[] = this.snbcapitalService.getPortfoliosStream().getValue();
        let defaultPortfolio = this.snbcapitalService.getDefaultPortfolioId() ?
            portfolios.find(portfolio => portfolio.portfolioId == this.snbcapitalService.getDefaultPortfolioId()) : portfolios[0];

        let openRequest = {
            type: ChannelRequestType.SnbcapitalBuySell,
            order: SnbcapitalOrder.newOrder(type, company.symbol, defaultPortfolio, company.name),
            price: price
        };
        this.sharedChannel.request(openRequest);
    }

    activate(): void {
        this.snbcapitalService.activate();
    }

    displaysSettings(): boolean {
        return true;
    }

    displayAccountTransactions(): boolean {
        return false;
    }

    displayAccountBalances():boolean{
        return true;
    }

    displaysAccount(): boolean {
        return false;
    }

    onLogout(): void {
        this.snbcapitalService.disconnectFromSnbcapital();
    }

    getPositionsLoadedStream(): Subject<void> {
        return this.positionsLoadedStream;
    }

    getRefreshStream(): Subject<void> {
        return this.refreshStream;
    }

    getTradingOrders(): TradingOrder[] {
        let tradingOrders: TradingOrder[] = [];
        this.snbcapitalOrdersService.getOrders().filter(order => order.isOpen && SnbcapitalOrderExecution.isLimitOrder(order)).forEach(snbcapitalOrder => {
            tradingOrders.push({
                id: snbcapitalOrder.id,
                symbol: snbcapitalOrder.symbol,
                price: snbcapitalOrder.price,
                quantity: snbcapitalOrder.quantity,
                side: TradingOrderSide.fromType(snbcapitalOrder.type.type == SnbcapitalOrderType.Buy ? TradingOrderSideType.BUY : TradingOrderSideType.SELL),
                type: TradingOrderTypeWrapper.fromType(TradingOrderType.LIMIT),
                status: TradingOrderStatus.fromType(SnbcapitalOrderStatus.filterStatusType(snbcapitalOrder, SnbcapitalOrderStatusGroupType.Active) ? TradingOrderStatusType.ACTIVE : TradingOrderStatusType.EXECUTED),
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

        this.snbcapitalPositionService.getPositions().forEach(position => {
            tradingPositions.push({
                id: position.id,
                brokerType:BrokerType.Snbcapital,
                symbol: position.symbol,
                averagePrice: position.cost,
                quantity: position.quantity,
                totalCost: position.totalCost,
                currentTotalCost: position.currentTotalCost
            });
        });

        return tradingPositions;

    }

    getAccounts(): BrokerAccount[] {
        let accounts:BrokerAccount[] = [];
        this.snbcapitalService.getPortfoliosStream().getValue().forEach(portfolio => {
            accounts.push({id: portfolio.portfolioId, name: portfolio.portfolioName});
        });
        return accounts;
    }

    getPositionSymbols(account: BrokerAccount): string[] {
        let symbols:string[] = [];
        let snbcapitalPositions:{[portfolio:string]:SnbcapitalPosition[]} = this.snbcapitalPositionService.getPositionsStream().getValue();
        if(account.id in snbcapitalPositions ) {
            snbcapitalPositions[account.id].forEach(position => {
                symbols.push(position.symbol);
            })
        }
        return symbols;
    }
}
