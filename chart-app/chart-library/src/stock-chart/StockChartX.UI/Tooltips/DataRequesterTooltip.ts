import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {AbstractTooltip} from './AbstractTooltip';
import {Tc} from '../../../utils';


export abstract class DataRequesterTooltip<T> extends AbstractTooltip {

    private _dataRequestSubscription: Subscription;
    private _requestedItemId:string;

    constructor() {
        super();
    }

    protected abstract onDataCb(data:T): void;
    protected abstract getRequestObservable():Observable<T>;
    protected abstract getTooltipId():string;

    protected requestData(itemId:string):void {

        if(this._requestedItemId == itemId) {
            return; // currently requesting this item
        }

        if(this._hasRequestInProgress() && (itemId != this._requestedItemId)) {
            this._cancelRequest(); // requesting a different item, so cancel it
        }

        // make the request
        this._requestedItemId = itemId;
        this._dataRequestSubscription = this.getRequestObservable().subscribe(
            data => {
                this._requestedItemId = null;
                this._hideLoadingImageTooltip();
                this.onDataCb(data);
            }
        )

        // if request is cached, then above callback will be called immediately and no need to show ajax loading
        if(this._requestedItemId != null) {
            this._showLoadingImageTooltip();
        }

    }

    private _cancelRequest():void {
        Tc.assert(this._requestedItemId != null, 'no pending request to cancel');
        this._hideLoadingImageTooltip();
        if(this._dataRequestSubscription) {
            this._dataRequestSubscription.unsubscribe();
            this._dataRequestSubscription = null;
        }
        this._requestedItemId = null;
    }

    private _showLoadingImageTooltip() {
        if(!$(this.getTooltipId()).find(".scxLoadingImageTooltip-row").length) {
            $(this.getTooltipId()).append($('#scxLoadingImageTooltip').find("tr"));
        }
        $(this.getTooltipId()).find("tr.scxLoadingImageTooltip-row").show();
        $(this.getTooltipId()).find("tr:not(.scxLoadingImageTooltip-row)").hide();
    }

    private _hideLoadingImageTooltip() {
        $(this.getTooltipId()).find("tr.scxLoadingImageTooltip-row").hide();
        $(this.getTooltipId()).find("tr:not(.scxLoadingImageTooltip-row)").show();
    }

    private _hasRequestInProgress() {
        return this._requestedItemId != null;
    }


}
