var DerayahOrderStatusGroup = (function () {
    function DerayahOrderStatusGroup(type, name) {
        this.type = type;
        this.name = name;
    }
    DerayahOrderStatusGroup.getAllGroups = function () {
        if (DerayahOrderStatusGroup.allGroups.length == 0) {
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.All, 'الكل'));
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.OutStanding, 'قائم'));
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.Executed, 'المنفذ'));
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.Closed, 'المغلق'));
        }
        return DerayahOrderStatusGroup.allGroups;
    };
    DerayahOrderStatusGroup.getByType = function (type) {
        return DerayahOrderStatusGroup.getAllGroups().find(function (item) { return item.type == type; });
    };
    DerayahOrderStatusGroup.allGroups = [];
    DerayahOrderStatusGroup.allActions = [];
    return DerayahOrderStatusGroup;
}());
export { DerayahOrderStatusGroup };
export var DerayahOrderStatusGroupType;
(function (DerayahOrderStatusGroupType) {
    DerayahOrderStatusGroupType[DerayahOrderStatusGroupType["All"] = 0] = "All";
    DerayahOrderStatusGroupType[DerayahOrderStatusGroupType["OutStanding"] = 1] = "OutStanding";
    DerayahOrderStatusGroupType[DerayahOrderStatusGroupType["Executed"] = 2] = "Executed";
    DerayahOrderStatusGroupType[DerayahOrderStatusGroupType["Closed"] = 3] = "Closed";
})(DerayahOrderStatusGroupType || (DerayahOrderStatusGroupType = {}));
//# sourceMappingURL=derayah-order-status-group.js.map