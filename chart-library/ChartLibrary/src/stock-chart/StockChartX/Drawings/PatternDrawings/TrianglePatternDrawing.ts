import {Drawing, DrawingDragPoint} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {IPoint} from '../../Graphics/ChartPoint';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class TrianglePatternDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {

  static get className(): string {
    return 'trianglePattern';
  }

  get pointsNeeded(): number {
    return 4;
  }

  hitTest(point: IPoint): boolean {
    let points = this.cartesianPoints();
    let extendedTrianglePoints = this.getExtendedTrianglePoints();
    return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
      Geometry.isPointNearPolyline(point, extendedTrianglePoints) ||
      Geometry.isPointNearPolyline(point, [extendedTrianglePoints[0], extendedTrianglePoints[2]]);
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
    if (!this.visible)
      return;
    let points = this.cartesianPoints();

    if (points.length > 1) {
      this.context.beginPath();
      this.context.scxStrokePolyline(points, this.getDrawingTheme().line);
      this.drawTextInBox(this.getDrawingTheme().line, points[0], 'A', points[1].y > points[0].y);
      this.drawTextInBox(this.getDrawingTheme().line, points[1], 'B', points[0].y > points[1].y);
      if (points.length == this.pointsNeeded - 1 || points.length == this.pointsNeeded) {
        this.drawTextInBox(this.getDrawingTheme().line, points[2], 'C',points[1].y > points[2].y);
      }
      if (points.length == this.pointsNeeded) {
        this.drawTextInBox(this.getDrawingTheme().line, points[3], 'D', points[2].y > points[3].y);
        this.drawTriangle();
      }
    }
    if (this.selected)
      this._drawSelectionMarkers(points);
  }

  private drawTriangle(): void {
    let extendedTrianglePoints = this.getExtendedTrianglePoints();
    this.drawLine(extendedTrianglePoints[2], extendedTrianglePoints[0]);
    this.drawLine(extendedTrianglePoints[2], extendedTrianglePoints[1]);
    this.drawLine(extendedTrianglePoints[0], extendedTrianglePoints[1]);
    this.context.scxFillPolyLine([extendedTrianglePoints[2], extendedTrianglePoints[0], extendedTrianglePoints[1]], this.getDrawingTheme().fill);
    this.context.scxStroke(this.getDrawingTheme().line);

  }

  private getExtendedTrianglePoints(): IPoint[] {
    let points = this.cartesianPoints();
    let sortedPoints = this.getSortedPoints();
    let slopePoint02 = this.slope(points[0], points[2]);
    let slopePoint13 = this.slope(points[1], points[3]);
    let trianglePoint1X = (((points[0].x * slopePoint02) - points[0].y - (points[1].x * slopePoint13) + points[1].y) / (slopePoint02 - slopePoint13));
    let trianglePoint1Y = (trianglePoint1X - points[1].x) * slopePoint13 + points[1].y;
    let trianglePoint3: IPoint;
    let trianglePoint2Y = 0;
    if (trianglePoint1X >= sortedPoints[0].x) {
      trianglePoint3 = sortedPoints[0];
    } else {
      trianglePoint3 = sortedPoints[sortedPoints.length - 1];
    }
    if (points[0].x == trianglePoint3.x || points[2].x == trianglePoint3.x) {
      trianglePoint2Y = (trianglePoint3.x - points[1].x) * slopePoint13 + points[1].y;
    } else {
      trianglePoint2Y = (trianglePoint3.x - points[0].x) * slopePoint02 + points[0].y;
    }
    return [
      {x: trianglePoint1X,  y: trianglePoint1Y },
      {x: trianglePoint3.x, y: trianglePoint2Y },
      {x: trianglePoint3.x, y: trianglePoint3.y}
    ];
  }

  private drawLine(point1: IPoint, point2: IPoint) {
    let context = this.context;
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
  }

  private slope(point1: IPoint, point2: IPoint): number {
    return (point2.y - point1.y) / (point2.x - point1.x);
  }

  private getSortedPoints(): IPoint[] {
    let points = this.cartesianPoints();
    let listOfPoints = [points[0], points[1], points[2], points[3]];
    let sortedPoints = listOfPoints.sort((a, b) => {
        if (a.x < b.x) return -1;
        if (a.x > b.x) return 1;
        return 0;
    });
    return sortedPoints;
  }


}

Drawing.register(TrianglePatternDrawing);
