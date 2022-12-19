var BrowserUtils = (function () {
    function BrowserUtils() {
    }
    BrowserUtils.getUserAgent = function () {
        return window.navigator.userAgent;
    };
    BrowserUtils.isMac = function () {
        return BrowserUtils.getUserAgent().includes("Mac");
    };
    BrowserUtils.isIPhone = function () {
        return /iPhone/.test(navigator.userAgent) && !window.MSStream;
    };
    BrowserUtils.isMobile = function () {
        if (this.mobileBrowser == null) {
            this.mobileBrowser = this.checkMobileBrowser();
        }
        return this.mobileBrowser;
    };
    BrowserUtils.isDesktop = function () {
        return !this.isMobile();
    };
    BrowserUtils.isMobileScreenDimensions = function () {
        return BrowserUtils.isMobile() && !BrowserUtils.isWideScreen();
    };
    BrowserUtils.isWideScreen = function () {
        return 600 <= screen.width;
    };
    BrowserUtils.checkMobileBrowser = function () {
        return window.mobileCheck();
    };
    ;
    BrowserUtils.mobileBrowser = null;
    return BrowserUtils;
}());
export { BrowserUtils };
//# sourceMappingURL=browser.utils.js.map