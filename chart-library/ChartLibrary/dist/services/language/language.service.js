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
import { LanguageType } from './language-type';
import { LanguageLoaderService } from '../loader/language-loader/index';
import { StringUtils, Tc } from '../../utils/index';
var TranslateType;
(function (TranslateType) {
    TranslateType["Element"] = "translate";
    TranslateType["PlaceHolder"] = "place-holder-translate";
    TranslateType["Title"] = "title-translate";
})(TranslateType || (TranslateType = {}));
var LanguageService = (function () {
    function LanguageService(languageLoaderService) {
        this.languageLoaderService = languageLoaderService;
        this.languageEntries = null;
        var languageAsString = localStorage.getItem(LanguageService_1.STORAGE_KEY);
        this.language = languageAsString && languageAsString == "en" ? LanguageType.English : LanguageType.Arabic;
    }
    LanguageService_1 = LanguageService;
    Object.defineProperty(LanguageService.prototype, "arabic", {
        get: function () {
            return this.language == LanguageType.Arabic;
        },
        enumerable: false,
        configurable: true
    });
    LanguageService.prototype.translate = function (arabic) {
        if (this.arabic) {
            return arabic;
        }
        if (StringUtils.hasOnlyAsciiCharacters(arabic)) {
            return arabic;
        }
        if (this.languageEntries[arabic] && 0 < this.languageEntries[arabic].length) {
            return this.languageEntries[arabic];
        }
        if (this.languageEntries[arabic] == null) {
            this.languageLoaderService.addNewLanguageEntry(arabic);
            this.languageEntries[arabic] = "";
        }
        return arabic;
    };
    LanguageService.prototype.getLanguage = function () {
        return this.language;
    };
    LanguageService.prototype.setLanguage = function (language) {
        this.write(language);
    };
    LanguageService.prototype.switchLanguage = function () {
        var language = this.language == LanguageType.Arabic ? LanguageType.English : LanguageType.Arabic;
        this.setLanguage(language);
    };
    LanguageService.prototype.translateHtml = function (element) {
        this.translateElement(element);
        this.translateElementPlaceHolder(element);
        this.translateElementTitle(element);
    };
    LanguageService.prototype.getLanguageEntries = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.arabic) {
                return resolve({});
            }
            _this.languageLoaderService.getLanguageEntries().subscribe(function (translation) {
                _this.languageEntries = Object.assign([], translation.entries);
                resolve(_this.languageEntries);
            }, function (error) {
                Tc.error('cannot load language entries.');
            });
        });
    };
    LanguageService.prototype.write = function (language) {
        var languageAsString = language == LanguageType.Arabic ? "ar" : "en";
        localStorage.setItem(LanguageService_1.STORAGE_KEY, languageAsString);
    };
    LanguageService.prototype.translateElement = function (element) {
        var _this = this;
        $(element).find(".".concat(TranslateType.Element)).text(function (index, oldText) {
            return _this.translate(oldText);
        });
    };
    LanguageService.prototype.translateElementPlaceHolder = function (element) {
        var _this = this;
        $(element).find(".".concat(TranslateType.PlaceHolder)).each(function (index, element) {
            $(element).attr("placeholder", _this.translate($(element).attr("placeholder")));
        });
    };
    LanguageService.prototype.translateElementTitle = function (element) {
        var _this = this;
        $(element).find(".".concat(TranslateType.Title)).each(function (index, element) {
            $(element).attr("title", _this.translate($(element).attr("title")));
        });
    };
    var LanguageService_1;
    LanguageService.STORAGE_KEY = "TC_LANGUAGE";
    LanguageService = LanguageService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LanguageLoaderService])
    ], LanguageService);
    return LanguageService;
}());
export { LanguageService };
//# sourceMappingURL=language.service.js.map