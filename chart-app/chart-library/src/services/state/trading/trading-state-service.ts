import {Injectable} from '@angular/core';
import {EnumUtils} from '../../../utils/enum.utils';
import {BrokerType} from '../../trading/broker/broker';
// import {AuthorizationService} from '../../auhtorization';
// import {FeatureType} from '../../auhtorization/feature';
import {Tc} from '../../../utils';

@Injectable()
export class TradingStateService {

    private static STORAGE_KEY: string = 'TC_TRADING';

    protected storageData: TradingState;

    constructor() {
        if(localStorage.getItem(TradingStateService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(TradingStateService.STORAGE_KEY));
            // MA for backward compatibility, if user hasn't this key, then set the key to be "true" by default.
            if(!("showExecutedOrders" in this.storageData)) {
                (this.storageData as TradingState).showExecutedOrders = true;
                this.write();
            }
        } else {
            this.storageData = {
                toolbarState: {position: {top: 15, left: 100}, visible: true},
                selectedBroker: EnumUtils.enumValueToString(BrokerType, BrokerType.None),
                useFastOrder: false,
                showPositionDrawings: true,
                showOrderDrawings: true,
                showExecutedOrders: true
            };
        }
    }

    getVirtualTradingFloatingToolbarPosition():{left:number, top:number}{
        return this.storageData.toolbarState.position;
    }

    setVirtualTradingFloatingToolbarPosition(position:{left:number, top:number}){
        this.storageData.toolbarState.position = position;
        this.write();
    }

    setVirtualTradingFloatingToolbarVisibility(visible:boolean){
        this.storageData.toolbarState.visible = visible;
        this.write();
    }

    getVirtualTradingFloatingToolbarVisibility():boolean{
        return this.storageData.toolbarState.visible;
    }

    setSelectedBroker(availableBroker:string){
        this.storageData.selectedBroker = availableBroker;
        this.write();
    }

    // getSelectedBroker(): string {
    //     return this.authorizationService.authorizeFeature(FeatureType.TRADING) ?
    //         this.storageData.selectedBroker : Tc.enumString(BrokerType, BrokerType.None);
    // }

    setUseFastOrder(value: boolean) {
        this.storageData.useFastOrder = value;
        this.write();
    }

    getUseFastOrder(): boolean {
        return this.storageData.useFastOrder;
    }

    setShowPositionDrawings(value: boolean){
        this.storageData.showPositionDrawings = value;
        this.write();
    }

    getShowPositionDrawings(): boolean{
        return this.storageData.showPositionDrawings;
    }

    setShowOrderDrawings(value: boolean){
        this.storageData.showOrderDrawings = value;
        this.write();
    }

    getShowOrderDrawings(): boolean{
        return this.storageData.showOrderDrawings;
    }

    setShowExecutedOrders(value: boolean){
        this.storageData.showExecutedOrders = value;
        this.write();
    }

    getShowExecutedOrders(): boolean{
        return this.storageData.showExecutedOrders;
    }

    private write(){
        localStorage[TradingStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }

}

interface TradingState{
    toolbarState: TradingFloatingBarState,
    selectedBroker:string,
    useFastOrder: boolean,
    showPositionDrawings: boolean,
    showOrderDrawings: boolean,
    showExecutedOrders: boolean
}

interface TradingFloatingBarState {
    position: {top:number, left:number};
    visible:boolean;
}
