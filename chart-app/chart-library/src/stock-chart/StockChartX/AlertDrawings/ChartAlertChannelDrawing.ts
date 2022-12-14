import {ChartAlertDrawing} from './ChartAlertDrawing';
import {IPoint} from '../Graphics/ChartPoint';

export class ChartAlertChannelDrawing extends ChartAlertDrawing {

    protected _completeLinesDrawing() {
        this._drawBridge();
    }

    protected _getHoverCartesianPoint(pointerPosition: IPoint): IPoint {
        return this._pointHitTest(pointerPosition, 0) ? this._cartesianPoint(0) : this._cartesianPoint(1);
    }

    protected _cartesianPoints(): IPoint[] {
        return [this._cartesianPoint(0), this._cartesianPoint(1)];
    }

    private _drawBridge() {
        let context = this.chartPanel.context,
            frame = this.chartPanel.contentFrame,
            theme = this.actualTheme;

        context.beginPath();
        context.moveTo(frame.right - 1, this._cartesianPoint(0).y);
        context.lineTo(frame.right - 1, this._cartesianPoint(1).y);
        context.scxStroke(theme.bridge);

        this._drawCorner(0);
        this._drawCorner(1);
    }

    private _drawCorner(index: number) {
        let context = this.chartPanel.context,
            theme = this.actualTheme,
            textSize = theme.valueMarketText.fontSize,
            padding = 2,
            frame = this.chartPanel.contentFrame,
            width = 10,
            height = Math.round(textSize + (2 * padding)),
            halfHeight = Math.round(height / 2),
            x = Math.round(frame.right - 1),
            y = Math.round(this._cartesianPoint(index).y - (index * halfHeight));

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - width, y + (index * halfHeight));
        context.lineTo(x, y + halfHeight);
        context.closePath();
        context.scxStroke(theme);
        context.scxFillStroke(theme.valueMarkerFill, theme.bridge);
    }
}
