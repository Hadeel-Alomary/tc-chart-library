/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


/**
 * The value scale major tick mark structure.
 * @typedef {object} ValueScaleMajorTick
 * @type {object}
 * @property {number} y The Y coordinate of the tick mark.
 * @property {number} value The value.
 * @property {string} text The text representation of the date.
 * @memberOf StockChartX
 */

import {IStateProvider} from "../Data/IStateProvider";
import {ChartPanelValueScale} from "./ChartPanelValueScale";
import {ClassRegistrar, IConstructor} from "../Utils/ClassRegistrar";
import {JsUtil} from "../Utils/JsUtil";

/**
 * The value scale minor tick mark structure.
 * @typedef {object} ValueScaleMinorTick
 * @type {object}
 * @property {number} y The Y coordinate of the tick mark.
 * @memberOf StockChartX
 */

export interface IValueScaleMajorTick {
    y: number;
    value: number;
    text: string;
}

export interface IValueScaleMinorTick {
    y: number;
}

export interface IValueScaleCalibratorConfig {

}

export interface IValueScaleCalibratorOptions {

}

export interface IValueScaleCalibratorState {
    className: string;
    options: IValueScaleCalibratorOptions;
}

export interface IValueScaleCalibrator extends IStateProvider<IValueScaleCalibratorState> {
    majorTicks: IValueScaleMajorTick[];
    minorTicks: IValueScaleMinorTick[];

    calibrate(valueScale: ChartPanelValueScale): void;
}

class ValueScaleCalibratorRegistrar {
    private static _calibrators = new ClassRegistrar<IValueScaleCalibrator>();

    /**
     * Gets object with information about registered value scale calibrators. Key is class name and value is constructor.
     * @name registeredCalibrators
     * @type {Object}
     * @memberOf ValueScaleCalibrator
     */
    static get registeredCalibrators(): Object {
        return this._calibrators.registeredItems;
    }

    /**
     * Registers new value scale calibrator.
     * @method register
     * @param {string} className The unique class name of the value scale calibrator.
     * @param {Function} constructor The constructor.
     * @memberOf ValueScaleCalibrator
     */
    /**
     * Registers new value scale calibrator.
     * @method register
     * @param {Function} type The constructor.
     * @memberOf ValueScaleCalibrator
     */
    static register(type: typeof ValueScaleCalibrator): void;
    static register(className: string, constructor: IConstructor<IValueScaleCalibrator>): void;
    static register(typeOrClassName: string | typeof ValueScaleCalibrator, constructor?: IConstructor<IValueScaleCalibrator>) {
        if (typeof typeOrClassName === 'string')
            this._calibrators.register(typeOrClassName, constructor);
        else
            this._calibrators.register(typeOrClassName.className, <IConstructor<IValueScaleCalibrator>> (typeOrClassName as unknown));
    }

    /**
     * Deserializes value scale calibrator.
     * @method deserialize
     * @param {Object} state The state of date scale calibrator.
     * @returns {IValueScaleCalibrator}
     * @memberOf ValueScaleCalibrator
     */
    static deserialize(state: IValueScaleCalibratorState): IValueScaleCalibrator {
        if (!state)
            return null;

        let calibrator = this._calibrators.createInstance(state.className);
        calibrator.loadState(state);

        return calibrator;
    }
}

/**
 * The abstract base class for value scale calibrators.
 * @constructor ValueScaleCalibrator
 */
export abstract class ValueScaleCalibrator implements IValueScaleCalibrator {
    static get className(): string {
        return '';
    }

    // ValueScaleCalibratorRegistrar mixin
    static registeredCalibrators: Object;
    static register: (typeOrClassName: string | typeof ValueScaleCalibrator, constructor?: IConstructor<IValueScaleCalibrator>) => void;
    static deserialize: (state: IValueScaleCalibratorState) => IValueScaleCalibrator;

    /**
     * Returns an array of major ticks.
     * @name majorTicks
     * @type {ValueScaleMajorTick[]}
     * @memberOf ValueScaleCalibrator#
     */
    private _majorTicks: IValueScaleMajorTick[] = [];
    get majorTicks(): IValueScaleMajorTick[] {
        return this._majorTicks;
    }

    /**
     * Returns an array of minor ticks.
     * @name minorTicks
     * @type {ValueScaleMinorTick[]}
     * @memberOf ValueScaleCalibrator#
     */
    private _minorTicks: IValueScaleMinorTick[] = [];
    get minorTicks(): IValueScaleMinorTick[] {
        return this._minorTicks;
    }

    protected _options: IValueScaleCalibratorOptions = {};

    constructor(config?: IValueScaleCalibratorConfig) {
        if (config) {
            this.loadState(<IValueScaleCalibratorState> {options: config});
        }
    }

    /**
     * Calibrates value scale.
     * @method calibrate
     * @param {ChartPanelValueScale} valueScale The value scale.
     * @memberOf ValueScaleCalibrator#
     */
    calibrate(valueScale: ChartPanelValueScale) {
        this._majorTicks.length = 0;
        this._minorTicks.length = 0;
    }

    protected _calibrateMinorTicks(ticksCount: number) {
        let majorTicks = this.majorTicks;

        for (let i = 0, count = majorTicks.length; i < count - 1; i++) {
            let tick1 = majorTicks[i],
                tick2 = majorTicks[i + 1],
                width = (tick2.y - tick1.y) / (ticksCount + 1);

            for (let j = 1; j <= ticksCount; j++) {
                this.minorTicks.push({
                    y: Math.round(tick1.y + j * width)
                });
            }
        }
    }

    /**
     * Saves calibrator's state.
     * @method saveState
     * @returns {object} The state.
     * @memberOf ValueScaleCalibrator#
     * @see [loadState]{@linkcode ValueScaleCalibrator#loadState}
     */
    saveState(): IValueScaleCalibratorState {
        return {
            className: (this.constructor as typeof ValueScaleCalibrator).className,
            options: Object.keys(this._options).length == 0 ? null : JsUtil.clone(this._options)
        };
    }

    /**
     * Restores calibrator's state.
     * @method loadState
     * @param {object} state The state.
     * @memberOf ValueScaleCalibrator#
     * @see [saveState]{@linkcode ValueScaleCalibrator#saveState}
     */
    loadState(state: IValueScaleCalibratorState) {
        this._options = (state && JsUtil.clone(state.options)) || {};
    }
}

JsUtil.applyMixins(ValueScaleCalibrator, [ValueScaleCalibratorRegistrar]);
