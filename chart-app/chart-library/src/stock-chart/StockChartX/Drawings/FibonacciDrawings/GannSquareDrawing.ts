import {Drawing, IDrawingOptions} from '../Drawing';
import {PanGesture} from '../../Gestures/PanGesture';
import {Gesture, GestureState, WindowEvent} from '../../Gestures/Gesture';
import {Geometry} from '../../Graphics/Geometry';
import {IChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {GannSquareDrawingBase} from './GannSquareDrawingBase';
import {MeasuringUtil} from '../../Utils/MeasuringUtil';
import {FibonacciTimeZonesDrawingTheme, GannSquareDrawingTheme} from '../DrawingThemeTypes';

export interface IGannSquareDrawingOptions extends IDrawingOptions {
    endUserDrawing?: boolean;
}

export class GannSquareDrawing extends GannSquareDrawingBase<GannSquareDrawingTheme> {
    static get className(): string {
        return 'gannSquare';
    }

    fansValue = [8, 5, 4, 3, 2, 1, 2, 3, 4, 5, 8];
    arcsValue = [1, 1.4, 1.5, 2, 2.3, 3, 3.2, 4, 4.15, 5, 5.1];
    thirdPoint: IPoint;
    rangeAndRatio: number;

    get pointsNeeded(): number {
        return 2;
    }

    get endUserDrawing(): boolean {
        if ((<IGannSquareDrawingOptions> this._options).endUserDrawing == undefined)
            (<IGannSquareDrawingOptions> this._options).endUserDrawing = false;

        return (<IGannSquareDrawingOptions> this._options).endUserDrawing;
    }

    set endUserDrawing(value: boolean) {
        (<IGannSquareDrawingOptions> this._options).endUserDrawing = value;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        if (points.length < this.pointsNeeded)
            return false;

        return this.levelsHitTest(point, points) || this.fansHitTest(point, points) || (Geometry.isPointNearPoint(point, points));
    }

    private levelsHitTest(point: IPoint, points: IPoint[]) {
        let thirdPoint = this._calculateThirdPoint(points);
        for (let i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;

            let point1 = {
                x: points[0].x,
                y: points[0].y - i * ((points[0].y - thirdPoint.y) / 5)
            };

            let point2 = {
                x: thirdPoint.x,
                y: points[0].y - i * ((points[0].y - thirdPoint.y) / 5)
            };

            let point3 = {
                x: points[0].x + i * ((thirdPoint.x - points[0].x) / 5),
                y: points[0].y
            };

            let point4 = {
                x: points[0].x + i * ((thirdPoint.x - points[0].x) / 5),
                y: thirdPoint.y
            };

            if (Geometry.isPointNearLine(point, point1, point2) || Geometry.isPointNearLine(point, point3, point4))
                return true;
        }
    }

    private fansHitTest(point: IPoint, points: IPoint[]) {
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
                    x: this.thirdPoint.x,
                    y: points[0].y - ((points[0].y - this.thirdPoint.y) / this.fansValue[i])
                };
                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            } else {
                point3 = {
                    x: points[0].x + ((this.thirdPoint.x - points[0].x) / this.fansValue[i]),
                    y: this.thirdPoint.y
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
            this.thirdPoint = this._calculateThirdPoint(points);

            this.drawLevels(points);
            this.drawFans(points);
            this.drawArcs(points);
            this.drawText(points);
        }

        if (this.selected) {
            this._drawSelectionMarkers(this.getMarkerPoints());
        }
    }

    private drawLevels(points: IPoint[]) {
        for (let i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;

            this.context.beginPath();
            this.context.moveTo(points[0].x, points[0].y - i * ((points[0].y - this.thirdPoint.y) / 5));
            this.context.lineTo(this.thirdPoint.x, points[0].y - i * ((points[0].y - this.thirdPoint.y) / 5));
            this.context.moveTo(points[0].x + i * ((this.thirdPoint.x - points[0].x) / 5), points[0].y);
            this.context.lineTo(points[0].x + i * ((this.thirdPoint.x - points[0].x) / 5), this.thirdPoint.y);
            this.context.scxStroke(this.levels[i].theme.line);
        }
    }

    private drawFans(points: IPoint[]) {
        for (let i = 0; i < this.fansValue.length; i++) {
            if (!this._isLevelVisible(this.fans[i]))
                continue;

            if (i < 6) {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(this.thirdPoint.x, points[0].y - ((points[0].y - this.thirdPoint.y) / this.fansValue[i]));
                this.context.scxStroke(this.fans[i].theme.line);
            } else {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(points[0].x + ((this.thirdPoint.x - points[0].x) / this.fansValue[i]), this.thirdPoint.y);
                this.context.scxStroke(this.fans[i].theme.line);
            }
        }
    }

    private drawArcs(points: IPoint[]) {
        let quarter = this._getQuarter([points[0], {x: this.thirdPoint.x, y: this.thirdPoint.y}]);
        let angles = this._angles(quarter);
        let prevWidth = 0;
        let prevHeight = 0;
        for (let i = 0; i < this.arcsValue.length; i++) {
            if (!this._isLevelVisible(this.arcs[i]))
                continue;

            //Draw
            this.context.beginPath();
            this.context.ellipse(points[0].x, points[0].y, (this.arcsValue[i] * Math.abs((this.thirdPoint.x - points[0].x) / 5)), (this.arcsValue[i] * Math.abs((points[0].y - this.thirdPoint.y) / 5)), 0, angles.start, angles.end);
            this.context.scxStroke(this.arcs[i].theme.line);

            //Fill
            if (this.getDrawingTheme().showLevelBackgrounds) {
                let width = (this.arcsValue[i] * Math.abs((this.thirdPoint.x - points[0].x) / 5));
                let height = (this.arcsValue[i] * Math.abs((points[0].y - this.thirdPoint.y) / 5));
                this.context.beginPath();
                this.context.ellipse(points[0].x, points[0].y, prevWidth, prevHeight, 0, angles.start, angles.end);
                this.context.ellipse(points[0].x, points[0].y, width, height, 0, angles.end, angles.start, true);
                this.context.scxFill(this.arcs[i].theme.fill);
                prevWidth = width;
                prevHeight = height;
            }
        }
    }

    private drawText(points: IPoint[]) {
        let quarter = this._getQuarter([points[0], {x: this.thirdPoint.x, y: this.thirdPoint.y}]);
        let divOfPriceDifferenceAndBarsCount = this.positionOfDivText(quarter, this.thirdPoint.x, this.thirdPoint.y);
        let barsCountText = this.positionOfBarsCountText(quarter, this.thirdPoint.x, points);
        let priceDiffText = this.positionOfPriceDiffText(quarter, points, this.thirdPoint.y);
        this.rangeAndRatio = this.divOfPriceDifferenceAndBarsCount(points);
        if (this.getDrawingTheme().showText) {
            this.context.beginPath();
            this.context.scxApplyTextTheme(this.getDrawingTheme().text);
            this.context.fillText(this.divOfPriceDifferenceAndBarsCount(points).toFixed(7).toString(), divOfPriceDifferenceAndBarsCount.x, divOfPriceDifferenceAndBarsCount.y);
            this.context.fillText(this.getBarCount().toString(), barsCountText.x, barsCountText.y);
            this.context.fillText(this.priceDifference(points).toFixed(2).toString(), priceDiffText.x, priceDiffText.y);
        }
    }

    private _calculateThirdPoint(points: IPoint[]) {
        let width = Math.abs(points[1].x - points[0].x);
        let height = width;
        let x;
        let y;
        if ((points[0].x < points[1].x) && (points[0].y > points[1].y)) {
            x = points[0].x + width;
            y = points[0].y - height;
        }
        if ((points[0].x > points[1].x) && (points[0].y > points[1].y)) {
            x = points[0].x - width;
            y = points[0].y - height;
        }
        if ((points[0].x > points[1].x) && (points[0].y < points[1].y)) {
            x = points[0].x - width;
            y = points[0].y + height;
        }
        if ((points[0].x < points[1].x) && (points[0].y < points[1].y)) {
            x = points[0].x + width;
            y = points[0].y + height;
        }

        if (this.endUserDrawing) {
            x = points[1].x;
            y = points[1].y;
        }

        if (this.getDrawingTheme().reverse) {
            let xo = points[0].x;
            let yo = points[0].y;
            points[0].x = points[1].x;
            points[0].y = points[1].y;
            x = xo;
            y = yo;
        }

        return {x: x, y: y};
    }

    private _angles(quarter: number) {
        switch (quarter) {
            case 1:
                return {start: Math.PI, end: -1 / 2 * Math.PI};
            case 2:
                return {start: -0.5 * Math.PI, end: 0};
            case 3:
                return {start: 0, end: 0.5 * Math.PI};
            case 4:
                return {start: 0.5 * Math.PI, end: Math.PI};
        }
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

    private positionOfDivText(quarter: number, x2: number, y2: number) {
        switch (quarter) {
            case 1:
                return {x: x2 - 70, y: y2 - 10};
            case 2:
                return {x: x2 + 10, y: y2 - 10};
            case 3:
                return {x: x2 + 10, y: y2 + 20};
            case 4:
                return {x: x2 - 70, y: y2 + 20};
        }

    }

    private positionOfBarsCountText(quarter: number, x2: number, points: IPoint[]) {
        switch (quarter) {
            case 1:
                return {x: x2 - 20, y: points[0].y + 20};
            case 2:
                return {x: x2 + 10, y: points[0].y + 15};
            case 3:
                return {x: x2 + 10, y: points[0].y - 10};
            case 4:
                return {x: x2 - 30, y: points[0].y - 10};
        }
    }

    private positionOfPriceDiffText(quarter: number, points: IPoint[], y2: number) {
        switch (quarter) {
            case 1:
                return {x: points[0].x + 10, y: y2 - 10};
            case 2:
                return {x: points[0].x - 20, y: y2 - 15};
            case 3:
                return {x: points[0].x - 20, y: y2 + 25};
            case 4:
                return {x: points[0].x + 10, y: y2 + 15};
        }

    }

    private divOfPriceDifferenceAndBarsCount(points: IPoint[]): number {
        return Math.abs(this.priceDifference(points) / this.getBarCount());
    }


    public getBarCount():number {
        return this.getDrawingTheme().reverse ?
            MeasuringUtil.getMeasuringValues([this.chartPoints[1],this.chartPoints[0]], this.chartPanel).barsCount:
            MeasuringUtil.getMeasuringValues([this.chartPoints[0],this.chartPoints[1]], this.chartPanel).barsCount;
    }

    public priceDifference(points: IPoint[]): number {
        return this.projection.valueByY(this.thirdPoint.y) - this.projection.valueByY(points[0].y);
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        let points = this.cartesianPoints();
        this.chartPoints[1].moveToPoint(this._calculateThirdPoint(points), this.projection);
        this.endUserDrawing = true;
    }

    private getMarkerPoints(): IPoint[] {
        let markers = [this.cartesianPoints()[0]];
        if (this.endUserDrawing) {
            markers.push(this.cartesianPoints()[1]);
        }
        return markers;
    }
}

Drawing.register(GannSquareDrawing);
