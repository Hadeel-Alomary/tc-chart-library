import { Tc } from '../../utils';
var ProxiedUrlLoader = (function () {
    function ProxiedUrlLoader(baseProxyService) {
        this.baseProxyService = baseProxyService;
    }
    ProxiedUrlLoader.prototype.getProxyAppliedUrl = function (url) {
        var proxyServerUrl = this.baseProxyService.getProxyServerUrl();
        var dataUrl = Tc.url(url);
        return proxyServerUrl.length == 0 ? dataUrl : proxyServerUrl + encodeURIComponent(dataUrl);
    };
    return ProxiedUrlLoader;
}());
export { ProxiedUrlLoader };
//# sourceMappingURL=proxied-url-loader.js.map