import {ChartComponent, IChartComponentConfig, IChartComponentState} from "../Controls/ChartComponent";
import {MouseHoverGesture} from "../Gestures/MouseHoverGesture";
import {ClickGesture} from "../Gestures/ClickGesture";
import {ChartPanel} from "../ChartPanels/ChartPanel";
import {IRect} from "../Graphics/Rect";
import {Gesture, GestureState, WindowEvent} from '../Gestures/Gesture';
import {ChartEvent} from "../Chart";
import {ChartPoint, IPoint} from "../Graphics/ChartPoint";
import {DummyCanvasContext} from "../Utils/DummyCanvasContext";
import {IMeasurementValues, MeasuringUtil} from "../Utils/MeasuringUtil";
import {DrawingCalculationUtil} from "../Utils/DrawingCalculationUtil";
import {BrowserUtils} from '../../../utils';
import {PanGesture} from '../Gestures/PanGesture';

export interface IMeasurementToolState extends IChartComponentState {

}

export interface IMeasurementToolConfig extends IChartComponentConfig {

}

enum MeasurementToolState {
    Active_Changing = 1,
    Active_Fixed,
    Inactive
}

const theme = {
    fillTheme: {
        fillEnabled: true,
        fillColor: 'rgba(138, 180, 180, 0.4)'
    }
};

const valuesTheme = {
    fillTheme: {
        fillEnabled: true,
        fillColor: 'rgba(107, 145, 197, 0.9)'
    }
};

const arrowTheme = {
    strokeTheme: {
        width: 2,
        strokeColor: 'black',
        lineStyle: 'dash'
    }
};

const textTheme = {
    fontFamily: 'Arial',
    fontSize: 12,
    fontStyle: 'bold',
    fillColor: 'white'
};

export class MeasurementTool extends ChartComponent {

    private _state: MeasurementToolState = MeasurementToolState.Inactive;

    private _mouseHoverGesture: MouseHoverGesture;
    private _mouseClickGesture: ClickGesture;
    private _panGesture: PanGesture;


    private _chartPanel: ChartPanel;
    private _points:ChartPoint[] = [];

    private _values: IMeasurementValues = {
        barsCount: 0,
        change: 0,
        changePercentage: 0,
        period: '0',
    };

    constructor(config: IMeasurementToolConfig) {
        super(config);
    }

    startMeasuring(): void {
        this._points = [];
        this._state = MeasurementToolState.Inactive;
        this._initializeGestures();
    }

    finishMeasuring(): void {
        this._state = MeasurementToolState.Inactive;
        this._resetGestures();
    }


    handleEvent(event: WindowEvent) {
        return BrowserUtils.isMobile() ? this.handleMobileEvent(event) : this.handleDesktopEvent(event);
    }

    private handleMobileEvent(event: WindowEvent){
        if(this._panGesture && this._panGesture.handleEvent(event)) {
            return true;
        }
        return this._mouseClickGesture.handleEvent(event) ||
            this._mouseHoverGesture.handleEvent(event);
    }

    private handleDesktopEvent(event: WindowEvent) {
        if (this._mouseClickGesture.handleEvent(event)) {
            return true;
        } else if (this._mouseHoverGesture.handleEvent(event)) {
            return true;
        }
        return false;
    }

    isMeasuringPanel(panel:ChartPanel):boolean {
        return this._chartPanel === panel;
    }

    /* override methods */

    draw() {
        if (this._state == MeasurementToolState.Inactive) {
            return;
        }

        let arrowBoundsRect:IRect = this._getArrowsRectangleBounds();
        let valuesBoundsRect:IRect = this._getValuesRectangleBounds(arrowBoundsRect);
        this._forceBoundsInsideChartPanel(valuesBoundsRect);

        this._drawArrowsRectangle(arrowBoundsRect);
        this._drawValuesRectangle(valuesBoundsRect);
    }

    loadState() {

    }

    saveState(): IMeasurementToolState {
        return null;
    }

    /* end of override methods */

    /* Gestures methods */

    private _handleMouseClick(gesture: Gesture, event: WindowEvent): void {
        switch (this._state) {
            case MeasurementToolState.Inactive:
                this._startInternalMeasuringProcess(event.pointerPosition);
                break;
            case MeasurementToolState.Active_Changing:
                this._state = MeasurementToolState.Active_Fixed;
                break;
            case MeasurementToolState.Active_Fixed:
                this._finishInternalMeasuringProcess();
                break;
        }
    }

    private _handleMouseHover(gesture: Gesture, event: WindowEvent): void {
        if (this._state != MeasurementToolState.Active_Changing) {
            return;
        }

        let point = event.pointerPosition;
        //NK if we try to move the mouse out of the panel we started on, we should prevent updating the calculations
        if (!this._isMeasuringInSamePanel(point)) {
            return;
        }

        if (this._isMouseHoverValueScale(point)) {
            return;
        }

        this._updateLastPoint(point);
        this._magnetChartPointIfNeeded(this._points[1]);

        this._values = MeasuringUtil.getMeasuringValues(this._points, this._chartPanel);
        this._chartPanel.setNeedsUpdate();
    }

    private _handlePanGesture(gesture: Gesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._handleMouseClick(gesture,event);
                break;
            case GestureState.CONTINUED:
                this._handleMouseHover(gesture,event);
                break;
            case GestureState.FINISHED:
                this._handleMouseClick(gesture,event);
                break;
        }
    }

    private _resetGestures(): void {
        this._mouseClickGesture = null;
        this._mouseHoverGesture = null;
    }

    private _initializeGestures():void{
        this._mouseClickGesture = new ClickGesture({
            handler: this._handleMouseClick.bind(this),
            hitTest: () => {
                return true;
            }
        });

        this._mouseHoverGesture = new MouseHoverGesture({
            handler: this._handleMouseHover.bind(this),
            hitTest: () => {
                return true;
            }
        });

        this._panGesture = new PanGesture({
            handler: this._handlePanGesture.bind(this),
            hitTest: () => {
                return true;
            }
        });
    }

    /* end of gestures methods*/

    /* Drawing methods */

    private _drawValuesRectangle(bounds:IRect): void {
        let context = this._chartPanel.context,
            radius = 5;

        if (bounds) {
            // NK draw values rounded rectangle
            context.beginPath();
            context.scxRounderRectangle(bounds, radius);
            context.scxFill(valuesTheme.fillTheme);

            // NK draw values text
            let padding = 5;
            let textSizes = this._getValuesTextSize();
            context.scxApplyTextTheme(textTheme);

            //NK when we draw any other drawing that contains text drawing, these properties will change and affect the drawing here, so we should set them every time we want to draw
            context.textAlign = 'left';
            context.textBaseline = 'alphabetic';

            let xOffset = bounds.left + padding;
            let yOffset = bounds.top + padding;

            let text = this._getTextThatWillBeDrawn();

            context.fillText(text.change, xOffset, yOffset + textSizes.changeSize.height);
            xOffset += textSizes.changeSize.width + padding;

            context.fillText(text.changePercentage, xOffset, yOffset + textSizes.changePercentageSize.height);

            xOffset = bounds.left + padding;
            yOffset += textSizes.changePercentageSize.height + padding;

            context.fillText(text.bars, xOffset, yOffset + textSizes.barsSize.height);
            xOffset += textSizes.barsSize.width + padding;

            context.fillText(text.period, xOffset, yOffset + textSizes.periodSize.height);
        }
    }

    private _drawArrowsRectangle(bounds:IRect): void {

        if (bounds) {
            let context = this._chartPanel.context;

            context.beginPath();

            // Draw arrows lines
            let leftPoint = {
                x: bounds.left,
                y: bounds.top + (bounds.height / 2)
            };
            let rightPoint = {
                x: bounds.left + bounds.width,
                y: bounds.top + (bounds.height / 2)
            };
            context.scxDrawAntiAliasingLine(leftPoint, rightPoint);

            let topPoint = {
                x: bounds.left + (bounds.width / 2),
                y: bounds.top
            };
            let bottomPoint = {
                x: bounds.left + (bounds.width / 2),
                y: bounds.top + bounds.height
            };
            context.scxDrawAntiAliasingLine(topPoint, bottomPoint);
            context.scxStroke(arrowTheme.strokeTheme);

            this._drawArrows(context, bounds);

            // Draw rectangle
            context.rect(bounds.left, bounds.top, bounds.width, bounds.height);
            context.scxFill(theme.fillTheme);
        }
    }

    private _drawArrows(context: CanvasRenderingContext2D, bounds:IRect): void {
        let radius = 10,
            point:IPoint = null,
            angle:number = 0;

        let leftArrow:boolean = this._points[1].date < this._points[0].date;
        if (leftArrow) {
            point = {x: bounds.left, y: bounds.top + (bounds.height / 2)};
            angle = 180;
        } else {
            point = {x: bounds.left + bounds.width, y: bounds.top + (bounds.height / 2)};
            angle = 0;
        }
        context.scxDrawArrow(point, DrawingCalculationUtil.convertDegreeToRadian(angle), radius, radius);
        context.scxStroke(arrowTheme.strokeTheme);

        let bottomArrow:boolean = this._points[1].value < this._points[0].value;
        if (bottomArrow) {
            point = {x: bounds.left + (bounds.width / 2), y: bounds.top + bounds.height};
            angle = -90;
        } else {
            point = {x: bounds.left + (bounds.width / 2), y: bounds.top};
            angle = 90;
        }
        context.scxDrawArrow(point, DrawingCalculationUtil.convertDegreeToRadian(angle), radius, radius);
        context.scxStroke(arrowTheme.strokeTheme);
    }

    /* end of drawing methods*/

    /* Calculation methods */

    private _updateLastPoint(point: IPoint): void {
        this._points[1].moveToPoint(this._getPointCoordinationBasedOnChartPanel(point),  this._chartPanel.projection);
    }

    private _getArrowsRectangleBounds(): IRect {
        let point1:IPoint = this._points[0].toPoint(this._chartPanel.projection);
        let point2:IPoint = this._points[1].toPoint(this._chartPanel.projection);

        let x1 = point1.x;
        let x2 = point2.x;

        let y1 = point1.y;
        let y2 = point2.y;

        return {
            left: x2 < x1 ? x2 : x1,
            top: y2 < y1 ? y2 : y1,
            height: Math.abs(y1 - y2),
            width: Math.abs(x1 - x2)
        };
    }

    private _getValuesRectangleBounds(arrowRectangleBounds:IRect): IRect {
        let sizes = this._getValuesTextSize();
        let padding = 5;

        let firstRowWidth = sizes.changeSize.width + sizes.changePercentageSize.width,
            secondRowWidth = sizes.barsSize.width + sizes.periodSize.width,
            width = Math.max(firstRowWidth, secondRowWidth) + (3 * padding),
            height = sizes.changePercentageSize.height + sizes.periodSize.height + (4 * padding),
            left = (arrowRectangleBounds.left + (arrowRectangleBounds.width / 2) - (width / 2));

        let reversed = this._points[1].value < this._points[0].value,
            reversedLocation = arrowRectangleBounds.top + arrowRectangleBounds.height + padding,
            normalLocation = arrowRectangleBounds.top - height - padding;

        let top = reversed ? reversedLocation : normalLocation;

        return {
            left: left,
            top: top,
            height: height,
            width: width
        };
    }

    private _forceBoundsInsideChartPanel(bounds: IRect): void {
        if (bounds.top < 0) {
            bounds.top = 0;
        } else if (bounds.top + bounds.height > this._chartPanel.contentFrame.height) {
            bounds.top -= bounds.top + bounds.height - this._chartPanel.contentFrame.height;
        }
    }

    /* end of calculation methods */

    private _startInternalMeasuringProcess(point:IPoint){
        this._updateChartPanel(point.y);
        this._state = MeasurementToolState.Active_Changing;

        point = this._getPointCoordinationBasedOnChartPanel(point);
        let date:Date = this._chartPanel.projection.dateByX(point.x),
            value:number = this._chartPanel.projection.valueByY(point.y);

        this._points.push(new ChartPoint({
            date: date,
            value: value
        }));
        this._points.push(new ChartPoint({
            date: date,
            value: value
        }));
    }

    private _finishInternalMeasuringProcess(){
        this.finishMeasuring();
        this.chart.finishMeasuring();
        this.chart.fireValueChanged(ChartEvent.USER_MEASURING_FINISHED);
    }

    private _getValuesTextSize() {
        let text = this._getTextThatWillBeDrawn();

        return {
            changeSize: DummyCanvasContext.measureText(text.change, textTheme),
            changePercentageSize: DummyCanvasContext.measureText(text.changePercentage, textTheme),
            barsSize: DummyCanvasContext.measureText(text.bars, textTheme),
            periodSize: DummyCanvasContext.measureText(text.period, textTheme)
        };
    }

    private _getTextThatWillBeDrawn() {
        let change = this._values.change.toFixed(2);
        let changePercentage = '(' + this._values.changePercentage.toFixed(2) + '%)';
        let bars = this._values.barsCount + ' bars, ';
        let period = this._values.period;

        return {
            change: change,
            changePercentage: changePercentage,
            bars: bars,
            period: period
        }
    }

    private _updateChartPanel(y: number): void {
        this._chartPanel = this.chart.chartPanelsContainer.findPanelAt(y);
    }

    private _isMeasuringInSamePanel(point: IPoint): boolean {
        return this.chart.chartPanelsContainer.findPanelAt(point.y) === this._chartPanel;
    }

    private _isMouseHoverValueScale(point: IPoint): boolean {
        return this._chartPanel.valueScale.rightFrame.left <= point.x;
    }

    private _getPointCoordinationBasedOnChartPanel(point:IPoint):IPoint{
        if (this._chartPanel !== this.chart.mainPanel) {
            point.y -= this._chartPanel.contentFrame.top;
        }

        return point;
    }

    private _magnetChartPointIfNeeded(point: ChartPoint){
        if (this.chart.magnetRatio == 0) {
            return point;
        }

        if (this._chartPanel !== this.chart.mainPanel) {
            return point;
        }

        let dataSeries = this.chart.barDataSeries();
        let hoveredRecord = this.chart.hoveredRecord;

        if (hoveredRecord >= dataSeries.open.length) {
            return point;
        }

        let open = <number> dataSeries.open.valueAtIndex(hoveredRecord),
            high = <number> dataSeries.high.valueAtIndex(hoveredRecord),
            low = <number> dataSeries.low.valueAtIndex(hoveredRecord),
            close = <number> dataSeries.close.valueAtIndex(hoveredRecord);

        let fields: number[] = [open, high, low, close];

        let hoveredRecordX = this._chartPanel.projection.xByRecord(hoveredRecord);
        let pointY:number = this._chartPanel.projection.yByValue(point.value);

        let updatedPoint = {x: hoveredRecordX, y: pointY};
        let smallestDistance: number = this.chart.magnetRatio * 25;

        for (let field of fields) {
            let fieldY = this._chartPanel.projection.yByValue(field);

            if (Math.abs(pointY - fieldY) <= smallestDistance) {
                smallestDistance = Math.abs(pointY - fieldY);
                updatedPoint.y = fieldY;
            }
        }
        point.moveToPoint(updatedPoint, this._chartPanel.projection);
    }
}
