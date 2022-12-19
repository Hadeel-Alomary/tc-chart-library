var SnbcapitalOrderStatusGroup = (function () {
    function SnbcapitalOrderStatusGroup(type, name) {
        this.type = type;
        this.name = name;
    }
    SnbcapitalOrderStatusGroup.getAllGroups = function () {
        if (SnbcapitalOrderStatusGroup.allGroups.length == 0) {
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.All, 'الكل'));
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.Active, 'فعال'));
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.Filled, 'منفذ'));
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.Cancelled, 'ملغي'));
        }
        return SnbcapitalOrderStatusGroup.allGroups;
    };
    SnbcapitalOrderStatusGroup.getByType = function (type) {
        return SnbcapitalOrderStatusGroup.getAllGroups().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderStatusGroup.allGroups = [];
    SnbcapitalOrderStatusGroup.allActions = [];
    return SnbcapitalOrderStatusGroup;
}());
export { SnbcapitalOrderStatusGroup };
export var SnbcapitalOrderStatusGroupType;
(function (SnbcapitalOrderStatusGroupType) {
    SnbcapitalOrderStatusGroupType[SnbcapitalOrderStatusGroupType["All"] = 0] = "All";
    SnbcapitalOrderStatusGroupType[SnbcapitalOrderStatusGroupType["Active"] = 1] = "Active";
    SnbcapitalOrderStatusGroupType[SnbcapitalOrderStatusGroupType["Filled"] = 2] = "Filled";
    SnbcapitalOrderStatusGroupType[SnbcapitalOrderStatusGroupType["Cancelled"] = 3] = "Cancelled";
})(SnbcapitalOrderStatusGroupType || (SnbcapitalOrderStatusGroupType = {}));
//# sourceMappingURL=snbcapital-order-status-group.js.map