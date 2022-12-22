import {AbstractStreamer} from '../../abstract-streamer';
import {Subject} from 'rxjs';
import {Tc, TcTracker} from '../../../../../utils';
import {DerayahMessageType} from './derayahMessageType';
import {DerayahOrderType, DerayahOrderTypeWrapper} from '../../../../trading/derayah/derayah-order/derayah-order-type';
import {DerayahOrderStatus, DerayahOrderStatusType} from '../../../../trading/derayah/derayah-order/derayah-order-status';
import {DerayahOrderExecution, DerayahOrderExecutionType, DerayahOrderLastActionStatus, DerayahOrderLastActionStatusType} from '../../../../trading/derayah/derayah-order';

export class DerayahStreamer extends AbstractStreamer {

    private derayahOrderStream: Subject<boolean>;
    private derayahPositionStream: Subject<boolean>;
    private derayahNotificationTimeOutStream: Subject<void>;
    private derayahNotFoundQueueStream: Subject<void>;

    private timerId: number;

    private static THRESHOLD: number = 45000;
    private lastReceivedHeartBeat: number;

    constructor() {
        super(null, null);

        this.derayahOrderStream = new Subject();
        this.derayahPositionStream = new Subject();
        this.derayahNotificationTimeOutStream = new Subject();
        this.derayahNotFoundQueueStream = new Subject();
    }

    onDestroy() {
        this.disconnect();
        super.onDestroy();
    }

    disconnect() {
        if (this.channel) {
            this.channel.disconnect();
        }
        this.channel = null;
        window.clearInterval(this.timerId);
        TcTracker.trackMessage('disconnect derayah streamer');
    }

    start(url: string) {
        this.initChannel(url, false);
        this.timerId = window.setInterval(() => this.checkHeartbeatTimeout(), 1000);
        TcTracker.trackMessage('start derayah streamer');
    }

    public getDerayahOrderStream(): Subject<boolean> {
        return this.derayahOrderStream;
    }

    public getDerayahPositionStream(): Subject<boolean> {
        return this.derayahPositionStream;
    }

    public getDerayahNotificationTimeOutStream(): Subject<void> {
        return this.derayahNotificationTimeOutStream;
    }

    public getDerayahNotFoundQueueStream(): Subject<void> {
        return this.derayahNotFoundQueueStream;
    }

    protected subscribeHeartbeat() {
        this.subscribeTopic(this.getHeartBeatTopic());
    }

    protected getHeartBeatTopic(): string {
        return 'HB.HB.DN';
    }

    public subscribeDerayahTopic(topicId: string, userName: string) {
        let topic: string = `DN.${topicId}.${userName}`;
        this.subscribeTopic(topic);
    }

    public unSubscribederayahTopics(portfolios: string[], userName: string) {
        for (let portfolio of portfolios) {
            let purchasePowerTopic: string = `DN.${portfolio}.${userName}`;
            this.unSubscribeTopic(purchasePowerTopic);
        }
    }

    private getDerayahMessageType(message: { [key: string]: unknown }): DerayahMessageType {
        let topic = message['topic'] as string;

        if (topic.startsWith('HB.HB.')) {
            return DerayahMessageType.HEARTBEAT;
        } else if (topic.startsWith('DN.')) {
            if ('status' in message) {
                let messageStatus = message['status'] as string;
                return this.getDerayahMessageTypeBasedOnMessageStatus(messageStatus.toLowerCase());
            }
            else if ('message' in message) {
                let derayahStreamingMessage: DerayahStreamerMessage = JSON.parse((message['message']) as string);
                let updatedOrderInfo = this.mapDerayahStreamerMessage(derayahStreamingMessage);
                return this.getDerayahMessageTypeBasedOnOrderStatus(updatedOrderInfo.status.type);
            }
        }

        Tc.error('fail to extract message type from topic ' + topic);

        return null;
    }

    private mapDerayahStreamerMessage(derayahStreamingMessage: DerayahStreamerMessage): UpdatedDerayahOrder {
        return {
            id: derayahStreamingMessage.$id,
            type:  DerayahOrderTypeWrapper.fromType(derayahStreamingMessage.orderSide),
            portfolio: derayahStreamingMessage.portfolioID,
            symbol: derayahStreamingMessage.stockID,
            date: derayahStreamingMessage.orderDate,
            execution: DerayahOrderExecution.getExecutionByType(derayahStreamingMessage.orderType),
            quantity: derayahStreamingMessage.dealQuantity,
            executedQuantity: derayahStreamingMessage.filledQuantity,
            price: derayahStreamingMessage.price,
            status: DerayahOrderStatus.getStatusByType(derayahStreamingMessage.orderStatus),
            lastActionStatus: DerayahOrderLastActionStatus.getStatusByType(derayahStreamingMessage.lastActionStatus),
        };
    }

    private getDerayahMessageTypeBasedOnOrderStatus(orderStatus: DerayahOrderStatusType): DerayahMessageType {
        switch (orderStatus) {
            case DerayahOrderStatusType.Open:
            case DerayahOrderStatusType.StopOrCancelled:
            case DerayahOrderStatusType.New:
            case DerayahOrderStatusType.Cancelled:
            case DerayahOrderStatusType.Rejected:
            case DerayahOrderStatusType.ActivePurchaseOrSaleEquityInternetOrder:
            case DerayahOrderStatusType.CancelledPurchaseOrSaleEquityOrder:
            case DerayahOrderStatusType.Expired:
                return DerayahMessageType.DERAYAH_ORDER;
            default:
                return DerayahMessageType.DERAYAH_POSITION;
        }
    }

    private getDerayahMessageTypeBasedOnMessageStatus(messageStatus: string): DerayahMessageType {
        switch (messageStatus) {
            case 'canceled':
            case 'shutdown':
            case 'not_found':
                TcTracker.trackMessage('derayah notificaton ' + messageStatus);
                return DerayahMessageType.DERAYAH_RENEW_QUEUE_ID;
        }
    }

    protected onMessageReceive(message: { [key: string]: unknown }): void {
        let messageType: DerayahMessageType = this.getDerayahMessageType(message);
        switch (messageType) {
            case DerayahMessageType.DERAYAH_ORDER:
                this.derayahOrderStream.next(true);
                break;
            case DerayahMessageType.DERAYAH_POSITION:
                this.derayahPositionStream.next(true);
                this.derayahOrderStream.next(true);
                break;
            case DerayahMessageType.DERAYAH_RENEW_QUEUE_ID:
                this.derayahNotFoundQueueStream.next();
                break;
            case DerayahMessageType.HEARTBEAT:
                this.processHeartbeatMessage();
                break;
            default:
                Tc.error('unknown message type: ' + DerayahMessageType[messageType]);
        }
    }

    protected monitorMarket() {
    }

    protected processHeartbeatMessage(): void {
        this.heartbeatReceived();
    }

    heartbeatReceived(): void {
        this.lastReceivedHeartBeat = Date.now();
    }

    private checkHeartbeatTimeout(): void {
        if ((Date.now() - this.lastReceivedHeartBeat > DerayahStreamer.THRESHOLD)) {
            this.derayahNotificationTimeOutStream.next();
            Tc.warn(`heartbeat disconnection detected for derayah notification streamer, request restart`);
            TcTracker.trackHeartbeatDisconnection('derayah notification streamer disconnection ');
            this.lastReceivedHeartBeat = Date.now();
        }
    }
}

interface DerayahStreamerMessage {
    $id: string,
    averagePrice: number,
    createdDate: string,
    dealQuantity: number,
    exchangeCode: number,
    exchangeCurrency: number,
    expiryDate: string,
    feedId: number,
    filledQuantity: number,
    lastActionStatus: DerayahOrderLastActionStatusType,
    netDealAmt: number,
    orderDate: string,
    orderNumber: number,
    orderSide: DerayahOrderType,
    orderStatus: DerayahOrderStatusType,
    orderType: DerayahOrderExecutionType,
    portfolioID: number,
    price: number,
    stockID: string,
    tickerDesEng: string,
    tickerDesNatLan: string,
    timeStamp: string,
    updateTime: string,
}


interface UpdatedDerayahOrder {
    id: string,
    type: DerayahOrderTypeWrapper,
    portfolio: number,
    symbol: string,
    date: string,
    execution: DerayahOrderExecution,
    quantity: number,
    executedQuantity: number,
    price: number,
    status: DerayahOrderStatus,
    lastActionStatus: DerayahOrderLastActionStatus,
}
