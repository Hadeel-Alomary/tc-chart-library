var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChartTooltipType } from "../../../services/index";
import { AbstractTooltip } from "./AbstractTooltip";
var IDS = {
    TOOLTIP_ID: 'scxAlertTooltip',
    TABLE_ID: '#scxAlertTooltip',
    TEXT_ID: '#scxAlertTooltip-text',
};
var AlertTooltip = (function (_super) {
    __extends(AlertTooltip, _super);
    function AlertTooltip() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AlertTooltip, "instance", {
        get: function () {
            if (AlertTooltip._instance == null) {
                AlertTooltip._instance = new AlertTooltip();
            }
            return AlertTooltip._instance;
        },
        enumerable: false,
        configurable: true
    });
    AlertTooltip.prototype.show = function (config) {
        if (this.shown)
            this.hide();
        this._appendDataToHTML(config.text);
        $(IDS.TABLE_ID).addClass('shown');
        this.shown = true;
        config.position.y -= AbstractTooltip.offset;
        $(IDS.TABLE_ID).css('width', "".concat(AbstractTooltip.defaultWidth, "px"));
        this.setPosition(config.chartPanel, config.position, "#".concat(IDS.TOOLTIP_ID), AbstractTooltip.defaultWidth, true);
    };
    AlertTooltip.prototype.hide = function () {
        if (!this.shown)
            return;
        $(IDS.TABLE_ID).removeClass('shown');
        this.shown = false;
    };
    AlertTooltip.prototype.getType = function () {
        return ChartTooltipType.Alert;
    };
    AlertTooltip.prototype._appendDataToHTML = function (text) {
        $(IDS.TEXT_ID).text(text);
    };
    AlertTooltip._instance = null;
    return AlertTooltip;
}(AbstractTooltip));
export { AlertTooltip };
//# sourceMappingURL=AlertTooltip.js.map