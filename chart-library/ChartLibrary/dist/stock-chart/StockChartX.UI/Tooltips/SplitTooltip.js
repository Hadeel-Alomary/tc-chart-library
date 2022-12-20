var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChartTooltipType } from "../../../services/index";
import { AbstractTooltip } from "./AbstractTooltip";
var IDS = {
    TOOLTIP_ID: 'scxSplitTooltip',
    TABLE_ID: '#scxSplitTooltip',
    DATE_ID: '#scxSplitTooltip-date',
    VALUE_ID: '#scxSplitTooltip-value'
};
var SplitTooltip = (function (_super) {
    __extends(SplitTooltip, _super);
    function SplitTooltip() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SplitTooltip, "instance", {
        get: function () {
            if (SplitTooltip._instance == null) {
                SplitTooltip._instance = new SplitTooltip();
            }
            return SplitTooltip._instance;
        },
        enumerable: true,
        configurable: true
    });
    SplitTooltip.prototype.show = function (config) {
        if (this.shown)
            this.hide();
        this._appendDataToHTML(config.data);
        $(IDS.TABLE_ID).addClass('shown');
        this.shown = true;
        this.setPosition(config.chartPanel, config.mousePosition, "#" + IDS.TOOLTIP_ID);
    };
    SplitTooltip.prototype.hide = function () {
        if (!this.shown)
            return;
        $(IDS.TABLE_ID).removeClass('shown');
        this.shown = false;
    };
    SplitTooltip.prototype.getType = function () {
        return ChartTooltipType.Split;
    };
    SplitTooltip.prototype._appendDataToHTML = function (data) {
        $(IDS.DATE_ID).text(data.date);
        $(IDS.VALUE_ID).find('.from-value').text(data.data.toFixed(2));
    };
    SplitTooltip._instance = null;
    return SplitTooltip;
}(AbstractTooltip));
export { SplitTooltip };
//# sourceMappingURL=SplitTooltip.js.map