
import {LineSegmentDrawing} from "./LineSegmentDrawing";
import {Drawing, IDrawingOptions} from "../Drawing";
import {IPoint} from "../../Graphics/ChartPoint";
import {DrawingCalculationUtil} from "../../Utils/DrawingCalculationUtil";
import {LineStyle, IStrokeTheme, ITextTheme} from "../../Theme";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {Geometry} from "../../Graphics/Geometry";

export interface IAngleLineSegmentDrawingOptions extends IDrawingOptions {
    angle:number;
    distance:number;
}

export class AngleLineSegmentDrawing extends LineSegmentDrawing{

    static get className(): string {
        return 'angleLineSegment';
    }

    private _angleLineTheme:IStrokeTheme = {
        width: 1,
        lineStyle: LineStyle.DASH,
        strokeColor: "#555"
    };
    private get angleLineTheme():IStrokeTheme{
        //NK sync with line theme
        this._angleLineTheme.width = this.getDrawingTheme().line.width;
        this._angleLineTheme.strokeColor= this.getDrawingTheme().line.strokeColor;
        return this._angleLineTheme;
    }

    private _angleLineTextTheme:ITextTheme = {
        fontFamily: 'Arial',
        fontSize: 14,
        fontStyle: "normal",
        fillColor: "#333",
        fontWeight: "bold"
    };
    private get angleLineTextTheme():ITextTheme{
        //NK sync with line theme
        this._angleLineTextTheme.fillColor = this.getDrawingTheme().line.strokeColor;
        return this._angleLineTextTheme;
    }

    private get basicRadius():number{
        return 50;
    }

    private get angle():number{
        return (<IAngleLineSegmentDrawingOptions>this._options).angle;
    }

    private set angle(value:number){
        (<IAngleLineSegmentDrawingOptions>this._options).angle = value;
    }

    private get distance():number{
        return (<IAngleLineSegmentDrawingOptions>this._options).distance;
    }

    private set distance(value:number){
        (<IAngleLineSegmentDrawingOptions>this._options).distance = value;
    }

    draw() {
        if (!this.visible) {
            return;
        }

        let points:IPoint[] = this.cartesianPoints();

        if (this.pointsNeeded == points.length) {
            this.keepOnCurrentAngle(points);
            this.drawBasicTrendLine(points[0], points[1]);
            this.drawAngle(points[0]);
            this.fillDegreeText(points[0]);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    /* Drawing gesture */

    protected onMoveChartPointInUserDrawingState():void {
        super.onMoveChartPointInUserDrawingState();

        let allChartPointsAdded: boolean = this.chartPoints.length == this.pointsNeeded;
        if (allChartPointsAdded) {
            this.compute();
        }
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        let points = this.cartesianPoints();
        switch (gesture.state) {
            case GestureState.STARTED:
                for (let i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    this.compute();
                    return true;
                }
                break;
        }

        return false;
    }

    /* Compute methods */

    private keepOnCurrentAngle(points:IPoint[]):void{
        let newAnglePoint: IPoint = DrawingCalculationUtil.calculatePointFromAngleAndPoint(this.angle, points[0], this.distance);
        let lastAnglePoint: IPoint = points[1];

        let shouldChangePoint: boolean = newAnglePoint.x != lastAnglePoint.x || newAnglePoint.y != lastAnglePoint.y;
        if (shouldChangePoint) {
            this.chartPoints[1].moveToPoint(newAnglePoint, this.projection);
            this.chartPanel.setNeedsUpdate();
        }
    }

    private compute():void{
        let points:IPoint[] = this.cartesianPoints();
        this.distance = DrawingCalculationUtil.calculateDistanceBetweenTwoPoints(points[0], points[1]);
        this.angle = DrawingCalculationUtil.calculateAngleBetweenTwoPointsInRadians(points[0], points[1]);
    }

    /* Drawing methods */

    private drawBasicTrendLine(point1:IPoint, point2:IPoint):void{
        this.context.beginPath();
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
        this.context.scxStroke(this.getDrawingTheme().line);
    }

    private drawAngle(point:IPoint):void {
        this.context.beginPath();
        this.context.moveTo(point.x, point.y);
        //NK for more understanding please check the below url:
        //https://stackoverflow.com/questions/6746598/what-is-start-angle-and-end-angle-of-arc-in-html5-canvas
        if (0 <= this.angle) {
            //NK Move the context to the start point of the arc to avoid draw line between point1 and the start of the arc
            let x: number = point.x + (this.basicRadius * Math.cos(this.angle));
            let y: number = point.y - (this.basicRadius * Math.sin(this.angle));
            this.context.moveTo(x, y);
            this.context.arc(point.x, point.y, this.basicRadius, -this.angle, 0);
            this.context.moveTo(point.x, point.y);
            this.context.lineTo(point.x + this.basicRadius, point.y);
        } else {
            this.context.arc(point.x, point.y, this.basicRadius, 0, -this.angle);
        }

        this.context.scxStroke(this.angleLineTheme);
    }

    private fillDegreeText(point:IPoint):void{
        let degrees:number = DrawingCalculationUtil.convertRadianToDegree(this.angle);
        let halfDegree:number = degrees / 2;
        //NK get the center of the arc
        let x:number = point.x + (this.basicRadius * Math.cos(DrawingCalculationUtil.convertDegreeToRadian(halfDegree)));
        let y:number = point.y - (this.basicRadius * Math.sin(DrawingCalculationUtil.convertDegreeToRadian(halfDegree)));

        //NK give it some margin
        x += 10;
        if(degrees < 0){
            y += 10;
        }

        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.scxApplyTextTheme(this.angleLineTextTheme);
        this.context.fillText(Math.round(degrees) + "°", x, y);
    }
}

Drawing.register(AngleLineSegmentDrawing);
