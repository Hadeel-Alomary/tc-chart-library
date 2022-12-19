var Class = {
    CONTAINER: 'scxWaitingBarContainer',
    LOADING_TEXT: 'scxWaitingBarText',
    DOTS_CONTAINER: 'scxDotsContainer',
    DOT: 'scxWaitingBarDot'
};
var WaitingBar = (function () {
    function WaitingBar(container) {
        this._isWorkingNow = false;
        this._parentContainer = container;
    }
    WaitingBar.prototype.show = function (config) {
        if (this._isWorkingNow)
            return;
        this._config = $.extend({
            text: "Loading...",
            dotsCount: 7
        }, config);
        this._isWorkingNow = true;
        this._createDom();
        this._container.show();
    };
    WaitingBar.prototype.hide = function () {
        this._isWorkingNow = false;
        this._destroy();
    };
    WaitingBar.prototype._createDom = function () {
        this._container = $("<div class=\"".concat(Class.CONTAINER, "\"></div>"))
            .appendTo(this._parentContainer);
        $("<span class=\"".concat(Class.LOADING_TEXT, "\">").concat(this._config.text, "</span>"))
            .appendTo(this._container);
        var dotsContainer = $("<div class=\"".concat(Class.DOTS_CONTAINER, "\"></div>"))
            .appendTo(this._container);
        var dots = [];
        for (var i = 0; i < this._config.dotsCount; i++)
            dots.push($("<div class=\"".concat(Class.DOT, "\"></div>")));
        dotsContainer.append(dots);
    };
    WaitingBar.prototype._destroy = function () {
        this._container.remove();
        this._container = null;
    };
    return WaitingBar;
}());
export { WaitingBar };
//# sourceMappingURL=WaitingBar.js.map