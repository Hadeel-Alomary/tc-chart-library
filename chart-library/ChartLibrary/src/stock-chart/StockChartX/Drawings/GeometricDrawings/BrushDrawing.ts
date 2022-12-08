import {Drawing, IDrawingOptions} from '../Drawing';
import {ClickGesture} from '../../Gestures/ClickGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {ChartPoint, IChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {PanGesture} from '../../Gestures/PanGesture';
import {Geometry} from '../../Graphics/Geometry';
import {MouseHoverGesture} from "../../Gestures/MouseHoverGesture";
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export interface IBrushDrawingOptions extends IDrawingOptions {
    applyFillDrawing: boolean;
}

export class BrushDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'brush';
    }

    private _createBrushPanGesture: PanGesture;
    private _createBrushClickGesture: ClickGesture;
    private _createBrushMoveGesture: MouseHoverGesture;

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points);
    }

    startUserDrawing() {
        this._createBrushPanGesture = new PanGesture({
            hitTest: () => {
                return true;
            },
            handler: this._handleUserDrawingPanGesture,
            context: this,
        });
        this._createBrushClickGesture = new ClickGesture({
            hitTest: () => {
                return true;
            },
            context: this,
        });
        this._createBrushMoveGesture = new MouseHoverGesture({
            enterEventEnabled: false,
            leaveEventEnabled: false,
            hitTest: () => {
                return true;
            },
            context: this,
        });

        this.chartPoints = [];
        this.selected = true;

        let panel = this.chartPanel;
        if (panel) {
            panel.deleteDrawings(this);
            panel.setNeedsUpdate();
            this.chartPanel = null;
        }
    }

    public _handleUserDrawingPanGesture(gesture: ClickGesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.FINISHED:
                if (!this.chartPanel) {
                    event.chartPanel.addDrawings(this);
                }
                let point = this._normalizePoint(event.pointerPosition);
                this._lastCreatePoint = null;
                if (!this._handleUserDrawingPoint(point)) {
                    this.appendChartPoint(point);
                    this.onAddNewChartPointInUserDrawingState();
                }
                if (this.chartPoints.length >= this.pointsNeeded) {
                    this._finishUserDrawing();
                    this.removeDrawingIfNotSeen();
                }
                this.chartPanel.setNeedsUpdate();
                break;
            case GestureState.CONTINUED:
                if (this.chartPoints.length > 0) {
                    let point = this._normalizePoint(event.pointerPosition);
                    this._lastCreatePoint = <IPoint>this._normalizePoint(event.pointerPosition);
                    this.appendChartPoint(point);
                    this.showDrawingTooltip();
                    this.chartPanel.setNeedsUpdate();
                }
                break;
        }
    }

    draw() {
        if (!this.visible)
            return;

        let points = this.cartesianPoints();

        if (points.length > 1) {
            this.context.beginPath();
            for (let i = 0; i < points.length - 1; i++) {
                if (points[i + 1] !== undefined) {
                    let x = (points[i].x + points[i + 1].x) / 2,
                        y = (points[i].y + points[i + 1].y) / 2;
                    this.context.quadraticCurveTo(points[i].x, points[i].y, x, y);
                }
            }
            this.context.scxStroke(this.getDrawingTheme().line);

            if (this.applyFillDrawing && this.getDrawingTheme().fill.fillEnabled)
                this.context.scxFill(this.getDrawingTheme().fill);
        }

        if (this.selected)
            this._drawSelectionMarkers([points[0], points[points.length - 1]]);
    }

    private _normalizePoint(point: IPoint): IChartPoint {
        let magnetPoint = this._magnetChartPointIfNeeded(point);
        return ChartPoint.convert(magnetPoint, this.createPointBehavior, this.projection);
    }

    handleEvent(event: WindowEvent): boolean {
        if (this._createBrushPanGesture) {
            return this._createBrushPanGesture.handleEvent(event) ||
                this._createBrushClickGesture.handleEvent(event) ||
                this._createBrushMoveGesture.handleEvent(event);
        }

        return this._gestures.handleEvent(event);
    }

    private removeDrawingIfNotSeen() {
        // MA when finishing the drawing, if it is just too few points, then remove the drawing
        if(this.cartesianPoints().length < 3) {
            this.chartPanel.deleteDrawings(this);
        }
    }

    get applyFillDrawing(): boolean {
        if ((<IBrushDrawingOptions> this._options).applyFillDrawing == undefined)
            (<IBrushDrawingOptions> this._options).applyFillDrawing = false;

        return (<IBrushDrawingOptions> this._options).applyFillDrawing;
    }

    set applyFillDrawing(value: boolean) {
        (<IBrushDrawingOptions> this._options).applyFillDrawing = !!value;
    }

    canControlPointsBeManuallyChanged(): boolean {
        return false;
    }
    
    _finishUserDrawing() {
        this._createBrushPanGesture = null;
        this.applyFillDrawing = true;
        super._finishUserDrawing();
    }

}

Drawing.register(BrushDrawing);
