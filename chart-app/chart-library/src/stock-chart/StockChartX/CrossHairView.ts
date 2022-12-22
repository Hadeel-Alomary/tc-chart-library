/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IDestroyable} from './Controls/Component';
import {CrossHair, CrossHairType, ICrossHairTheme} from './CrossHair';
import {IPoint} from './Graphics/ChartPoint';
import {Animation} from './Graphics/Animation';
import {Chart} from './Chart';
import {HtmlUtil} from './Utils/HtmlUtil';
import {ChartPanel} from './ChartPanels/ChartPanel';
import {BrowserUtils} from '../../utils';
import {ITextTheme, Theme} from './Theme';

interface ICrossHairAddControl {
    visible: boolean;
    halfHeight: number;
    $control: JQuery;
}

interface ICrossHairValueMarker {
    visible: boolean;
    halfHeight: number;
    $control: JQuery;
}

interface ICrossHairDateMarker {
    visible: boolean;
    halfWidth: number;
    $control: JQuery;
}

interface ICrossHairLines {
    visible: boolean;
    $horLine: JQuery;
    $verLine: JQuery;
}

interface ICrossHairControls {
    lines: ICrossHairLines;
    leftMarkers: ICrossHairValueMarker[];
    rightMarkers: ICrossHairValueMarker[];
    topMarker: ICrossHairDateMarker;
    bottomMarker: ICrossHairDateMarker;
    rightAddControl?: ICrossHairAddControl;
}


const Class = {
    HOR_LINE: 'scxCrossHairHorLine',
    VER_LINE: 'scxCrossHairVerLine',
    MARKER: 'scxCrossHairMarker',
    DATE_MARKER: 'scxCrossHairDateMarker',
    VALUE_MARKER: 'scxCrossHairValueMarker',
    CROSS_HAIR: 'scxCrossHair',
    ADD_CONTROL: 'scxAddControl'
};
Object.freeze(Class);


export class CrossHairView implements IDestroyable {
    private _crossHair: CrossHair;
    private _controls: ICrossHairControls;
    private _position: IPoint = null;
    private _prevPosition: IPoint = <IPoint> {};
    private _positionAnimation: Animation = new Animation({
        context: this,
        recurring: false,
        callback: this.updatePosition
    });


    private get chart(): Chart {
        return this._crossHair.chart;
    }

    private get rootDiv(): JQuery {
        return this.chart.rootDiv;
    }

    constructor(crossHair: CrossHair) {
        this._crossHair = crossHair;
    }

    private static _applyMarkerTheme(control: JQuery, theme: ICrossHairTheme, axisTextTheme:ITextTheme) {
        if(BrowserUtils.isMobile()) {
            theme.text.fontStyle = 'bold';
        }

        // MA theme come from two different places, coloring from cross-hair and font-size from axis text
        let markerTextTheme:ITextTheme = {
            fillColor: theme.text.fillColor,
            fontSize: axisTextTheme.fontSize,
            fontFamily: axisTextTheme.fontFamily,
            fontStyle: axisTextTheme.fontStyle
        };

        control.scxTextStyle(markerTextTheme).scxFill(theme.fill);
    }

    private static _updateValueMarkerMetrics(marker: ICrossHairValueMarker) {
        let $control = marker.$control;

        if (!$control.text())
            $control.text('1');
        marker.halfHeight = $control.height() / 2;
    }

    private static _updateAddControlMetrics(marker: ICrossHairAddControl) {
        let $control = marker.$control;
        marker.halfHeight = $control.height() / 2;
    }

    private static _updateDateMarkerMetrics(marker: ICrossHairDateMarker, formattedDate: string) {
        let $control = marker.$control;

        $control.text(formattedDate).width('auto');
        let width = Math.round($control.width() * 1.2);
        marker.halfWidth = Math.round(width / 2);
        $control.width(width);
    }

    private _createValueMarker(): ICrossHairValueMarker {
        return {
            visible: true,
            halfHeight: 0,
            $control: this.rootDiv.scxAppend('span', [Class.MARKER, Class.VALUE_MARKER])
        };
    }

    private _createControls() {
        let parent = this.rootDiv;

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

        if(BrowserUtils.isDesktop()) {
            this._controls.rightAddControl = {
                visible: BrowserUtils.isDesktop(),
                halfHeight: 0,
                $control: parent.scxAppend('span', [Class.ADD_CONTROL]),
            }
            this._controls.rightAddControl.$control.click((eventObject: JQueryEventObject) => {
                crossHair.showTradingContextMenu(eventObject, this.getAddControlPrice(this._controls.rightAddControl), this.getPanelIndex(this._controls.rightAddControl));
            });
        }

        let crossHair = this._crossHair;

        this._crossHair.applyTheme();
        this.updateVisibility(false);
    }

    private _syncValueMarkers() {
        let leftMarkers = this._controls.leftMarkers,
            rightMarkers = this._controls.rightMarkers,
            scales = this.chart.valueScales,
            overhead = leftMarkers.length - scales.length;

        if (overhead > 0) {
            leftMarkers.splice(-overhead, overhead);
            rightMarkers.splice(-overhead, overhead);
        } else if (overhead < 0) {
            for (let i = 0; i < -overhead; i++) {
                leftMarkers.push(this._createValueMarker());
                rightMarkers.push(this._createValueMarker());
            }
            this._crossHair.applyTheme();
            this.updateVisibility(false);
        }
    }

    layout() {
        let chart = this.chart;
        if (!this._controls) {
            this._createControls();
        }

        this._syncValueMarkers();

        let controls = this._controls,
            panelsFrame = chart.chartPanelsContainer.panelsContentFrame;

        controls.lines.$horLine
            . css('left', panelsFrame.left)
            .width(panelsFrame.width);
        controls.lines.$verLine
            .css('top', panelsFrame.top)
            .height(panelsFrame.height);

        let valueScales = chart.valueScales;
        for (let i = 0; i < valueScales.length; i++) {
            let leftFrame = valueScales[i].leftPanel.frame;
            if (leftFrame) {
                controls.leftMarkers[i].$control
                    .css('left', leftFrame.left + 1)
                    .outerWidth(leftFrame.width - 2);
            }

            let rightFrame = valueScales[i].rightPanel.frame;
            if (rightFrame) {
                controls.rightMarkers[i].$control
                    .css('left', rightFrame.left + 1)
                    .outerWidth(rightFrame.width - 2);
            }

            if(controls.rightAddControl) {
                controls.rightAddControl.$control
                    .css('left', rightFrame.left - 17)
                    .outerWidth(15)
                    .outerHeight(15);
            }

        }

        let dateScale = chart.dateScale,
            topFrame = dateScale.topPanel.frame;

        if (topFrame) {
            controls.topMarker.$control
                .css('top', topFrame.top + 1)
                .outerHeight(topFrame.height - 2)
                .css('line-height', topFrame.height - 2 + 'px');
        }

        let bottomFrame = dateScale.bottomPanel.frame;
        if (bottomFrame) {
            controls.bottomMarker.$control
                .css('top', bottomFrame.top + 1)
                .outerHeight(bottomFrame.height - 2)
                .css('line-height', bottomFrame.height - 2 + 'px');
        }
    }

    applyTheme(theme: ICrossHairTheme) {
        let controls = this._controls;

        controls.lines.$horLine.scxBorder('border-top', theme.line);
        controls.lines.$verLine.scxBorder('border-left', theme.line);
        for (let marker of controls.leftMarkers)
            CrossHairView._applyMarkerTheme(marker.$control, theme, this.chart.theme.valueScale.text);
        for (let marker of controls.rightMarkers)
            CrossHairView._applyMarkerTheme(marker.$control, theme, this.chart.theme.valueScale.text);
        CrossHairView._applyMarkerTheme(controls.topMarker.$control, theme, this.chart.theme.dateScale.text);
        CrossHairView._applyMarkerTheme(controls.bottomMarker.$control, theme, this.chart.theme.dateScale.text);

        this.updateMarkers();
    }

    updateVisibility(isVisible?: boolean) {
        let controls = this._controls;
        if (!controls)
            return;

        let crossHairType = this._crossHair.crossHairType;
        isVisible = this._crossHair.visible && !!isVisible && crossHairType !== CrossHairType.NONE;

        if (isVisible && crossHairType === CrossHairType.CROSS)
            this.rootDiv.addClass(Class.CROSS_HAIR);
        else
            this.rootDiv.removeClass(Class.CROSS_HAIR);

        let isMarkerVisible = isVisible && crossHairType !== CrossHairType.NONE,
            valueScales = this.chart.valueScales;

        for (let i = 0; i < valueScales.length; i++) {
            if (i >= controls.leftMarkers.length)
                break;

            let showLeft = isMarkerVisible && valueScales[i].leftPanelVisible,
                showRight = isMarkerVisible && valueScales[i].rightPanelVisible;

            controls.leftMarkers[i].visible = showLeft;
            controls.rightMarkers[i].visible = showRight;
            HtmlUtil.setVisibility(controls.leftMarkers[i].$control, showLeft);
            HtmlUtil.setVisibility(controls.rightMarkers[i].$control, showRight);
        }

        let showLines = controls.lines.visible = isVisible && crossHairType === CrossHairType.CROSS;
        HtmlUtil.setVisibility(controls.lines.$horLine, showLines);
        HtmlUtil.setVisibility(controls.lines.$verLine, showLines);

        let dateScale = this.chart.dateScale,
            showTop = controls.topMarker.visible = isMarkerVisible && dateScale.topPanelVisible,
            showBottom = controls.bottomMarker.visible = isMarkerVisible && dateScale.bottomPanelVisible;
        HtmlUtil.setVisibility(controls.topMarker.$control, showTop);
        HtmlUtil.setVisibility(controls.bottomMarker.$control, showBottom);

        if(controls.rightAddControl) {
            controls.rightAddControl.visible = isMarkerVisible;
            this.toggleAddControlVisibilityOnPositionChange();
        }


    }

    // MA Based on whether the position is within the main panel or not, then show/hide Add icon
    toggleAddControlVisibilityOnPositionChange() {

        let controls = this._controls;

        if (!controls || !controls.rightAddControl)
            return;

        let showAddControl = this.chart.isInteractive && controls.rightAddControl.visible;
        let isAddControlShown = HtmlUtil.isHidden(controls.rightAddControl.$control);
        if(showAddControl !== isAddControlShown) {
            HtmlUtil.setVisibility(controls.rightAddControl.$control, showAddControl);
        }

    }

    isInMainPanel(): boolean {

        if (!this._position) {
            return false;
        }

        let panel = this.chart.findPanelAt(this._position.y);
        if (!panel){
            return false;
        }

        return this.chart.mainPanel.getIndex() == this.chart.findPanelAt(this._position.y).getIndex();

    }

    setPosition(point: IPoint, animated?: boolean) {
        this._position = point;

        if (animated) {
            this._positionAnimation.start();
        } else {
            this.updatePosition();
        }
    }

    updatePosition(force?: boolean) {
        if (!this._positionAnimation)
            return;
        this._positionAnimation.stop();

        let point = this._position;
        if (!point)
            return;

        let chart = this.chart,
            panel = chart.findPanelAt(point.y);
        if (!panel)
            return;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA unlike other controls, AddControl visibility can change based on the position (due to leaving mainPanel for example).
        // This is why we check it every time the position is updated.
        this.toggleAddControlVisibilityOnPositionChange();
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let controls = this._controls,
            prevPos = this._prevPosition;

        if (prevPos.x !== point.x || force === true) {
            prevPos.x = point.x;

            if (controls.lines.visible)
                controls.lines.$verLine.css('left', point.x);

            let topMarker = controls.topMarker,
                bottomMarker = controls.bottomMarker;
            if (topMarker.visible || bottomMarker.visible) {
                let dateScale = chart.dateScale,
                    projection = dateScale.projection,
                    date = projection.dateByColumn(projection.columnByX(point.x)),
                    dateText = dateScale.formatDate(date);

                this._updateDateMarker(topMarker, dateText);
                this._updateDateMarker(bottomMarker, dateText);
            }
        }
        if (prevPos.y !== point.y || force === true) {
            prevPos.y = point.y;

            if (controls.lines.visible)
                controls.lines.$horLine.css('top', point.y);

            let valueScales = chart.valueScales,
                y = point.y - panel.frame.top - chart.chartPanelsContainer.frame.top;

            if(controls.rightAddControl) {
                this._updateAddControl(controls.rightAddControl);
            }

            for (let i = 0; i < valueScales.length; i++) {
                let leftMarker = controls.leftMarkers[i],
                    rightMarker = controls.rightMarkers[i];

                if (!leftMarker.visible && !rightMarker.visible)
                    continue;

                let scale = panel.valueScales[i],
                    value = scale.projection.valueByY(y),
                    valueText = scale.formatValue(value);

                this._updateValueMarker(leftMarker, valueText);
                this._updateValueMarker(rightMarker, valueText);
            }
        }
    }

    updateMarkers() {
        let controls = this._controls;
        if (!controls)
            return;

        for (let marker of controls.leftMarkers) {
            CrossHairView._updateValueMarkerMetrics(marker);
        }
        for (let marker of controls.rightMarkers) {
            CrossHairView._updateValueMarkerMetrics(marker);
        }

        let date = this.chart.dateScale.formatDate(new Date(0));

        CrossHairView._updateDateMarkerMetrics(controls.topMarker, date);
        CrossHairView._updateDateMarkerMetrics(controls.bottomMarker, date);
        if(controls.rightAddControl) {
            CrossHairView._updateAddControlMetrics(controls.rightAddControl);
        }
    }

    private _updateValueMarker(marker: ICrossHairValueMarker, text: string) {
        if (marker.visible) {
            marker.$control
                .text(text)
                .css('top', this._position.y - marker.halfHeight);
        }
    }

    private _updateAddControl(marker: ICrossHairAddControl) {
        if (marker.visible) {
            marker.$control.css('top', this._position.y - marker.halfHeight);
        }
    }

    private _updateDateMarker(marker: ICrossHairDateMarker, text: string) {
        if (marker.visible) {
            let chartWidth = this.rootDiv.width(),
                left = this._position.x > (chartWidth - marker.halfWidth)
                    ? chartWidth - 2 * marker.halfWidth
                    : this._position.x - marker.halfWidth;

            marker.$control
                .text(text)
                .css('left', Math.max(left, 0));
        }
    }

    private getPanelIndex(marker: ICrossHairAddControl): number {
        let y:number =  +marker.$control.css('top').replace('px', '') + marker.halfHeight;
        return this.chart.findPanelAt(y).getIndex();
    }

    private getAddControlPrice(marker: ICrossHairAddControl) {
        let y:number =  +marker.$control.css('top').replace('px', '') + marker.halfHeight;
        let panel:ChartPanel = this.chart.findPanelAt(y);
        return panel.valueScales[0].projection.valueByY(y - panel.frame.top - this.chart.chartPanelsContainer.frame.top);
    }

    destroy() {
        let controls = this._controls;
        controls.lines.$horLine.remove();
        controls.lines.$verLine.remove();
        controls.topMarker.$control.remove();
        controls.bottomMarker.$control.remove();
        for (let marker of controls.leftMarkers)
            marker.$control.remove();
        for (let marker of controls.rightMarkers)
            marker.$control.remove();
        this._controls = null;
    }
}
