import { Tc } from '../../../utils/index';
import { MarketDateProjector } from './market-date-projector';
var find = require("lodash/find");
var map = require("lodash/map");
var sortBy = require("lodash/sortBy");
export var CompanyTag;
(function (CompanyTag) {
    CompanyTag[CompanyTag["NONE"] = 0] = "NONE";
    CompanyTag[CompanyTag["USA_SUPPORTED"] = 1] = "USA_SUPPORTED";
    CompanyTag[CompanyTag["USA_DOWJONES"] = 2] = "USA_DOWJONES";
})(CompanyTag || (CompanyTag = {}));
var Market = (function () {
    function Market(id, abbreviation, arabic, english, name, shortArabic, shortEnglish, shortName, historicalPricesUrl, streamerUrl, startTime, endTime, marketDepthByPriceTopic, sectors, companies, companyFlags, alertsHistoryUrl, technicalIndicatorStreamUrl) {
        var _this = this;
        this.id = id;
        this.abbreviation = abbreviation;
        this.arabic = arabic;
        this.english = english;
        this.name = name;
        this.shortArabic = shortArabic;
        this.shortEnglish = shortEnglish;
        this.shortName = shortName;
        this.historicalPricesUrl = historicalPricesUrl;
        this.streamerUrl = streamerUrl;
        this.startTime = startTime;
        this.endTime = endTime;
        this.marketDepthByPriceTopic = marketDepthByPriceTopic;
        this.sectors = sectors;
        this.companies = companies;
        this.companyFlags = companyFlags;
        this.alertsHistoryUrl = alertsHistoryUrl;
        this.technicalIndicatorStreamUrl = technicalIndicatorStreamUrl;
        this.companiesHash = {};
        this.companies.forEach(function (company) { return _this.companiesHash[company.symbol] = company; });
        this.sortCompanies();
        this.marketDateProjector = new MarketDateProjector(this.abbreviation, this.startTime, this.endTime);
    }
    Market.prototype.getGeneralIndex = function () {
        if (this.abbreviation == 'FRX') {
            return find(this.companies, function (company) { return company.symbol == 'EURUSD.FRX'; });
        }
        return find(this.companies, function (company) { return company.categoryId == 5; });
    };
    Market.prototype.getCompany = function (symbol) {
        return this.companiesHash[symbol];
    };
    Market.prototype.getCompanyById = function (id) {
        return find(this.companies, function (company) { return company.id == id; });
    };
    Market.prototype.getFirstSortedCompany = function () {
        for (var i = 0; i < this.sortedCompanies.length; ++i) {
            if (!this.sortedCompanies[i].index) {
                return this.sortedCompanies[i];
            }
        }
        Tc.error("fail to find first sorted company");
    };
    Market.prototype.getAllSymbols = function () {
        return map(this.companies, function (company) { return company.symbol; });
    };
    Market.prototype.findProjectedFutureDate = function (from, numberOfCandles, interval) {
        return this.marketDateProjector.findProjectedFutureDate(from, numberOfCandles, interval);
    };
    Market.prototype.findProjectNumberOfCandlesBetweenDates = function (from, to, interval) {
        return this.marketDateProjector.findProjectNumberOfCandlesBetweenDates(from, to, interval);
    };
    Market.prototype.sortCompanies = function () {
        var _this = this;
        this.sortedCompanies = [];
        var indices = this.companies.filter(function (company) { return company.index; });
        var companies = this.companies.filter(function (company) { return !company.index; });
        indices = sortBy(indices, function (index) { return index.categoryId; });
        companies = sortBy(companies, function (company) { return company.symbol; });
        indices.forEach(function (index) {
            _this.sortedCompanies.push(index);
            companies.forEach(function (company) {
                if (company.categoryId == index.categoryId) {
                    _this.sortedCompanies.push(company);
                }
            });
        });
        companies.forEach(function (company) {
            if (!_this.sortedCompanies.includes(company)) {
                _this.sortedCompanies.push(company);
            }
        });
    };
    return Market;
}());
export { Market };
//# sourceMappingURL=market.js.map