var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HtmlLoader } from '../../../stock-chart/StockChartX.UI/HtmlLoader';
import { LanguageService } from "../../../services/language";
var TooltipService = (function () {
    function TooltipService(languageService) {
        this.languageService = languageService;
        this.tooltips = {};
        this.init();
    }
    TooltipService.prototype.init = function () {
        var _this = this;
        var body = $("body");
        if (!body.attr("data-init-chart-tooltip")) {
            body.attr("data-init-chart-tooltip", "true");
            HtmlLoader.getView("ChartTooltip.html", function (html) {
                _this.languageService.translateHtml($(html).appendTo(body));
            });
        }
    };
    TooltipService.prototype.register = function (toolTip) {
        this.tooltips[toolTip.getType()] = toolTip;
    };
    TooltipService.prototype.hideAllTooltips = function () {
        Object.values(this.tooltips).forEach(function (tooltip) {
            tooltip.hide();
        });
    };
    TooltipService.prototype.show = function (tooltipType, config) {
        this.hideAllTooltips();
        this.tooltips[tooltipType].show(config);
    };
    TooltipService.prototype.hide = function (tooltipType) {
        this.tooltips[tooltipType].hide();
    };
    TooltipService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LanguageService])
    ], TooltipService);
    return TooltipService;
}());
export { TooltipService };
//# sourceMappingURL=tooltip.service.js.map