import { __extends } from "tslib";
import { AbstractTooltip } from './AbstractTooltip';
import { Tc } from '../../../utils';
var DataRequesterTooltip = (function (_super) {
    __extends(DataRequesterTooltip, _super);
    function DataRequesterTooltip() {
        return _super.call(this) || this;
    }
    DataRequesterTooltip.prototype.requestData = function (itemId) {
        var _this = this;
        if (this._requestedItemId == itemId) {
            return;
        }
        if (this._hasRequestInProgress() && (itemId != this._requestedItemId)) {
            this._cancelRequest();
        }
        this._requestedItemId = itemId;
        this._dataRequestSubscription = this.getRequestObservable().subscribe(function (data) {
            _this._requestedItemId = null;
            _this._hideLoadingImageTooltip();
            _this.onDataCb(data);
        });
        if (this._requestedItemId != null) {
            this._showLoadingImageTooltip();
        }
    };
    DataRequesterTooltip.prototype._cancelRequest = function () {
        Tc.assert(this._requestedItemId != null, 'no pending request to cancel');
        this._hideLoadingImageTooltip();
        if (this._dataRequestSubscription) {
            this._dataRequestSubscription.unsubscribe();
            this._dataRequestSubscription = null;
        }
        this._requestedItemId = null;
    };
    DataRequesterTooltip.prototype._showLoadingImageTooltip = function () {
        if (!$(this.getTooltipId()).find(".scxLoadingImageTooltip-row").length) {
            $(this.getTooltipId()).append($('#scxLoadingImageTooltip').find("tr"));
        }
        $(this.getTooltipId()).find("tr.scxLoadingImageTooltip-row").show();
        $(this.getTooltipId()).find("tr:not(.scxLoadingImageTooltip-row)").hide();
    };
    DataRequesterTooltip.prototype._hideLoadingImageTooltip = function () {
        $(this.getTooltipId()).find("tr.scxLoadingImageTooltip-row").hide();
        $(this.getTooltipId()).find("tr:not(.scxLoadingImageTooltip-row)").show();
    };
    DataRequesterTooltip.prototype._hasRequestInProgress = function () {
        return this._requestedItemId != null;
    };
    return DataRequesterTooltip;
}(AbstractTooltip));
export { DataRequesterTooltip };
//# sourceMappingURL=DataRequesterTooltip.js.map