import {IPoint} from '../../Graphics/ChartPoint';
import {Drawing} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';


export abstract class AbstractCurvedPathDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    private path2d: Path2D;


    public savePath(c: IPoint) {
        let points = this.cartesianPoints();
        this.path2d = new Path2D();
        if (points.length > 2) {
            let controlPoints = c;
            this.path2d.moveTo(points[0].x, points[0].y);
            this.path2d.quadraticCurveTo(controlPoints.x, controlPoints.y, points[1].x, points[1].y);
        }
    }

    // this method will return 4 point looks like square Derived from the point of the cursor , to determine whether all point located in the path or not .
    private boxHover(point: IPoint) {
        let margin = 10;
        let topPoint = {x: point.x, y: point.y - margin};
        let bottomPoint = {x: point.x, y: point.y + margin};
        let rightPoint = {x: point.x + margin, y: point.y};
        let leftPoint = {x: point.x - margin, y: point.y};
        return {
            topPoint: topPoint, bottomPoint: bottomPoint, rightPoint: rightPoint, leftPoint: leftPoint
        };
    }

    //return true if the point are in the quadratic curve path.
    private pointInPath(point: IPoint) {
        //HA : hit test was not working in mobile that is the reason of set window.devicePixelRatio , and it's value will be (1) in desktop .
        return this.context.isPointInPath(this.path2d, point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
    }

    //return true if all box point are in the quadratic curve path.
    private allPointInPath(point: IPoint) {
        let boxHover = this.boxHover(point);
        return this.pointInPath(boxHover.topPoint) && this.pointInPath(boxHover.bottomPoint) && this.pointInPath(boxHover.rightPoint) && this.pointInPath(boxHover.leftPoint);
    }

    //return true if any of box point are in the quadratic curve path.
    private atLeastOnePointInPath(point: IPoint) {
        let boxHover = this.boxHover(point);
        return this.pointInPath(boxHover.topPoint) || this.pointInPath(boxHover.bottomPoint) || this.pointInPath(boxHover.rightPoint) || this.pointInPath(boxHover.leftPoint);
    }

    //to prevent hover on line 01 in hit test
    private distanceBetweenCursorAndLine01(point: IPoint) {
        let points: IPoint[] = this.cartesianPoints();
        let A = (points[1].y - points[0].y) / (points[1].x - points[0].x);
        let B = -1;
        let C = points[0].y - (A * points[0].x);
        let lineEq = A * point.x + B * point.y + C;
        return Math.abs(lineEq) / Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2));
    }

    public curveHitTest(point: IPoint): boolean {
        let points: IPoint[] = this.cartesianPoints();
        let distanceBetweenCursorAndLine = this.distanceBetweenCursorAndLine01(point);
        if (distanceBetweenCursorAndLine <= 10) {
            return Geometry.isPointNearPoint(point, [points[0], points[1]]);
        }
        if (this.allPointInPath(point)) return false;
        if (this.atLeastOnePointInPath(point)) return true;
        return false;
    }

}
