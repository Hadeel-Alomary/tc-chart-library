/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


/**
 * The selection marker theme structure.
 * @typedef {object} SelectionMarkerTheme
 * @type {object}
 * @property {StrokeTheme} line The border line theme.
 * @property {FillTheme} fill The fill theme.
 * @memberOf StockChartX
 * @example
 * // Selection marker with black border and white background.
 * var theme = {
 *  line: {
 *      strokeColor: 'black'
 *  },
 *  fill: {
 *      fillColor: 'white'
 *  }
 * };
 */

import {Chart} from './Chart';
import {IFillTheme, IStrokeTheme, Theme} from './Theme';
import {IPoint} from './Graphics/ChartPoint';
import {ThemeType} from './ThemeType';
import {Geometry} from './Graphics/Geometry';
import DEVIATION = Geometry.DEVIATION;
import {BrowserUtils} from '../../utils';

export interface ISelectionMarkerConfig {
    chart: Chart;
    theme?: ISelectionMarkerTheme;
    width?: number;
}

export interface ISelectionMarkerTheme {
    line: IStrokeTheme;
    fill: IFillTheme;
}


const defaultWidth = BrowserUtils.isMobile() ? 12 : DEVIATION; // for mobile, DEVIATION is larger than circle size (to be able to select it easily)

/**
 * Represents object's selection marker.
 * @constructor SelectionMarker
 */
export class SelectionMarker {
    private _chart: Chart;
    /**
     * Returns parent chart.
     * @name chart
     * @type {Chart}
     * @readonly
     * @memberOf SelectionMarker#
     */
    get chart(): Chart {
        return this._chart;
    }


    /**
     * Gets/Sets marker's width.
     * @name width
     * @type {number}
     * @memberOf SelectionMarker#
     */
    private _width: number = null;
    private set width(value: number) {
        this._width = value;
    }

    private get width(): number {
        return this._width || defaultWidth;
    };

    /**
     * Returns actual theme.
     * @name actualTheme
     * @type {SelectionMarkerTheme}
     * @memberOf SelectionMarker#
     */
    get actualTheme(): ISelectionMarkerTheme {
        // MA for selection marker, we don't have customization for it (at time of writing this comment), and to make fine tuning colors
        // easy, we are reading it directly from Theme.Light instead of chart.theme (so that we don't have to do backward compatibility
        // for saved charts).
        return this._chart.getThemeType() == ThemeType.Light ? Theme.Light.pointerPoint.selectionMarker : Theme.Dark.pointerPoint.selectionMarker;
    }

    constructor(config: ISelectionMarkerConfig) {
        config = config || <ISelectionMarkerConfig> {};

        this._chart = config.chart;
        this.width = config.width;
    }

    /**
     * Draws marker at a given position(s).
     * @method draw
     * @param {CanvasRenderingContext2D} context The drawing context.
     * @param {Point | Point[]} point
     * @memberOf SelectionMarker#
     * @example
     * // draw marker at a given position
     * marker.draw(context, {x: 10, y: 20});
     *
     * // draw 2 markers at a given positions.
     * marker.draw(context, [{x: 10, y: 20}, {x: 100, y: 100}]);
     */
    draw(context: CanvasRenderingContext2D, point: IPoint | IPoint[] , theme : ISelectionMarkerTheme) {
        let width = this.width;

        if(BrowserUtils.isMobile()) {
            theme = this.actualTheme;
        }

        if (Array.isArray(point)) {
            context.scxApplyFillTheme(theme.fill);
            context.scxApplyStrokeTheme(theme.line);

            for (let item of point) {
                context.beginPath();
                context.arc(item.x + 0.5, item.y + 0.5, width, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            }
        } else {
            context.beginPath();
            context.arc(point.x + 0.5, point.y + 0.5, width, 0, 2 * Math.PI);
            context.scxFill(theme.fill);
            context.scxStroke(theme.line);
        }
    }
}
