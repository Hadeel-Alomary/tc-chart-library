import {Drawing, IDrawingOptions} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {ChartPoint, IChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export interface IPolyLineDrawingOptions extends IDrawingOptions {
    closeTheShape: boolean;
}


export class PolyLineDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'polyLine';
    }

    get pointsNeeded(): number {
        return Number.MAX_VALUE;
    }

    hitTest(point: IPoint): boolean {
        let points: IPoint[] = this.cartesianPoints();
        let lastDrownLine = this.lastDrawnLine();
        if (points.length < 2)
            return false;

        return Geometry.isPointNearPolyline(point, points) || Geometry.isPointNearPolyline(point, [lastDrownLine.startPoint, lastDrownLine.endPoint]);
    }

    protected _handleUserDrawingPoint(point: IChartPoint) {
        if (this.chartPoints.length > 1) {
            let currentPoint = new ChartPoint(point).toPoint(this.projection);
            let lastPoint = this.cartesianPoint(this.chartPoints.length - 1);

            // finish drawing If the last point is the same as the previous point .
            if (Geometry.isPointNearPoint(currentPoint, lastPoint)) {
                this._finishUserDrawing();
                return true;
            }

            // close the shape when last point equal first point (point[0]) during the drawing .
            if (Geometry.isPointNearPoint(currentPoint, this.cartesianPoints()[0])) {
                this.closeTheShape = true;
                this._finishUserDrawing();
                return true;
            }
        }
        this.appendChartPoint(point);

        return true;
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this.cartesianPoints();
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
                    points = this.chartPoints;
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    // close the shape when last point equal first point (point[0]) after drawing ( during dragging ) .
                    if (Geometry.isPointNearPoint(this.cartesianPoints()[this.cartesianPoints().length - 1], this.cartesianPoints()[0])) {
                        this.closeTheShape = true;
                    }
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
            this.context.beginPath();
            this.context.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                this.context.lineTo(points[i].x, points[i].y);
            }
            this.context.scxStroke(this.getDrawingTheme().line);

            if (this.closeTheShape) {
                this.context.lineTo(points[0].x, points[0].y);
                this.context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private lastDrawnLine() {
        let points = this.cartesianPoints();
        return {
            startPoint: points[0],
            endPoint: points[points.length - 1]
        };
    }

    canControlPointsBeManuallyChanged(): boolean {
        return false;
    }

    get closeTheShape(): boolean {
        if ((<IPolyLineDrawingOptions> this._options).closeTheShape == undefined)
            (<IPolyLineDrawingOptions> this._options).closeTheShape = false;

        return (<IPolyLineDrawingOptions> this._options).closeTheShape;
    }

    set closeTheShape(value: boolean) {
        (<IPolyLineDrawingOptions> this._options).closeTheShape = !!value;
    }

    protected shouldDrawMarkers(): boolean {
        return false;
    }


}

Drawing.register(PolyLineDrawing);
