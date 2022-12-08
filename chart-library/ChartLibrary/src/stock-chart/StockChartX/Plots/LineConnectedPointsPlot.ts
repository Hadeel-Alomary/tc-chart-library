import {AbstractConnectedPointsPlot, IAbstractConnectedPointsPlotConfig} from "./AbstractConnectedPointsPlot";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {IPlotValueDrawParams} from "./Plot";
import {IStrokeTheme, LineConnectedPlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface ILineConnectedPointsPlotConfig extends IAbstractConnectedPointsPlotConfig {

}


export class LineConnectedPointsPlot extends AbstractConnectedPointsPlot {
    constructor(chart:Chart, config: ILineConnectedPointsPlotConfig) {
        super(chart, config);

        this._plotThemeKey = 'lineConnectedPoints';
    }

    draw() {
        if (!this.visible)
            return;

        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        this.drawColoredLine(params, true, (params.theme as LineConnectedPlotTheme).upLine);
        this.drawColoredLine(params, false, (params.theme as LineConnectedPlotTheme).downLine);
    }

    drawValueMarkers() {
        if (!this.showValueMarkers)
            return;

        let marker = this.chart.valueMarker,
            markerTheme = marker.theme,
            drawParams = this._valueDrawParams();

        if (drawParams.values.length === 0)
            return;

        let lastIdx = Math.ceil(this.chart.dateScale.lastVisibleRecord);
        if(!this.dataSeries[0].valueAtIndex(lastIdx)) {
            lastIdx = drawParams.values.length - 1;
        }
        let beforeLastIndex = drawParams.values.length - 2,
            isUp = drawParams.values[lastIdx] > drawParams.values[beforeLastIndex],
            fillColor = drawParams.theme[isUp ? 'upLine' : 'downLine'].strokeColor;

        markerTheme.fill.fillColor = fillColor;
        markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';
        marker.draw(drawParams.values[lastIdx], this.panelValueScale, this.valueMarkerOffset, this.plotType);
    }

    hitTest(point: IPoint) {
        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return false;

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];

            if (value == null)
                continue;

            let x = this.projection.xByColumn(column);

            if (x <= point.x && point.x <= x + this.chart.dateScale.columnWidth) {

                let nextX = this.projection.xByColumn(column + 1);

                let nextEntry = Math.min(i + 1, params.endIndex);

                let y = this.projection.yByValue(value);
                let nextY = this.projection.yByValue(params.values[nextEntry]);

                if (Geometry.isPointNearLine(point, {x: x, y: y}, {x: nextX, y: nextY}))
                    return true;
            }
        }

        return false;
    }

    drawSelectionPoints(): void {
        if (!this.visible) {
            return;
        }

        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        let projection = params.projection;

        for (let i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            let value = params.values[i];
            if (value == null || isNaN(value))
                continue;

            let x = projection.xByRecord(i),
                y = projection.yByValue(value);

            this.drawSelectionCircle(x, y);
        }
    }

    private drawColoredLine(params: IPlotValueDrawParams, upLine: boolean, theme: IStrokeTheme): void {
        let context = params.context,
            projection = params.projection;

        let count = this.connectedPointsSeries.length,
            values = <number[]> this.connectedPointsSeries.values;

        let lastValue: number = Infinity;

        context.beginPath();
        for (let i = 0; i < count; i++) {
            let value = values[i];
            if (value == null || isNaN(value) || value == 0)
                continue;

            let x = projection.xByRecord(i),
                y = projection.yByValue(value),
                firstPoint: boolean = false;

            if (lastValue == Infinity) {
                lastValue = value;
                firstPoint = true;
            } else {
                let down = lastValue > value;
                lastValue = value;
                firstPoint = false;
                if (down == upLine) {
                    context.moveTo(x, y);
                    continue;
                }
            }

            if (!firstPoint)
                context.lineTo(x, y);

            context.moveTo(x, y);
        }
        context.scxApplyStrokeTheme(theme);
        context.stroke();
    }
}
