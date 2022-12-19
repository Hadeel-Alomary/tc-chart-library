var SnbcapitalOrderExpiration = (function () {
    function SnbcapitalOrderExpiration(type, name) {
        this.type = type;
        this.name = name;
    }
    SnbcapitalOrderExpiration.getAllTypes = function () {
        if (!SnbcapitalOrderExpiration.allTypes) {
            SnbcapitalOrderExpiration.allTypes = [];
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.Today, 'يوم'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.FillOrKill, 'تنفيذ أو إالغاء'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.FillAndKill, 'تنفيذ و إلغاء'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.AtTheOpening, 'عند الافتتاح'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillDate, 'حتى تاريخ'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillMonth, 'لمدة شهر'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillWeek, 'لمدة أسبوع'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillCancellation, 'حتى الالغاء'));
        }
        return SnbcapitalOrderExpiration.allTypes;
    };
    SnbcapitalOrderExpiration.getBuySellExpirationType = function () {
        return SnbcapitalOrderExpiration.getAllTypes().filter(function (item) { return item.type != SnbcapitalOrderExpirationType.GoodTillMonth && item.type != SnbcapitalOrderExpirationType.GoodTillWeek; });
    };
    SnbcapitalOrderExpiration.getOrderExpirationByType = function (type) {
        return SnbcapitalOrderExpiration.getAllTypes().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderExpiration.getExpirationType = function (type, quantityParam, isEditOrder) {
        if (quantityParam) {
            switch (quantityParam) {
                case 1:
                    return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.FillAndKill);
                case 6:
                    return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.FillOrKill);
            }
        }
        if (type == 0 || type == 1) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.Today);
        }
        else if (type == 2) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillDate);
        }
        else if (type == 4) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.AtTheOpening);
        }
        else if (type == 6 && !isEditOrder) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillWeek);
        }
        else if (type == 7 && !isEditOrder) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillMonth);
        }
        else if (type == 9) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillCancellation);
        }
        else {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.Today);
        }
    };
    return SnbcapitalOrderExpiration;
}());
export { SnbcapitalOrderExpiration };
export var SnbcapitalOrderExpirationType;
(function (SnbcapitalOrderExpirationType) {
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["Today"] = 0] = "Today";
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["GoodTillDate"] = 1] = "GoodTillDate";
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["AtTheOpening"] = 2] = "AtTheOpening";
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["GoodTillWeek"] = 3] = "GoodTillWeek";
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["GoodTillMonth"] = 4] = "GoodTillMonth";
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["GoodTillCancellation"] = 5] = "GoodTillCancellation";
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["FillAndKill"] = 6] = "FillAndKill";
    SnbcapitalOrderExpirationType[SnbcapitalOrderExpirationType["FillOrKill"] = 7] = "FillOrKill";
})(SnbcapitalOrderExpirationType || (SnbcapitalOrderExpirationType = {}));
//# sourceMappingURL=snbcapital-order-expiration.js.map