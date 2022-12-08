import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {VirtualTradingAccount, VirtualTradingCurrency, VirtualTradingOrder, VirtualTradingOrderDetails} from './virtual-trading-models';
import {VirtualTradingLoader} from '../../loader/trading/virtual-trading';
import {VirtualTradingService} from './virtual-trading.service';
import {TradingMessage} from '../../streaming/shared';
import {Streamer} from '../../streaming/streamer';
import {MessageBoxRequest} from '../../../components/modals/popup/message-box';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {Company, MarketsManager} from '../../loader/loader';
import {LanguageService} from '../../state/language';
import {TcTracker} from '../../../utils';


@Injectable()
export class VirtualTradingOrdersService {

    private ordersStream: BehaviorSubject<VirtualTradingOrder[]>;

    constructor(
        private virtualTradingService: VirtualTradingService,
        private virtualTradingLoaderService: VirtualTradingLoader,
        private sharedChannel: SharedChannel,
        private marketsManager: MarketsManager,
        private streamer: Streamer,
        private languageService: LanguageService) {

        this.ordersStream = new BehaviorSubject(null);

        this.virtualTradingService.getAccountStream().subscribe(account => {
            if(account != null) {
                this.reloadOrders();
            }else{
                this.ordersStream.next([]);
            }
        });

        this.streamer.getGeneralPurposeStreamer().getTradingStreamer().subscribe(
            (tradingMessage: TradingMessage) => {
                let order: VirtualTradingOrder = this.ordersStream.value.find(order => order.id == tradingMessage.id.toString());
                let company: Company = this.marketsManager.getCompanyBySymbol(tradingMessage.ticker);
                let quantityString: string = this.getQuantityString(order.quantity);

                let message = this.languageService.translate(`تم تنفيذ الأمر رقم: `) + `${tradingMessage.id}`;
                let message2Arabic = `${order.orderSide.arabic} ${quantityString} من شركة ${company.arabic} بسعر ${tradingMessage.price} ${VirtualTradingCurrency.fromValue(this.account.currency).arabic}`;
                let message2English = `${order.orderSide.english} ${quantityString} from ${company.english} on ${tradingMessage.price} ${VirtualTradingCurrency.fromValue(this.account.currency).english}`;
                let message2 = this.languageService.arabic ? message2Arabic : message2English;
                this.showMessageBox(message, message2);
                this.virtualTradingService.refreshState();
            }
        );
    }

    private getQuantityString(quantity: number): string {
        if (quantity == 1) {
            return this.languageService.arabic ? 'سهم' : 'a share';
        } else if (quantity == 2) {
            return this.languageService.arabic ? 'سهمين' : 'two shares';
        } else if (quantity <= 10) {
            return this.languageService.arabic ? `${quantity} أسهم` : `${quantity} shares`;
        } else {
            return this.languageService.arabic ? `${quantity} سهم` : `${quantity} shares`;
        }
    }

    private showMessageBox(message: string, message2: string) {
        let request:MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message, messageLine2: message2};
        this.sharedChannel.request(request);
    }

    public postOrder(order: VirtualTradingOrder): Observable<null> {

        return this.virtualTradingLoaderService.postOrder(this.account.id, order).pipe(
            tap(() => this.virtualTradingService.refreshState())
        );
    }

    public updateOrder(order: VirtualTradingOrder): Observable<null> {

        return this.virtualTradingLoaderService.updateOrder(this.account.id, order).pipe(
            tap(() => this.virtualTradingService.refreshState())
        );
    }

    public getOrderDetails(order: VirtualTradingOrder): Observable<VirtualTradingOrderDetails>{

        return this.virtualTradingLoaderService.getOrderDetails(this.account.id, order);
    }


    public getOrdersStream(): BehaviorSubject<VirtualTradingOrder[]> {
        return this.ordersStream;
    }

    private reloadOrders(): void {
        this.virtualTradingLoaderService.getOrders(this.account.id)
            .subscribe(
                orders => this.ordersStream.next(orders),
                error => {}
            );
    }

    public deleteOrder(order: VirtualTradingOrder): void {
        TcTracker.trackVirtualTradingDeleteOrder();
        this.virtualTradingLoaderService.deleteOrder(this.account.id, order).subscribe(
            () => this.virtualTradingService.refreshState()
        );
    }


    public calculateCommission(order: VirtualTradingOrder): number {
        if(this.account == null) {
            return 0;
        }

        return order.price * order.quantity * this.account.commission;
    }

    private get account(): VirtualTradingAccount {
        return this.virtualTradingService.getAccount();
    }
}
