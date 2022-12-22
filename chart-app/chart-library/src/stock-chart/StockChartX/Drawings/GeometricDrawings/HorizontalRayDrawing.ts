import {Drawing} from "../Drawing";
import {IRect, ISize, Rect} from "../../Graphics/Rect";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {HorizontalLineDrawing} from "./HorizontalLineDrawing";
import {DummyCanvasContext} from "../../Utils/DummyCanvasContext";
import {DrawingTextHorizontalPosition} from "../DrawingTextPosition";
import {ITextTheme} from '../../Theme';

export class HorizontalRayDrawing extends HorizontalLineDrawing {
    static get className(): string {
        return 'horizontalRay';
    }

    bounds(): IRect {
        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        let frame = this.chartPanel.contentFrame;

        return {
            left: point.x,
            top: point.y,
            width: frame.width - point.x,
            height: 1
        };
    }

    hitTest(point: IPoint): boolean {
        let p = this.cartesianPoint(0);

        return point && Geometry.isPointNearPolyline(point, [p, {x: this.chartPanel.contentFrame.right, y: p.y}]);
    }


    draw() {
        if (!this.visible) {
            return;
        }

        let point = this.cartesianPoint(0);
        if (!point) {
            return;
        }

        let context = this.chartPanel.context,
            frame = this.chartPanel.contentFrame;

        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(this.getDrawingTheme().line);

        if (this.selected) {
            this._drawSelectionMarkers({x: point.x, y: point.y});
        }

        this.drawValue();

        if(this.text.length){
            this.drawText(point);
        }

        this.drawAlertBellIfNeeded();

    }

    protected getTextHorizontalPosition(point:IPoint):number{
        let textTheme : ITextTheme= <ITextTheme>{fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: ''};
        let position:number = 0,
            value = this.projection.valueByY(point.y),
            yValue = this.chartPanel.formatValue(value),
            frame:Rect = this.chartPanel.contentFrame,
            padding:number = 5,
            yValueBoxWidth = DummyCanvasContext.measureText(yValue, textTheme).width;

        switch (this.textHorizontalPosition) {
            case DrawingTextHorizontalPosition.RIGHT:
                position = frame.right  - yValueBoxWidth - (padding*4);
                break;
            case DrawingTextHorizontalPosition.CENTER:
                position = point.x + Math.floor((this.bounds().width / 2) );
                break;
            case DrawingTextHorizontalPosition.LEFT:
                position = point.x + padding;
                break;
            default:
                throw new Error("Unknown horizontal text position type: " + this.textHorizontalPosition);
        }

        return position;
    }

    protected getAlertIconPoint() : IPoint {
        return this.getAlertFirstChartPoint().toPoint(this.projection);
    }

    shouldDrawMarkers(): boolean {
        return false;
    }

}

Drawing.register(HorizontalRayDrawing);
