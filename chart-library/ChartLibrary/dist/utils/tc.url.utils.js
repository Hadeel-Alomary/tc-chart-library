import { SecurityUtils } from './security.utils';
var TcUrlUtils = (function () {
    function TcUrlUtils() {
    }
    TcUrlUtils.url = function (url) {
        var randomNumberAsString = 'rand=' + Math.round(Math.random() * 1000000000);
        if (url.includes('?')) {
            url += '&' + randomNumberAsString;
        }
        else {
            url += '?' + randomNumberAsString;
        }
        url = TcUrlUtils.hashUrl(url);
        return url;
    };
    TcUrlUtils.hashUrl = function (url) {
        var urlWithoutHostName = url.replace(new RegExp('^https?://'), '');
        urlWithoutHostName = urlWithoutHostName.replace(urlWithoutHostName.substr(0, urlWithoutHostName.indexOf('/')), '');
        var hValue = SecurityUtils.h(urlWithoutHostName);
        url += '&h=' + hValue;
        return url;
    };
    return TcUrlUtils;
}());
export { TcUrlUtils };
//# sourceMappingURL=tc.url.utils.js.map