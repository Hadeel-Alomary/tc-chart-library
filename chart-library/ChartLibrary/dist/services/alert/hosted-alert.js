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
import { AbstractAlert } from './abstract-alert';
var HostedAlert = (function (_super) {
    __extends(HostedAlert, _super);
    function HostedAlert(id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, hostId) {
        var _this = _super.call(this, id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted) || this;
        _this.hostId = hostId;
        return _this;
    }
    return HostedAlert;
}(AbstractAlert));
export { HostedAlert };
//# sourceMappingURL=hosted-alert.js.map