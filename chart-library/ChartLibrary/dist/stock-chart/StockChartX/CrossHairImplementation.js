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
import { ChartComponent } from "./Controls/ChartComponent";
import { CrossHairView } from "./CrossHairView";
import { ChartEvent } from "./Chart";
import { JsUtil } from "./Utils/JsUtil";
import { GestureState } from "./Gestures/Gesture";
import { CrossHairType } from "./CrossHair";
import { ChartSideContextMenu } from "../StockChartX.UI/ChartSideContextMenu";
import { ChartAccessorService } from '../../services/chart';
import { MathUtils } from '../../utils/math.utils';
var EVENTS_SUFFIX = '.scxCrossHair';
var CrossHairImplementation = (function (_super) {
    __extends(CrossHairImplementation, _super);
    function CrossHairImplementation(config) {
        var _this = _super.call(this, config) || this;
        _this._view = new CrossHairView(_this);
        _this._visible = true;
        _this._chartSideContextMenu = new ChartSideContextMenu({
            onItemSelected: function (menuItem, checked) {
                var isAlertItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.ALERT || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.ALERT;
                var isBuyItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.BUY || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.BUY;
                var isSellItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.SELL || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.SELL;
                var isStopItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.STOP || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.STOP;
                if (isAlertItem) {
                    _this.onAlertSelected();
                }
                else if (isBuyItem) {
                    _this.onBuySelected();
                }
                else if (isSellItem) {
                    _this.onSellSelected();
                }
                else if (isStopItem) {
                    _this.onStopSelected();
                }
            },
            onShow: function () {
                var isSymbolTradable = ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(_this.chart.instrument.symbol);
                var isStopSupported = ChartAccessorService.instance.getTradingService().isStopOrderSupportedByBroker();
                var isViewInMainPanel = _this._view.isInMainPanel();
                var market = null;
                var priceStep = null;
                var tradingPrice = MathUtils.roundToNearestStep(_this._currentPositionPrice, priceStep);
                if (isSymbolTradable && isViewInMainPanel) {
                    _this._chartSideContextMenu.showTradingOptions(_this._currentPositionPrice, tradingPrice);
                }
                else {
                    _this._chartSideContextMenu.hideTradingOptions();
                }
                if (isStopSupported && isSymbolTradable && isViewInMainPanel) {
                    _this._chartSideContextMenu.showStopOption();
                }
                else {
                    _this._chartSideContextMenu.hideStopOption();
                }
            }
        });
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(CrossHairImplementation.prototype, "crossHairType", {
        get: function () {
            return this._options.crossHairType;
        },
        set: function (type) {
            var oldType = this._options.crossHairType;
            if (oldType !== type) {
                this._options.crossHairType = type;
                this._view.updateVisibility();
                this.chart.fireValueChanged(ChartEvent.CROSS_HAIR_CHANGED, type, oldType);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossHairImplementation.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
        },
        enumerable: true,
        configurable: true
    });
    CrossHairImplementation.prototype.onAlertSelected = function () {
        this.chart.fireValueChanged(ChartEvent.ADD_ALERT, { price: this._currentPositionPrice, panelIndex: this._currentPositionPanelIndex });
    };
    CrossHairImplementation.prototype.onBuySelected = function () {
        if (!ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(this.chart.instrument.symbol)) {
            return;
        }
        this.chart.fireValueChanged(ChartEvent.BUY_SYMBOL, this._currentPositionPrice);
    };
    CrossHairImplementation.prototype.onSellSelected = function () {
        if (!ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(this.chart.instrument.symbol)) {
            return;
        }
        this.chart.fireValueChanged(ChartEvent.SELL_SYMBOL, this._currentPositionPrice);
    };
    CrossHairImplementation.prototype.onStopSelected = function () {
        if (!ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(this.chart.instrument.symbol)) {
            return;
        }
        this.chart.fireValueChanged(ChartEvent.STOP_SYMBOL, this._currentPositionPrice);
    };
    CrossHairImplementation.prototype.showTradingContextMenu = function (e, price, panelIndex) {
        this._currentPositionPrice = MathUtils.roundAccordingMarket(price, this.chart.instrument.symbol);
        this._currentPositionPanelIndex = panelIndex;
        this._chartSideContextMenu.show(e);
    };
    CrossHairImplementation.prototype._subscribeEvents = function () {
        var _this = this;
        _super.prototype._subscribeEvents.call(this);
        this.chart
            .on(ChartEvent.THEME_CHANGED + EVENTS_SUFFIX, function () {
            _this.applyTheme();
        })
            .on(ChartEvent.LOCALE_CHANGED + EVENTS_SUFFIX, function () {
            _this.update();
        })
            .on(ChartEvent.TIME_INTERVAL_CHANGED + EVENTS_SUFFIX, function () {
            _this.update();
        });
    };
    CrossHairImplementation.prototype._unsubscribeEvents = function () {
        this.chart.off(EVENTS_SUFFIX);
        _super.prototype._unsubscribeEvents.call(this);
    };
    CrossHairImplementation.prototype.layout = function () {
        this._view.layout();
    };
    CrossHairImplementation.prototype.applyTheme = function () {
        var theme = this.chart.theme.crossHair;
        this._view.applyTheme(theme);
    };
    CrossHairImplementation.prototype.update = function () {
        this._view.updateMarkers();
        this._view.updatePosition(true);
    };
    CrossHairImplementation.prototype.show = function () {
        this.visible = true;
        this._view.updatePosition(true);
        this._view.updateVisibility(true);
    };
    CrossHairImplementation.prototype.hide = function () {
        this.visible = false;
        this._view.updateVisibility(false);
    };
    CrossHairImplementation.prototype.saveState = function () {
        return JsUtil.clone(this._options);
    };
    CrossHairImplementation.prototype.loadState = function (state) {
        this._options = {};
        this.crossHairType = (state && state.crossHairType) || CrossHairType.NONE;
    };
    CrossHairImplementation.prototype.setPosition = function (point, animated) {
        this._view.setPosition(point, animated);
    };
    CrossHairImplementation.prototype.handleMouseHoverGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._view.updateVisibility(true);
                break;
            case GestureState.FINISHED:
                this._view.updateVisibility(false);
                break;
            case GestureState.CONTINUED:
                if (this.crossHairType !== CrossHairType.NONE)
                    this.setPosition(event.pointerPosition, true);
                break;
        }
    };
    CrossHairImplementation.prototype.draw = function () {
    };
    CrossHairImplementation.prototype.destroy = function () {
        this._view.destroy();
        _super.prototype.destroy.call(this);
    };
    return CrossHairImplementation;
}(ChartComponent));
export { CrossHairImplementation };
//# sourceMappingURL=CrossHairImplementation.js.map