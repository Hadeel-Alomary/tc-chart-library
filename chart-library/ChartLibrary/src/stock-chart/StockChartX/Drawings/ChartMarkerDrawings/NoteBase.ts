import {IRect} from '../../Graphics/Rect';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {Gesture, GestureState, WindowEvent} from '../../Gestures/Gesture';
import {DummyCanvasContext} from '../../Utils/DummyCanvasContext';
import {TextBase} from './TextBase';
import {ITextTheme} from '../../Theme';

export class NoteBase extends TextBase {
    rectangle = new NoteRectangle();
    hover = false;

    pointerBounds(): IRect {
        let point = this.cartesianPoints()[0];
        if (!point)
            return null;
        let pointerHeight = 19;
        let pointerWidth = 14;
        let x = point.x;

        return {
            left: x - pointerWidth / 2,
            top: point.y - pointerHeight,
            width: pointerWidth,
            height: pointerHeight
        };
    }

    hitTest(point: IPoint): boolean {
        return Geometry.isPointInsideOrNearRect(point, this.pointerBounds());
    }


    get textWrapWidth(): number {
        return 250; // For note, this is hardcoded and does't change.
    }

    set textWrapWidth(value: number) {
        // MA does nothing for the note, as the width is fixed.
    }

    protected _handleMouseHover(gesture: Gesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this.hover = true;
                this.chartPanel.draw();
            case GestureState.CONTINUED:
                this.chartPanel.rootDiv.addClass('drawing-mouse-hover');
                break;
            case GestureState.FINISHED:
                this.chartPanel.rootDiv.addClass('drawing-mouse-hover');
                this.hover = false;
                this.chartPanel.draw();
                break;
        }
    }


    draw() {
        if (!this.visible) return;
        let point = this.cartesianPoint(0);
        if (!point) {
            return;
        }

        this.drawPointer();
        this.CoordinatesOfRectangleBasedOnLocation();

        if (this.selected || this.hover) {
            this.drawRect();
        }
        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    }

    private drawPointer() {
        let point = this.cartesianPoint(0);
        let pointerHeight = 18.5;
        let startAngle = 40 * Math.PI / 180;
        let endAngle = 140 * Math.PI / 180;
        let context = this.context;
        let x = point.x;

        context.beginPath();
        context.arc(x, point.y - pointerHeight, 11, startAngle, endAngle, true);
        context.lineTo(x, point.y);
        context.closePath();
        context.scxFill({fillColor: this.getDrawingTheme().borderLine.strokeColor});

        context.beginPath();
        context.arc(x, point.y - pointerHeight, 7, 0, 2 * Math.PI);
        context.scxFill({fillColor: 'white'});
    }

    private CoordinatesOfRectangleBasedOnLocation() {
        this.normalSituation();
        this.rectangleIsCloseToTheTop();
        this.rectangleIsCloseToTheRight();
        this.rectangleIsCloseToTheLeft();
    }

    private normalSituation() {
        let point = this.cartesianPoint(0);
        let rect = this.basicRectData();
        let triangle = this.basicTriangleData();
        let pointer = this.pointerBounds();

        this.rectangle.rootX = point.x;
        this.rectangle.centerRightX = triangle.right;
        this.rectangle.centerLeftX = triangle.left;
        this.rectangle.rightX = rect.right;
        this.rectangle.leftX = rect.left;
        this.rectangle.rootY = point.y - (triangle.height + pointer.height);
        this.rectangle.bottomY = point.y - (triangle.height + pointer.height) - 10;
        this.rectangle.topY = (point.y - (triangle.height + pointer.height) - 10) - rect.height;
    }

    private rectangleIsCloseToTheTop() {
        let point = this.cartesianPoint(0);
        let rect = this.basicRectData();
        let triangle = this.basicTriangleData();
        let pointer = this.pointerBounds();
        let frame = this.frame();
        if (point.y < frame.top + rect.height + triangle.height + pointer.height) {
            this.rectangle.rootY = point.y + (0.2 * pointer.height);
            this.rectangle.bottomY = point.y + (0.2 * pointer.height) + 10;
            this.rectangle.topY = (point.y + (0.2 * pointer.height) + 10) + rect.height;
        }
    }

    private rectangleIsCloseToTheRight() {
        let point = this.cartesianPoint(0);
        let rect = this.basicRectData();
        let frame = this.frame();
        if (rect.right > frame.right) {
            this.rectangle.rootX = point.x;
            this.rectangle.rightX = frame.right;
            this.rectangle.leftX = frame.right - 270;
            if (point.x > frame.right - 8) {
                this.pointerIsCloseToRight();
            }
        }
    }

    private pointerIsCloseToRight() {
        let frame = this.frame();
        this.rectangle.rootX = frame.right;
        this.rectangle.centerRightX = frame.right;
        this.rectangle.centerLeftX = frame.right;
        this.rectangle.rootY = this.rectangle.bottomY;
    }

    private rectangleIsCloseToTheLeft() {
        let point = this.cartesianPoint(0);
        let rect = this.basicRectData();
        let frame = this.frame();
        if (point.x < frame.left + rect.width / 2) {
            this.rectangle.rootX = point.x;
            this.rectangle.rightX = frame.left + 270;
            this.rectangle.leftX = frame.left;
            if (point.x < frame.left + 8) {
                this.pointerIsCloseToLeft();
            }
        }
    }

    private pointerIsCloseToLeft() {
        let frame = this.frame();
        this.rectangle.rootX = frame.left;
        this.rectangle.centerLeftX = frame.left;
        this.rectangle.centerRightX = frame.left;
        this.rectangle.rootY = this.rectangle.bottomY;
    }

    private drawRect() {
        let context = this.context;
        let rect = this.rectangle;
        context.beginPath();
        context.moveTo(rect.rootX, rect.rootY);
        context.lineTo(rect.centerRightX, rect.bottomY);
        context.lineTo(rect.rightX, rect.bottomY);
        context.lineTo(rect.rightX, rect.topY);
        context.lineTo(rect.leftX, rect.topY);
        context.lineTo(rect.leftX, rect.bottomY);
        context.lineTo(rect.centerLeftX, rect.bottomY);
        context.closePath();

        if(this.getDrawingTheme().text.textBackgroundEnabled) {
            context.scxFill(this.getDrawingTheme().fill);
        }

        if(this.getDrawingTheme().text.textBorderEnabled) {
            context.scxStroke(this.getDrawingTheme().borderLine);
        }

        this.drawText();
    }

    private drawText() {
        this.context.beginPath();
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        let line = this.getWrappedLines();
        for (let i = 0; i < this.getWrappedLines().length; i++) {
            this.context.fillText(line[i], this.xByTextDirection(), this.yByRectLocation(i));
        }
    }

    protected xByTextDirection(): number {
        let x;

        if (this.context.textAlign == 'right') {
            x = this.rectangle.rightX - 10;
        } else if (this.context.textAlign == 'center') {
            x = (this.rectangle.rightX + this.rectangle.leftX) / 2;
        } else {
            x = this.rectangle.leftX + 10;
        }
        return x;
    }

    private yByRectLocation(i: number) {
        let point = this.cartesianPoint(0);
        let rect = this.rectangle;
        let textRectangleHeight;
        if (point.y < this.frame().top + this.basicRectData().height + this.basicTriangleData().height + this.pointerBounds().height) {
            textRectangleHeight = (rect.bottomY + 10 + this.lineHeight() + (i * this.lineHeight()));
        } else {
            textRectangleHeight = (rect.bottomY - 10) - (this.lineHeight() * ((this.getWrappedLines().length - i) - 1));
        }
        return textRectangleHeight;
    }

    private lineHeight() {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return DummyCanvasContext.measureText(this.lines[0], this.getDrawingTheme().text as ITextTheme).height;
    }

    private frame() {
        let frame = this.chartPanel.contentFrame;
        return {
            right: frame.right - 15,
            left: frame.left + 15,
            top: frame.top + 15
        };
    }

    private basicRectData() {
        let point = this.cartesianPoint(0);
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return {
            right: point.x + 270 / 2,
            left: point.x - 270 / 2,
            width: 270,
            height: (DummyCanvasContext.measureText(this.lines[0], this.getDrawingTheme().text as ITextTheme).height * this.getWrappedLines().length) + 20,
        };
    }

    private basicTriangleData() {
        let point = this.cartesianPoint(0);
        return {
            right: point.x + 7.5,
            left: point.x - 7.5,
            height: 15,
        };
    }

}

class NoteRectangle {
    rootX: number;
    centerRightX: number;
    centerLeftX: number;
    rightX: number;
    leftX: number;
    rootY: number;
    bottomY: number;
    topY: number;
}
