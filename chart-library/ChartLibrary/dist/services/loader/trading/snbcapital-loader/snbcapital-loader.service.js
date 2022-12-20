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
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Tc } from '../../../../utils/index';
import { LanguageService } from '../../../language/index';
import { SnbcapitalHttpClientService } from '../../../trading/snbcapital/snbcapital-http-client-service';
import { TcAuthenticatedHttpClient } from '../../../../utils/tc-authenticated-http-client.service';
var SnbcapitalLoaderService = (function () {
    function SnbcapitalLoaderService(http, tcHttpClient, snbcapitalHttpClientService, languageService) {
        this.http = http;
        this.tcHttpClient = tcHttpClient;
        this.snbcapitalHttpClientService = snbcapitalHttpClientService;
        this.languageService = languageService;
    }
    SnbcapitalLoaderService.prototype.connectToSnbcapital = function () {
        this.logRequestData('Connect to integration Tc Layer url : ', {});
        return this.snbcapitalHttpClientService.post('SourceOnly=true&JavaClient=JSON').pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.callLogin = function (tickerchartUserId, password) {
        var xslcontext = this.languageService.arabic ? 'GTRADEGILARAB' : 'GTRADEGIL';
        var body = "DEVICETYPE=PC&NameXsl=FirstStepLogin&SourceOnly=true&Password=" + password + "&Bank=NCBC&UserID=" + tickerchartUserId + "&XSLCONTEXT=" + xslcontext + "&JavaClient=JSON&minifyJSON=true";
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.verify = function (mobileCode, snbcapitalUserName, snbcapitalPassword) {
        var xslcontext = this.languageService.arabic ? 'GTRADEGILARAB' : 'GTRADEGIL';
        var body = "DEVICETYPE=PC&NameXsl=LoginOTP&SourceOnly=true&CodiceABI=NCBC&JavaClient=JSON&minifyJSON=true&UserID=" + snbcapitalUserName + "&Password=" + snbcapitalPassword + "&otCode=" + mobileCode + "&SecStepLogin=doLogin&XSLCONTEXT=" + xslcontext;
        this.logRequestData('verify', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.snbcapitalRegisterApi = function (snbcapitalUserName) {
        var url = null;
        return this.tcHttpClient.postWithAuth(Tc.url(url), {
            'alahli_username': snbcapitalUserName,
            'language': this.languageService.arabic ? 'ARABIC' : "ENGLISH"
        }).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.disconnectFromSnbcapital = function () {
        this.logRequestData('Disconnect from snbcapital', {});
        var body = "action=LOGOUT&SourceOnly=true&JavaClient=JSON";
        return this.snbcapitalHttpClientService.post(body).pipe();
    };
    SnbcapitalLoaderService.prototype.addPreConfirm = function (order, preConfirmBody, portfolio) {
        var portafoglio = "Portafoglio=" + portfolio.securityAccountBranchCode + "*" + portfolio.portfolioId + "*0*-**" + portfolio.cashAccountBranchCode + "*" + portfolio.cashAccountCode;
        var body = "NameXsl=RiepilogoOrdine&" + preConfirmBody + "&" + portafoglio + "&Quantita=" + order.quantity + "&DeviceType=1&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode + "&sliceType=0&stepQty=0&stepInterval=0&timeStamp=" + moment().valueOf() + "&SkipChecks=" + false;
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.addOrder = function (order, portfolio) {
        var body = "NameXsl=ConfermaOrdine&referrer=" + order.referrer + "&checkPinMode=account&pinContainerCode=" + portfolio.securityAccountBranchCode + "/" + portfolio.portfolioId + "&pin=&checkPin=" + false + "&reloadPinData=" + true + "&timeStamp=" + moment().valueOf() + "&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode;
        this.logRequestData('add Order', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.updatePreConfirm = function (order, portfolio) {
        var body = "NameXsl=ModificaOrdine&Calendar=" + true + "&InfoSegmento=" + true + "&NroRifOrdine=" + order.gpsOrderNumber + "&Portafoglio=" + portfolio.securityAccountBranchCode + "*" + portfolio.portfolioId + "*0*NULL*NULL&DataOrdine=&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode;
        this.logRequestData('update PreConfirm order', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.updateOrder = function (order, paramPrc, paramQty, paramDisclosedQty, paramExpiry, newTimeInForceOrPrmQty, portfolio) {
        var body = "NameXsl=ConfermaModificaOrdine&" + paramPrc + paramQty + paramDisclosedQty + newTimeInForceOrPrmQty + paramExpiry + "NroRifOrdine=" + order.gpsOrderNumber + "&Portafoglio=" + portfolio.securityAccountBranchCode + "*" + portfolio.portfolioId + "*0*NULL*NULL&DataOrdine=&checkPin=false&reloadPinData=true&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode;
        this.logRequestData('update order', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.deleteOrder = function (order, portfolio) {
        var fullDate = moment(order.date).format('YYYYMMDDHHmmssSSS');
        var body = "NameXsl=RispostaCancellaOrdine&NroRifOrdine=" + order.gpsOrderNumber + "&DataOrdine=" + fullDate + "&checkPinMode=account&pinContainerCode=" + portfolio.securityAccountBranchCode + "/" + portfolio.portfolioId + "&pin=&checkPin=false&reloadPinData=true&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode;
        this.logRequestData('delete order', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.getOrderDetails = function (order, portfolio) {
        var portfolioValue = portfolio.securityAccountBranchCode + "*" + portfolio.portfolioId + "*0*NULL*NULL";
        var fullDate = moment(order.date).format('YYYYMMDDHHmmssSSS');
        var body = "NameXsl=ListaEseguiti&Portafoglio=" + portfolioValue + "&DataOrdine=" + fullDate + "&NroRifOrdine=" + order.id + "&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode;
        this.logRequestData('Snbcapital get order detailes ', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.calculateOrderQuantity = function (order, calculateQuantityBody, portfolio) {
        var portafoglio = "Portafoglio=" + portfolio.securityAccountBranchCode + "*" + portfolio.portfolioId + "*0*-**" + portfolio.cashAccountBranchCode + "*" + portfolio.cashAccountCode;
        var body = "NameXsl=MaxBuyQty&" + calculateQuantityBody + "&maxOrderQty=true&" + portafoglio + "&DeviceType=1&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode + "&sliceType=0&stepQty=0&stepInterval=0&timeStamp=" + moment().valueOf();
        this.logRequestData('Snbcapital quantity calculator ', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.getPortfolios = function () {
        this.logRequestData('Snbcapital get portfolios', {});
        var body = 'NameXsl=PortfolioList&JavaClient=JSON';
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.getOrders = function (customerCode) {
        var body = "NameXsl=ListaOrdiniEx&revoche=" + true + "&ascendingOrderBy=" + true + "&TipoRicercaOrdine=TRO_APERTI&TipoRicercaOrdine=TRO_ODIERNI_CHIUSI&NO_PAGING=" + true + "&JavaClient=JSON&GUserTrace=" + customerCode;
        this.logRequestData('get orders', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.getSearchOrders = function (portfolio, orderAction, startDate, endDate, orderStatus, company, orderNumber, pageNumber) {
        var startYear = startDate.split('-')[0];
        var startMonth = startDate.split('-')[1];
        var startDay = startDate.split('-')[2];
        var endYear = endDate.split('-')[0];
        var endMonth = endDate.split('-')[1];
        var endDay = endDate.split('-')[2];
        var body = "NameXsl=ListaOrdiniEx&DepositoJS=[{filiale:" + portfolio.securityAccountBranchCode + ",codice:" + portfolio.portfolioId + "}]&GGDataDa=" + startDay + "&MMDataDa=" + startMonth + "&AADataDa=" + startYear + "&GGDataAl=" + endDay + "&MMDataAl=" + endMonth + "&AADataAl=" + endYear + "&revoche=true&orderSearch=1&Page=" + pageNumber + "&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode;
        if (orderAction != 'all') {
            if (orderAction == 'buy') {
                body += '&Sign=BS_COMPRA';
            }
            else {
                body += '&Sign=BS_VENDE';
            }
        }
        if (orderStatus.newOrder) {
            body += '&TipoRicercaOrdine=TRO_NUOVI';
        }
        if (orderStatus.partialExecutionOrder) {
            body += '&TipoRicercaOrdine=TRO_ESEGUITI_PARZIALI';
        }
        if (orderStatus.fullExecutionOrder) {
            body += '&TipoRicercaOrdine=TRO_ESEGUITI_TOTALI';
        }
        if (orderStatus.cancelExecutionOrder) {
            body += '&TipoRicercaOrdine=TRO_CANCELLED';
        }
        if (orderStatus.modifiedOrder) {
            body += '&TipoRicercaOrdine=TRO_MODIFIED';
        }
        if (orderStatus.rejectedOrder) {
            body += '&TipoRicercaOrdine=TRO_RIFIUTATI';
        }
        if (orderStatus.suspendedOrder) {
            body += '&TipoRicercaOrdine=TRO_SOSPESI';
        }
        if (orderStatus.expiredOrder) {
            body += '&TipoRicercaOrdine=TRO_SCADUTI';
        }
        if (company) {
            body += "&TipoCodice=BANCA&CodRicerca=" + company;
        }
        if (orderNumber) {
            body += "&TipoCodice=TRANSACTION_NUM&CodRicerca=" + orderNumber;
        }
        this.logRequestData('get orders search', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.getSnbcapitalPurchasePower = function (portfolio) {
        var contoCorrente = portfolio.securityAccountBranchCode + "*" + portfolio.portfolioId + "*" + portfolio.securitySubAccountCode + "*_*" + portfolio.cashAccountBranchCode + "*" + portfolio.cashAccountCode + "*" + portfolio.currency.CurrencyCode;
        var body = "NameXsl=SaldoCC&ContoCorrente=" + contoCorrente + "&JavaClient=JSON&GUserTrace=" + portfolio.gBSCustomerCode;
        this.logRequestData('purchase power', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.getPositions = function (portfolio) {
        var body = "NameXsl=ListaPosizioniTD&saldi=" + true + "&Tipo=APERTE&abi=NCBC&JavaClient=JSON&ndg=" + portfolio.gBSCustomerCode + "&Portafoglio=" + portfolio.securityAccountBranchCode + "*" + portfolio.portfolioId + "*TUTTI*TUTTI*TUTTI&GUserTrace=" + portfolio.gBSCustomerCode;
        this.logRequestData('Snbcapital get positions.', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map(function (response) { return response; }));
    };
    SnbcapitalLoaderService.prototype.logRequestData = function (url, data) {
    };
    SnbcapitalLoaderService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, TcAuthenticatedHttpClient, SnbcapitalHttpClientService, LanguageService])
    ], SnbcapitalLoaderService);
    return SnbcapitalLoaderService;
}());
export { SnbcapitalLoaderService };
export var SnbcapitalOrderStatusResponse;
(function (SnbcapitalOrderStatusResponse) {
    SnbcapitalOrderStatusResponse[SnbcapitalOrderStatusResponse["Pending"] = 1] = "Pending";
    SnbcapitalOrderStatusResponse[SnbcapitalOrderStatusResponse["Rejected"] = 2] = "Rejected";
    SnbcapitalOrderStatusResponse[SnbcapitalOrderStatusResponse["Released"] = 3] = "Released";
})(SnbcapitalOrderStatusResponse || (SnbcapitalOrderStatusResponse = {}));
//# sourceMappingURL=snbcapital-loader.service.js.map