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
var DerayahErrorService = (function () {
    function DerayahErrorService() {
        this.errorStream = new Subject();
    }
    DerayahErrorService.prototype.getErrorStream = function () {
        return this.errorStream;
    };
    DerayahErrorService.prototype.extractErrorResponse = function (response) {
        return {
            expiredSession: response.responseCode == 2,
            message: response.message
        };
    };
    DerayahErrorService.prototype.onError = function (error) {
        this.errorStream.next(error);
    };
    DerayahErrorService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], DerayahErrorService);
    return DerayahErrorService;
}());
export { DerayahErrorService };
//# sourceMappingURL=derayah-error.service.js.map