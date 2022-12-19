import { EnumUtils } from '../../utils/enum.utils';
var NotificationMethods = (function () {
    function NotificationMethods() {
        this.methods = {};
        this.methods[NotificationMethodType.APP] = 'True-0';
    }
    NotificationMethods.fromResponseData = function (response) {
        var methods = new NotificationMethods();
        for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
            var responseObject = response_1[_i];
            methods.setMethod(EnumUtils.enumStringToValue(NotificationMethodType, responseObject.method_type), responseObject.method_param);
        }
        return methods;
    };
    NotificationMethods.prototype.getMethods = function () {
        return this.methods;
    };
    NotificationMethods.prototype.setMethod = function (type, param) {
        this.methods[type] = param;
    };
    NotificationMethods.prototype.removeMethod = function (type) {
        delete this.methods[type];
    };
    NotificationMethods.prototype.getParam = function (type) {
        return this.methods[type];
    };
    NotificationMethods.prototype.sendEmail = function () {
        return NotificationMethodType.EMAIL in this.methods && this.methods[NotificationMethodType.EMAIL] != null && this.methods[NotificationMethodType.EMAIL] != '';
    };
    NotificationMethods.prototype.sendSMS = function () {
        return NotificationMethodType.SMS in this.methods && this.methods[NotificationMethodType.SMS] != null && this.methods[NotificationMethodType.SMS] != '';
    };
    NotificationMethods.prototype.sendMobileNotification = function () {
        return NotificationMethodType.MOBILE in this.methods && this.methods[NotificationMethodType.MOBILE] == '1';
    };
    NotificationMethods.prototype.toRequestObject = function () {
        var result = [];
        for (var type in this.methods) {
            result.push({
                type: NotificationMethodType[type],
                param: this.methods[type]
            });
        }
        return result;
    };
    return NotificationMethods;
}());
export { NotificationMethods };
export var NotificationMethodType;
(function (NotificationMethodType) {
    NotificationMethodType[NotificationMethodType["APP"] = 1] = "APP";
    NotificationMethodType[NotificationMethodType["EMAIL"] = 2] = "EMAIL";
    NotificationMethodType[NotificationMethodType["SMS"] = 3] = "SMS";
    NotificationMethodType[NotificationMethodType["MOBILE"] = 4] = "MOBILE";
})(NotificationMethodType || (NotificationMethodType = {}));
//# sourceMappingURL=notification-methods.js.map