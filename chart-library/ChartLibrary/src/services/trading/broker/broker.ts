import {Company, Market} from '../../loader/index';
import {GridBoxType} from '../../../components/shared/grid-box/index';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Subject} from 'rxjs/internal/Subject';
import {TradingOrder, TradingPosition} from './models';
import {ChannelRequester} from '../../shared-channel';

export interface Broker {

    openBuyScreen(company: Company, price?: number): void;

    openSellScreen(company: Company, price?: number): void;

    openStopScreen(company: Company, price?: number): void;

    openSellAllSharesScreen(company: Company): void;

    openEditOrderScreen(orderId: string, price?: number, requester?: ChannelRequester): void;

    openEditTakeProfitScreen(orderId: string, takeProfit: number, requester?: ChannelRequester): void;

    openEditStopLossScreen(orderId: string, stopLoss: number, requester?: ChannelRequester): void;

    onClosePosition(position:TradingPosition):void;

    onBoundPositionClicked(position:TradingPosition):void;

    onReversePosition(position:TradingPosition):void;

    cancelOrder(orderId: string): void;

    cancelTakeProfit(orderId: string): void;

    cancelStopLoss(orderId: string): void;

    hasReversePositionOption():boolean;

    hasClosePositionOption():boolean;

    needToConcatSideTextWithTypeText():boolean;

    hasCancelOrderOption(orderId: string): boolean;

    canMoveOrder(orderId: string): boolean;

    useDarkLightTextColor():boolean;

    isStopOrderSupported(): boolean;

    isSupportedMarket(market: Market): boolean;

    activate(isReconnectMode: boolean):void;

    deactivate(): void;

    getBrokerType():BrokerType;

    getTradingOrdersGridBoxType(): GridBoxType;

    getTradingPositionsGridBoxType(): GridBoxType;

    getTradingAccountBalanceGridBoxType(): GridBoxType;

    getSessionStream(): BehaviorSubject<boolean>;

    getPositionsLoadedStream(): Subject<void>;

    displaysSettings(): boolean;

    displayAccountBalances():boolean;

    displaysAccount(): boolean;

    displayAccountTransactions(): boolean;

    onLogout(): void;

    getAccounts():BrokerAccount[];

    getPositionSymbols(account:BrokerAccount): string[];

    getRefreshStream(): Subject<void>;

    getCancelStream() : Subject<void>;

    getTradingOrders(): TradingOrder[];

    getTradingPositions(): TradingPosition[];

}

export interface BrokerAccount {
    id:string,
    name:string
}

export enum BrokerType{
    None,
    Derayah,
    VirtualTrading,
    Tradestation,
    Snbcapital
}
