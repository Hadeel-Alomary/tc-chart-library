/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Drawing, IDrawingConfig, IDrawingDefaults, IDrawingOptions} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {IRect} from '../../Graphics/Rect';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {FibonacciDrawingBase} from '../FibonacciDrawings/FibonacciDrawingBase';
import {FibonacciTimeZonesDrawingTheme, GannFanDrawingTheme} from '../DrawingThemeTypes';

export interface IGannFanAngle {
    value: number
}

export interface IGannFanConfig extends IDrawingConfig {
    angles?: IGannFanAngle[]
}

export interface IGannFanOptions extends IDrawingOptions {
    angles?: IGannFanAngle[]
}

export interface IGannFanDefaults extends IDrawingDefaults {
    angles?: IGannFanAngle[]
}

export namespace DrawingEvent {
    export const ANGLES_CHANGED = 'drawingAnglesChanged';
    export const SHOW_ANGLE_LINE_CHANGED = 'drawingShowAngleLineChanged';
}

/**
 * Represents gann fan drawing.
 * @constructor GannFanDrawing
 * @augments Drawing
 * @example
 *  // Create gann fan drawing.
 *  var drawing1 = new GannFanDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create gann fan drawing.
 *  var drawing2 = new GannFanDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create gann fan drawing with a custom theme.
 *  var drawing3 = new GannFanDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 2
 *          }
 *      }
 *  });
 */
export class GannFanDrawing extends FibonacciDrawingBase<GannFanDrawingTheme> {
    static get className(): string {
        return 'gannFan';
    }

    private numberOfLastTwoLineDrawn: number[];
    private angles = [1 / 8, 1 / 4, 1 / 3, 1 / 2, 1 / 1, 2 / 1, 3 / 1, 4 / 1, 8 / 1];
    private pointsOfLines: Array<IPoint[]>;

    get pointsNeeded(): number {
        return 2;
    }

    get anglesText() {
        return ['8/1', '4/1', '3/1', '2/1', '1/1', '1/2', '1/3', '1/4', '1/8'];
    }

    bounds(): IRect {
        let points = this.cartesianPoints();
        if (points.length < 2)
            return null;

        return {
            left: Math.min(points[0].x, points[1].x),
            top: Math.max(points[0].y, points[1].y),
            width: Math.abs(points[1].x - points[0].x),
            height: Math.abs(points[1].y - points[0].y)
        };
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;

        let pointsOfLines = this.pointsOfLines;
        for (let i = 0; i < pointsOfLines.length; i++) {
            let startPointOfLine = pointsOfLines[i][0];
            let endPointOfLine = pointsOfLines[i][2];
            if (Geometry.isPointNearLine(point, startPointOfLine, endPointOfLine))
                return true;
        }
        return false;
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;

                return true;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }
        return false;
    }

    draw() {
        if (!this.visible)
            return;

        let points = this.cartesianPoints();
        if (points.length === 0)
            return;

        if (points.length > 1) {
            let pointsOfLines = this.pointsOfLines = this._calculateLinesPoints(points);
            this.numberOfLastTwoLineDrawn = [];
            let numberOfDeletedLine = 0;

            for (let lineNumber = 0; lineNumber < pointsOfLines.length; lineNumber++) {
                if (!this._isLevelVisible(this.levels[lineNumber])) {
                    numberOfDeletedLine++;
                    continue;
                }
                this.drawLine(lineNumber, pointsOfLines);
                if (this.getDrawingTheme().showLevelValues) {
                    this.drawText(lineNumber, pointsOfLines, points);
                }
                if (this.getDrawingTheme().showLevelBackgrounds) {
                    this.fillDrawing(lineNumber, pointsOfLines, points, numberOfDeletedLine);
                }
            }
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    }

    private drawLine(lineNumber: number, pointsOfLines: Array<IPoint[]>) {
        let startPointOfLine = {x: pointsOfLines[lineNumber][0].x, y: pointsOfLines[lineNumber][0].y};
        let endPointOfLine = {x: pointsOfLines[lineNumber][2].x, y: pointsOfLines[lineNumber][2].y};
        let themeLevel = this.levels[lineNumber].theme;
        // Draw lines .........
        this.context.beginPath();
        this.context.moveTo(startPointOfLine.x, startPointOfLine.y);
        this.context.lineTo(endPointOfLine.x, endPointOfLine.y);
        this.context.scxStroke(themeLevel.line);
        this.numberOfLastTwoLineDrawn.push(lineNumber);
    }

    private drawText(lineNumber: number, pointsOfLines: Array<IPoint[]>, points: IPoint[]) {
        let centerPointOfLine = {x: pointsOfLines[lineNumber][1].x, y: pointsOfLines[lineNumber][1].y};
        let horizontalText_X = this.calculate_X_ForHorizontalTextUsing_Y_OfLineCenterPoint(centerPointOfLine.y, points);
        //Draw Text ..........
        this.context.beginPath();
        this.context.scxApplyTextTheme(this.levels[lineNumber].theme.text);
        if (lineNumber < 5) {
            this.context.fillText(this.anglesText[lineNumber].toString(), points[1].x, centerPointOfLine.y);
        } else {
            this.context.fillText(this.anglesText[lineNumber].toString(), horizontalText_X, points[1].y);
        }
    }

    private fillDrawing(lineNumber: number, pointsOfLines: Array<IPoint[]>, points: IPoint[], numberOfDeletedLine: number) {
        if (lineNumber <= 5) {
            this.fillAboveCenterLines(pointsOfLines, points);
        } else {
            this.fillBelowCenterLines(pointsOfLines, points, numberOfDeletedLine);
        }
    }

    private fillAboveCenterLines(pointsOfLines: Array<IPoint[]>, points: IPoint[]) {
        let assemblyPoint = points[0];
        if (this.numberOfLastTwoLineDrawn.length > 1) {
            let firstLine = pointsOfLines[this.numberOfLastTwoLineDrawn[0]][2];
            let secondLine = pointsOfLines[this.numberOfLastTwoLineDrawn[1]][2];
            this.context.scxFillPolyLine([assemblyPoint, firstLine, secondLine], this.levels[this.numberOfLastTwoLineDrawn[0]].theme.fill);
            this.numberOfLastTwoLineDrawn.shift();
        }
    }

    private fillBelowCenterLines(pointsOfLines: Array<IPoint[]>, points: IPoint[], numberOfDeletedLine: number) {
        let assemblyPoint = points[0];
        let firstLine = pointsOfLines[this.numberOfLastTwoLineDrawn[0]][2];
        let secondLine = pointsOfLines[this.numberOfLastTwoLineDrawn[1]][2];
        if (!this._isLevelVisible(this.levels[5]) && this.numberOfLastTwoLineDrawn[1] == this.numberOfLastTwoLineDrawn[0] + numberOfDeletedLine + 1) {
            this.context.scxFillPolyLine([assemblyPoint, firstLine, secondLine], this.levels[this.numberOfLastTwoLineDrawn[0]].theme.fill);
        }
        this.context.scxFillPolyLine([assemblyPoint, firstLine, secondLine], this.levels[this.numberOfLastTwoLineDrawn[1]].theme.fill);
        this.numberOfLastTwoLineDrawn.shift();
    }

    private calculate_X_ForHorizontalTextUsing_Y_OfLineCenterPoint(centerPoint_y: number, points: IPoint[]) {
        let slope = (centerPoint_y - points[0].y) / (points[1].x - points[0].x);
        return ((points[1].y - points[0].y) / slope) + points[0].x;
    }

    private _calculateLinesPoints(points: IPoint[]): Array<IPoint[]> {
        let assemblyPoint = {x: points[0].x, y: points[0].y};
        let isLeft = points[0].x > points[1].x;
        let destinationX = isLeft ? this.chartPanel.contentFrame.left : this.chartPanel.contentFrame.right;
        let drawingPoints: Array<IPoint[]> = [];

        for (let angle of this.angles) {
            let centerPoint_X = points[1].x;
            let centerPoint_Y = assemblyPoint.y - (Math.round(assemblyPoint.y - points[1].y) * angle);
            let endPoint_X = destinationX;
            let endPoint_Y = Math.round(assemblyPoint.y + (destinationX - assemblyPoint.x) * (centerPoint_Y - assemblyPoint.y) / (centerPoint_X - assemblyPoint.x));
            // each line has 3 points [start point , center point , end point ] .
            drawingPoints.push([{x: assemblyPoint.x, y: assemblyPoint.y}, {x: centerPoint_X, y: centerPoint_Y}, {
                x: endPoint_X,
                y: endPoint_Y
            }]);
        }

        return drawingPoints;
    }
}

Drawing.register(GannFanDrawing);
