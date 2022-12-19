var SnbcapitalOrderLastActionStatus = (function () {
    function SnbcapitalOrderLastActionStatus(type, name, serverName) {
        this.type = type;
        this.name = name;
        this.serverName = serverName;
    }
    SnbcapitalOrderLastActionStatus.getAllStatus = function () {
        if (SnbcapitalOrderLastActionStatus.allStatus.length == 0) {
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.NotSentToExchangeCode, 'تحت المعاينة', 'N'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.FetchedToBeSentToExchangeCode, 'أرسلت', 'Y'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.AcknowledgeAfterFetch, 'أرسلت', 'K'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.SendToExchangeCode, 'تم  القبول', 'A'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.Rejected, 'رفضت', 'R'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.Void, 'ملغي', 'V'));
        }
        return SnbcapitalOrderLastActionStatus.allStatus;
    };
    SnbcapitalOrderLastActionStatus.getStatusByType = function (type) {
        return SnbcapitalOrderLastActionStatus.getAllStatus().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderLastActionStatus.getStatusByServerName = function (serverName) {
        return SnbcapitalOrderLastActionStatus.getAllStatus().find(function (item) { return item.serverName == serverName; });
    };
    SnbcapitalOrderLastActionStatus.allStatus = [];
    return SnbcapitalOrderLastActionStatus;
}());
export { SnbcapitalOrderLastActionStatus };
export var SnbcapitalOrderLastActionStatusType;
(function (SnbcapitalOrderLastActionStatusType) {
    SnbcapitalOrderLastActionStatusType[SnbcapitalOrderLastActionStatusType["NotSentToExchangeCode"] = 0] = "NotSentToExchangeCode";
    SnbcapitalOrderLastActionStatusType[SnbcapitalOrderLastActionStatusType["FetchedToBeSentToExchangeCode"] = 1] = "FetchedToBeSentToExchangeCode";
    SnbcapitalOrderLastActionStatusType[SnbcapitalOrderLastActionStatusType["AcknowledgeAfterFetch"] = 2] = "AcknowledgeAfterFetch";
    SnbcapitalOrderLastActionStatusType[SnbcapitalOrderLastActionStatusType["SendToExchangeCode"] = 3] = "SendToExchangeCode";
    SnbcapitalOrderLastActionStatusType[SnbcapitalOrderLastActionStatusType["Rejected"] = 4] = "Rejected";
    SnbcapitalOrderLastActionStatusType[SnbcapitalOrderLastActionStatusType["Void"] = 5] = "Void";
})(SnbcapitalOrderLastActionStatusType || (SnbcapitalOrderLastActionStatusType = {}));
//# sourceMappingURL=snbcapital-order-last-action-status.js.map