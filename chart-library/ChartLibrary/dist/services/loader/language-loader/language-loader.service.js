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
import { Tc } from "../../../utils";
var LanguageLoaderService = (function () {
    function LanguageLoaderService(http) {
        this.http = http;
    }
    LanguageLoaderService.prototype.getLanguageEntries = function () {
        return this.http.get(Tc.url('/m/liveweb/translation/entry'));
    };
    LanguageLoaderService.prototype.addNewLanguageEntry = function (arabic) {
        this.http.post(Tc.url('/m/liveweb/translation/entry'), { "arabic": arabic, "dev_mode": true }).subscribe();
    };
    LanguageLoaderService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], LanguageLoaderService);
    return LanguageLoaderService;
}());
export { LanguageLoaderService };
//# sourceMappingURL=language-loader.service.js.map