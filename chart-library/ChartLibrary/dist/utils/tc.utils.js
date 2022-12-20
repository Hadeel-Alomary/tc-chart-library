import { TcTracker } from './tc-tracker';
import { TcUrlUtils } from './tc.url.utils';
import { EnumUtils } from './enum.utils';
var cloneDeep = require("lodash/cloneDeep");
var Tc = (function () {
    function Tc() {
    }
    Tc._2digits = function (num) {
        return Math.round(num * 100) / 100;
    };
    Tc.assert = function (flag, message) {
        if (!flag) {
            throw new Error(message);
        }
    };
    Tc.warn = function (message) {
        console.log("WARN: " + message);
        TcTracker.trackMessage("WARN: " + message);
    };
    Tc.error = function (error) {
        if (typeof error == "string") {
            throw new Error(error);
        }
        throw error;
    };
    Tc.fatalExit = function (message) {
        TcTracker.trackUrgentMessage("fatal exit: " + message);
    };
    Tc.info = function (message) {
        console.log("INFO: " + message);
    };
    Tc.url = function (url) {
        return TcUrlUtils.url(url);
    };
    Tc.enumValues = function (enumType) {
        return EnumUtils.enumValues(enumType);
    };
    Tc.enumString = function (enumType, enumValue) {
        return EnumUtils.enumValueToString(enumType, enumValue);
    };
    Tc.getBrowserVersion = function () {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null)
                return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null)
            M.splice(1, 1, tem[1]);
        return M.join(' ');
    };
    Tc.getParameterByName = function (name, url) {
        if (url === void 0) { url = null; }
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    Tc.debug = function (message, color) {
        color = color || '#f00';
        console.log("%c" + message, "color: " + color);
    };
    return Tc;
}());
export { Tc };
//# sourceMappingURL=tc.utils.js.map