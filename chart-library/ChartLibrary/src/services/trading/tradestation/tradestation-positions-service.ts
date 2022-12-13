import {Injectable} from '@angular/core';
import {TradestationService} from './tradestation.service';
import {TradestationPosition} from './tradestation-position/tradestation-position';
import {BehaviorSubject, Observable} from 'rxjs';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {LanguageService} from '../../language';
import {MarketUtils} from '../../../utils';
import {TradestationConfirmationMessageChannelRequest, TradestationConfirmCaller, TradestationMessageChannelRequest} from '../../shared-channel/channel-request';
import {TradestationOrder, TradestationOrderSideType, TradestationOrderSideWrapper, TradestationOrderType} from './tradestation-order';
import {TradestationLoaderService, TradestationOrderConfirmationResponse, TradestationPositionResponse, TradestationPostOrderResponse} from '../../loader/trading/tradestation/tradestation-loader.service';
import {map} from 'rxjs/operators';
import {TradestationUtils} from '../../../utils/tradestation.utils';
import {TradestationOrdersService} from './tradestation-orders-service';
import {TradestationAccountsService} from './tradestation-accounts-service';
import {TradestationClosePositionsType} from "../../../data-types/types";

@Injectable()
export class TradestationPositionsService {
    private positions: TradestationPosition[] = []

    private closedPositionsCounter: number = 0;

    private positionsStream: BehaviorSubject<TradestationPosition[]>;

    constructor(private tradestationService: TradestationService, private tradestationLoaderService: TradestationLoaderService, private tradestationOrdersService: TradestationOrdersService, private tradestationAccountsService: TradestationAccountsService, private sharedChannel:SharedChannel, private languageService:LanguageService) {
        this.positionsStream = new BehaviorSubject([]);

        this.tradestationAccountsService.getAccountStream().subscribe(() => {
            this.refreshPositions();
        });
    }

    public getPositionsStream(): BehaviorSubject<TradestationPosition[]> {
        return this.positionsStream;
    }

    private refreshPositions(): void {
        this.getPositions().subscribe(response => this.onPositions(response));
    }

    private getPositions(): Observable<TradestationPosition[]> {
        return this.tradestationLoaderService.getPositions().pipe(
            map((response: TradestationPositionResponse[]) => this.mapPositions(response)));
    }

    public getPositionQuantity(symbol: string): number {
        if(!this.positions){
            return 0;
        }
        let companyPosition: TradestationPosition = this.positions.find(item => item.symbol == symbol);
        return companyPosition ? companyPosition.quantity: 0;
    }

    private onPositions(response: TradestationPosition[]): void {
        this.positions = response;
        this.positionsStream.next(this.positions);
    }

    private mapPositions(response: TradestationPositionResponse[]): TradestationPosition[] {
        let tradestationPositions: TradestationPosition[] = [];
        let positions = response as TradestationPositionResponse[];

        if (positions && positions.length > 0) {
            for (let item of positions) {
                let symbol = TradestationUtils.getSymbolWithMarketFromTradestation(item.Symbol);
                // let company = this.marketsManager.getCompanyBySymbol(symbol);
                // tradestationPositions.push(TradestationPosition.mapResponseToTradestationPosition(item,company.name,company.symbol));
            }
        }
        return tradestationPositions;
    }

    public onClosePosition(filteredPositions: TradestationPosition[]) {
        let messageLine1: string = this.languageService.translate('هل أنت متأكد من إغلاق هذه الصفقة ؟');
        let messageLine2: string = this.languageService.translate('سيؤدي هذا أيضا الى إلغاء جميع الأوامر النشطة.');
        this.showClosePositionConfirmationMessage(filteredPositions, [messageLine1 , messageLine2]);
    }

    public showClosePositionConfirmationMessage(filteredPositions: TradestationPosition[], messageLines: string[]) {
        let self = this;
        let confirmationRequest: TradestationConfirmationMessageChannelRequest = {
            type: ChannelRequestType.TradestationConfirmationMessage,
            messageLines: messageLines,
            caller: new class implements TradestationConfirmCaller {
                onConfirmation(confirmed: boolean): void {
                    if (confirmed) {
                        self.closedPositionsCounter = 0;
                        self.closePosition(filteredPositions);
                    }
                }
            }
        };
        this.sharedChannel.request(confirmationRequest);
    }

    private closePosition(filteredPositions: TradestationPosition[]) {
        for (let position of filteredPositions) {
            this.deleteActiveOrders(position);
            let type = position.type.value == TradestationOrderSideType.Buy ? TradestationOrderSideType.Sell : TradestationOrderSideType.BuyToCover;
            let order = TradestationOrder.fromPosition(position, type, TradestationOrderType.Market);
            order.quantity = Math.abs(order.quantity);
            this.postClosePositionOrder(filteredPositions, order);
        }
    }

    public onReversePosition(position: TradestationPosition) {
        let warningMessageLines: string[] = this.getWarningMessageLines(position);
        let messageLine = this.languageService.translate('هل تريد المتابعة ؟');
        let self = this;
        let openRequest: TradestationConfirmationMessageChannelRequest = {
            type: ChannelRequestType.TradestationConfirmationMessage,
            messageLines: [messageLine],
            warningMessageLines: warningMessageLines,
            caller: new class implements TradestationConfirmCaller {
                onConfirmation(confirmed: boolean): void {
                    if (confirmed) {
                        self.deleteActiveOrders(position);
                        let reversePositionType1 = position.type.value == TradestationOrderSideType.Buy ? TradestationOrderSideType.Sell : TradestationOrderSideType.BuyToCover;
                        let reversePositionType2 = reversePositionType1 == TradestationOrderSideType.Sell ? TradestationOrderSideType.SellShort : TradestationOrderSideType.Buy;
                        let reversePositionOrder1 = TradestationOrder.fromPosition(position, reversePositionType1, TradestationOrderType.Market);
                        let reversePositionOrder2 = TradestationOrder.fromPosition(position, reversePositionType2, TradestationOrderType.Market);
                        reversePositionOrder1.quantity = Math.abs(reversePositionOrder1.quantity);
                        reversePositionOrder2.quantity = Math.abs(reversePositionOrder2.quantity);
                        self.postReversePositionOrder(reversePositionOrder1, reversePositionOrder2);
                    }
                }
            }
        };

        this.sharedChannel.request(openRequest);
    }

    private getWarningMessageLines(position: TradestationPosition): string[] {
        let orderType = this.getReverseOrderType(position);
        let symbolWithoutMarket: string = MarketUtils.symbolWithoutMarket(position.symbol);
        let orderType1;
        let orderType2;
        let messageHeader: string = this.languageService.translate('عكس هذه الصفقة سيؤدي تلقائيا الى :');
        let line1, line2, line3;
        if(this.languageService.arabic){
            orderType1 = orderType.type1.arabic;
            orderType2 = orderType.type2.arabic;
            line1 = `   1 - إالغاء ${symbolWithoutMarket}. جميع الأوامر النشطة.`;
            line2 = `   2 - إضافة امر "${orderType1}" - ${symbolWithoutMarket} ${position.quantity} @ سعر السوق.`;
            line3 = `   3 - إضافة امر "${orderType2}" - ${symbolWithoutMarket} ${position.quantity} @ سعر السوق.`;
        }else{
            orderType1 = orderType.type1.english;
            orderType2 = orderType.type2.english;
            line1 = `    1- Cancel "${symbolWithoutMarket}" all active orders.`;
            line2 = `    2- Add "${orderType1}" order - ${position.quantity} ${symbolWithoutMarket} @ market price.` ;
            line3 = `    3- Add "${orderType2}" order - ${position.quantity} ${symbolWithoutMarket} @ market price.`;
        }
        return [messageHeader, line1, line2, line3];
    }

    private getReverseOrderType(position : TradestationPosition) {
        let type1: TradestationOrderSideWrapper;
        let type2: TradestationOrderSideWrapper;
        if (position.type.value == TradestationOrderSideType.Buy) {
            type1 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.Sell);
            type2 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.SellShort);
        } else {
            type1 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.Buy);
            type2 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.BuyToCover);
        }
        return {type1,type2}
    }

    private postReversePositionOrder(order: TradestationOrder, osoOrder?: TradestationOrder) {
        let osoOrders: TradestationOrder[] = osoOrder ? [osoOrder] : [];
        this.tradestationOrdersService.getOrderConfirmation(order, osoOrders).subscribe((response: TradestationOrderConfirmationResponse[]) => {
            order.confirmationId = response[0].OrderConfirmId;
            osoOrder.confirmationId = response[1].OrderConfirmId;
            this.tradestationOrdersService.postOrder(order, [osoOrder]).subscribe((response: TradestationPostOrderResponse[]) => {
                if (response[0].OrderStatus == 'Ok' && response[1].OrderStatus == 'Ok') {
                    this.showMessageBox([response[0].Message, response[1].Message],false,  false);
                } else {//response[0].OrderStatus == 'Failed' || response[1].OrderStatus == 'Failed'
                    this.showMessageBox([response[0].Message, response[1].Message],true,  true);
                }
            });
        });
    }

    private deleteActiveOrders(position: TradestationPosition) {
        let orders = this.tradestationOrdersService.getGroupedOrders().filter(order => order.accountId == position.accountId);
        if (orders) {
            let activeOrders = orders.filter(order => order.symbol == position.symbol && TradestationOrder.isActiveOrder(order));

            this.tradestationOrdersService.deleteOrdersSequentially(activeOrders).subscribe((response: TradestationPostOrderResponse[])=>{});
        }
    }

    private postClosePositionOrder(filteredPositions: TradestationPosition[], order: TradestationOrder) {
        this.tradestationOrdersService.getOrderConfirmation(order, []).subscribe((response: TradestationOrderConfirmationResponse[]) => {
            order.confirmationId = response[0].OrderConfirmId;
            this.tradestationOrdersService.postOrder(order, []).subscribe((response: TradestationPostOrderResponse[]) =>{
                if(response[0].OrderStatus == 'Ok' && filteredPositions.length == ++this.closedPositionsCounter){
                    //show success msg only if we've closed all positions
                    let message = filteredPositions.length == 1 ? response[0].Message: this.languageService.translate('.تم إغلاق الصفقات بنجاح');
                    this.showMessageBox([message] ,false , false)
                } else {//response[0].OrderStatus == 'Failed'
                    this.showMessageBox([response[0].Message] ,true , true)
                }
            })
        });
    }

    public showMessageBox(messageLines: string[], isErrorMessage: boolean, showWarningMessage: boolean) {
        let tradestationMessageChannelRequest: TradestationMessageChannelRequest = {
            type: ChannelRequestType.TradestationMessage,
            messageLines: messageLines,
            isErrorMessage: isErrorMessage,
            showWarningMessage: showWarningMessage
        };
        this.sharedChannel.request(tradestationMessageChannelRequest);
    }

    public getPositionsByClosingType(closePositionType: TradestationClosePositionsType): TradestationPosition[] {
        switch (closePositionType) {
            case TradestationClosePositionsType.All:
                return this.positions;
            case TradestationClosePositionsType.Long:
                return this.positions.filter(position => position.type.value == TradestationOrderSideType.Buy);
            case TradestationClosePositionsType.Short:
                return this.positions.filter(position => position.type.value == TradestationOrderSideType.SellShort);
            case TradestationClosePositionsType.Selected:
                return []
            default:
                return [];
        }
    }
}
