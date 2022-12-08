/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IValueScaleCalibratorConfig, IValueScaleCalibratorOptions, ValueScaleCalibrator} from "./ValueScaleCalibrator";
import {JsUtil} from "../Utils/JsUtil";
import {ChartPanelValueScale} from "./ChartPanelValueScale";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {Projection} from './Projection';

export interface IIntervalValueScaleCalibratorConfig extends IValueScaleCalibratorConfig {
    majorTicks?: {
        interval?: number;
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}

interface IIntervalValueScaleCalibratorOptions extends IValueScaleCalibratorOptions {
    majorTicks?: {
        interval?: number;
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}

export interface IIntervalValueScaleCalibratorDefaults {
    majorTicks: {
        interval: number;
        minOffset: number;
    };
    minorTicks: {
        count: number;
    };
}

/**
 * The value scale calibrator which uses user defined value interval.
 * @constructor IntervalValueScaleCalibrator
 * @augments ValueScaleCalibrator
 */
export class IntervalValueScaleCalibrator extends ValueScaleCalibrator {
    static defaults: IIntervalValueScaleCalibratorDefaults = {
        majorTicks: {
            interval: 0.00001,
            minOffset: 10
        },
        minorTicks: {
            count: 0
        }
    };

    static get className(): string {
        return 'StockChartX.IntervalValueScaleCalibrator';
    }

    /**
     * The minimum interval between values..
     * @name interval
     * @type {number}
     * @memberOf IntervalValueScaleCalibrator#
     */
    get interval(): number {
        let majorTicks = (<IIntervalValueScaleCalibratorOptions> this._options).majorTicks;

        return majorTicks != null && majorTicks.interval != null
            ? majorTicks.interval
            : IntervalValueScaleCalibrator.defaults.majorTicks.interval;
    }

    set interval(value: number) {
        if (value != null && !JsUtil.isPositiveNumber(value))
            throw new Error('Interval must be a value greater or equal to 0.');

        let options = <IIntervalValueScaleCalibratorOptions> this._options;
        (options.majorTicks || (options.majorTicks = {})).interval = value;
    }

    /**
     * The minimum vertical offset between labels.
     * @name minValuesOffset
     * @type {number}
     * @memberOf IntervalValueScaleCalibrator#
     */
    get minValuesOffset(): number {
        let majorTicks = (<IIntervalValueScaleCalibratorOptions> this._options).majorTicks;

        return majorTicks != null && majorTicks.minOffset != null
            ? majorTicks.minOffset
            : IntervalValueScaleCalibrator.defaults.majorTicks.minOffset;
    }

    set minValuesOffset(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Values offset must be a value greater or equal to 0.');

        let options = <IIntervalValueScaleCalibratorOptions> this._options;
        (options.majorTicks || (options.majorTicks = {})).minOffset = value;
    }

    /**
     * Gets/Sets number of minor tick marks on the value scale.
     * @name minorTicksCount
     * @type {number}
     * @memberOf IntervalValueScaleCalibrator#
     */
    get minorTicksCount(): number {
        let minorTicks = (<IIntervalValueScaleCalibratorOptions> this._options).minorTicks;

        return minorTicks && minorTicks.count != null
            ? minorTicks.count
            : IntervalValueScaleCalibrator.defaults.minorTicks.count;
    }

    set minorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Tick count must be greater or equal to 0.');

        let options = <IIntervalValueScaleCalibratorOptions> this._options;
        (options.minorTicks || (options.minorTicks = {})).count = value;
    }

    constructor(config?: IIntervalValueScaleCalibratorConfig) {
        super(config);
    }

    /**
     * @inheritdoc
     */
    calibrate(valueScale: ChartPanelValueScale) {
        super.calibrate(valueScale);

        this._calibrateMajorTicks(valueScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    }

    private _getValueStep(minValue: number, maxValue: number, frameHeight: number, textHeight: number): number {
        let valueSpan = maxValue - minValue;

        let step = Math.pow(10,Math.floor(Math.log10(valueSpan)) + 1);
        let divStep = [2, 2.5, 2];

        for(let k = 0; ((valueSpan / step) * textHeight * 2) < frameHeight; k++){
            step /= divStep[k % divStep.length];
        }
        return step
    }

    private _calibrateMajorTicks(valueScale: ChartPanelValueScale) {
        let interval = this.interval;
        if ((valueScale.maxVisibleValue - valueScale.minVisibleValue) <= interval)
            return;

        let theme = valueScale.actualTheme,
            textHeight = HtmlUtil.getFontSize(theme.text),
            minValuesOffset = this.minValuesOffset,
            projection = valueScale.projection,
            minValue = valueScale.minVisibleValue,
            maxValue = valueScale.maxVisibleValue;

        let step = this._getValueStep(
            minValue,
            maxValue,
            valueScale.projectionFrame.height,
            textHeight + minValuesOffset
        );

        let minLabelValue = Math.floor(minValue / step) * step - step;
        let maxLabelValue = Math.ceil(maxValue / step) * step;

        let ticksCount = Math.trunc((maxLabelValue - minLabelValue) / step);

        for(let i = 1; i <= ticksCount; i++) {
            let value = minLabelValue + step * i;
            let y = projection.yByValue(value);
            this.majorTicks.push({
                y: y,
                value: value,
                text: valueScale.formatValue(value)
            });
        }
    }
}

ValueScaleCalibrator.register(IntervalValueScaleCalibrator);
