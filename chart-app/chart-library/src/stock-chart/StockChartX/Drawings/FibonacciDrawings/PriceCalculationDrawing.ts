import {Drawing, DrawingDragPoint} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {DummyCanvasContext} from "../../Utils/DummyCanvasContext";
import {Geometry} from "../../Graphics/Geometry";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {PanGesture} from "../../Gestures/PanGesture";
import {ISize} from "../../Graphics/Rect";
import {LineWithTextDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';
import {ITextTheme} from '../../Theme';
import {DrawingTextHorizontalPosition, DrawingTextVerticalPosition} from '../DrawingTextPosition';
import {DrawingLevelsFormatType} from '../DrawingLevelsFormatType';

export class PriceCalculationDrawing extends ThemedDrawing<LineWithTextDrawingTheme> {
    static get className(): string {
        return 'priceCalculation';
    }
    priceDiff: number = 0;
    secondYPoint: number ;


    get pointsNeeded(): number {
        return 2;
    }

    private getTextHorizontalPositionAlignment():string{
        return this.getDrawingTheme().text.textAlign;
    }

    private getTextVerticalPositionAlignment():string{
        return this.getDrawingTheme().text.textVerticalAlign;
    }

    hitTest(point: IPoint): boolean {
        if(this.cartesianPoints().length < this.pointsNeeded){
            return false;
        }

        return this.calculatePriceHitTest(point);
    }

    private calculatePriceHitTest(point: IPoint): boolean{
       let points = this._markerPoints();
        return (Geometry.isPointNearLine(point , points.firstLineStartPoint , points.firstLineEndPoint)
            || Geometry.isPointNearLine(point , points.secondLineStartPoint , points.secondLineEndPoint)
            || Geometry.isPointNearLine(point , points.secondLineMidPoint , points.firstLineMidPoint));
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;
                return true;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }
        return false;
    }

    draw() {
        if (!this.visible)
            return;
        let points = this.cartesianPoints();
        if (points.length > 1) {
            this.secondYPoint = this._calculateSecondYPoint(points);
            this.chartPoints[1].moveToY(this.secondYPoint, this.projection);

             this.drawPriceCalculation();
             this.drawPriceCalculationText();
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private drawPriceCalculation(): void{
        let points: PriceCalculationPoints = this._markerPoints();
        this.context.scxStrokePolyline([points.firstLineStartPoint , points.firstLineEndPoint] ,  this.getDrawingTheme().line);
        this.context.scxStrokePolyline([ points.secondLineStartPoint , points.secondLineEndPoint ] ,  this.getDrawingTheme().line);
        this.context.scxStrokePolyline([ points.secondLineMidPoint , points.firstLineMidPoint] , this.getDrawingTheme().line);
    }

    private drawPriceCalculationText() {
        let points: PriceCalculationPoints = this._markerPoints() ,
            price1: number = this.projection.valueByY(points.firstLineStartPoint.y),
            price2: number = this.projection.valueByY(points.secondLineStartPoint.y),
            priceChange: number = price2 - price1,
            priceText: string = this.formatLevelText(priceChange , DrawingLevelsFormatType.PRICE),
            priceTextSize: ISize = DummyCanvasContext.measureText(priceText, this.getDrawingTheme().text as ITextTheme),
            changePercentText: string = ((priceChange / price1) * 100).toFixed(2) + ' ' + '%',
            textDrawingPoint: IPoint = {
                x: this.getTextHorizontalPosition(priceTextSize, points.midPoint),
                y: this.getTextVerticalPosition(priceTextSize)
            };
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        this.context.fillText(priceText, textDrawingPoint.x, textDrawingPoint.y);
        this.context.fillText(changePercentText, textDrawingPoint.x, textDrawingPoint.y + priceTextSize.height);
    }

    private getTextHorizontalPosition(textSize: ISize, midPoint:IPoint): number{
        let position: number = 0,
            padding: number = 10;
        switch (this.getTextHorizontalPositionAlignment()) {
            case DrawingTextHorizontalPosition.RIGHT:
                position = midPoint.x + textSize.width + padding;
                break;
            case DrawingTextHorizontalPosition.CENTER:
                position = midPoint.x;
                break;
            case DrawingTextHorizontalPosition.LEFT:
                position =  midPoint.x - textSize.width - padding;
                break;
            default:
                throw new Error("Unknown horizontal text position type: " + this.getTextHorizontalPositionAlignment());
        }
        return position;
    }

    private getTextVerticalPosition(textSize: ISize): number{
        let position: number = 0,
            textOffset: number = 8,
            points: PriceCalculationPoints = this._markerPoints();
        switch (this.getTextVerticalPositionAlignment()) {
            case DrawingTextVerticalPosition.TOP:
                let isOnTopSide: boolean = points.firstLineMidPoint.y > points.secondLineMidPoint.y;
                position = isOnTopSide ?  points.secondLineMidPoint.y + textSize.height : points.firstLineMidPoint.y + textSize.height;
                break;
            case DrawingTextVerticalPosition.MIDDLE:
                position = points.midPoint.y;
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                let isOnBottomSide: boolean = points.firstLineMidPoint.y < points.secondLineMidPoint.y;
                    position = isOnBottomSide ? points.secondLineMidPoint.y - textSize.height - textOffset: points.firstLineMidPoint.y - textSize.height - textOffset;
                break;
            default:
                throw new Error("Unknown vertical text position type: " + this.getTextVerticalPositionAlignment());
        }
        return position;
    }

    private _markerPoints(): PriceCalculationPoints{
        let points: IPoint[] = this.cartesianPoints();
        if (points.length === 0)
            return null;

            let midXAxis: number = (points[1].x + points[0].x) / 2,
                midYAxis: number = (this.secondYPoint + points[0].y) / 2;

            return {
                firstLineStartPoint: {x: points[0].x, y: points[0].y},
                firstLineEndPoint: {x : points[1].x, y : points[0].y},
                firstLineMidPoint: {x:midXAxis , y:points[0].y},
                secondLineStartPoint: {x: points[1].x, y: this.secondYPoint},
                secondLineEndPoint: {x: points[0].x , y: this.secondYPoint},
                secondLineMidPoint: {x: midXAxis , y: this.secondYPoint},
                midPoint: {x:midXAxis , y:midYAxis}
            };
    }

    private _calculateSecondYPoint(points : IPoint[]): number{
        let yValue ;
        if(this._dragPoint === DrawingDragPoint.ALL){
            //Drag
            if(this.priceDiff === 0){ //To Take only the first price before dragging.
                this.priceDiff = this.projection.valueByY(points[1].y) - this.projection.valueByY(points[0].y);
            }
            let secondPointsPrice =  this.priceDiff + this.projection.valueByY(points[0].y);
            yValue =  this.projection.yByValue(secondPointsPrice);
        }else{
            //Not Drag
            this.priceDiff = 0;
            yValue =  points[1].y;
        }

        return yValue;
    }

}

interface PriceCalculationPoints{
    firstLineStartPoint: IPoint,
    secondLineStartPoint: IPoint,
    firstLineEndPoint?: IPoint,
    secondLineEndPoint?: IPoint,
    firstLineMidPoint?: IPoint,
    secondLineMidPoint?: IPoint,
    midPoint?: IPoint
}

Drawing.register(PriceCalculationDrawing);
