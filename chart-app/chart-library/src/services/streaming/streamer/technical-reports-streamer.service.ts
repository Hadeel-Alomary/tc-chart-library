import {Subject} from 'rxjs';
import {HeartbeatMessage, LiquidityMessage, MessageType} from '../shared/index';
import {MarketUtils, Tc} from '../../../utils/index';
import {HeartbeatManager} from './heartbeat-manager';
import {AbstractStreamer} from './abstract-streamer';

export class TechnicalReportsStreamer extends AbstractStreamer{

    private liquidityStreamer:Subject<LiquidityMessage>;

    constructor(heartbeatManager:HeartbeatManager){
        super(heartbeatManager, 'TECHNICAL_REPORTS');
        this.liquidityStreamer = new Subject();
    }

    protected getHeartBeatTopic(): string {
        return 'HB.HB.GP';
    }

    onDestroy() {
        super.onDestroy();
    }

    public getLiquidityStreamer():Subject<LiquidityMessage>{
        return this.liquidityStreamer;
    }

    public subscribeLiquidity(intervalString: string, market: string) {
        if(market !== 'USA' && market !== 'FRX') {
            this.subscribeTopic(`${intervalString}.liquidity.${market}`);
        }
    }

    protected onMessageReceive(message:{[key:string]:unknown}){
        let messageType:MessageType = this.getMessageType(message['topic'] as string);
        switch (messageType){
            case MessageType.LIQUIDITY:
                this.processLiquidityMessage(message as {[key:string]:string});
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message as unknown as HeartbeatMessage);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    }

    protected processLiquidityMessage(message: {[key:string]:string}){
        let topicParts: string[] = MarketUtils.splitTopic(message['topic']);
        let liquidityMessage: LiquidityMessage = {
            topic: message['topic'],
            symbol: `${message['symbol']}.${topicParts[2]}`,
            interval: topicParts[0],
            time: message['time'],
            percent: message['percent'],
            inflowAmount: message['inf-amnt'],
            inflowVolume: message['inf-vol'],
            outflowAmount: message['outf-amnt'],
            outflowVolume: message['outf-vol'],
            netAmount: message['net-amnt'],
            netVolume: message['net-vol']
        };
        this.liquidityStreamer.next(liquidityMessage);
    }
}
