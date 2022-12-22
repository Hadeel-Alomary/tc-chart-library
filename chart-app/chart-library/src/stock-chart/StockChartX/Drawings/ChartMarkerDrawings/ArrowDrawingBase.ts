/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {
    GeometricMarkerDrawingBase,
    IGeometricMarkerDrawingBaseConfig, IGeometricMarkerDrawingBaseDefaults,
    IGeometricMarkerDrawingBaseOptions
} from "./GeometricMarkerDrawingBase";
import {JsUtil} from "../../Utils/JsUtil";
import {ITextDrawingOptions} from '../GeneralDrawings/TextDrawing';
import {Drawing, IDrawingOptions} from '../Drawing';
import {ArrowRightDrawing} from './ArrowRightDrawing';
import {ArrowDrawingTheme} from '../DrawingThemeTypes';
import {Chart} from '../../Chart';

export interface IArrowDrawingBaseConfig extends IGeometricMarkerDrawingBaseConfig {
    headRatio?: number;
    tailRatio?: number;
}

export interface IArrowDrawingBaseOptions extends IGeometricMarkerDrawingBaseOptions {
    headRatio?: number;
    tailRatio?: number;
    text?:string;
}

export interface IArrowDrawingBaseDefaults extends IGeometricMarkerDrawingBaseDefaults {
    headRatio: number;
    tailRatio: number;
}

/** 
 * Drawing events enumeration values. 
 * @name DrawingEvent 
 * @enum {string} 
 * @property {string} ARROW_HEAD_RATIO_CHANGED Arrow head ratio changed
 * @property {string} ARROW_TAIL_RATIO_CHANGED Arrow tail ratio changed
 * @readonly 
 * @memberOf  
 */
export namespace DrawingEvent {
    export const ARROW_HEAD_RATIO_CHANGED = 'drawingArrowHeadRatioChanged';
    export const ARROW_TAIL_RATIO_CHANGED = 'drawingArrowTailRatioChanged';
    export const TEXT_CHANGED = 'drawingTextChanged';
}

/**
 * Represents abstract arrow drawing.
 * @param {object} [config] The configuration object.
 * @param {Point | ChartPoint} [config.point] The point.
 * @param {Size} [config.size] The size.
 * @param {number} [config.headRatio]
 * @param {number} [config.tailRatio]
 * @param {number} [config.height] The height.
 * @abstract
 * @constructor ArrowDrawingBase
 * @augments GeometricMarkerDrawingBase
 */
export class ArrowDrawingBase extends GeometricMarkerDrawingBase<ArrowDrawingTheme> {
    static defaults: IArrowDrawingBaseDefaults = {
        size: null,
        headRatio: 0.5,
        tailRatio: 0.5
    };

    get text(): string {
        return (<IArrowDrawingBaseOptions> this._options).text || '' ;
    }

    set text(value: string) {
        value = value || '';
        this._setOption('text', value, DrawingEvent.TEXT_CHANGED);
    }

    get headRatio(): number {
        return (<IArrowDrawingBaseOptions> this._options).headRatio || ArrowDrawingBase.defaults.headRatio;
    }

    set headRatio(value: number) {
        if (!JsUtil.isPositiveNumber(value) || value >= 1)
            throw new Error("Value must be in range (0..1).");

        this._setOption('headRatio', value, DrawingEvent.ARROW_HEAD_RATIO_CHANGED);
    }

    get tailRatio(): number {
        return (<IArrowDrawingBaseOptions> this._options).tailRatio || ArrowDrawingBase.defaults.tailRatio;
    }

    set tailRatio(value: number) {
        if (!JsUtil.isPositiveNumber(value) || value >= 1)
            throw new Error("Value must be in range (0..1).");

        this._setOption('tailRatio', value, DrawingEvent.ARROW_TAIL_RATIO_CHANGED);
    }

    constructor(chart:Chart, config?: IArrowDrawingBaseConfig) {
        super(chart, config);
    }


}
