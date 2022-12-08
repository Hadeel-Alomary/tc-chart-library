/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Drawing, IDrawingOptions} from "../Drawing";
import {IRect} from "../../Graphics/Rect";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {TimeSpan} from "../../Data/TimeFrame";
import {DummyCanvasContext} from "../../Utils/DummyCanvasContext";
import {HtmlUtil} from "../../Utils/HtmlUtil";
import {ITextTheme} from '../../Theme';
import {FilledShapeDrawingTheme, LineWithLabelDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';
import {BrowserUtils} from '../../../../utils';

export interface IVerticalLineDrawingOptions extends IDrawingOptions {
}

/**
 * Represents vertical line drawing.
 * @constructor VerticalLineDrawing
 * @augments Drawing
 * @example
 *  // Create vertical line drawing.
 *  var line1 = new VerticalLineDrawing({
     *      point: {x: 10, y: 20}
     *  });
 *
 *  // Create vertical line drawing.
 *  var line2 = new VerticalLineDrawing({
     *      point: {record: 10, value: 20.0}
     *  });
 *
 *  // Create vertical line drawing with a custom theme.
 *  var line3 = new VerticalLineDrawing({
     *      point: {record: 10, value: 20.0}
     *      theme: {
     *          line: {
     *              strokeColor: 'white'
     *              width: 1
     *          }
     *      }
     *  });
 */
export class VerticalLineDrawing extends ThemedDrawing<LineWithLabelDrawingTheme> {
    static get className(): string {
        return 'verticalLine';
    }

    private intradDayTimeIntervals: number[] = [TimeSpan.MILLISECONDS_IN_MINUTE, TimeSpan.MILLISECONDS_IN_HOUR];

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        let frame = this.chartPanel.contentFrame;

        return {
            left: point.x,
            top: frame.top,
            width: 1,
            height: frame.height
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let p = this.cartesianPoint(0);

        return point && Geometry.isValueNearValue(point.x, p.x);
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let point = this.cartesianPoint(0);
        if (!point)
            return;

        let context = this.context,
            frame = this.chartPanel.contentFrame;

        context.beginPath();
        context.moveTo(point.x, frame.top);
        context.lineTo(point.x, frame.bottom);
        context.scxStroke(this.getDrawingTheme().line);

        if (this.selected) {
            let y = Math.round(frame.top + frame.height / 2);

            this._drawSelectionMarkers({x: point.x, y: y});
        }

        this.drawValue();

    }

    drawValue() {
        let textTheme : ITextTheme= <ITextTheme>{fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: ''};
        let point = this.cartesianPoint(0),
            frame = this.chartPanel.contentFrame,
            context = this.chartPanel.context,
            text = this.getFormattedDate(point.x),
            theme = this.getDrawingTheme();

        if(BrowserUtils.isMobile()) {

            let padding = 2,
                valuePosition = {x: point.x, y: Math.round(frame.bottom - padding)};
            textTheme.fillColor = 'black';
            textTheme.fontSize = 9;
            let textSize = DummyCanvasContext.measureText(text, textTheme);
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, valuePosition.x + padding, valuePosition.y);

        } else {

            let textSize = DummyCanvasContext.measureText(text, textTheme),
                padding = 5,
                valuePosition = {x: point.x, y: Math.round(frame.bottom - padding)};

            context.scxApplyFillTheme({fillColor: theme.line.strokeColor});

            let x = valuePosition.x + padding,
                y = valuePosition.y - textSize.height - ( 2 * padding ),
                width = textSize.width + (padding * 2),
                height = textSize.height + (padding * 2);

            context.fillRect(x, y, width, height);

            textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, x + padding, y + textSize.height + (padding / 2));
        }



    }

    private getFormattedDate(x: number): string {
        let date = this.projection.dateByColumn(this.projection.columnByX(x));

        if (this.intradDayTimeIntervals.indexOf(this.chart.timeInterval) !== -1) // Minutes intervals
            return moment(date).format("DD-MM-YYYY , HH:mm:ss");

        return moment(date).format("DD-MM-YYYY");
    }

    protected shouldDrawMarkers(): boolean {
        return false;
    }

}

Drawing.register(VerticalLineDrawing);
