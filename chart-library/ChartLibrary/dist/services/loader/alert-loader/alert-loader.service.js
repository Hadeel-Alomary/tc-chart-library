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
import { map } from 'rxjs/operators';
import { Tc } from '../../../utils/index';
import { TrendLineAlert } from '../../alert/trend-line-alert';
import { NormalAlert } from '../../alert/normal-alert';
import { AlertType } from '../../alert/alert-type';
import { NotificationMethods } from '../../notification';
import { AlertOperator } from '../../alert/alert-operator';
import { TrendLineAlertOperation, TrendLineAlertOperationType } from '../../alert/trend-line-alert-operation';
import { AlertTriggerType } from '../../alert/alert-trigger';
import { EnumUtils } from '../../../utils/enum.utils';
import { ChartAlert } from '../../alert/chart-alert';
import { ChartAlertFunctionType } from '../../alert/chart-alert-function';
import { ChartAlertIndicator } from '../../alert/chart-alert-indicator';
import { Interval } from '../price-loader/interval';
import { TcAuthenticatedHttpClient } from '../../../utils/tc-authenticated-http-client.service';
import { LanguageService } from "../../../services";
var AlertLoader = (function () {
    function AlertLoader(tcHttpClient, languageService) {
        this.tcHttpClient = tcHttpClient;
        this.languageService = languageService;
    }
    AlertLoader.prototype.loadAlerts = function () {
        var _this = this;
        var url = "".concat(this.baseUrl, "/web/index");
        return this.tcHttpClient.getWithAuth(Tc.url(url)).pipe(map(function (response) { return _this.processHistoricalAlerts(response); }));
    };
    AlertLoader.prototype.createAlert = function (alert) {
        var _this = this;
        var url = "".concat(this.baseUrl, "/add");
        var alertAsJson = {
            "alert_type": EnumUtils.enumValueToString(AlertType, alert.alertType),
            "data_interval": Interval.toAlertServerInterval(alert.interval),
            "equation": alert.getEquation(),
            "equation_description": alert.getEquationDescription(),
            "expiry_time": "".concat(alert.expiryDate, " 00:00:00"),
            "market": null,
            "message": alert.message,
            "language": this.languageService.arabic ? "arabic" : "english",
            "methods": alert.notificationMethods.toRequestObject(),
            "paused": alert.paused,
            "trigger_type": EnumUtils.enumValueToString(AlertTriggerType, alert.triggerType),
            "symbols": [alert.company.symbol],
            "fire_on_change": alert.fireOnChange
        };
        if (!alert.isNormalAlert()) {
            alertAsJson['platform'] = 'WEB';
        }
        return this.tcHttpClient.postWithAuth(Tc.url(url), alertAsJson).pipe(map(function (response) { return _this.processSavedAlertOnServer(response); }));
    };
    AlertLoader.prototype.updateAlert = function (alert) {
        var url = "".concat(this.baseUrl, "/{0}/update");
        url = url.replace('{0}', alert.id);
        return this.tcHttpClient.postWithAuth(url, {
            "alert_type": EnumUtils.enumValueToString(AlertType, alert.alertType),
            "data_interval": Interval.toAlertServerInterval(alert.interval),
            "equation": alert.getEquation(),
            "equation_description": alert.getEquationDescription(),
            "expiry_time": "".concat(alert.expiryDate, " 00:00:00"),
            "market": null,
            "message": alert.message,
            "language": this.languageService.arabic ? "arabic" : "english",
            "methods": alert.notificationMethods.toRequestObject(),
            "paused": alert.paused,
            "trigger_type": EnumUtils.enumValueToString(AlertTriggerType, alert.triggerType),
            "symbols": [alert.company.symbol],
            "fire_on_change": alert.fireOnChange
        }).pipe(map(function (response) { return null; }));
    };
    AlertLoader.prototype.deleteAlert = function (alert) {
        var url = "".concat(this.baseUrl, "/{0}/delete");
        url = url.replace('{0}', alert.id);
        return this.tcHttpClient.postWithAuth(url, {}).pipe(map(function (response) { return null; }));
    };
    AlertLoader.prototype.processSavedAlertOnServer = function (response) {
        if (!response.success) {
            Tc.warn("fail in saving alert on server");
            alert("لم يتم حفظ التنبيه بنجاح");
            return "-1";
        }
        return response.id;
    };
    AlertLoader.prototype.processHistoricalAlerts = function (response) {
        var result = [];
        for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
            var responseObject = response_1[_i];
            if ((responseObject.deleted == "1") || (responseObject.legacy == "1")) {
                continue;
            }
            if (this.isSupportedAlert(responseObject.alert_type)) {
                var symbol = "".concat(responseObject.symbols[0].symbol, ".").concat(responseObject.symbols[0].market);
                if (responseObject.alert_type == 'NORMAL') {
                    result.push(this.constructNormalAlert(responseObject));
                }
                else if (responseObject.alert_type == 'TREND') {
                    result.push(this.constructTrendLineAlert(responseObject));
                }
                else if (responseObject.alert_type == 'TECHNICAL') {
                    result.push(this.constructChartAlert(responseObject));
                }
                else {
                    Tc.error("unexpected alert type: " + responseObject.alert_type);
                }
            }
        }
        return result;
    };
    AlertLoader.prototype.isSupportedAlert = function (alertType) {
        return ['NORMAL', 'TREND', 'TECHNICAL'].indexOf(alertType) > -1;
    };
    AlertLoader.prototype.constructNormalAlert = function (responseObject) {
        var equationDescription = JSON.parse(responseObject.equation_description);
        return new NormalAlert(responseObject.id, Interval.fromAlertServerInterval(responseObject.data_interval), responseObject.paused == "1", responseObject.reactivate_minutes == "1", EnumUtils.enumStringToValue(AlertTriggerType, responseObject.trigger_type), responseObject.fire_on_change == "1", "".concat(responseObject.expiry_time).substr(0, 10), responseObject.message, responseObject.language, responseObject.expired == "1", responseObject.created_at, responseObject.updated_at, null, responseObject.last_trigger_time, this.extractAlertHistory(responseObject.history), NotificationMethods.fromResponseData(responseObject.methods), AlertType.NORMAL, false, equationDescription['Operands'][0], AlertOperator.fromOperationSymbol(equationDescription['Operation']).id, equationDescription['Operands'][1]);
    };
    AlertLoader.prototype.constructTrendLineAlert = function (responseObject) {
        var equation = JSON.parse(responseObject.equation);
        var equationDescription = JSON.parse(responseObject.equation_description);
        var symbol = "".concat(responseObject.symbols[0].symbol, ".").concat(responseObject.symbols[0].market);
        var trendLineDefinition = {
            date1: equation['date1'],
            date2: equation['date2'],
            price1: equation['price1'],
            price2: equation['price2'],
            extendLeft: equation['extend-left'],
            extendRight: equation['extend-right'],
            logarithmic: equation['logarithmic'],
        };
        return new TrendLineAlert(responseObject.id, Interval.fromAlertServerInterval(responseObject['data_interval']), responseObject.paused == "1", responseObject.reactivate_minutes == "1", EnumUtils.enumStringToValue(AlertTriggerType, responseObject.trigger_type), responseObject.fire_on_change == "1", "".concat(responseObject.expiry_time).substr(0, 10), responseObject.message, responseObject.language, responseObject.expired == "1", responseObject.created_at, responseObject.updated_at, null, responseObject.last_trigger_time, this.extractAlertHistory(responseObject.history), NotificationMethods.fromResponseData(responseObject.methods), AlertType.TREND, false, equationDescription['hostId'], TrendLineAlertOperation.fromType(TrendLineAlertOperationType[equation['operation']]), trendLineDefinition, equationDescription['drawingId']);
    };
    AlertLoader.prototype.constructChartAlert = function (responseObject) {
        var equationDescription = JSON.parse(responseObject.equation_description);
        var indicatorType = equationDescription['indicatorType'];
        var selectedIndicatorField = equationDescription['selectedIndicatorField'];
        var indicatorParameters = equationDescription['indicatorParameters'];
        var value = equationDescription['value'];
        var alertFunction = equationDescription['alertFunction'];
        var alertFunctionTypeEnumString = ChartAlertFunctionType[alertFunction];
        var hostId = equationDescription['hostId'];
        var indicatorId = equationDescription['indicatorId'];
        var secondValue = equationDescription['secondValue'];
        return new ChartAlert(responseObject.id, Interval.fromAlertServerInterval(responseObject.data_interval), responseObject.paused == "1", responseObject.reactivate_minutes == "1", EnumUtils.enumStringToValue(AlertTriggerType, responseObject.trigger_type), responseObject.fire_on_change == "1", "".concat(responseObject.expiry_time).substr(0, 10), responseObject.message, responseObject.language, responseObject.expired == "1", responseObject.created_at, responseObject.updated_at, null, responseObject.last_trigger_time, this.extractAlertHistory(responseObject.history), NotificationMethods.fromResponseData(responseObject.methods), AlertType.TECHNICAL, false, hostId, {
            indicator: new ChartAlertIndicator(indicatorType, selectedIndicatorField, indicatorParameters, indicatorId),
            alertFunctionType: ChartAlertFunctionType[alertFunctionTypeEnumString],
            value1: value,
            value2: secondValue
        });
    };
    AlertLoader.prototype.extractAlertHistory = function (responseHistory) {
        var result = [];
        for (var _i = 0, responseHistory_1 = responseHistory; _i < responseHistory_1.length; _i++) {
            var history_1 = responseHistory_1[_i];
            result.push({
                time: history_1.alert_time,
                price: +history_1.price
            });
        }
        return result;
    };
    AlertLoader = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TcAuthenticatedHttpClient,
            LanguageService])
    ], AlertLoader);
    return AlertLoader;
}());
export { AlertLoader };
//# sourceMappingURL=alert-loader.service.js.map