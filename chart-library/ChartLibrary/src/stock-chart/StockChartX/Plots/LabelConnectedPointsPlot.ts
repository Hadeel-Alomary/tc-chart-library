import {AbstractConnectedPointsPlot, IAbstractConnectedPointsPlotConfig} from "./AbstractConnectedPointsPlot";
import {ISize} from "../Graphics/Rect";
import {DummyCanvasContext} from "../Utils/DummyCanvasContext";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {IPlotValueDrawParams, PlotDrawingOrderType} from "./Plot";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {IMinMaxValues} from "../Data/DataSeries";
import {LabelConnectedPlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface ILabelConnectedPointsPlotConfig extends IAbstractConnectedPointsPlotConfig {

}

export class LabelConnectedPointsPlot extends AbstractConnectedPointsPlot {

    private size: ISize = {
        width: 30,
        height: 20
    };

    private textTheme = {
        fontFamily: 'Arial',
        fontSize: 12,
        fontStyle: 'bold',
        fillColor: 'black',
        textBaseline:'alphabetic'
    };

    private angle = 4;
    private padding = 8;

    get height() {
        return this.padding + this.size.height + (this.actualTheme as LabelConnectedPlotTheme).stroke.width;
    }

    constructor(chart:Chart, config: ILabelConnectedPointsPlotConfig) {
        super(chart, config);

        this._plotThemeKey = 'labelConnectedPoints';
    }

    draw() {
        if (!this.visible)
            return;

        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            projection = params.projection,
            values = <number[]> this.connectedPointsSeries.values;

        let pOHLC = this.chart.barDataSeries();

        for (let i = params.startIndex; i < params.endIndex; i++) {
            let value = values[i];
            if (value == null || isNaN(value) || value == 0)
                continue;

            context.beginPath();
            let x = projection.xByRecord(i),
                y = projection.yByValue(value);

            let high = pOHLC.high.valueAtIndex(i),
                upValue = high == value,
                valueTextSize = DummyCanvasContext.measureText(value.toFixed(2), this.textTheme);

            y = upValue ? y - this.padding : y + this.padding;

            this.drawPopupRectangle(params, x, y, valueTextSize, upValue);
            this.drawText(params, value, x, y, valueTextSize, upValue);
        }
    }

    drawValueMarkers() {
        // NK label connected points plot does not have value markers
    }

    hitTest(point: IPoint): boolean {
        let params = this._valueDrawParams(),
            values = <number[]> this.connectedPointsSeries.values;

        if (values.length === 0)
            return false;

        let projection = params.projection;

        for (let i = params.startIndex; i < params.endIndex; i++) {
            let value = values[i];

            if (value == null || isNaN(value) || value == 0)
                continue;

            let x = projection.xByRecord(i);

            let y = projection.yByValue(value);
            let pOHLC = this.chart.barDataSeries();
            let high = pOHLC.high.valueAtIndex(i),
                upValue = high == value;

            if (x - this.size.width <= point.x && point.x <= x + this.size.width) {

                let left = x - (this.size.width / 2),
                    top = upValue
                        ? y - this.padding - this.size.height
                        : y + this.padding + this.angle,
                    width = this.size.width,
                    height = this.size.height - this.angle;

                if (Geometry.isPointInsideOrNearRect(point, {left: left, top: top, width: width, height: height}))
                    return true;
            }
        }

        return false;
    }

    drawSelectionPoints(): void {
        if (!this.visible) {
            return;
        }

        let params = this._valueDrawParams(),
            values = <number[]> this.connectedPointsSeries.values;
        if (values.length === 0)
            return;

        let projection = params.projection;

        for (let i = params.startIndex; i < params.endIndex; i++) {
            let value = values[i];

            if (value == null || isNaN(value) || value == 0)
                continue;

            let x = projection.xByRecord(i);
            let y = projection.yByValue(value);

            this.drawSelectionCircle(x, y);
        }
    }

    public get drawingOrder(): PlotDrawingOrderType {
        return this.selected ? PlotDrawingOrderType.SelectedPlot : PlotDrawingOrderType.LabelConnectedPlot;
    }

    updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number> {
        //NK ensure not have some of the plot trimmed
        let height = this.valueScale.rightPanel.frame.height,
            pixelsPerUnit = (max - min) / height,
            yOffset = this.height * pixelsPerUnit * 2;
        return {
            min: min - yOffset,
            max: max + yOffset
        };
    }

    private drawPopupRectangle(params: IPlotValueDrawParams, x: number, y: number, valueTextSize: ISize, upValue: boolean): void {
        if (this.size.width <= valueTextSize.width) {
            this.size.width += (valueTextSize.width - this.size.width) + this.padding;
        }

        let angle = this.angle,
            height = this.size.height,
            halfWidth = this.size.width / 2,
            context = params.context,
            theme = (params.theme as LabelConnectedPlotTheme).stroke,
            angleY = upValue ? y - angle : y + angle,
            rectangleY = upValue ? y - height : y + height,
            left = x - halfWidth,
            right = x + halfWidth;

        //NK draw the angle of the rectangle
        context.moveTo(x, y);
        context.lineTo(x + angle, angleY);
        context.moveTo(x, y);
        context.lineTo(x - angle, angleY);

        //NK draw the rectangle
        context.lineTo(left, angleY);
        context.lineTo(left, rectangleY);
        context.lineTo(right, rectangleY);
        context.lineTo(right, angleY);
        context.lineTo(x + angle, angleY);
        context.closePath();
        context.scxFillStroke(
            {
                fillColor: HtmlUtil.isDarkColor(theme.strokeColor) ? '#eee' : '#7f7e7e'
            },
            theme
        );
    }

    private drawText(params: IPlotValueDrawParams, value: number, x: number, y: number, valueTextSize: ISize, upValue: boolean): void {
        let context = params.context,
            valueAsString = value.toFixed(2),
            textY = upValue
                ? y - this.angle - (this.size.height - this.angle - valueTextSize.height) * (4 / 3)
                : y + this.angle - (this.size.height - this.angle - valueTextSize.height) * (1 / 4) + valueTextSize.height,
            textX = x - (valueTextSize.width / 2);

        this.textTheme.fillColor = (params.theme as LabelConnectedPlotTheme).stroke.strokeColor;
        context.scxApplyTextTheme(this.textTheme);
        context.fillText(valueAsString, textX, textY);
    }
}
