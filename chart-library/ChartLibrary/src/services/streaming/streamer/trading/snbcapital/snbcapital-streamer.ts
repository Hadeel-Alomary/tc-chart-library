import {AbstractStreamer} from '../../abstract-streamer';
import {Subject} from 'rxjs';
import {Tc, TcTracker} from '../../../../../utils';
import {SnbcapitalMessageType} from './snbcapitalMessageType';
import {SnbcapitalPortfolio} from '../../../../trading/snbcapital/snbcapital-order';

export class SnbcapitalStreamer extends AbstractStreamer{

    private snbcapitalOrderStream: Subject<boolean>;
    private snbcapitalPositionStream: Subject<string>;
    private snbcapitalPurchasePowerStream: Subject<SnbcapitalPurchasePowerStreamerMessage>;
    private snbcapitalNotificationTimeOutStream: Subject<boolean>;

    private timerId:number;

    private static THRESHOLD:number = 45000;
    private lastReceivedHeartBeat: number;

    constructor() {
        super(null, null);

        this.snbcapitalOrderStream = new Subject();
        this.snbcapitalPositionStream = new Subject();
        this.snbcapitalPurchasePowerStream = new Subject();
        this.snbcapitalNotificationTimeOutStream = new Subject();
    }

    onDestroy() {
        this.disconnect();
        super.onDestroy();
    }

    disconnect() {
        if(this.channel) {
            this.channel.disconnect();
        }
        this.channel = null;
        window.clearInterval(this.timerId);
    }

    start(url: string) {
        this.initChannel(url, false);
        this.timerId = window.setInterval(() => this.checkHeartbeatTimeout(), 1000);
    }

    public getSnbCapitalOrderStream(): Subject<boolean> {
        return this.snbcapitalOrderStream;
    }

    public getSnbCapitalPositionStream(): Subject<string> {
        return this.snbcapitalPositionStream;
    }

    public getSnbCapitalPurchasePowerStream(): Subject<SnbcapitalPurchasePowerStreamerMessage> {
        return this.snbcapitalPurchasePowerStream;
    }

    public getsnbcapitalNotificationTimeOutStream(): Subject<boolean> {
        return this.snbcapitalNotificationTimeOutStream;
    }

    protected subscribeHeartbeat(){
        this.subscribeTopic(this.getHeartBeatTopic());
    }

    protected getHeartBeatTopic(): string {
        return  'HB.HB.SNB';
    }

    public subscribeSnbCapitalTopics(portfolios: SnbcapitalPortfolio[]) {
        let orderTopic: string = `SNB.${portfolios[0].gBSCustomerCode}.ORDER`;
        let positionTopic: string = `SNB.${portfolios[0].gBSCustomerCode}.POSITION`;

        for (let portfolio of portfolios) {
            let purchasePowerTopic: string = `SNB.${portfolio.cashAccountCode}_${portfolio.cashAccountBranchCode}.CASHBALANCE`;
            this.subscribeTopic(purchasePowerTopic);
        }

        this.subscribeTopic(orderTopic);
        this.subscribeTopic(positionTopic);
    }

    public unSubscribeSnbCapitalTopics(portfolios: SnbcapitalPortfolio[]) {
        let orderTopic: string = `SNB.${portfolios[0].gBSCustomerCode}.ORDER`;
        let positionTopic: string = `SNB.${portfolios[0].gBSCustomerCode}.POSITION`;

        for (let portfolio of portfolios) {
            let purchasePowerTopic: string = `SNB.${portfolio.cashAccountCode}_${portfolio.cashAccountBranchCode}.CASHBALANCE`;
            this.unSubscribeTopic(purchasePowerTopic);
        }

        this.unSubscribeTopic(orderTopic);
        this.unSubscribeTopic(positionTopic);
    }

    private getSnbcapitalMessageType(topic:string) : SnbcapitalMessageType {
        if (topic.startsWith('HB.HB.')) {
            return SnbcapitalMessageType.HEARTBEAT;
        } else if (topic.startsWith('SNB.')) {
            if (topic.endsWith('.ORDER'))
                return SnbcapitalMessageType.SNBCAPITAL_ORDER;
            else if (topic.endsWith('.POSITION'))
                return SnbcapitalMessageType.SNBCAPITAL_POSITION;
            else if(topic.endsWith('.CASHBALANCE')){
                return SnbcapitalMessageType.SNBCAPITAL_PURCHASE_POWER;
            }
        }

        Tc.error("fail to extract message type from topic " + topic);

        return null;
    }

    protected onMessageReceive(message:{[key:string]:unknown}): void {
        let messageType: SnbcapitalMessageType = this.getSnbcapitalMessageType(message['topic'] as string);
        switch (messageType) {
            case SnbcapitalMessageType.SNBCAPITAL_ORDER:
                this.snbcapitalOrderStream.next(true);
                break;
            case SnbcapitalMessageType.SNBCAPITAL_POSITION:
                let positionStreamingMessage : SnbcapitalPositionStreamerMessage = JSON.parse((message['message']) as string);
                let portfolioId = positionStreamingMessage.saCode;
                this.snbcapitalPositionStream.next(portfolioId)
                break;
            case SnbcapitalMessageType.SNBCAPITAL_PURCHASE_POWER:
                let purchasePowerStreamingMessage: SnbcapitalPurchasePowerStreamerMessageResponse = JSON.parse((message['message']) as string);
                let purchasePowerMessage :SnbcapitalPurchasePowerStreamerMessage = this.mapPurchasePowerMessage(purchasePowerStreamingMessage);
                this.snbcapitalPurchasePowerStream.next(purchasePowerMessage);
                break;
            case SnbcapitalMessageType.HEARTBEAT:
                this.processHeartbeatMessage();
                break;
            default:
                Tc.error('unknown message type: ' + SnbcapitalMessageType[messageType]);
        }
    }

    protected monitorMarket() {
        // do nothing
    }

    protected processHeartbeatMessage(){
       this.heartbeatReceived();

    }

    heartbeatReceived() {
        this.lastReceivedHeartBeat = Date.now();
    }


    private checkHeartbeatTimeout() {
        if((Date.now() - this.lastReceivedHeartBeat > SnbcapitalStreamer.THRESHOLD)) {
            this.snbcapitalNotificationTimeOutStream.next(true);
            Tc.warn(`heartbeat disconnection detected for SnbCapital notification streamer, request restart`);
            TcTracker.trackHeartbeatDisconnection("SnbCapital notification streamer disconnection ");
            this.lastReceivedHeartBeat = Date.now();
        }
    }

    private mapPurchasePowerMessage(purchasePowerMessage: SnbcapitalPurchasePowerStreamerMessageResponse): SnbcapitalPurchasePowerStreamerMessage {
        return {
            purchasePower: +purchasePowerMessage.buyingPower_value,
            cashAccountCode: purchasePowerMessage.caCode,
            currencyType: purchasePowerMessage.currencyCode
        };
    }
}

interface SnbcapitalPositionStreamerMessage {
    eventType: string,
    AvgCostPrice: number,
    customerCode: string,
    mrkCode: string,
    secCode: string,
    costValue: string,
    costValueRefCurr: string,
    saCode: string,
    saBranchCode: string,
    blockedQty: string,
    qty: string,
    blockedQtySell: string,
    ssaCode: string
}
export interface SnbcapitalPurchasePowerStreamerMessageResponse {
    availableForCashOut_is_null: boolean,
    availableForCashOut_value: number,
    blockedAmount_is_null: boolean,
    blockedAmount_value: number,
    bookedAmount_is_null: boolean,
    bookedAmount_value: number,
    buyingPower_is_null: boolean,
    buyingPower_value: number,
    caBranchCode: string,
    caCode: string,
    cashBalance_is_null: boolean,
    cashBalance_value: number,
    currencyCode: string,
    eventType: string,
    netDepositWithdrawal_is_null: boolean,
    netDepositWithdrawal_value: number,
    settledCashBalance_is_null: boolean,
    settledCashBalance_value: number,
    unsettledCashBalance_is_null: boolean,
    unsettledCashBalance_value: number
}

export interface SnbcapitalPurchasePowerStreamerMessage {
    purchasePower: number,
    cashAccountCode: string,
    currencyType: string,
}
