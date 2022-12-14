import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Company, Market} from '../loader/index';
import {Tc} from '../../utils/index';
import {DerayahOrdersService, DerayahPositionsService, DerayahService} from './derayah/index';
import {SnbcapitalOrdersService, SnbcapitalPositionsService, SnbcapitalService} from './snbcapital/index';
import {ChannelRequester, SharedChannel} from '../shared-channel/index';
// import {GridBoxType} from '../../components/shared/grid-box/grid-box-type';
import {Broker, BrokerType} from './broker/broker';
import {DerayahBroker} from './broker/derayah-broker';
import {SnbcapitalBroker} from './broker/snbcapital-broker';
import {NoBroker} from './broker/no-broker';
import {TradingStateService} from '../state/index';
import {VirtualTradingBroker} from './broker/virtual-trading-broker';
import {VirtualTradingOrdersService, VirtualTradingPositionsService, VirtualTradingService} from './virtual-trading';
import {EnumUtils} from '../../utils/enum.utils';
import {BrokerWatchlistManager} from './broker-watchlist-manager';
import {ChannelRequestType} from '../shared-channel';
import {SubscriptionLike as ISubscription} from 'rxjs/index';
import {Subject} from 'rxjs/internal/Subject';
import {TradingOrder, TradingPosition} from './broker/models';
import {TradestationBroker} from './broker/tradestation-broker';
import {TradestationAccountsService, TradestationLogoutService, TradestationOrdersService, TradestationPositionsService, TradestationService} from './tradestation';
import {WatchlistService} from "../../services";

@Injectable()
export class TradingService {

    private broker:Broker;
    private sessionStream: BehaviorSubject<boolean>;
    private brokerSelectionStream: BehaviorSubject<BrokerType>;
    private brokerWatchlistManager:BrokerWatchlistManager;
    private refreshSubscription:ISubscription;

    private brokerRefreshStream: Subject<void>;
    private brokerRefreshSubscription:ISubscription;

    constructor(private derayahService: DerayahService,
                private derayahOrdersService: DerayahOrdersService,
                private derayahPositionService: DerayahPositionsService,
                private snbcapitalService: SnbcapitalService,
                private snbcapitalOrdersService: SnbcapitalOrdersService,
                private snbcapitalPositionService: SnbcapitalPositionsService,
                private virtualTradingService: VirtualTradingService,
                private virtualTradingPositionsService: VirtualTradingPositionsService,
                private virtualTradingOrdersService: VirtualTradingOrdersService,
                private sharedChannel: SharedChannel,
                private tradingStateService:TradingStateService,
                private watchlistService:WatchlistService,
                private tradestationService:TradestationService,
                private tradestationAccountsService: TradestationAccountsService,
                private tradestationLogoutService: TradestationLogoutService,
                private tradestationOrdersService:TradestationOrdersService,
                private tradestationPositionsService:TradestationPositionsService) {

        this.sessionStream = new BehaviorSubject(false);
        this.brokerSelectionStream = new BehaviorSubject(BrokerType.None);
        this.broker = this.createBroker(BrokerType.None); // default is no broker (which will be changed later once markets are loaded)
        this.brokerRefreshStream = new Subject();
        //
        // this.loader.isLoadingDoneStream()
        //     .subscribe((doneLoading: boolean) => {
        //         if (doneLoading) {
        //             if(!this.tradingStateService.getSelectedBroker()){
        //                 this.tradingStateService.setSelectedBroker(Tc.enumString(BrokerType, BrokerType.None));
        //             }
                    // MA need timeout in order for GridContainers to init before sending broker selection (in case no broker is selected and
                    // GridContainer wants to remove the trading boxes)
                    // window.setTimeout(() => {
                    //     let selectedBroker:BrokerType = EnumUtils.enumStringToValue(BrokerType, this.tradingStateService.getSelectedBroker()) as BrokerType;
                    //     this.selectBroker(selectedBroker, true);
                    // }, 0);
                // }
            // });

        this.brokerWatchlistManager = new BrokerWatchlistManager(watchlistService, sharedChannel);

    }

    /* toolbar */
    get toolbarVisible(): boolean {
        return this.tradingStateService.getVirtualTradingFloatingToolbarVisibility();
    }

    set toolbarVisible(visible: boolean) {
        this.tradingStateService.setVirtualTradingFloatingToolbarVisibility(visible);
    }

    get toolbarPosition(): { top: number, left: number } {
        return this.tradingStateService.getVirtualTradingFloatingToolbarPosition();
    }

    set toolbarPosition(position: { top: number, left: number }) {
        this.tradingStateService.setVirtualTradingFloatingToolbarPosition(position);
    }

    get useFastOrder(): boolean {
        return this.tradingStateService.getUseFastOrder();
    }

    set useFastOrder(value: boolean) {
        this.tradingStateService.setUseFastOrder(value);
        this.brokerRefreshStream.next();
    }

    get showPositionDrawings(): boolean {
        return this.tradingStateService.getShowPositionDrawings();
    }

    set showPositionDrawings(value: boolean) {
        this.tradingStateService.setShowPositionDrawings(value);
        this.brokerRefreshStream.next();
    }

    get showOrderDrawings(): boolean {
        return this.tradingStateService.getShowOrderDrawings();
    }

    set showOrderDrawings(value: boolean) {
        this.tradingStateService.setShowOrderDrawings(value);
        this.brokerRefreshStream.next();
    }

    get showExecutedOrders(): boolean {
        return this.tradingStateService.getShowExecutedOrders();
    }

    set showExecutedOrders(value: boolean) {
        this.tradingStateService.setShowExecutedOrders(value);
        this.brokerRefreshStream.next();
    }

    /* buy and sell */
    public openBuyScreen(market:Market,symbol:string, price?: number):void{
        // let company = this.marketsManager.getCompanyBySymbol(symbol);
        // this.broker.openBuyScreen(company, price);
    }

    public openSellScreen(market:Market,symbol:string, price?: number):void{
        // let company = this.marketsManager.getCompanyBySymbol(symbol);
        // this.broker.openSellScreen(company, price);
    }

    public openStopScreen(symbol:string, price?: number):void{
        // let company = this.marketsManager.getCompanyBySymbol(symbol);
        // this.broker.openStopScreen(company, price);
    }

    public openSellAllSharesScreen(symbol:string):void{
        // let company = this.marketsManager.getCompanyBySymbol(symbol);
        // this.broker.openSellAllSharesScreen(company);
    }

    public onBoundPositionClicked(position:TradingPosition) {
        this.broker.onBoundPositionClicked(position);
    }

    public onClosePosition(position:TradingPosition) {
        this.broker.onClosePosition(position);
    }

    public onReversePosition(position:TradingPosition) {
        this.broker.onReversePosition(position);
    }

    public openEditOrderScreen(orderId: string, newPrice?: number, requester?: ChannelRequester): void {
        this.broker.openEditOrderScreen(orderId, newPrice, requester);
    }

    public openEditTakeProfitScreen(orderId: string, takeProfit: number, requester?: ChannelRequester): void {
        this.broker.openEditTakeProfitScreen(orderId, takeProfit, requester);
    }

    public openEditStopLossScreen(orderId: string, stopLoss: number, requester?: ChannelRequester): void {
        this.broker.openEditStopLossScreen(orderId, stopLoss, requester);
    }

    public cancelOrder(orderId: string): void {
        this.broker.cancelOrder(orderId);
    }

    public cancelTakeProfit(orderId: string): void {
        this.broker.cancelTakeProfit(orderId);
    }

    public cancelStopLoss(orderId: string): void {
        this.broker.cancelStopLoss(orderId);
    }

    public hasReversePositionOption(): boolean {
       return this.broker.hasReversePositionOption();
    }

    public hasClosePositionOption(): boolean {
        return this.broker.hasClosePositionOption();
    }

    public needToConcatSideTextWithTypeText():boolean {
        return this.broker.needToConcatSideTextWithTypeText();
    }

    public useDarkLightTextColor():boolean {
        return this.broker.useDarkLightTextColor();
    }

    public hasCancelOrderOption(orderId: string): boolean {
        return this.broker.hasCancelOrderOption(orderId);
    }

    public canMoveOrder(orderId: string): boolean {
        return this.broker.canMoveOrder(orderId);
    }

    /* symbol support */
    public isSymbolTradableByBroker(symbol: string): boolean {

        if (!symbol) {
            return false;
        }

        // let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        // if(!market){
        //     return;
        // }
        //
        // let company: Company = this.marketsManager.getCompanyBySymbol(symbol);
        // if (!company || company.index) {
        //     //NK company has removed, it's symbol changed or it's and index
        //     return false;
        // }

        // return this.broker.isSupportedMarket(market);

      return null;

    }

    /* order type support */
    public isStopOrderSupportedByBroker() {
        return this.broker.isStopOrderSupported();
    }

    /* activation & deactivation */
    public deselectBroker(): void {

        Tc.assert(this.getBrokerType() != BrokerType.None, "no broker is selected");

        this.broker.deactivate();
        this.broker = this.createBroker(BrokerType.None);
        this.tradingStateService.setSelectedBroker(EnumUtils.enumValueToString(BrokerType, BrokerType.None));
        this.brokerSelectionStream.next(BrokerType.None);

        this.refreshSubscription.unsubscribe();
        this.brokerRefreshSubscription.unsubscribe();
        this.watchlistService.removeAllTradingWatchlists();
        this.sharedChannel.request({type: ChannelRequestType.WatchlistRefresh});

    }

    public selectBroker(brokerType:BrokerType, isReconnectMode: boolean): void {
        // Ehab isReconnectMode when user click to integrate with broker it will be false otherwise any code called this function it will be true

        // MA ordering is important, this should be called the first for broker components to be created.
        this.brokerSelectionStream.next(brokerType);

        // MA wait for any component to finish rendering (in above notification) before proceeding further in selection of broker.
        window.setTimeout(() => {
            this.broker = this.createBroker(brokerType);
            this.broker.getSessionStream().subscribe((established: boolean) => {
                this.onBrokerSessionEstablished(established);
                this.sessionStream.next(established);
            });
            this.broker.activate(isReconnectMode);

            this.refreshSubscription = this.broker.getPositionsLoadedStream().subscribe(() => {
                this.brokerWatchlistManager.refreshTradingWatchlists(this.broker);
            });

            this.brokerRefreshSubscription = this.broker.getRefreshStream().subscribe(
                () => {
                    this.brokerRefreshStream.next();
                }
            );

            //HA: ------ this stream is important -------- .
            this.broker.getCancelStream().subscribe(() => {
                if (this.getBrokerType() == BrokerType.None) {
                    // HA : to reshow trading button in footer if we click cancel and have no broker selected yet .
                    this.brokerSelectionStream.next(BrokerType.None);
                }
            });
        }, 0);

    }

    public hasSelectedBroker(): boolean {
        return false;
        // return this.tradingStateService.getSelectedBroker() != EnumUtils.enumValueToString(BrokerType, BrokerType.None);
    }

    public getBrokerRefreshStream(): Subject<void> {
        return this.brokerRefreshStream;
    }

    public getTradingOrders(): TradingOrder[] {
        return this.broker.getTradingOrders();
    }

    public getTradingPositions(): TradingPosition[] {
        return this.broker.getTradingPositions();
    }

    // MA we only consider broker as "selected" when user is able to establish a connection to the broker.
    // therefore, if the user chooses to abort the broker connection first steps, then the broker is not considered as "selected".
    private onBrokerSessionEstablished(established: boolean) {
        if (established) {
            let brokerTypeAsString: string = EnumUtils.enumValueToString(BrokerType, this.getBrokerType());
            // if (brokerTypeAsString != this.tradingStateService.getSelectedBroker()) {
            //     this.tradingStateService.setSelectedBroker(brokerTypeAsString);
            // }
        }
    }

    public onLogout():void {
        this.broker.onLogout();
    }

    /* streams */

    public getSessionStream():BehaviorSubject<boolean>{
        return this.sessionStream;
    }

    public getBrokerSelectionStream():BehaviorSubject<BrokerType> {
        return this.brokerSelectionStream;
    }

    /* grid box types */
    // public getTradingOrdersGridBoxType():GridBoxType{
    //     return this.broker.getTradingOrdersGridBoxType();
    // }
    //
    // public getTradingPositionsGridBoxType():GridBoxType{
    //     return this.broker.getTradingPositionsGridBoxType();
    // }
    //
    // public getTradingAccountBalanceGridBoxType(): GridBoxType{
    //     return this.broker.getTradingAccountBalanceGridBoxType();
    // }

    public getBrokerType(): BrokerType {
        return this.broker.getBrokerType();
    }

    public shouldDisplaySettings(): boolean {
        return this.broker.displaysSettings();
    }

    public shouldDisplayAccountBalances():boolean {
        return this.broker.displayAccountBalances();
    }

    public shouldDisplayAccount(): boolean {
        return this.broker.displaysAccount();
    }

    public shouldDisplayAccountTransactions(): boolean{
        return this.broker.displayAccountTransactions();
    }

    public listAvailableBrokers():BrokerType[] {

        let brokerTypes:BrokerType[] = [BrokerType.VirtualTrading];
        // if(this.marketsManager.isSubscribedInMarket("TAD")) {
        //    brokerTypes.push(BrokerType.Derayah);
        //    brokerTypes.push(BrokerType.Snbcapital);
        // }
        // if(this.marketsManager.isSubscribedInMarket('USA')){
        //     brokerTypes.push(BrokerType.Tradestation);
        // }
        return brokerTypes;

    }

    /* helpers */

    private createBroker(brokerType:BrokerType): Broker {
        switch (brokerType)  {
            case BrokerType.Derayah:
                return new DerayahBroker(this.derayahService, this.derayahPositionService, this.derayahOrdersService, this.sharedChannel);
            case BrokerType.Snbcapital:
                return new SnbcapitalBroker(this.snbcapitalService, this.snbcapitalPositionService, this.snbcapitalOrdersService, this.sharedChannel);
            case BrokerType.VirtualTrading:
                return new VirtualTradingBroker(this.virtualTradingService, this.virtualTradingPositionsService, this.virtualTradingOrdersService, this.sharedChannel);
            case BrokerType.Tradestation:
                return new TradestationBroker(this.tradestationService, this.sharedChannel, this.tradestationAccountsService, this.tradestationLogoutService, this.tradestationOrdersService,this.tradestationPositionsService);
            case BrokerType.None:
                return new NoBroker();
            default:
                Tc.error("should not be here")
        }
    }


}


