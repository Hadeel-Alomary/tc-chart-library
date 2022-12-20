var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { NotificationMethods, NotificationMethodType } from './notification-methods';
var VirtualTradingNotificationMethods = (function (_super) {
    __extends(VirtualTradingNotificationMethods, _super);
    function VirtualTradingNotificationMethods() {
        var _this = _super.call(this) || this;
        _this.setMethod(NotificationMethodType.APP, '');
        return _this;
    }
    VirtualTradingNotificationMethods.prototype.toRequestObject = function () {
        var result = [];
        for (var type in this.getMethods()) {
            result.push({
                method_type: NotificationMethodType[type],
                method_param: this.getMethods()[type]
            });
        }
        return result;
    };
    return VirtualTradingNotificationMethods;
}(NotificationMethods));
export { VirtualTradingNotificationMethods };
//# sourceMappingURL=virtual-trading-notification-methods.js.map