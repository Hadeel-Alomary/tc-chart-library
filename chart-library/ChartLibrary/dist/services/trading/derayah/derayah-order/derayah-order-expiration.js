var DerayahOrderExpiration = (function () {
    function DerayahOrderExpiration(type, name, tillDate) {
        this.type = type;
        this.name = name;
        this.tillDate = tillDate;
    }
    DerayahOrderExpiration.getAllTypes = function () {
        if (!DerayahOrderExpiration.allTypes) {
            DerayahOrderExpiration.allTypes = [];
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.Day, 'يوم', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.FillOrKill, 'تنفيذ أو إالغاء', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.FillAndKill, 'تنفيذ و إلغاء', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.PreOpen, 'عند الافتتاح', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.GoodTillDate, 'حتى تاريخ', null));
        }
        return DerayahOrderExpiration.allTypes;
    };
    DerayahOrderExpiration.getOrderExpirationByType = function (type) {
        return DerayahOrderExpiration.getAllTypes().find(function (item) { return item.type == type; });
    };
    DerayahOrderExpiration.getOrderExpirationByTypeAsString = function (type) {
        return DerayahOrderExpiration.getOrderExpirationByType(type);
    };
    return DerayahOrderExpiration;
}());
export { DerayahOrderExpiration };
export var DerayahOrderExpirationType;
(function (DerayahOrderExpirationType) {
    DerayahOrderExpirationType[DerayahOrderExpirationType["Day"] = 1] = "Day";
    DerayahOrderExpirationType[DerayahOrderExpirationType["FillOrKill"] = 2] = "FillOrKill";
    DerayahOrderExpirationType[DerayahOrderExpirationType["FillAndKill"] = 3] = "FillAndKill";
    DerayahOrderExpirationType[DerayahOrderExpirationType["PreOpen"] = 4] = "PreOpen";
    DerayahOrderExpirationType[DerayahOrderExpirationType["GoodTillDate"] = 6] = "GoodTillDate";
})(DerayahOrderExpirationType || (DerayahOrderExpirationType = {}));
//# sourceMappingURL=derayah-order-expiration.js.map