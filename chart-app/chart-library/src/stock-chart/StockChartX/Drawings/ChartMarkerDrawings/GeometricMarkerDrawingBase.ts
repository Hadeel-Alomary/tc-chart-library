/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Drawing, IDrawingConfig, IDrawingDefaults, IDrawingOptions} from "../Drawing";
import {ISize} from "../../Graphics/Rect";
import {IPoint} from "../../Graphics/ChartPoint";
import {Geometry} from "../../Graphics/Geometry";
import {ThemedDrawing} from '../ThemedDrawing';
import {DrawingTheme} from '../DrawingThemeTypes';
import {Chart} from '../../Chart';

export interface IGeometricMarkerDrawingBaseConfig extends IDrawingConfig {
    size?: ISize;
}

export interface IGeometricMarkerDrawingBaseOptions extends IDrawingOptions {
    size?: ISize;
}

export interface IGeometricMarkerDrawingBaseDefaults extends IDrawingDefaults {
    size?: ISize;
}

/** 
 * Drawing events enumeration values. 
 * @name DrawingEvent 
 * @enum {string} 
 * @property {string} SIZE_CHANGED Size changed
 * @readonly 
 * @memberOf  
 */
export namespace DrawingEvent {
    export const SIZE_CHANGED = 'drawingSizeChanged';
}

/**
 * Represents abstract geometric marker drawing.
 * @param {object} [config] The configuration object.
 * @param {Point | ChartPoint} [config.point] The point.
 * @param {Size} [config.size] The size.
 * @abstract
 * @constructor AbstractGeometricMarkerDrawing
 * @augments Drawing
 */
export abstract class GeometricMarkerDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T> {
    static get subClassName(): string {
        return 'abstractMarker';
    }

    static defaults: IGeometricMarkerDrawingBaseDefaults = {
        size: {
            width: 20,
            height: 20
        }
    };

    /**
     * Gets/Sets size.
     * @name size
     * @type {Size}
     * @memberOf GeometricMarkerDrawingBase#
     */
    get size(): ISize {
        return (<IGeometricMarkerDrawingBaseOptions> this._options).size || GeometricMarkerDrawingBase.defaults.size;
    }

    set size(value: ISize) {
        this._setOption('size', value, DrawingEvent.SIZE_CHANGED);
    }

    constructor(chart:Chart, config?: IGeometricMarkerDrawingBaseConfig) {
        super(chart, config);
    }

    /**
     * inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let bounds = this.bounds();

        return bounds && Geometry.isPointInsideOrNearRect(point, bounds);
    }
}
