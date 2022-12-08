import {Drawing} from "../Drawing";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {OneOpenEndLineSegmentDrawing} from "./OneOpenEndLineSegmentDrawing";


export class TwoOpenEndLineSegmentDrawing extends OneOpenEndLineSegmentDrawing {
    static get className(): string {
        return 'twoOpenEndLineSegment';
    }

    private secondEndPoint: IPoint = {x: 0, y: 0};

    hitTest(point: IPoint): boolean {
        if (super.hitTest(point))
            return true;

        if(this.cartesianPoints().length < this.pointsNeeded){
            return false;
        }

        return Geometry.isPointNearPolyline(point, [this.cartesianPoint(0), this.secondEndPoint])
    }

    draw() {
        if (!this.visible) {
            return;
        }

        if (this.chartPoints.length > 1) {
            super.draw();
            this.secondEndPoint = this.getExtendedLineEndPoint(this.cartesianPoint(1), this.cartesianPoint(0));
            this.context.scxStrokePolyline([this.cartesianPoint(0), this.secondEndPoint], this.getDrawingTheme().line);
        } else{
            if (this.selected) {
                this._drawSelectionMarkers(this.cartesianPoints());
            }
        }
    }

    protected canAlertExtendRight():boolean {
        return true;
    }

    protected canAlertExtendLeft():boolean {
        return true;
    }

}

Drawing.register(TwoOpenEndLineSegmentDrawing);
