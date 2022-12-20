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
    TOOLTIP_ID: 'scxTradingTooltip',
    TABLE_ID: '#scxTradingTooltip',
    TEXT_ID: '#scxTradingTooltip-text',
};
var TradingTooltip = (function (_super) {
    __extends(TradingTooltip, _super);
    function TradingTooltip() {
        return _super.call(this) || this;
    }
    Object.defineProperty(TradingTooltip, "instance", {
        get: function () {
            if (TradingTooltip._instance == null) {
                TradingTooltip._instance = new TradingTooltip();
            }
            return TradingTooltip._instance;
        },
        enumerable: true,
        configurable: true
    });
    TradingTooltip.prototype.show = function (config) {
        if (this.shown)
            this.hide();
        this._appendDataToHTML(config.text);
        $(IDS.TABLE_ID).addClass('shown');
        this.shown = true;
        this.setPosition(config.chartPanel, config.mousePosition, "#" + IDS.TOOLTIP_ID);
    };
    TradingTooltip.prototype.hide = function () {
        if (!this.shown)
            return;
        $(IDS.TABLE_ID).removeClass('shown');
        this.shown = false;
    };
    TradingTooltip.prototype.getType = function () {
        return ChartTooltipType.Trading;
    };
    TradingTooltip.prototype._appendDataToHTML = function (text) {
        $(IDS.TEXT_ID).text(text);
    };
    TradingTooltip._instance = null;
    return TradingTooltip;
}(AbstractTooltip));
export { TradingTooltip };
//# sourceMappingURL=TradingTooltip.js.map