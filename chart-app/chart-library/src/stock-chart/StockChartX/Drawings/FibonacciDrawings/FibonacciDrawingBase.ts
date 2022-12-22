/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {IFillTheme, IStrokeTheme, ITextTheme} from "../../Theme";
import {Drawing, IDrawingConfig, IDrawingLevel, IDrawingOptions} from '../Drawing';
import {DrawingTextVerticalPosition, DrawingTextHorizontalPosition} from "../DrawingTextPosition";
import {ChartAccessorService} from "../../../../services/index";
import {ShowDrawingSettingsDialogRequest} from '../../../../services/shared-channel/channel-request';
import {ChannelRequestType} from '../../../../services';
import {
    DrawingTheme,
    FibonacciEllipsesDrawingTheme,
    FibonacciExtendedLevelsDrawingTheme,
    FibonacciFanDrawingTheme,
    FibonacciTimeZonesDrawingTheme, LevelThemeElement
} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';
import {Chart} from '../../Chart';

/**
 * The fibonacci level structure.
 * @typedef {object} FibonacciLevel
 * @type {object}
 * @property {boolean} [visible = true] The flag that indicates whether level is visible.
 * @property {number} value The level value.
 * @property {object} [theme] The theme for the level.
 * @memberOf StockChartX
 * @example
 *  var point = {
 *      x: 10,
 *      y: 20
 *  };
 */



export interface IFibonacciDrawingBaseConfig extends IDrawingConfig {
    levels: IDrawingLevel[];
}

export interface IFibonacciDrawingBaseOptions extends IDrawingOptions {
    levels?: IDrawingLevel[];
}


/**
 * The base abstract class for fibonacci drawings.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor FibonacciDrawingBase
 * @augments Drawing
 */
export class FibonacciDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T> {
    static get subClassName(): string {
        return 'fibonacci';
    }

    protected _textOffset: number = 2;

    /**
     * The level values
     * @name levels
     * @type {FibonacciLevel[]}
     * @memberOf FibonacciDrawingBase#
     */
    get levels(): IDrawingLevel[] {
        return (this._options as IFibonacciDrawingBaseOptions).levels;
    }

    set levels(value: IDrawingLevel[]) {
        //Levels should not be rearranged for gannFan drawing like fibonacciSpeedResistanceArcs .
        if(this.className == 'fibonacciSpeedResistanceArcs' || this.className == 'gannFan') {
            (<IFibonacciDrawingBaseOptions> this._options).levels = [];
            (<IFibonacciDrawingBaseOptions> this._options).levels = value;
        }else {
            if (value != null && !Array.isArray(value))
                throw new TypeError('Levels must be an array of numbers.');

            for (let i = 0, count = value.length; i < count - 1; i++) {
                for (let j = i + 1; j < count; j++) {
                    if (value[i].value > value[j].value) {
                        let tmp = value[i];
                        value[i] = value[j];
                        value[j] = tmp;
                    }
                }
            }

            (<IFibonacciDrawingBaseOptions> this._options).levels = value;
        }
    }


    /**
     * The flag that indicates whether level lines are visible.
     * @name showLevelLines
     * @type {boolean}
     * @memberOf FibonacciDrawingBase#
     */
    get showLevelLines(): boolean {
        return true;
    }

    constructor(chart:Chart, config?: IFibonacciDrawingBaseConfig) {
        super(chart, config);
    }

    public showSettingsDialog(): void {
       let showFiboDrawingSettingsRequest : ShowDrawingSettingsDialogRequest = {type: ChannelRequestType.FiboDrawingSettingsDialog,drawing:this};
        ChartAccessorService.instance.sendSharedChannelRequest(showFiboDrawingSettingsRequest);
    }

    protected _applyTextPosition(theme:FibonacciExtendedLevelsDrawingTheme|FibonacciEllipsesDrawingTheme|FibonacciTimeZonesDrawingTheme) {
        let context = this.context,
            baseline: string,
            align: string;

        switch (theme.levelTextVerPosition) {
            case DrawingTextVerticalPosition.MIDDLE:
                baseline = 'middle';
                break;
            case DrawingTextVerticalPosition.TOP:
                baseline = 'bottom';
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                baseline = 'top';
                break;
            default:
                throw new Error('Unsupported level text vertical position: ' + theme.levelTextVerPosition);
        }

        switch (theme.levelTextHorPosition) {
            case DrawingTextHorizontalPosition.CENTER:
                align = 'center';
                break;
            case DrawingTextHorizontalPosition.LEFT:
                align = 'right';
                break;
            case DrawingTextHorizontalPosition.RIGHT:
                align = 'left';
                break;
            default:
                throw new Error('Unsupported level text horizontal position: ' + theme.levelTextHorPosition);
        }

        context.textBaseline = baseline as CanvasTextBaseline;
        context.textAlign = align as CanvasTextAlign;
    }

    // noinspection JSMethodCanBeStatic
    protected _isLevelVisible(level: IDrawingLevel): boolean {
        return level.visible != null ? level.visible : true;
    }

    protected _adjustXWithTextOffset(theme:FibonacciExtendedLevelsDrawingTheme|FibonacciEllipsesDrawingTheme|FibonacciTimeZonesDrawingTheme, x: number): number {
        switch (theme.levelTextHorPosition) {
            case DrawingTextHorizontalPosition.LEFT:
                return x - this._textOffset;
            case DrawingTextHorizontalPosition.RIGHT:
                return x + this._textOffset;
            default:
                return x;
        }
    };

    protected _adjustYWithTextOffset(theme:FibonacciExtendedLevelsDrawingTheme|FibonacciEllipsesDrawingTheme|FibonacciTimeZonesDrawingTheme|FibonacciFanDrawingTheme, y: number): number {
        switch (theme.levelTextVerPosition) {
            case DrawingTextVerticalPosition.TOP:
                return y - this._textOffset;
            case DrawingTextVerticalPosition.BOTTOM:
                return y + this._textOffset;
            default:
                return y;
        }
    };
}
