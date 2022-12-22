import {IRect} from "../../Graphics/Rect";
import {Drawing} from "../Drawing";
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {BorderedTextDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class PriceLabelDrawing extends ThemedDrawing<BorderedTextDrawingTheme> {
    static get className(): string {
        return 'priceLabel';
    }


    bounds(): IRect {
        let leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return null;

        return {
            left: leftPoint.x + 15,
            top: leftPoint.y - 15 - this.textHeight(),
            width: this.textWidth() + 30,
            height: this.textHeight()
        };
    }

    hitTest(point: IPoint): boolean {
        return Geometry.isPointInsideOrNearRect(point,this.bounds());
    }

    draw() {
        if (!this.visible)
            return;

        let point = this.cartesianPoint(0);
        if (!point)
            return;

        let context = this.context;
        let priceNumber = this.priceNumber();
        let height = this.textHeight();
        let width = this.textWidth();
        let y = point.y - 13;

        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(point.x + 25, y );
        context.lineTo(point.x + 33 + width, y);
        context.lineTo(point.x + 33 + width, y - height );
        context.lineTo(point.x + 12, y - height );
        context.lineTo(point.x + 12, y);
        context.lineTo(point.x + 17, y);
        context.lineTo(point.x, point.y);
        if(this.getDrawingTheme().text.textBackgroundEnabled) {
            context.scxFill(this.getDrawingTheme().fill);
        }
        if(this.getDrawingTheme().text.textBorderEnabled) {
            context.scxStroke(this.getDrawingTheme().borderLine);
        }
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(priceNumber, point.x + 23, y - (height/2));

        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    }

    private priceNumber() {
        return Math.roundToDecimals(this.chartPoints[0].value, 3).toString();
    }

    private textWidth() {
        let priceNumber = this.priceNumber();
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return this.context.measureText(priceNumber).width;
    }

    private textHeight() {
        return 60 - (1.25 * (40 - this.getDrawingTheme().text.fontSize));
    }
}

Drawing.register(PriceLabelDrawing);
