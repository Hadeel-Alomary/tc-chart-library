import { __extends } from "tslib";
import { ChartAccessorService, ChartTooltipType } from '../../../services/index';
import { DataRequesterTooltip } from './DataRequesterTooltip';
import { map } from 'rxjs/operators';
import { ChartEvent } from '../../StockChartX/Chart';
var IDS = {
    TABLE_ID: '#scxNewsTooltip',
    TEXT_ID: '#scxNewsTooltip-text',
    DETAILS_ANCHOR_ID: '#scxNewsTooltip-details-anchor'
};
var NewsTooltip = (function (_super) {
    __extends(NewsTooltip, _super);
    function NewsTooltip() {
        var _this = _super.call(this) || this;
        _this.width = 350;
        _this.height = 80;
        _this._initGestures();
        _this._initDetailsClickGesture();
        return _this;
    }
    Object.defineProperty(NewsTooltip, "instance", {
        get: function () {
            if (NewsTooltip._instance == null) {
                NewsTooltip._instance = new NewsTooltip();
            }
            return NewsTooltip._instance;
        },
        enumerable: false,
        configurable: true
    });
    NewsTooltip.prototype.getType = function () {
        return ChartTooltipType.News;
    };
    NewsTooltip.prototype.show = function (config) {
        if (this._config && this._config.newsId != config.newsId) {
            this.hide();
        }
        if (this.shown) {
            return;
        }
        this._config = config;
        this.showTooltip();
        this.requestData(this._config.newsId.toString());
    };
    NewsTooltip.prototype.hide = function () {
        if (this._isPointerInsideTooltip) {
            return;
        }
        this.shown = false;
        this.hideTable();
    };
    NewsTooltip.prototype.onDataCb = function (data) {
        this._appendDataToHTML(data);
    };
    NewsTooltip.prototype.getTooltipId = function () {
        return IDS.TABLE_ID;
    };
    NewsTooltip.prototype.hideTable = function () {
        $(IDS.TABLE_ID).removeClass('shown');
    };
    NewsTooltip.prototype.getRequestObservable = function () {
        return ChartAccessorService.instance.getNewsService().loadNewsTitle(this._config.newsId).pipe(map(function (title) { return title; }));
    };
    NewsTooltip.prototype.getTableId = function () {
        return IDS.TABLE_ID;
    };
    NewsTooltip.prototype._appendDataToHTML = function (text) {
        $(IDS.TEXT_ID).text(text);
    };
    NewsTooltip.prototype._setDimensions = function () {
        $(IDS.TABLE_ID).css('width', this.width + "px");
        $(IDS.TABLE_ID).css('height', this.height + "px");
    };
    NewsTooltip.prototype._initDetailsClickGesture = function () {
        var _this = this;
        $(document).on('click', IDS.DETAILS_ANCHOR_ID, function () {
            _this._config.chartPanel.chart.fireValueChanged(ChartEvent.SHOW_NEWS_DETAILS, _this._config.newsId);
        });
    };
    NewsTooltip.prototype._initGestures = function () {
        var self = this;
        $(document).on('mouseleave', this.getTableId(), function () {
            self._isPointerInsideTooltip = false;
            self.hide();
        });
        $(document).on('mouseenter', this.getTableId(), function () {
            self._isPointerInsideTooltip = true;
        });
    };
    NewsTooltip.prototype.showTooltip = function () {
        this.shown = true;
        this._setDimensions();
        this._appendDataToHTML('');
        $(IDS.TABLE_ID).addClass('shown');
        this.setPosition(this._config.chartPanel, this._config.mousePosition, "" + this.getTableId(), this.width);
    };
    NewsTooltip._instance = null;
    return NewsTooltip;
}(DataRequesterTooltip));
export { NewsTooltip };
//# sourceMappingURL=NewsTooltip.js.map