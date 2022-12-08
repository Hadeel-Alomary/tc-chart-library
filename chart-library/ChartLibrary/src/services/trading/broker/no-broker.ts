import {Company, Market} from '../../loader/index';
import {BrokerType, Broker, BrokerAccount} from './broker';
import {GridBoxType} from '../../../components/shared/grid-box/index';
import {Tc} from '../../../utils/index';
import {BehaviorSubject, Subject} from 'rxjs/index';
import {TradingOrder, TradingPosition} from './models';
import {ChannelRequester} from '../../shared-channel';


export class NoBroker implements Broker {

    private sessionStream: BehaviorSubject<boolean>;
    private positionsLoadedStream: Subject<void>;
    private refreshStream: Subject<void>;
    private cancelStream: Subject<void>;

    public constructor() {
        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();
    }

    public isToolbarVisible(): boolean {
        return false;
    }

    public setToolbarVisible(value: boolean): void {}

    public getToolbarPosition(): { top: number; left: number } {
        return {top: 0, left: 0};
    }

    public setToolbarPosition(value: { top: number; left: number }): void {}

    public openBuyScreen(company: Company, price?: number): void {
        Tc.error("should not be here")
    }

    public openSellScreen(company: Company, price?: number): void {
        Tc.error("should not be here")
    }

    public openStopScreen(company: Company, price?: number): void {
        Tc.error("should not be here")
    }

    public openSellAllSharesScreen(company: Company): void {
        Tc.error("should not be here");
    }

    public openEditOrderScreen(orderId: string, price?: number, requester?: ChannelRequester): void {
        Tc.error("should not be here");
    }

    public openEditTakeProfitScreen(orderId: string, takeProfit: number, requester?: ChannelRequester): void {
        Tc.error("should not be here");
    }

    public openEditStopLossScreen(orderId: string, stopLoss: number, requester?: ChannelRequester): void {
        Tc.error("should not be here");
    }

    public onBoundPositionClicked(position:TradingPosition):void {
        Tc.error("should not be here");
    };

    public onClosePosition(position:TradingPosition):void {
        Tc.error("should not be here");
    };

    public onReversePosition(position:TradingPosition):void {
        Tc.error("should not be here");
    };

    public cancelOrder(orderId: string): void {
        Tc.error("should not be here");
    }

    public cancelTakeProfit(orderId: string): void {
        Tc.error("should not be here");
    }

    public cancelStopLoss(orderId: string): void {
        Tc.error("should not be here");
    }

    public hasReversePositionOption() : boolean {
        return false;
    }

    public hasClosePositionOption():boolean{
        return false;
    }

    public hasCancelOrderOption(orderId: string): boolean {
        return false;
    }

    public canMoveOrder(orderId: string): boolean {
        return false;
    }

    public needToConcatSideTextWithTypeText():boolean {
        return false;
    }

    public useDarkLightTextColor():boolean {
        return false;
    }

    public isStopOrderSupported(): boolean {
        return false;
    }

    public isSupportedMarket(market: Market): boolean {
        return false;
    }

    public deactivate(): void {}

    public getBrokerType(): BrokerType {
        return BrokerType.None;
    }

    public getTradingOrdersGridBoxType(): GridBoxType {
        Tc.error("should not be here")
        return undefined;
    }

    public getTradingPositionsGridBoxType(): GridBoxType {
        Tc.error("should not be here")
        return undefined;
    }

    getTradingAccountBalanceGridBoxType(): GridBoxType {
        return undefined;
    }

    public getSessionStream(): BehaviorSubject<boolean> {
        return this.sessionStream;
    }

    activate(isReconnectMode: boolean): void {}

    displaysSettings(): boolean {
        return false;
    }

    displayAccountTransactions(): boolean {
        return false;
    }

    displayAccountBalances():boolean {
        return false;
    }

    displaysAccount(): boolean {
        return false;
    }

    onLogout(): void {
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
        return [];
    }

    getTradingPositions(): TradingPosition[] {
        return [];
    }

    getAccounts(): BrokerAccount[] {
        return [];
    }

    getPositionSymbols(account: BrokerAccount): string[] {
        return [];
    }

}
