import {ChartAlertDrawing} from './ChartAlertDrawing';

export class ChartAlertCrossDrawing extends ChartAlertDrawing {

    protected _completeLinesDrawing() {
        this._drawTriangle();
    }

    private _drawTriangle() {
        let context = this.chartPanel.context,
            theme = this.actualTheme,
            textSize = theme.valueMarketText.fontSize,
            padding = 2,
            frame = this.chartPanel.contentFrame,
            width = 10,
            height = Math.round(textSize + (2 * padding)),
            halfHeight = Math.round(height / 2),
            x = Math.round(frame.right - 5),
            y = Math.round(this._cartesianPoint().y - halfHeight);

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - width, y + halfHeight);
        context.lineTo(x, y + height);
        context.closePath();
        context.scxStroke(theme);
        context.scxFillStroke(theme.valueMarkerFill, theme.line);
    }
}
