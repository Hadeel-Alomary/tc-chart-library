import { Observable } from 'rxjs/internal/Observable';
import { AbstractTooltip } from './AbstractTooltip';
export declare abstract class DataRequesterTooltip<T> extends AbstractTooltip {
    private _dataRequestSubscription;
    private _requestedItemId;
    constructor();
    protected abstract onDataCb(data: T): void;
    protected abstract getRequestObservable(): Observable<T>;
    protected abstract getTooltipId(): string;
    protected requestData(itemId: string): void;
    private _cancelRequest;
    private _showLoadingImageTooltip;
    private _hideLoadingImageTooltip;
    private _hasRequestInProgress;
}
//# sourceMappingURL=DataRequesterTooltip.d.ts.map