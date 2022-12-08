import {Drawing, IDrawingLevel} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {GannBoxDrawingBase} from './GannBoxDrawingBase';
import {FibonacciSpeedResistanceFanDrawingTheme, LevelThemeElement} from '../DrawingThemeTypes';


export class FibonacciSpeedResistanceFanDrawing extends GannBoxDrawingBase<FibonacciSpeedResistanceFanDrawingTheme> {
    static get className(): string {
        return 'fibonacciSpeedResistanceFan';
    }

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return this.priceLinesHitTest(point, points) || this.timeLinesHitTest(point, points) || this.fansHitTest(point , points);
    }

    private priceLinesHitTest(point: IPoint, points: IPoint[]): boolean {
        let x_min = Math.min(points[0].x, points[1].x),
            x_max = Math.max(points[0].x, points[1].x);

        for (let level of this.levels) {
            if (!this._isLevelVisible(level) || !this.getDrawingTheme().grid.strokeEnabled)
                continue;

            let value  = this._calculateValue(level.value),
                y = this.projection.yByValue(value),

            point1 = {x: x_min, y: y},
            point2 = {x: x_max, y: y};

            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
        }
    }

    private timeLinesHitTest(point: IPoint, points: IPoint[]): boolean {
        let y_min = Math.min(points[0].y, points[1].y),
            y_max = Math.max(points[0].y, points[1].y);

        for (let timeLevel of this.timeLevels) {
            if (!this._isLevelVisible(timeLevel) || !this.getDrawingTheme().grid.strokeEnabled)
                continue;

            let x = Math.round((points[1].x - points[0].x) * timeLevel.value + points[0].x),
                point1 = {x: x, y: y_min},
                point2 = {x: x, y: y_max};

            if (Geometry.isPointNearLine(point, point1, point2))
                return true;

        }
    }

    private fansHitTest(point: IPoint, points: IPoint[]): boolean {
        let isOnLeftSide = points[0].x > points[1].x,
            contentFrame = this.chartPanel.contentFrame,
            x3 = isOnLeftSide ? contentFrame.left : contentFrame.right,
            isOnTopSide = points[0].y > points[1].y,
            y3 = isOnTopSide ? contentFrame.top : contentFrame.bottom;


        for (let level of this.levels) {
            if (!this._isLevelVisible(level))
                continue;

            let y3 = this.getFanY(points,x3,level.value),
            point1 = {x: points[0].x, y: points[0].y},
                point2 = {x: x3, y: y3};

            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
        }

        for (let timeLevel of this.timeLevels) {
            if (!this._isLevelVisible(timeLevel))
                continue;

            let point1 = {x: points[0].x, y: points[0].y},
                point2 = {
                    x: (points[0].x + (y3 - points[0].y) * (((points[1].x - points[0].x) * timeLevel.value + points[0].x) - points[0].x) / (points[1].y - points[0].y)),
                    y: y3
                };

            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
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
            let contentFrame = this.chartPanel.contentFrame,
                isOnLeftSide = points[0].x > points[1].x,
                x3 = isOnLeftSide ? contentFrame.left : contentFrame.right,
                isOnTopSide = points[0].y > points[1].y,
                y3 = isOnTopSide ? contentFrame.top : contentFrame.bottom;

            this.drawPriceLevelsLinesAndFans(points, x3);
            this.drawTimeLevelsLinesAndFans(points, y3);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private drawPriceLevelsLinesAndFans(points: IPoint[], x3: number) {
        let x_min = Math.min(points[0].x, points[1].x),
            x_max = Math.max(points[0].x, points[1].x),
            y3old: number;

        for (let level of this.levels) {
            let levelTheme = level.theme;

            let value = this._calculateValue(level.value),
                y = this.projection.yByValue(value);

            if (!this._isLevelVisible(level))
                continue;

            // Draw Price Fans ...
            this.drawPriceFans(points , x3 , level);

            //Fill Price Fans ...
            if (this.getDrawingTheme().showLevelBackgrounds) {
                let y3new = this.getFanY(points,x3,level.value);
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(x3, y3old);
                this.context.lineTo(x3, y3new);
                this.context.closePath();
                this.context.scxFill(level.theme.fill);
                y3old = y3new;
            }

            //Draw Price Lines ...
            if (this.getDrawingTheme().grid.strokeEnabled) {
               this.drawPriceLines(x_min ,x_max, y);
            }

            //Draw Right Labels ...
            if (this.getDrawingTheme().showRightLabels) {
                this.drawRightLabels(level, x_max, y, levelTheme);
            }

            //Draw Left Labels ...
            if (this.getDrawingTheme().showLeftLabels) {
                this.drawLeftLabels(level, x_min, y, levelTheme);
            }
        }
    }

    private drawPriceFans(points: IPoint[], x3: number, level: IDrawingLevel) {
        let fanY = this.getFanY(points,x3,level.value);
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(x3,fanY);
        this.context.scxStroke(level.theme.line);
    }

    getFanY(points: IPoint[], x3: number, levelValue: number) {
        let value = this._calculateValue(levelValue),
            y = this.projection.yByValue(value);
        return (points[0].y + (x3 - points[0].x) * (y - points[0].y) / (points[1].x - points[0].x))
    }

    private drawPriceLines(x_min: number ,x_max: number, y: number) {
        this.context.beginPath();
        this.context.moveTo(x_min, y);
        this.context.lineTo(x_max, y);
        this.context.scxStroke(this.getDrawingTheme().grid);
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

    private drawTimeLevelsLinesAndFans(points: IPoint[], y3: number) {
        let y_min = Math.min(points[0].y, points[1].y),
            y_max = Math.max(points[0].y, points[1].y),
            x3old;

        for (let timeLevel of this.timeLevels) {
            let levelTheme = timeLevel.theme;

            let quarter = this._getQuarter(points);

            let x = this._calculateX(quarter, points, timeLevel.value);

            if (!this._isLevelVisible(timeLevel))
                continue;

            //Draw Time Fans ...
            this.drawTimeFans(points , y3 , timeLevel);

            //Fill Time Fans ...
            if (this.getDrawingTheme().showLevelBackgrounds) {
                let x3new = (points[0].x + (y3 - points[0].y) * (((points[1].x - points[0].x) * timeLevel.value + points[0].x) - points[0].x) / (points[1].y - points[0].y));
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(x3old, y3);
                this.context.lineTo(x3new, y3);
                this.context.closePath();
                this.context.scxFill(timeLevel.theme.fill);
                x3old = x3new;
            }

            //Draw Time Lines ...
            if (this.getDrawingTheme().grid.strokeEnabled) {
                this.drawTimeLines(y_min ,y_max , x);
            }

            //Draw Top Labels ...
            if (this.getDrawingTheme().showTopLabels) {
                this.drawTopLabels(timeLevel, y_min, x, levelTheme);
            }

            //Draw Bottom Labels ...
            if (this.getDrawingTheme().showBottomLabels) {
                this.drawBottomLabels(timeLevel, y_max, x, levelTheme);
            }
        }
    }

    private drawTimeFans(points: IPoint[], y3: number, timeLevel: IDrawingLevel) {
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo((points[0].x + (y3 - points[0].y) * (((points[1].x - points[0].x) * timeLevel.value + points[0].x) - points[0].x) / (points[1].y - points[0].y)), y3);
        this.context.scxStroke(timeLevel.theme.line);
    }

    private drawTimeLines(y_min: number,y_max: number, x: number) {
        this.context.beginPath();
        this.context.moveTo(x, y_min);
        this.context.lineTo(x, y_max);
        this.context.scxStroke(this.getDrawingTheme().grid);
    }

    private drawTopLabels(timeLevel: IDrawingLevel, y_min: number, x: number, levelTheme: LevelThemeElement) {
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(timeLevel.value.toString(), x, y_min - 10);
    }

    private drawBottomLabels(timeLevel: IDrawingLevel, y_max: number, x: number, levelTheme: LevelThemeElement) {
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(timeLevel.value.toString(), x, y_max + 10);
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


        return quarter;
    }

    private _calculateValue(levelValue: number): number {
        let price0 = this.chartPoints[0];
        let price1 = this.chartPoints[1];

        return price0.value + ((price1.value - price0.value) * levelValue);

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
        }
    }
}

Drawing.register(FibonacciSpeedResistanceFanDrawing);
