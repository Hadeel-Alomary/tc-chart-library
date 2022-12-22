import {Drawing} from '../Drawing';
import {IRect} from '../../Graphics/Rect';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {FlagDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class FlagDrawing extends ThemedDrawing<FlagDrawingTheme> {
    static get className(): string {
        return 'flag';
    }


    bounds(): IRect {
        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        let info = this.flagInfo();

        return {
            left: point.x + info.distanceBetweenFlagAndItsStaff,
            top: point.y - info.flagSize,
            width: info.distanceBetweenFlagAndItsStaff + 2 * info.height + (info.height / 2),
            height: info.flagSize
        };
    }

    hitTest(point: IPoint): boolean {
        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    }

    draw() {
        if (!this.visible)
            return;

        let point = this.cartesianPoint(0);
        if (!point)
            return;

        this.drawFlagStaff();
        this.drawLeftRectangle();
        this.drawFlagCrossLine();
        this.drawFlagTriangles();

        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    }

    private flagInfo() {
        let point = this.cartesianPoint(0);
        let flagSize = 10 * (this.getDrawingTheme().width + 0.5);
        let height = flagSize / 2;
        let verticalDistanceBetweenFlagRectangles = (0.045 * flagSize);
        let distanceBetweenFlagAndItsStaff = 0.1 * flagSize;
        let x = point.x + distanceBetweenFlagAndItsStaff;

        return {
            x: x,
            flagSize: flagSize,
            height: height,
            verticalDistanceBetweenFlagRectangles: verticalDistanceBetweenFlagRectangles,
            distanceBetweenFlagAndItsStaff: distanceBetweenFlagAndItsStaff
        };
    }

    private drawFlagStaff(): void {
        let point = this.cartesianPoint(0);
        let info = this.flagInfo();
        this.context.beginPath();
        this.context.scxStroke(this.getDrawingTheme());
        this.context.lineWidth = this.getDrawingTheme().width == 1 ? 1 : this.getDrawingTheme().width / 2 ;
        this.context.moveTo(point.x, point.y);
        this.context.lineTo(point.x, point.y - info.flagSize);
        // HA can't use scxStroke here as not all theme elements are set, so call context.stroke directly
        this.context.stroke();
    }

    private drawLeftRectangle(): void {
        let point = this.cartesianPoint(0);
        let info = this.flagInfo();
        this.context.beginPath();
        this.context.rect(info.x, point.y - info.flagSize, info.height, info.height);
        this.context.fillStyle = this.getDrawingTheme().fill.fillColor;
        this.context.fill();
    }

    private drawFlagCrossLine(): void {
        let point = this.cartesianPoint(0);
        let info = this.flagInfo();
        this.context.beginPath();
        this.context.strokeStyle = 'rgba(255,255,255, 0.2)';
        this.context.moveTo(info.x + info.height, point.y - info.flagSize - (0.06 * info.flagSize));
        this.context.lineTo(info.x + info.height, point.y - info.flagSize + info.height);
        this.context.stroke();
    }

    private drawFlagTriangles(): void {
        let point = this.cartesianPoint(0);
        let info = this.flagInfo();
        this.context.moveTo(info.x + info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles);
        this.context.lineTo(info.x + 1.98 * info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles);
        this.context.lineTo(info.x + 1.5 * info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles + (info.height / 2));
        this.context.lineTo(info.x + 1.98 * info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles + info.height);
        this.context.lineTo(info.x + info.height - info.verticalDistanceBetweenFlagRectangles, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles + info.height);
        this.context.lineTo(info.x + info.height - info.verticalDistanceBetweenFlagRectangles, point.y - info.flagSize + info.height);
        this.context.lineTo(info.x + info.height, point.y - info.flagSize + info.height);
        this.context.fill();
    }

}

Drawing.register(FlagDrawing);
