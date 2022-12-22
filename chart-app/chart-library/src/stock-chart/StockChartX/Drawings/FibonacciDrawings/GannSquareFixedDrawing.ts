import {Drawing} from '../Drawing';
import {GannSquareDrawingBase} from './GannSquareDrawingBase';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {GannSquareDrawingTheme, GannSquareFixedDrawingTheme} from '../DrawingThemeTypes';


export class GannSquareFixedDrawing extends GannSquareDrawingBase<GannSquareFixedDrawingTheme> {
    static get className(): string {
        return 'gannSquareFixed';
    }

    fansValue = [8, 5, 4, 3, 2, 1, 2, 3, 4, 5, 8];
    arcsValue = [1, 1.4, 1.5, 2, 2.3, 3, 3.2, 4, 4.15, 5, 5.1];
    inDrawingState: boolean = true;

    get pointsNeeded(): number {
        return 2;
    }

    startUserDrawing() {
        super.startUserDrawing();
        this.inDrawingState = false;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        if (points.length < this.pointsNeeded)
            return false;

        if (this.getDrawingTheme().reverse)
            this.reversePoints(points);

        return (Geometry.isPointNearPoint(point, points) || this.levelsHitTest(point,points) || this.fansHitTest(point,points));
    }

    private levelsHitTest(point: IPoint, points: IPoint[]) {
        let distance = this._calculateDistance(points);
        let quarter = this._getQuarter(points);
        let horizontalDistance = this._horizontalDistance(quarter , distance);
        let verticalDistance = this._verticalDistance(quarter , distance);

        for (let i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;



            let point1 = {
                x: points[0].x,
                y: points[0].y + (verticalDistance * i)
            };

            let point2 = {
                x: points[0].x + (horizontalDistance * 5),
                y: points[0].y + (verticalDistance * i)
            };

            let point3 = {
                x: points[0].x + (i * horizontalDistance),
                y: points[0].y
            };

            let point4 = {
                x: points[0].x + (i * horizontalDistance),
                y:points[0].y + (verticalDistance * 5)
            };

            if (Geometry.isPointNearLine(point, point1, point2) || Geometry.isPointNearLine(point, point3, point4))
                return true;

        }



















    }

    private fansHitTest(point: IPoint, points: IPoint[]) {
        let distance = this._calculateDistance(points);
        let quarter = this._getQuarter(points);
        let horizontalDistance = this._horizontalDistance(quarter , distance);
        let verticalDistance = this._verticalDistance(quarter , distance);

        for (let i = 0; i < this.fansValue.length; i++) {
            if (!this._isLevelVisible(this.fans[i]))
                continue;

            let point2, point3;
            let point1 = {
                x: points[0].x,
                y: points[0].y
            };

            if (i < 6) {
                point2 = {
                    x: points[0].x + ((horizontalDistance * 5) / this.fansValue[i]),
                    y: points[0].y + (verticalDistance * 5)
                };
                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            } else {
                point3 = {
                    x: points[0].x + (5 * horizontalDistance),
                    y: points[0].y + ((verticalDistance * 5) / this.fansValue[i])
                };
                if (Geometry.isPointNearLine(point, point1, point3))
                    return true;
            }
        }
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
            if (this.getDrawingTheme().reverse)
               this.reversePoints(points);

            this.drawLevels(points);

            this.drawFans(points);

            this.drawArcs(points);
        }

        if (this.selected) {
            this._drawSelectionMarkers(this.getMarkerPoints());
        }
    }

    private drawLevels(points: IPoint[]) {
        let distance = this._calculateDistance(points);
        let quarter = this._getQuarter(points);
        let horizontalDistance = this._horizontalDistance(quarter , distance);
        let verticalDistance = this._verticalDistance(quarter , distance);

        for (let i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;

            this.context.beginPath();
            this.context.moveTo(points[0].x, points[0].y + (verticalDistance * i));
            this.context.lineTo(points[0].x + (horizontalDistance * 5), points[0].y + (verticalDistance * i));
            this.context.moveTo(points[0].x + (i * horizontalDistance), points[0].y);
            this.context.lineTo(points[0].x + (i * horizontalDistance), points[0].y + (verticalDistance * 5));
            this.context.scxStroke(this.levels[i].theme.line);
        }
    }

    private drawFans(points: IPoint[]) {
        let distance = this._calculateDistance(points);
        let quarter = this._getQuarter(points);
        let horizontalDistance = this._horizontalDistance(quarter , distance);
        let verticalDistance = this._verticalDistance(quarter , distance);

        for (let i = 0; i < this.fansValue.length; i++) {
            if (!this._isLevelVisible(this.fans[i]))
                continue;

            if (i < 6) {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(points[0].x + ((horizontalDistance * 5) / this.fansValue[i]), points[0].y + (verticalDistance * 5));
                this.context.scxStroke(this.fans[i].theme.line);
            } else {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(points[0].x + (5 * horizontalDistance), points[0].y + ((verticalDistance * 5) / this.fansValue[i]));
                this.context.scxStroke(this.fans[i].theme.line);
            }
        }

    }

    private drawArcs(points: IPoint[]) {
        let distance = this._calculateDistance(points);
        let quarter = this._getQuarter(points);
        let startAngle = this._startAngle(quarter);
        let endAngle = this._endAngle(quarter);
        let previousDistance = 0;

        for (let i = 0; i < this.arcsValue.length; i++) {
            if (!this._isLevelVisible(this.arcs[i]))
                continue;

            //Draw arc
            this.context.beginPath();
            this.context.arc(points[0].x, points[0].y, distance * this.arcsValue[i], startAngle, endAngle);
            this.context.scxStroke(this.arcs[i].theme.line);

            // //Fill arc
            if (this.getDrawingTheme().showLevelBackgrounds) {
                let newDistance = (this.arcsValue[i] * (distance));
                this.context.beginPath();
                this.context.arc(points[0].x, points[0].y, previousDistance, startAngle, endAngle);
                this.context.arc(points[0].x, points[0].y, newDistance, endAngle, startAngle, true);
                this.context.scxFill(this.arcs[i].theme.fill);
                previousDistance = newDistance;
            }
        }

    }

    private reversePoints(points: IPoint[]) {
        let xo = points[0].x;
        let yo = points[0].y;
        points[0].x = points[1].x;
        points[0].y = points[1].y;
        points[1].x = xo;
        points[1].y = yo;
    }

    private _calculateDistance(points: IPoint[]) {
        return Math.sqrt(Math.pow((points[1].x - points[0].x), 2) + Math.pow((points[1].y - points[0].y), 2));
    }

    private _getQuarter(points: IPoint[]) {
        let quarter = 0;
        if (points[0].y < points[1].y) {
            if (points[0].x < points[1].x) {
                quarter = 3;
            } else {
                quarter = 4;
            }
        } else {
            if (points[0].x < points[1].x) {
                quarter = 2;
            } else {
                quarter = 1;
            }
        }

        return quarter;
    }

    private _horizontalDistance(quarter: number, distance: number) {
        switch (quarter) {
            case 1:
                return -distance;
            case 2:
                return distance;
            case 3:
                return distance;
            case 4:
                return -distance;
        }
    }

    private _verticalDistance(quarter: number, distance: number) {
        switch (quarter) {
            case 1:
                return -distance;
            case 2:
                return -distance;
            case 3:
                return distance;
            case 4:
                return distance;
        }
    }

    private _startAngle(quarter: number) {
        switch (quarter) {
            case 1:
                return Math.PI;
            case 2:
                return -0.5 * Math.PI;
            case 3:
                return 0;
            case 4:
                return 0.5 * Math.PI;
        }
    }

    private _endAngle(quarter: number) {
        switch (quarter) {
            case 1:
                return -0.5 * Math.PI;
            case 2:
                return 0;
            case 3:
                return 0.5 * Math.PI;
            case 4:
                return Math.PI;
        }
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        this.inDrawingState = true;
    }

    private getMarkerPoints(): IPoint[] {
        let markers = [this.cartesianPoints()[0]];
        if (this.inDrawingState) {
            markers.push(this.cartesianPoints()[1]);
        }
        return markers;
    }

}
Drawing.register(GannSquareFixedDrawing);
