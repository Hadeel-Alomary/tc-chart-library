var TradestationOrderExpiration = (function () {
    function TradestationOrderExpiration(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TradestationOrderExpiration.getAllTypes = function () {
        if (!TradestationOrderExpiration.allTypes) {
            TradestationOrderExpiration.allTypes = [];
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.Day, 'يوم', 'Day'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.DayPlus, 'يوم +', 'Day Plus'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTD, 'صالح لتاريخ', 'Good Through Date'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTDPlus, 'صالح لتاريخ +', 'Good Through Date Plus'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTC, 'صالح حتى الإلغاء', 'Good Till Cancelled'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTCPlus, 'صالح حتى الإلغاء +', 'Good Till Cancelled Plus'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.OPG, 'عند الإفتتاح', 'At The Opening'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.CLO, 'عند الإغلاق', 'On Close'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.IOC, 'فوري أو إلغاء', 'Immediate Or Cancel'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.FOK, 'تحقق كامل أو إلغاء', 'Fill Or Kill'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.OneMin, '1 دقيقة', '1 min'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.ThreeMin, '3 دقائق', '3 min'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.FiveMin, '5 دقائق', '5 min'));
        }
        return TradestationOrderExpiration.allTypes;
    };
    TradestationOrderExpiration.getOrderExpirationByType = function (type) {
        return TradestationOrderExpiration.getAllTypes().find(function (item) { return item.type == type; });
    };
    TradestationOrderExpiration.isGoodTillDate = function (type) {
        return type == TradestationOrderExpirationType.GTD || type == TradestationOrderExpirationType.GTDPlus;
    };
    TradestationOrderExpiration.convertExpirationType = function (type) {
        switch (type) {
            case TradestationOrderExpirationType.DayPlus:
                return 'DYP';
            case TradestationOrderExpirationType.GTDPlus:
                return 'GDP';
            case TradestationOrderExpirationType.GTCPlus:
                return 'GCP';
        }
    };
    return TradestationOrderExpiration;
}());
export { TradestationOrderExpiration };
export var TradestationOrderExpirationType;
(function (TradestationOrderExpirationType) {
    TradestationOrderExpirationType["Day"] = "DAY";
    TradestationOrderExpirationType["DayPlus"] = "DAY+";
    TradestationOrderExpirationType["GTD"] = "GTD";
    TradestationOrderExpirationType["GTDPlus"] = "GTD+";
    TradestationOrderExpirationType["GTC"] = "GTC";
    TradestationOrderExpirationType["GTCPlus"] = "GTC+";
    TradestationOrderExpirationType["OPG"] = "OPG";
    TradestationOrderExpirationType["CLO"] = "CLO";
    TradestationOrderExpirationType["IOC"] = "IOC";
    TradestationOrderExpirationType["FOK"] = "FOK";
    TradestationOrderExpirationType["OneMin"] = "1 min";
    TradestationOrderExpirationType["ThreeMin"] = "3 min";
    TradestationOrderExpirationType["FiveMin"] = "5 min";
})(TradestationOrderExpirationType || (TradestationOrderExpirationType = {}));
//# sourceMappingURL=tradestation-order-expiration.js.map