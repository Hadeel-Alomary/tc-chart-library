import {ThemedDrawing} from '../ThemedDrawing';
import {LineDrawingTheme} from '../DrawingThemeTypes';
import {Drawing} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {IPoint} from '../../Graphics/ChartPoint';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {PanGesture} from '../../Gestures/PanGesture';
import {DrawingsHelper} from '../../Helpers/DrawingsHelper';

export class GridDrawing extends ThemedDrawing<LineDrawingTheme> {
    private gridLines: number = 10;
    private linesPoints: Array<IPoint[]>;

    static get className(): string {
        return 'grid';
    }

    get pointsNeeded(): number {
        return 2;
    }

    private _markerPoints(): GridPoints {
        let points: IPoint[] = this.cartesianPoints();
        if (points.length === 0) {
            return null;
        }
        return {
            firstPoint: {x: points[0].x, y: points[0].y},
            secondPoint: {x: points[1].x, y: points[1].y},
        };
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded) {
            return false;
        }

        if(!this.linesPoints){
            return false;
        }

        let pointsOfLines: Array<IPoint[]> = this.linesPoints;
        for(let i = 0; i < pointsOfLines.length; i++) {
            let startPoint = pointsOfLines[i][0];
            let endPoint = pointsOfLines[i][1];
            if (Geometry.isPointNearPolyline(point, [startPoint, endPoint]))
                return true;
        }
        return false;
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

    public draw() {
        if (!this.visible) {
            return;
        }

        let points = this.cartesianPoints();

        if (points.length === 0)
            return;

        if (points.length > 1) {
            this.drawLines();
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private drawLines() {
        let points = this._markerPoints();
        let context = this.context;
        let pointsOfLines: Array<IPoint[]> = this.linesPoints = this._calculateLinesPoints(points);

        context.beginPath();

        for(let lineNumber = 0; lineNumber < pointsOfLines.length; lineNumber++ ){
            let startPoint: IPoint = {x : pointsOfLines[lineNumber][0].x , y: pointsOfLines[lineNumber][0].y}; //starting point
            let endPoint: IPoint = {x : pointsOfLines[lineNumber][1].x , y: pointsOfLines[lineNumber][1].y}; // end points

            context.scxStrokePolyline([startPoint , endPoint] ,this.getDrawingTheme().line);
        }
    }

    private _calculateLinesPoints(points: GridPoints): Array<IPoint[]> {
        let drawingPoints: Array<IPoint[]> = [];

        let diffX: number = points.secondPoint.x - points.firstPoint.x;
        let diffY: number = points.secondPoint.y - points.firstPoint.y;

        for(let lineNumber = -this.gridLines; lineNumber < this.gridLines; lineNumber++) {
            let startPoint: IPoint =  {x: points.firstPoint.x+diffX*lineNumber, y: points.firstPoint.y-diffY*lineNumber};
            let endPoint: IPoint = {x: points.secondPoint.x+diffX*lineNumber, y: points.secondPoint.y-diffY*lineNumber};
            let firstExtendedPoint: IPoint = DrawingsHelper.getExtendedLineEndPoint(endPoint, startPoint, this.chartPanel),
                secondExtendedPoint: IPoint = DrawingsHelper.getExtendedLineEndPoint(startPoint, endPoint, this.chartPanel);
            drawingPoints.push([firstExtendedPoint, secondExtendedPoint]);

            startPoint =  {x: points.firstPoint.x+diffX*lineNumber, y: points.firstPoint.y+diffY*lineNumber};
            endPoint =  {x: points.firstPoint.x+diffX+diffX*lineNumber, y: points.firstPoint.y-diffY+diffY*lineNumber};
            firstExtendedPoint = DrawingsHelper.getExtendedLineEndPoint(endPoint, startPoint, this.chartPanel);
            secondExtendedPoint = DrawingsHelper.getExtendedLineEndPoint(startPoint, endPoint, this.chartPanel);
            drawingPoints.push([firstExtendedPoint, secondExtendedPoint]);
        }

        return drawingPoints;
    }
}

interface GridPoints {
    firstPoint: IPoint,
    secondPoint: IPoint,
}

Drawing.register(GridDrawing);
