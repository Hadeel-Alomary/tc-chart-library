var DerayahOrderLastActionStatus = (function () {
    function DerayahOrderLastActionStatus(type, name, serverName) {
        this.type = type;
        this.name = name;
        this.serverName = serverName;
    }
    DerayahOrderLastActionStatus.getAllStatus = function () {
        if (DerayahOrderLastActionStatus.allStatus.length == 0) {
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.NotSentToExchangeCode, 'تحت المعاينة', 'N'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode, 'أرسلت', 'Y'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.AcknowledgeAfterFetch, 'أرسلت', 'K'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.SendToExchangeCode, 'تم  القبول', 'A'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.Rejected, 'رفضت', 'R'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.Void, 'ملغي', 'V'));
        }
        return DerayahOrderLastActionStatus.allStatus;
    };
    DerayahOrderLastActionStatus.getStatusByType = function (type) {
        return DerayahOrderLastActionStatus.getAllStatus().find(function (item) { return item.type == type; });
    };
    DerayahOrderLastActionStatus.getStatusByServerName = function (serverName) {
        return DerayahOrderLastActionStatus.getAllStatus().find(function (item) { return item.serverName == serverName; });
    };
    DerayahOrderLastActionStatus.allStatus = [];
    return DerayahOrderLastActionStatus;
}());
export { DerayahOrderLastActionStatus };
export var DerayahOrderLastActionStatusType;
(function (DerayahOrderLastActionStatusType) {
    DerayahOrderLastActionStatusType[DerayahOrderLastActionStatusType["NotSentToExchangeCode"] = 0] = "NotSentToExchangeCode";
    DerayahOrderLastActionStatusType[DerayahOrderLastActionStatusType["FetchedToBeSentToExchangeCode"] = 1] = "FetchedToBeSentToExchangeCode";
    DerayahOrderLastActionStatusType[DerayahOrderLastActionStatusType["AcknowledgeAfterFetch"] = 2] = "AcknowledgeAfterFetch";
    DerayahOrderLastActionStatusType[DerayahOrderLastActionStatusType["SendToExchangeCode"] = 3] = "SendToExchangeCode";
    DerayahOrderLastActionStatusType[DerayahOrderLastActionStatusType["Rejected"] = 4] = "Rejected";
    DerayahOrderLastActionStatusType[DerayahOrderLastActionStatusType["Void"] = 5] = "Void";
})(DerayahOrderLastActionStatusType || (DerayahOrderLastActionStatusType = {}));
//# sourceMappingURL=derayah-order-last-action-status.js.map