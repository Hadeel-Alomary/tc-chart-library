import {FibonacciDrawingBase} from './FibonacciDrawingBase';
import {Drawing, IDrawingLevel, IDrawingOptions} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {IPoint} from '../../Graphics/ChartPoint';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {FibonacciSpeedResistanceArcsDrawingTheme} from '../DrawingThemeTypes';


export class FibonacciSpeedResistanceArcsDrawing extends FibonacciDrawingBase<FibonacciSpeedResistanceArcsDrawingTheme> {


    static get className(): string {
        return 'fibonacciSpeedResistanceArcs';
    }

    get showFullCircle(): boolean {
        return this.getDrawingTheme().showFullCircle;
    }

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;

        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;

            let centerPoint = {x:points[0].x , y:points[0].y};
            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let Radius = level.value * this.distance(points);

                if(this.showFullCircle) {
                    if (Geometry.isPointNearCircle(point,centerPoint,Radius))
                        return true;
                }else {
                    if(points[0].y < points[1].y && point.y >points[0].y) {
                        if (Geometry.isPointNearCircle(point,centerPoint,Radius))
                            return true;
                    }
                    if(points[0].y > points[1].y && point.y < points[0].y) {
                        if (Geometry.isPointNearCircle(point,centerPoint,Radius))
                            return true;
                    }
                }
        }
        return this.selected && Geometry.isPointNearPoint(point, points);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this.cartesianPoints();
                if (points.length > 1) {
                    for (let i = 0; i < points.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
                    }
                }

                break;
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
        if (points.length === 0)
            return;

        if (points.length > 1) {
            let previousDistance = 0;
            let distance = this.distance(points);
            let startAngle = this.startAngle(points);
            let endAngle = this.endAngle(points);


            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;
                //Draw Arcs ...
                this.drawArcs(points, level);
                //Draw Levels Value ...
                this.drawLevelsValueIfVisible(points, level);
                //Fill Arcs ...
                if (this.getDrawingTheme().showLevelBackgrounds) {
                    let newDistance = (level.value * (distance));
                    this.context.beginPath();
                    this.context.arc(points[0].x, points[0].y, previousDistance, startAngle, endAngle);
                    this.context.arc(points[0].x, points[0].y, newDistance, endAngle, startAngle, true);
                    this.context.scxFill(level.theme.fill);
                    previousDistance = newDistance;
                }
            }

            //Draw Trend Line ...
            this.drawTrendLineIfVisible(points);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private drawTrendLineIfVisible(points: IPoint[]) {
        if (this.getDrawingTheme().trendLine.strokeEnabled) {
            this.context.scxStrokePolyline(points, this.getDrawingTheme().trendLine);
        }
    }

    private drawArcs(points: IPoint[], level: IDrawingLevel) {
        let distance = this.distance(points);
        let startAngle = this.startAngle(points);
        let endAngle = this.endAngle(points);
        this.context.beginPath();
        this.context.arc(points[0].x, points[0].y, distance * level.value, startAngle, endAngle);
        this.context.scxStroke(level.theme.line);
    }

    private drawLevelsValueIfVisible(points: IPoint[], level: IDrawingLevel) {
        let textPosition = this.textPosition(points);
        if (this.getDrawingTheme().showLevelValues) {
            this.context.scxApplyTextTheme(level.theme.text);
            this.context.fillText(level.value.toString(), points[0].x, points[0].y + textPosition * level.value);
        }
    }

    private distance(points: IPoint[]) {
        return Math.sqrt(Math.pow((points[1].x-points[0].x), 2)+ Math.pow((points[1].y-points[0].y), 2)) ;
    }

    private startAngle(points: IPoint[]) {
        let isOnTopSide = points[0].y > points[1].y;
        let startAngle = isOnTopSide ? Math.PI : 0;
        if (this.showFullCircle) {
            startAngle = 0;
        }
        return startAngle;
    }

    private endAngle(points: IPoint[]) {
        let isOnTopSide = points[0].y > points[1].y;
        let endAngle = isOnTopSide ? 0 : Math.PI;
        if (this.showFullCircle) {
            endAngle = 2 * Math.PI;
        }
        return endAngle;
    }

    private textPosition(points: IPoint[]) {
        let distance = this.distance(points);
        let isOnTopSide = points[0].y > points[1].y;
        return isOnTopSide ? -distance : distance;
    }

}
Drawing.register(FibonacciSpeedResistanceArcsDrawing);
