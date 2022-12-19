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
import { Subject } from 'rxjs';
import { LanguageService } from '../../language';
var SnbcapitalErrorService = (function () {
    function SnbcapitalErrorService(languageService) {
        this.languageService = languageService;
        this.errorStream = new Subject();
    }
    SnbcapitalErrorService.prototype.getErrorStream = function () {
        return this.errorStream;
    };
    SnbcapitalErrorService.prototype.extractErrorResponse = function (response) {
        var isSessionExpired = response.__errorData__.type == 'SESSIONEXPIRED';
        if (isSessionExpired) {
            return this.getSessionExpiredError();
        }
        return {
            expiredSession: false,
            message: response.__errorData__.message,
        };
    };
    SnbcapitalErrorService.prototype.emitSessionExpiredError = function () {
        this.onError(this.getSessionExpiredError());
    };
    SnbcapitalErrorService.prototype.getSessionExpiredError = function () {
        return {
            expiredSession: true,
            message: this.languageService.translate('إنتهت الجلسة يرجى إعادة الربط مرة أخرى.'),
        };
    };
    SnbcapitalErrorService.prototype.onError = function (error) {
        this.errorStream.next(error);
    };
    SnbcapitalErrorService.prototype.errorDataResponseValidation = function (response) {
        if (response['__errorData__']) {
            return this.extractErrorResponse(response);
        }
        return null;
    };
    SnbcapitalErrorService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LanguageService])
    ], SnbcapitalErrorService);
    return SnbcapitalErrorService;
}());
export { SnbcapitalErrorService };
//# sourceMappingURL=snbcapital-error.service.js.map