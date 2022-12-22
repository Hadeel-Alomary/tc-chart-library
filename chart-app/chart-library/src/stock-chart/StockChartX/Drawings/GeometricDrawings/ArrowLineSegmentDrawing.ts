
import {LineSegmentDrawing} from "./LineSegmentDrawing";
import {Drawing} from "../Drawing";
import {IPoint} from "../../Graphics/ChartPoint";
import {DrawingCalculationUtil} from "../../Utils/DrawingCalculationUtil";
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';

export class ArrowLineSegmentDrawing extends LineSegmentDrawing{

    static get className(): string {
        return 'arrowLineSegment';
    }

    private get width():number{
        return Math.max(this.getDrawingTheme().line.width * 3, 6);
    }

    private get height():number{
        return Math.max(this.getDrawingTheme().line.width * 4, 10);
    }

    draw() {
        if (!this.visible) {
            return;
        }

        let points:IPoint[] = this.cartesianPoints();
        if (this.pointsNeeded == points.length) {
            //NK draw the basic trend line
            this.context.scxStrokePolyline(points, this.getDrawingTheme().line);

            this.drawArrows(points[0], points[1]);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private drawArrows(point1:IPoint, point2:IPoint):void{
        let radians:number = DrawingCalculationUtil.calculateAngleBetweenTwoPointsInRadians(point1, point2);
        this.context.beginPath();
        this.context.scxDrawArrow(point2, radians, this.width, this.height);
        this.context.scxApplyStrokeTheme(this.getDrawingTheme().line);
        this.context.stroke();
    }
}

Drawing.register(ArrowLineSegmentDrawing);
