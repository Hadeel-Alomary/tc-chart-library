import {Drawing, IDrawingLevel} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {GannBoxDrawingBase} from './GannBoxDrawingBase';
import {FibonacciSpeedResistanceFanDrawingTheme, GannBoxDrawingTheme, LevelThemeElement} from '../DrawingThemeTypes';

export class GannBoxDrawing extends GannBoxDrawingBase<GannBoxDrawingTheme> {
    static get className(): string {
        return 'gannBox';
    }

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return this.priceLinesHitTest(point, points) || this.timeLinesHitTest(point, points);
    }

    private priceLinesHitTest(point: IPoint, points: IPoint[]): boolean {
        let x_min = Math.min(points[0].x, points[1].x),
            x_max = Math.max(points[0].x, points[1].x),
            y_min = Math.min(points[0].y, points[1].y),
            y_max = Math.max(points[0].y, points[1].y);

        for (let level of this.levels) {

            let value = this._calculateValue(level.value),
                y = this.projection.yByValue(value),
                point1 = {x: x_min, y: y},
                point2 = {x: x_max, y: y};

            let point3 = {x: x_min, y: y_min},
                point4 = {x: x_max, y: y};

            let point5 = {x: x_max, y: y_min},
                point6 = {x: x_min, y: y};

            let point7 = {x: x_max, y: y_max},
                point8 = {x: x_min, y: y};


            let point9 = {x: x_min, y: y_max},
                point10 = {x: x_max, y: y};

            if (Geometry.isPointNearLine(point, point1, point2))
                return true;

            if (this.getDrawingTheme().showAngles) {
                if (Geometry.isPointNearLine(point, point3, point4)
                    || Geometry.isPointNearLine(point, point5, point6) || Geometry.isPointNearLine(point, point7, point8)
                    || Geometry.isPointNearLine(point, point9, point10))
                    return true;
            }
        }
    }

    private timeLinesHitTest(point: IPoint, points: IPoint[]): boolean {
        let x_min = Math.min(points[0].x, points[1].x),
            x_max = Math.max(points[0].x, points[1].x),
            y_min = Math.min(points[0].y, points[1].y),
            y_max = Math.max(points[0].y, points[1].y);

        for (let timeLevel of this.timeLevels) {

            let x = this.getDrawingTheme().reverse
                ? Math.round((points[0].x - points[1].x) * timeLevel.value + points[1].x)
                : Math.round((points[1].x - points[0].x) * timeLevel.value + points[0].x),
                point1 = {x: x, y: y_min},
                point2 = {x: x, y: y_max};

            let point3 = {x: x_min, y: y_min},
                point4 = {x: x, y: y_max};

            let point5 = {x: x_max, y: y_min},
                point6 = {x: x, y: y_max};

            let point7 = {x: x_max, y: y_max},
                point8 = {x: x, y: y_min};

            let point9 = {x: x_min, y: y_max},
                point10 = {x: x, y: y_min};

            if (Geometry.isPointNearLine(point, point1, point2))
                return true;

            if (this.getDrawingTheme().showAngles) {
                if (Geometry.isPointNearLine(point, point3, point4)
                    || Geometry.isPointNearLine(point, point5, point6) || Geometry.isPointNearLine(point, point7, point8)
                    || Geometry.isPointNearLine(point, point9, point10))
                    return true;
            }
        }
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
        if (points.length === 0)
            return;


        if (points.length > 1) {

            this.drawPriceLevels(points);
            this.drawTimeLevels(points);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private drawPriceLevels(points: IPoint[]) {
        let x_min = Math.min(points[0].x, points[1].x),
            x_max = Math.max(points[0].x, points[1].x),
            y_min = Math.min(points[0].y, points[1].y),
            y_max = Math.max(points[0].y, points[1].y),
            prevY: number;

        for (let level of this.levels) {
            let levelTheme = level.theme;

            let value = this._calculateValue(level.value),
                y = this.projection.yByValue(value);

            if (this.getDrawingTheme().showAngles) {
                this.drawPriceAngles(x_max, x_min, y, y_min, y_max);
            }

            if (!this._isLevelVisible(level))
                continue;

            if (this.getDrawingTheme().showPriceLevelBackground) {
                if (prevY) {
                    this.context.beginPath();
                    this.context.moveTo(x_min, prevY);
                    this.context.lineTo(x_max, prevY);
                    this.context.lineTo(x_max, y);
                    this.context.lineTo(x_min, y);
                    this.context.closePath();
                    this.context.scxFill(levelTheme.fill);
                }
                prevY = y;
            }

            this.drawPriceLevelLines(x_min, x_max, y, levelTheme);

            if (this.getDrawingTheme().showRightLabels) {
                this.drawRightLabels(level, x_max, y, levelTheme);
            }
            if (this.getDrawingTheme().showLeftLabels) {
                this.drawLeftLabels(level, x_min, y, levelTheme);
            }
        }
    }

    private drawPriceLevelLines(x_min: number, x_max: number, y: number, levelTheme: LevelThemeElement) {
        this.context.beginPath();
        this.context.moveTo(x_min, y);
        this.context.lineTo(x_max, y);
        this.context.scxStroke(levelTheme.line);
    }

    private drawRightLabels(level: IDrawingLevel, x_max: number, y: number, levelTheme: LevelThemeElement) {
        levelTheme.text.textAlign = 'left';
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(level.value.toString(), x_max + 7, y);
    }

    private drawLeftLabels(level: IDrawingLevel, x_min: number, y: number, levelTheme: LevelThemeElement) {
        levelTheme.text.textAlign = 'right';
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(level.value.toString(), x_min - 7, y);
    }

    private drawPriceAngles(x_max: number, x_min: number, y: number, y_min: number, y_max: number) {
        this.context.beginPath();
        this.context.moveTo(x_min, y_min);
        this.context.lineTo(x_max, y);

        this.context.moveTo(x_max, y_min);
        this.context.lineTo(x_min, y);

        this.context.moveTo(x_max, y_max);
        this.context.lineTo(x_min, y);

        this.context.moveTo(x_min, y_max);
        this.context.lineTo(x_max, y);
        this.context.scxStroke(this.getDrawingTheme().angles);
    }

    private drawTimeLevels(points: IPoint[]) {
        let x_min = Math.min(points[0].x, points[1].x),
            x_max = Math.max(points[0].x, points[1].x),
            y_min = Math.min(points[0].y, points[1].y),
            y_max = Math.max(points[0].y, points[1].y),
            prevX: number;

        for (let timeLevel of this.timeLevels) {
            let levelTheme = timeLevel.theme;

            let quarter = this._getQuarter(points);

            let x = this._calculateX(quarter, points, timeLevel.value);

            if (this.getDrawingTheme().showAngles) {
                this.drawTimeAngles(x_max, x_min, x , y_min, y_max);
            }

            if (!this._isLevelVisible(timeLevel))
                continue;

            if (this.getDrawingTheme().showTimeLevelBackground) {
                if (prevX) {
                    this.context.beginPath();
                    this.context.moveTo(prevX, y_min);
                    this.context.lineTo(prevX, y_max);
                    this.context.lineTo(x, y_max);
                    this.context.lineTo(x, y_min);
                    this.context.closePath();
                    this.context.scxFill(levelTheme.fill);
                }
                prevX = x;
            }
            //Draw ver lines
            this.drawTimeLevelLines(y_max, y_min, x, levelTheme);
            //Draw Text
            if (this.getDrawingTheme().showTopLabels) {
                this.drawTopLabels(timeLevel, y_min, x);
            }
            if (this.getDrawingTheme().showBottomLabels) {
                this.drawBottomLabels(timeLevel, y_max,x );
            }
        }

    }

    private drawTimeLevelLines(y_max: number, y_min: number, x: number, levelTheme: LevelThemeElement) {
        this.context.beginPath();
        this.context.moveTo(x, y_min);
        this.context.lineTo(x, y_max);
        this.context.scxStroke(levelTheme.line);
        this.context.scxApplyTextTheme(levelTheme.text);
    }

    private drawTopLabels(timeLevel: IDrawingLevel, y_min: number, x: number) {
        this.context.fillText(timeLevel.value.toString(), x, y_min - 10);
    }

    private drawBottomLabels(timeLevel: IDrawingLevel, y_max: number, x: number) {
        this.context.fillText(timeLevel.value.toString(), x, y_max + 10);
    }

    private drawTimeAngles(x_max: number, x_min: number, x: number, y_min: number, y_max: number) {
        this.context.beginPath();
        this.context.moveTo(x_min, y_min);
        this.context.lineTo(x, y_max);

        this.context.moveTo(x_max, y_min);
        this.context.lineTo(x, y_max);

        this.context.moveTo(x_max, y_max);
        this.context.lineTo(x, y_min);

        this.context.moveTo(x_min, y_max);
        this.context.lineTo(x, y_min);
        this.context.scxStroke(this.getDrawingTheme().angles);
    }

    private _getQuarter(points: IPoint[]) {
        let quarter = 0;
        if (points[0].y < points[1].y) {
            if (points[0].x < points[1].x) {
                quarter = 4;
            } else {
                quarter = 3;
            }
        } else {
            if (points[0].x < points[1].x) {
                quarter = 1;
            } else {
                quarter = 2;
            }
        }

        if (this.getDrawingTheme().reverse) {
            quarter = quarter + 4;
        }

        return quarter;
    }

    private _calculateValue(levelValue: number): number {

        if(this.getDrawingTheme().reverse)
            return this.chartPoints[1].value + ((this.chartPoints[0].value - this.chartPoints[1].value) * levelValue);

        return this.chartPoints[0].value + ((this.chartPoints[1].value - this.chartPoints[0].value) * levelValue);
    }

    private _calculateX(quarter: number, points: IPoint[], timeLevelValue: number): number {
        switch (quarter) {
            case 1:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 2:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 3:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 4:
                return Math.round(points[0].x + ((points[1].x - points[0].x) * timeLevelValue));
            // Reverse cases
            case 5:
                return Math.round(points[1].x + ((points[0].x - points[1].x) * timeLevelValue));
            case 6:
                return Math.round(points[1].x + ((points[0].x - points[1].x) * timeLevelValue));
            case 7:
                return Math.round(points[1].x + ((points[0].x - points[1].x) * timeLevelValue));
            case 8:
                return Math.round(points[1].x - ((points[1].x - points[0].x) * timeLevelValue));
        }
    }

}

Drawing.register(GannBoxDrawing);
