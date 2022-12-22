import {Drawing, DrawingDragPoint} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {IPoint} from '../../Graphics/ChartPoint';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {DrawingCalculationUtil} from '../../Utils/DrawingCalculationUtil';
import {ParallelChanelDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';
import {DrawingsHelper} from '../../Helpers/DrawingsHelper';

export class ParallelChannelDrawing extends ThemedDrawing<ParallelChanelDrawingTheme> {
    private _splits: number[] = [0, 1];
    private _linePoints: { [key: number]: ParallelChannelDrawingPoints } = {};
    private _distance: number = 0;

    static get className(): string {
        return 'parallelChannel';
    }

    get pointsNeeded(): number {
        return 3;
    }

    hitTest(point: IPoint): boolean {
        if (Object.keys(this._linePoints).length  < this.pointsNeeded) {
            return false;
        }

        return Geometry.isPointNearPolyline(point, [this._linePoints[0].startPoint, this._linePoints[0].endPoint]) ||
            Geometry.isPointNearPolyline(point, [this._linePoints[1].startPoint, this._linePoints[1].endPoint]) || (
                Geometry.isPointNearPolyline(point, [this._linePoints[2].startPoint, this._linePoints[2].endPoint]) &&
                this.getDrawingTheme().middleLine.strokeEnabled);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points: IPoint[] = this.cartesianPoints();
                for (let i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint: IPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
            case GestureState.FINISHED:
                if (this._dragPoint) {
                    this._setDragPoint(DrawingDragPoint.NONE);
                    return true;
                }
                break;
        }
        return false;
    }

    draw() {
        if (!this.visible) {
            return;
        }

        let points: IPoint[] = this.cartesianPoints();

        let extendLeft: boolean = this.getDrawingTheme().linesExtension.leftExtensionEnabled;
        let extendRight: boolean = this.getDrawingTheme().linesExtension.rightExtensionEnabled;

        if (points.length >= 2) {

            if (this._dragPoint && this._dragPoint == 2)
                this._distance = this.computeDistance(points);
            if (!this._dragPoint)
                this._distance = this.computeDistance(points);

            this.context.beginPath();

            for (let i = 0; i < this._splits.length; i++) {
                let rayStart: IPoint = {x: points[0].x, y: points[0].y};
                let rayEnd: IPoint = {x: points[1].x, y: points[1].y};

                if (rayStart.x < rayEnd.x) {
                    rayStart = {x: points[1].x, y: points[1].y};
                    rayEnd = {x: points[0].x, y: points[0].y};
                }

                rayStart.y -= this._splits[i] * this._distance;
                rayEnd.y -= this._splits[i] * this._distance;

                if(points.length == this.pointsNeeded && i == 1) {
                    this.setCenterPoint(points, rayStart, rayEnd);
                }

                if (extendLeft) {
                    rayEnd = DrawingsHelper.getExtendedLineEndPoint(rayStart, rayEnd, this.chartPanel);
                }

                if (extendRight) {
                    rayStart = DrawingsHelper.getExtendedLineEndPoint(rayEnd, rayStart, this.chartPanel);
                }

                this.addLinePoints(i, rayStart, rayEnd);

                this.context.scxStrokePolyline([rayStart, rayEnd], this.getDrawingTheme().line);
            }

            if (points.length == this.pointsNeeded) {
                if (this.getDrawingTheme().middleLine.strokeEnabled) {
                    this.drawMiddleLine();
                }

                this.context.scxFillPolyLine([
                    this._linePoints[0].startPoint, this._linePoints[0].endPoint, this._linePoints[1].endPoint, this._linePoints[1].startPoint
                ], this.getDrawingTheme().fill);
            }
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private computeDistance(points: IPoint[]): number {
        let midPointY: number = (points[0].y + points[1].y) / 2;
        return points.length == 3 ? midPointY - points[2].y : 0;
    }

    private drawMiddleLine() {
        let startPoint: IPoint = {
            x: (this._linePoints[0].startPoint.x + this._linePoints[1].startPoint.x) / 2,
            y: (this._linePoints[0].startPoint.y + this._linePoints[1].startPoint.y) / 2
        };

        let endPoint: IPoint = {
            x: (this._linePoints[0].endPoint.x + this._linePoints[1].endPoint.x) / 2,
            y: (this._linePoints[0].endPoint.y + this._linePoints[1].endPoint.y) / 2
        };

        this.addLinePoints(2, startPoint, endPoint);
        this.context.scxStrokePolyline([startPoint, endPoint], this.getDrawingTheme().middleLine);
    }

    private addLinePoints(index: number, startPoint: IPoint, endPoint: IPoint) {
        this._linePoints[index] = {startPoint: startPoint, endPoint: endPoint};
    }

    private setCenterPoint(points: IPoint[], rayStart: IPoint, rayEnd: IPoint) {
        let centerPoint: IPoint = DrawingCalculationUtil.centerPointOfLine(rayStart, rayEnd);
        points[2] = {x: centerPoint.x, y: centerPoint.y};
        this.chartPoints[2].moveToPoint(centerPoint, this.projection);
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
    }
}

interface ParallelChannelDrawingPoints {
    startPoint: IPoint,
    endPoint: IPoint
}

Drawing.register(ParallelChannelDrawing);
