import {TextBase} from '../../Drawings/ChartMarkerDrawings/TextBase';
import {IRect} from '../../Graphics/Rect';
import {DummyCanvasContext} from '../../Utils/DummyCanvasContext';
import {ChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {IDrawingOptions} from '../Drawing';
import {ITextTheme} from '../../Theme';
import {BorderedTextDrawingTheme} from '../DrawingThemeTypes';


export class TextDrawingsBase extends TextBase {

    private _draggedWrappingPoint:IPoint = null;

    bounds(): IRect {
        let borderPadding = 10;
        let boundsRect: IRect = this.getTextRectangle();
        boundsRect.left -= borderPadding;
        boundsRect.top -= borderPadding;
        boundsRect.width += 2 * borderPadding;
        boundsRect.height += 2 * borderPadding;
        return boundsRect;
    }


    getTextRectangle(): IRect {

        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        let size = this.getLongestLineSize();

        let boundsRect: IRect = {
            left: point.x,
            top: point.y,
            width: size.width,
            height: size.height * this.lines.length
        };

        let theme = this.getDrawingTheme();

        let result: IRect = {
            left: point.x,
            top: point.y,
            width: theme.text.textWrapEnabled ? this.textWrapWidth : boundsRect.width,
            height: theme.text.textWrapEnabled ? size.height * this.getWrappedLines().length : boundsRect.height,
        };


        return result;

    }

    hitTest(point: IPoint): boolean {
        let boundsRect: IRect = this.bounds();
        let result: boolean = boundsRect && Geometry.isPointInsideOrNearRect(point, boundsRect);
        return result;
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let rightPoint = this.rightCenterBorderPoint();
                if (Geometry.isPointNearPoint(event.pointerPosition, rightPoint)) {
                    this._draggedWrappingPoint = rightPoint;
                    return true;
                }
                break;
            case GestureState.CONTINUED:
                if (this._draggedWrappingPoint != null) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.textWrapWidth = this.textWrapWidth + (magnetChartPoint.x - this.rightCenterBorderPoint().x);
                    if (this.textWrapWidth <= 120) {
                        this.textWrapWidth = 120;
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._draggedWrappingPoint = null;
                break;
        }
        return false;
    }

    draw() {
        if (!this.visible) return;

        let lines = this.lines;
        if (lines.length === 0) return;

        let point = this.cartesianPoint(0);
        if (!point) return;


        this.drawBackgroundIfNeeded();
        this.drawBorderIfNeeded();
        this.drawText(lines, point);

        if (this.selected) {
            this.drawWrapBorderIfNeeded();
            this._drawSelectionMarkers(this.getMarkerPoints());
        }

    }

    private drawText(lines: string[], point: IPoint) {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        let lineHeight = DummyCanvasContext.measureText(lines[0], this.getDrawingTheme().text as ITextTheme).height;
        let textRectangleHeight = point.y;
        let x = this.xByTextDirection();
        for (let line of this.getLines()) {
            this.context.fillText(line, x, textRectangleHeight);
            textRectangleHeight += lineHeight;
        }
    }

    private xByTextDirection(): number {
        let point = this.cartesianPoint(0);
        let x;
        let boundsRect: IRect = this.getTextRectangle();
        if (this.context.textAlign == 'right') {
            x = point.x + boundsRect.width;
        } else if (this.context.textAlign == 'center') {
            x = point.x + (boundsRect.width / 2);
        } else {
            x = point.x;
        }
        return x;
    }

    private drawBackgroundIfNeeded(): void {
        if (this.getDrawingTheme().text.textBackgroundEnabled) {
            let rect: IRect = this.bounds();
            this.context.scxApplyFillTheme({fillColor: this.getDrawingTheme().fill.fillColor});
            this.context.fillRect(rect.left, rect.top, rect.width, rect.height);
        }
    }

    private drawBorderIfNeeded(): void {
        this.context.beginPath();
        if (this.getDrawingTheme().text.textBorderEnabled) {
            let rect: IRect = this.bounds();
            this.context.scxStroke(this.getDrawingTheme().borderLine);
            this.context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }
    }

    private drawWrapBorderIfNeeded(): void {
        if (this.getDrawingTheme().text.textWrapEnabled && !this.getDrawingTheme().text.textBorderEnabled) {
            let textRect = this.bounds();
            this.context.scxStroke({strokeColor: this.getDrawingTheme().text.fillColor, width: 1});
            this.context.setLineDash([2]);
            this.context.strokeRect(textRect.left, textRect.top, textRect.width, textRect.height);
        }
    }
    
    private getMarkerPoints() {
        let markers = [this.bottomCenterBorderPoint()];
        if (this.getDrawingTheme().text.textWrapEnabled) {
            markers.push(this.rightCenterBorderPoint());
        }
        return markers;
    }

    private bottomCenterBorderPoint(): IPoint {
        let rect: IRect = this.bounds();
        return {
            x: rect.left + rect.width / 2, y: rect.top + rect.height
        };
    }

    private rightCenterBorderPoint(): IPoint {

        let point = this.cartesianPoint(0),
            lines = this.lines,
            theme = this.getDrawingTheme();

        let rect: IRect = this.bounds();

        return {
            x: rect.left + rect.width,
            y: rect.top + rect.height / 2
        };

    }


    deleteDrawingIfNoTextExists() : boolean {
        return true;
    }

}
