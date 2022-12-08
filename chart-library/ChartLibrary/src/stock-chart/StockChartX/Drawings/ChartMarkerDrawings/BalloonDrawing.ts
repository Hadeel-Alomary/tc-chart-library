import {Drawing, IDrawingConfig, IDrawingOptions} from '../Drawing';
import {IRect} from '../../Graphics/Rect';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {ChartAccessorService} from '../../../../services/chart';
import {BorderedTextDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';


export interface IBalloonDrawingConfig extends IDrawingConfig {
    text: string;
}

export interface IBalloonDrawingOptions extends IDrawingOptions {
    text: string;
}

export namespace DrawingEvent {
    export const TEXT_CHANGED = 'drawingTextChanged';
}

export class BalloonDrawing extends ThemedDrawing<BorderedTextDrawingTheme> {
    static get className(): string {
        return 'balloon';
    }

    get text(): string {
        if ((<IBalloonDrawingOptions> this._options).text == 'none') {
            return '';
        }
        return (<IBalloonDrawingOptions> this._options).text || this.getDefaultText();
    }

    set text(value: string) {
        value = value || '';
        this._setOption('text', value, DrawingEvent.TEXT_CHANGED);
    }

    bounds(): IRect {
        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        let info = this.balloonInfo();
        let padding = this.padding();
        return {
            left: info.left - padding,
            top: info.top,
            width: info.width + padding,
            height: info.height
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

        this.drawBalloon();
        this.drawText();

        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    }

    private getDefaultText():string {
        return ChartAccessorService.instance.isArabic() ? 'تعليق' : 'Comment';
    }

    private drawBalloon() {
        let info = this.balloonInfo();
        let radius = 15;
        this.context.beginPath();
        this.context.moveTo(info.left, info.top);
        this.context.arcTo(info.left + info.width, info.top, info.left + info.width, info.top + radius, radius);
        this.context.arcTo(info.left + info.width, info.top + info.height, info.left + info.width - radius, info.top + info.height, radius);
        this.context.lineTo(info.left + 18, info.top + info.height);
        this.context.lineTo(info.left + 18, info.top + info.height + 10);
        this.context.lineTo(info.left + 8, info.top + info.height);
        this.context.arcTo(info.left - radius, info.top + info.height, info.left - radius, info.top + info.height - radius, radius);
        this.context.arcTo(info.left - radius, info.top, info.left, info.top, radius);
        if(this.getDrawingTheme().text.textBackgroundEnabled){
            this.context.scxFill(this.getDrawingTheme().fill);
        }
        if(this.getDrawingTheme().text.textBorderEnabled){
            this.context.scxStroke(this.getDrawingTheme().borderLine);
        }

    }

    private drawText() {
        let info = this.balloonInfo();
        this.context.beginPath();
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        this.context.fillText(this.text, info.left, info.top + info.height / 2);
    }

    private padding() {
        return 10;
    }

    private textWidth() {
        let radius = 15;
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return this.context.measureText(this.text).width + radius;
    }

    private balloonInfo() {
        let point = this.cartesianPoint(0);
        let height = 30;
        return {
            left: point.x - 18,
            top: point.y - height - 10,
            width: this.textWidth(),
            height: height
        };
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        this.showSettingsDialog();
    }

}

Drawing.register(BalloonDrawing);
