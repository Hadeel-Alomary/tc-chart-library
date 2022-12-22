/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Drawing, DrawingEvent, IDrawingOptions} from '../Drawing';
import {IRect, ISize, Rect} from '../../Graphics/Rect';
import {Geometry} from '../../Graphics/Geometry';
import {ChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {DummyCanvasContext} from '../../Utils/DummyCanvasContext';
import {HtmlUtil} from '../../Utils/HtmlUtil';
import {DrawingTextHorizontalPosition, DrawingTextVerticalPosition} from '../DrawingTextPosition';
import {ChartAccessorService} from '../../../../services/chart';
import {AlertableDrawing} from '../AlertableDrawing';
import {Interval} from '../../../../services/loader';
import {ITextTheme} from '../../Theme';
import {FilledShapeDrawingTheme, LineWithTextDrawingTheme} from '../DrawingThemeTypes';
import {BrowserUtils} from '../../../../utils';


export interface IHorizontalLineDrawingOptions extends IDrawingOptions {
    showValue: boolean;
    text: string;
}


/**
 * Represents horizontal line drawing.
 * @constructor HorizontalLineDrawing
 * @augments Drawing
 * @example
 *  // Create horizontal line drawing.
 *  var line1 = new HorizontalLineDrawing({
     *      point: {x: 10, y: 20}
     *  });
 *
 *  // Create horizontal line drawing.
 *  var line2 = new HorizontalLineDrawing({
     *      point: {record: 10, value: 20.0}
     *  });
 *
 *  // Create horizontal line drawing with a custom theme.
 *  var line3 = new HorizontalLineDrawing({
     *      point: {record: 10, value: 20.0}
     *      theme: {
     *          line: {
     *              strokeColor: 'white'
     *              width: 1
     *          }
     *      }
     *  });
 */
export class HorizontalLineDrawing extends AlertableDrawing<LineWithTextDrawingTheme> {

    static get className(): string {
        return 'horizontalLine';
    }

    get text(): string {
        if ((<IHorizontalLineDrawingOptions> this._options).text == undefined)
            (<IHorizontalLineDrawingOptions> this._options).text = '';
        return (<IHorizontalLineDrawingOptions> this._options).text;
    }

    set text(value: string) {
        (<IHorizontalLineDrawingOptions> this._options).text = value;
    }

    get textHorizontalPosition():string{
        return this.getDrawingTheme().text.textAlign;
    }

    set textHorizontalPosition(value:string){
        this.getDrawingTheme().text.textAlign = value;
    }

    get textVerticalPosition():string{
        return this.getDrawingTheme().text.textVerticalAlign;
    }

    set textVerticalPosition(value:string){
        this.getDrawingTheme().text.textVerticalAlign = value;
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        let frame = this.chartPanel.contentFrame;

        return {
            left: frame.left,
            top: point.y,
            width: frame.width,
            height: 1
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let p = this.cartesianPoint(0);

        return point && Geometry.isValueNearValue(point.y, p.y);
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let point = this.cartesianPoint(0);
        if (!point)
            return;

        let context = this.chartPanel.context,
            frame = this.chartPanel.contentFrame;

        context.beginPath();
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(this.getDrawingTheme().line);

        if (this.selected) {
            let x = Math.round(frame.left + frame.width / 2);

            this._drawSelectionMarkers({x: x, y: point.y});
        }

        this.drawValue();

        if(this.text.length){
            this.drawText(point);
        }

        this.drawAlertBellIfNeeded();
    }

    drawValue() {
        let textTheme : ITextTheme= <ITextTheme>{fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: ''};
        let point = this.cartesianPoint(0),
            frame = this.chartPanel.contentFrame,
            context = this.chartPanel.context,
            value = this.projection.valueByY(point.y),
            text = this.chartPanel.formatValue(value);

        if(BrowserUtils.isMobile()) {

            let padding = 2,
                valuePosition = {x: Math.round(frame.right - padding), y: point.y};
            textTheme.fillColor = 'black';
            textTheme.fontSize = 9;
            let textSize = DummyCanvasContext.measureText(text, textTheme);
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, valuePosition.x - textSize.width, valuePosition.y - padding);

        } else {

            let theme = this.getDrawingTheme(),
                textSize = DummyCanvasContext.measureText(text, textTheme),
                padding = 5,
                valuePosition = {x: Math.round(frame.right - padding), y: point.y};

            let x = valuePosition.x - textSize.width - (2 * padding),
                y = valuePosition.y - textSize.height - (3 * padding),
                width = textSize.width + (padding * 2),
                height = textSize.height + (padding * 2);

            context.scxApplyFillTheme({fillColor: theme.line.strokeColor});

            context.fillRect(x, y, width, height);

            textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, x + padding, y + (3 * padding));

        }

    }

    protected drawText(point:IPoint):void {
        let context: CanvasRenderingContext2D = this.context;

        let textDrawingPoint: IPoint = {
            x: this.getTextHorizontalPosition(point),
            y: this.getTextVerticalPosition(point)
        };

        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text, textDrawingPoint.x, textDrawingPoint.y);
    }

    protected getTextHorizontalPosition(point:IPoint):number{
        let textTheme : ITextTheme= <ITextTheme>{fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: ''};
        let position:number = 0,
            value = this.projection.valueByY(point.y),
            yValue = this.chartPanel.formatValue(value),
            frame:Rect = this.chartPanel.contentFrame,
            padding:number = 5,
            yValueBoxWidth = DummyCanvasContext.measureText(yValue, textTheme).width;

        switch (this.textHorizontalPosition) {
            case DrawingTextHorizontalPosition.RIGHT:
                position = frame.right  - yValueBoxWidth - (padding*4);
                break;
            case DrawingTextHorizontalPosition.CENTER:
                position = frame.width/2;
                break;
            case DrawingTextHorizontalPosition.LEFT:
                position = frame.left + padding;
                break;
            default:
                throw new Error("Unknown horizontal text position type: " + this.textHorizontalPosition);
        }

        return position;
    }

    protected isHorizontalLineAlert(): boolean {
        return true;
    }

    protected canAlertExtendRight():boolean {
        return true;
    }

    protected canAlertExtendLeft():boolean {
        return true;
    }

    protected getAlertFirstChartPoint():ChartPoint {
        return this.chartPoints[0];
    }

    protected getAlertIconPoint() : IPoint {
        let point = this.cartesianPoint(0);
        let frame = this.chartPanel.contentFrame;
        point.x = Math.round(frame.left + frame.width / 2);
        return point;
    }

    protected getAlertSecondChartPoint():ChartPoint {
        let firstPoint = this.chartPoints[0];
        let interval = Interval.fromChartInterval(this.chart.timeInterval);
        let symbol = this.chart.instrument.symbol;
        // let market = ChartAccessorService.instance.getMarketBySymbol(symbol);
        // let nextCandleDate = market.findProjectedFutureDate(firstPoint.date, 1, interval);
	  let nextCandleDate = null;
        return new ChartPoint({
            date: nextCandleDate,
            value: firstPoint.value
        });
    }

    private getTextVerticalPosition(point:IPoint):number{
        let position:number = 0,
            textSize:ISize = DummyCanvasContext.measureText(this.text, this.getDrawingTheme().text as ITextTheme),
            padding:number = 5;

        switch (this.textVerticalPosition) {
            case DrawingTextVerticalPosition.TOP:
                position = point.y - textSize.height + padding;
                break;
            case DrawingTextVerticalPosition.MIDDLE:
                position = point.y + padding;
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                position = point.y + textSize.height + padding;
                break;
            default:
                throw new Error("Unknown vertical text position type: " + this.textVerticalPosition);
        }

        return position;
    }

    protected shouldDrawMarkers(): boolean {
        return false;
    }

}

Drawing.register(HorizontalLineDrawing);
