import { CrossHairType } from './CrossHair';
import { Animation } from './Graphics/Animation';
import { HtmlUtil } from './Utils/HtmlUtil';
import { BrowserUtils } from '../../utils';
var Class = {
    HOR_LINE: 'scxCrossHairHorLine',
    VER_LINE: 'scxCrossHairVerLine',
    MARKER: 'scxCrossHairMarker',
    DATE_MARKER: 'scxCrossHairDateMarker',
    VALUE_MARKER: 'scxCrossHairValueMarker',
    CROSS_HAIR: 'scxCrossHair',
    ADD_CONTROL: 'scxAddControl'
};
Object.freeze(Class);
var CrossHairView = (function () {
    function CrossHairView(crossHair) {
        this._position = null;
        this._prevPosition = {};
        this._positionAnimation = new Animation({
            context: this,
            recurring: false,
            callback: this.updatePosition
        });
        this._crossHair = crossHair;
    }
    Object.defineProperty(CrossHairView.prototype, "chart", {
        get: function () {
            return this._crossHair.chart;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CrossHairView.prototype, "rootDiv", {
        get: function () {
            return this.chart.rootDiv;
        },
        enumerable: false,
        configurable: true
    });
    CrossHairView._applyMarkerTheme = function (control, theme, axisTextTheme) {
        if (BrowserUtils.isMobile()) {
            theme.text.fontStyle = 'bold';
        }
        var markerTextTheme = {
            fillColor: theme.text.fillColor,
            fontSize: axisTextTheme.fontSize,
            fontFamily: axisTextTheme.fontFamily,
            fontStyle: axisTextTheme.fontStyle
        };
        control.scxTextStyle(markerTextTheme).scxFill(theme.fill);
    };
    CrossHairView._updateValueMarkerMetrics = function (marker) {
        var $control = marker.$control;
        if (!$control.text())
            $control.text('1');
        marker.halfHeight = $control.height() / 2;
    };
    CrossHairView._updateAddControlMetrics = function (marker) {
        var $control = marker.$control;
        marker.halfHeight = $control.height() / 2;
    };
    CrossHairView._updateDateMarkerMetrics = function (marker, formattedDate) {
        var $control = marker.$control;
        $control.text(formattedDate).width('auto');
        var width = Math.round($control.width() * 1.2);
        marker.halfWidth = Math.round(width / 2);
        $control.width(width);
    };
    CrossHairView.prototype._createValueMarker = function () {
        return {
            visible: true,
            halfHeight: 0,
            $control: this.rootDiv.scxAppend('span', [Class.MARKER, Class.VALUE_MARKER])
        };
    };
    CrossHairView.prototype._createControls = function () {
        var _this = this;
        var parent = this.rootDiv;
        this._controls = {
            lines: {
                visible: true,
                $horLine: parent.scxAppend('div', Class.HOR_LINE),
                $verLine: parent.scxAppend('div', Class.VER_LINE),
            },
            leftMarkers: [],
            rightMarkers: [],
            topMarker: {
                visible: true,
                halfWidth: 0,
                $control: parent.scxAppend('span', [Class.MARKER, Class.DATE_MARKER]),
            },
            bottomMarker: {
                visible: true,
                halfWidth: 0,
                $control: parent.scxAppend('span', [Class.MARKER, Class.DATE_MARKER]),
            }
        };
        if (BrowserUtils.isDesktop()) {
            this._controls.rightAddControl = {
                visible: BrowserUtils.isDesktop(),
                halfHeight: 0,
                $control: parent.scxAppend('span', [Class.ADD_CONTROL]),
            };
            this._controls.rightAddControl.$control.click(function (eventObject) {
                crossHair.showTradingContextMenu(eventObject, _this.getAddControlPrice(_this._controls.rightAddControl), _this.getPanelIndex(_this._controls.rightAddControl));
            });
        }
        var crossHair = this._crossHair;
        this._crossHair.applyTheme();
        this.updateVisibility(false);
    };
    CrossHairView.prototype._syncValueMarkers = function () {
        var leftMarkers = this._controls.leftMarkers, rightMarkers = this._controls.rightMarkers, scales = this.chart.valueScales, overhead = leftMarkers.length - scales.length;
        if (overhead > 0) {
            leftMarkers.splice(-overhead, overhead);
            rightMarkers.splice(-overhead, overhead);
        }
        else if (overhead < 0) {
            for (var i = 0; i < -overhead; i++) {
                leftMarkers.push(this._createValueMarker());
                rightMarkers.push(this._createValueMarker());
            }
            this._crossHair.applyTheme();
            this.updateVisibility(false);
        }
    };
    CrossHairView.prototype.layout = function () {
        var chart = this.chart;
        if (!this._controls) {
            this._createControls();
        }
        this._syncValueMarkers();
        var controls = this._controls, panelsFrame = chart.chartPanelsContainer.panelsContentFrame;
        controls.lines.$horLine
            .css('left', panelsFrame.left)
            .width(panelsFrame.width);
        controls.lines.$verLine
            .css('top', panelsFrame.top)
            .height(panelsFrame.height);
        var valueScales = chart.valueScales;
        for (var i = 0; i < valueScales.length; i++) {
            var leftFrame = valueScales[i].leftPanel.frame;
            if (leftFrame) {
                controls.leftMarkers[i].$control
                    .css('left', leftFrame.left + 1)
                    .outerWidth(leftFrame.width - 2);
            }
            var rightFrame = valueScales[i].rightPanel.frame;
            if (rightFrame) {
                controls.rightMarkers[i].$control
                    .css('left', rightFrame.left + 1)
                    .outerWidth(rightFrame.width - 2);
            }
            if (controls.rightAddControl) {
                controls.rightAddControl.$control
                    .css('left', rightFrame.left - 17)
                    .outerWidth(15)
                    .outerHeight(15);
            }
        }
        var dateScale = chart.dateScale, topFrame = dateScale.topPanel.frame;
        if (topFrame) {
            controls.topMarker.$control
                .css('top', topFrame.top + 1)
                .outerHeight(topFrame.height - 2)
                .css('line-height', topFrame.height - 2 + 'px');
        }
        var bottomFrame = dateScale.bottomPanel.frame;
        if (bottomFrame) {
            controls.bottomMarker.$control
                .css('top', bottomFrame.top + 1)
                .outerHeight(bottomFrame.height - 2)
                .css('line-height', bottomFrame.height - 2 + 'px');
        }
    };
    CrossHairView.prototype.applyTheme = function (theme) {
        var controls = this._controls;
        controls.lines.$horLine.scxBorder('border-top', theme.line);
        controls.lines.$verLine.scxBorder('border-left', theme.line);
        for (var _i = 0, _a = controls.leftMarkers; _i < _a.length; _i++) {
            var marker = _a[_i];
            CrossHairView._applyMarkerTheme(marker.$control, theme, this.chart.theme.valueScale.text);
        }
        for (var _b = 0, _c = controls.rightMarkers; _b < _c.length; _b++) {
            var marker = _c[_b];
            CrossHairView._applyMarkerTheme(marker.$control, theme, this.chart.theme.valueScale.text);
        }
        CrossHairView._applyMarkerTheme(controls.topMarker.$control, theme, this.chart.theme.dateScale.text);
        CrossHairView._applyMarkerTheme(controls.bottomMarker.$control, theme, this.chart.theme.dateScale.text);
        this.updateMarkers();
    };
    CrossHairView.prototype.updateVisibility = function (isVisible) {
        var controls = this._controls;
        if (!controls)
            return;
        var crossHairType = this._crossHair.crossHairType;
        isVisible = this._crossHair.visible && !!isVisible && crossHairType !== CrossHairType.NONE;
        if (isVisible && crossHairType === CrossHairType.CROSS)
            this.rootDiv.addClass(Class.CROSS_HAIR);
        else
            this.rootDiv.removeClass(Class.CROSS_HAIR);
        var isMarkerVisible = isVisible && crossHairType !== CrossHairType.NONE, valueScales = this.chart.valueScales;
        for (var i = 0; i < valueScales.length; i++) {
            if (i >= controls.leftMarkers.length)
                break;
            var showLeft = isMarkerVisible && valueScales[i].leftPanelVisible, showRight = isMarkerVisible && valueScales[i].rightPanelVisible;
            controls.leftMarkers[i].visible = showLeft;
            controls.rightMarkers[i].visible = showRight;
            HtmlUtil.setVisibility(controls.leftMarkers[i].$control, showLeft);
            HtmlUtil.setVisibility(controls.rightMarkers[i].$control, showRight);
        }
        var showLines = controls.lines.visible = isVisible && crossHairType === CrossHairType.CROSS;
        HtmlUtil.setVisibility(controls.lines.$horLine, showLines);
        HtmlUtil.setVisibility(controls.lines.$verLine, showLines);
        var dateScale = this.chart.dateScale, showTop = controls.topMarker.visible = isMarkerVisible && dateScale.topPanelVisible, showBottom = controls.bottomMarker.visible = isMarkerVisible && dateScale.bottomPanelVisible;
        HtmlUtil.setVisibility(controls.topMarker.$control, showTop);
        HtmlUtil.setVisibility(controls.bottomMarker.$control, showBottom);
        if (controls.rightAddControl) {
            controls.rightAddControl.visible = isMarkerVisible;
            this.toggleAddControlVisibilityOnPositionChange();
        }
    };
    CrossHairView.prototype.toggleAddControlVisibilityOnPositionChange = function () {
        var controls = this._controls;
        if (!controls || !controls.rightAddControl)
            return;
        var showAddControl = this.chart.isInteractive && controls.rightAddControl.visible;
        var isAddControlShown = HtmlUtil.isHidden(controls.rightAddControl.$control);
        if (showAddControl !== isAddControlShown) {
            HtmlUtil.setVisibility(controls.rightAddControl.$control, showAddControl);
        }
    };
    CrossHairView.prototype.isInMainPanel = function () {
        if (!this._position) {
            return false;
        }
        var panel = this.chart.findPanelAt(this._position.y);
        if (!panel) {
            return false;
        }
        return this.chart.mainPanel.getIndex() == this.chart.findPanelAt(this._position.y).getIndex();
    };
    CrossHairView.prototype.setPosition = function (point, animated) {
        this._position = point;
        if (animated) {
            this._positionAnimation.start();
        }
        else {
            this.updatePosition();
        }
    };
    CrossHairView.prototype.updatePosition = function (force) {
        if (!this._positionAnimation)
            return;
        this._positionAnimation.stop();
        var point = this._position;
        if (!point)
            return;
        var chart = this.chart, panel = chart.findPanelAt(point.y);
        if (!panel)
            return;
        this.toggleAddControlVisibilityOnPositionChange();
        var controls = this._controls, prevPos = this._prevPosition;
        if (prevPos.x !== point.x || force === true) {
            prevPos.x = point.x;
            if (controls.lines.visible)
                controls.lines.$verLine.css('left', point.x);
            var topMarker = controls.topMarker, bottomMarker = controls.bottomMarker;
            if (topMarker.visible || bottomMarker.visible) {
                var dateScale = chart.dateScale, projection = dateScale.projection, date = projection.dateByColumn(projection.columnByX(point.x)), dateText = dateScale.formatDate(date);
                this._updateDateMarker(topMarker, dateText);
                this._updateDateMarker(bottomMarker, dateText);
            }
        }
        if (prevPos.y !== point.y || force === true) {
            prevPos.y = point.y;
            if (controls.lines.visible)
                controls.lines.$horLine.css('top', point.y);
            var valueScales = chart.valueScales, y = point.y - panel.frame.top - chart.chartPanelsContainer.frame.top;
            if (controls.rightAddControl) {
                this._updateAddControl(controls.rightAddControl);
            }
            for (var i = 0; i < valueScales.length; i++) {
                var leftMarker = controls.leftMarkers[i], rightMarker = controls.rightMarkers[i];
                if (!leftMarker.visible && !rightMarker.visible)
                    continue;
                var scale = panel.valueScales[i], value = scale.projection.valueByY(y), valueText = scale.formatValue(value);
                this._updateValueMarker(leftMarker, valueText);
                this._updateValueMarker(rightMarker, valueText);
            }
        }
    };
    CrossHairView.prototype.updateMarkers = function () {
        var controls = this._controls;
        if (!controls)
            return;
        for (var _i = 0, _a = controls.leftMarkers; _i < _a.length; _i++) {
            var marker = _a[_i];
            CrossHairView._updateValueMarkerMetrics(marker);
        }
        for (var _b = 0, _c = controls.rightMarkers; _b < _c.length; _b++) {
            var marker = _c[_b];
            CrossHairView._updateValueMarkerMetrics(marker);
        }
        var date = this.chart.dateScale.formatDate(new Date(0));
        CrossHairView._updateDateMarkerMetrics(controls.topMarker, date);
        CrossHairView._updateDateMarkerMetrics(controls.bottomMarker, date);
        if (controls.rightAddControl) {
            CrossHairView._updateAddControlMetrics(controls.rightAddControl);
        }
    };
    CrossHairView.prototype._updateValueMarker = function (marker, text) {
        if (marker.visible) {
            marker.$control
                .text(text)
                .css('top', this._position.y - marker.halfHeight);
        }
    };
    CrossHairView.prototype._updateAddControl = function (marker) {
        if (marker.visible) {
            marker.$control.css('top', this._position.y - marker.halfHeight);
        }
    };
    CrossHairView.prototype._updateDateMarker = function (marker, text) {
        if (marker.visible) {
            var chartWidth = this.rootDiv.width(), left = this._position.x > (chartWidth - marker.halfWidth)
                ? chartWidth - 2 * marker.halfWidth
                : this._position.x - marker.halfWidth;
            marker.$control
                .text(text)
                .css('left', Math.max(left, 0));
        }
    };
    CrossHairView.prototype.getPanelIndex = function (marker) {
        var y = +marker.$control.css('top').replace('px', '') + marker.halfHeight;
        return this.chart.findPanelAt(y).getIndex();
    };
    CrossHairView.prototype.getAddControlPrice = function (marker) {
        var y = +marker.$control.css('top').replace('px', '') + marker.halfHeight;
        var panel = this.chart.findPanelAt(y);
        return panel.valueScales[0].projection.valueByY(y - panel.frame.top - this.chart.chartPanelsContainer.frame.top);
    };
    CrossHairView.prototype.destroy = function () {
        var controls = this._controls;
        controls.lines.$horLine.remove();
        controls.lines.$verLine.remove();
        controls.topMarker.$control.remove();
        controls.bottomMarker.$control.remove();
        for (var _i = 0, _a = controls.leftMarkers; _i < _a.length; _i++) {
            var marker = _a[_i];
            marker.$control.remove();
        }
        for (var _b = 0, _c = controls.rightMarkers; _b < _c.length; _b++) {
            var marker = _c[_b];
            marker.$control.remove();
        }
        this._controls = null;
    };
    return CrossHairView;
}());
export { CrossHairView };
//# sourceMappingURL=CrossHairView.js.map