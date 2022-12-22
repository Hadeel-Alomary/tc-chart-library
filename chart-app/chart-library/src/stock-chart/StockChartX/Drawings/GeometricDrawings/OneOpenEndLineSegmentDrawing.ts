import {Drawing} from "../Drawing";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {LineSegmentDrawing} from "./LineSegmentDrawing";
import {BrowserUtils} from '../../../../utils';

export class OneOpenEndLineSegmentDrawing extends LineSegmentDrawing {
    static get className(): string {
        return 'oneOpenEndLineSegment';
    }

    public get hasTooltip():boolean{
        return BrowserUtils.isDesktop();
    }

    private endPoint: IPoint = {x: 0, y: 0};

    hitTest(point: IPoint): boolean {
        if (super.hitTest(point))
            return true;

        if(this.cartesianPoints().length < this.pointsNeeded){
            return false;
        }

        return Geometry.isPointNearPolyline(point, [this.cartesianPoint(1), this.endPoint])
    }

    draw() {
        if (!this.visible) {
            return;
        }

        if (this.chartPoints.length > 1) {
            super.draw();
            this.endPoint = this.getExtendedLineEndPoint(this.cartesianPoint(0), this.cartesianPoint(1));
            this.context.scxStrokePolyline([this.cartesianPoint(1), this.endPoint], this.getDrawingTheme().line);
        } else{
            if (this.selected) {
                this._drawSelectionMarkers(this.cartesianPoints());
            }
        }
    }

    protected getExtendedLineEndPoint(point1: IPoint, point2: IPoint) {
        let deltaX = point2.x - point1.x;
        let deltaY = point2.y - point1.y;

        let x = point2.x;
        let y = point2.y;

        let panelFrame = this.chartPanel.contentFrame;

        if (deltaX < 0) {
            x = panelFrame.left;
        } else if (deltaX > 0) {
            x = panelFrame.right;
        }

        if (deltaX == 0) {
            if (deltaY > 0) {
                y = panelFrame.bottom;
            } else {
                y = panelFrame.top;
            }
        } else {
            y = (x - point2.x) / deltaX * deltaY + point2.y;

            if (y < panelFrame.top || y > panelFrame.bottom) {

                if (y > panelFrame.bottom) {
                    y = panelFrame.bottom;
                } else if (y < panelFrame.top) {
                    y = panelFrame.top;
                }

                if (deltaY !== 0) {
                    x = (y - point2.y) / deltaY * deltaX + point2.x;
                }
            }
        }
        return {x: x, y: y};
    }
    protected canAlertExtendRight():boolean {
        return this.chartPoints[1].date > this.chartPoints[0].date;
    }

    protected canAlertExtendLeft():boolean {
        return this.chartPoints[0].date >= this.chartPoints[1].date;
    }

}

Drawing.register(OneOpenEndLineSegmentDrawing);
