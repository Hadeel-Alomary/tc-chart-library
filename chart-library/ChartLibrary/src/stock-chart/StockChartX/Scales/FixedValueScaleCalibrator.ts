/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import {IValueScaleCalibratorOptions, ValueScaleCalibrator} from "./ValueScaleCalibrator";
import {JsUtil} from "../Utils/JsUtil";
import {ChartPanelValueScale} from "./ChartPanelValueScale";

interface IFixedValueScaleCalibratorOptions extends IValueScaleCalibratorOptions {
    majorTicks?: {
        count?: number;
    };
    minorTicks?: {
        count?: number;
    };
}

export interface IFixedValueScaleCalibratorDefaults {
    majorTicks: {
        count: number;
    };
    minorTicks: {
        count: number;
    };
}

/**
 * The value scale calibrator which produces fixed number of labels.
 * @constructor FixedValueScaleCalibrator
 * @augments ValueScaleCalibrator
 */
export class FixedValueScaleCalibrator extends ValueScaleCalibrator {
    static defaults: IFixedValueScaleCalibratorDefaults = {
        majorTicks: {
            count: 3
        },
        minorTicks: {
            count: 0
        }
    };

    static get className(): string {
        return 'StockChartX.FixedValueScaleCalibrator';
    }

    /**
     * Gets/Sets number of major tick marks on the value scale.
     * @name majorTicksCount
     * @type {number}
     * @memberOf FixedValueScaleCalibrator#
     */
    get majorTicksCount(): number {
        let majorTicks = (<IFixedValueScaleCalibratorOptions> this._options).majorTicks;

        return majorTicks && majorTicks.count != null
            ? majorTicks.count
            : FixedValueScaleCalibrator.defaults.majorTicks.count;
    }

    set majorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Tick count must be greater or equal to 0.');

        let options = <IFixedValueScaleCalibratorOptions> this._options;
        (options.majorTicks || (options.majorTicks = {})).count = value;
    }

    /**
     * Gets/Sets number of minor tick marks on the value scale.
     * @name minorTicksCount
     * @type {number}
     * @memberOf FixedValueScaleCalibrator#
     */
    get minorTicksCount(): number {
        let minorTicks = (<IFixedValueScaleCalibratorOptions> this._options).minorTicks;

        return minorTicks && minorTicks.count != null
            ? minorTicks.count
            : FixedValueScaleCalibrator.defaults.minorTicks.count;
    }

    set minorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Tick count must be greater or equal to 0.');

        let options = <IFixedValueScaleCalibratorOptions> this._options;
        (options.minorTicks || (options.minorTicks = {})).count = value;
    }

    /**
     * @inheritdoc
     */
    calibrate(valueScale: ChartPanelValueScale) {
        super.calibrate(valueScale);

        this._calibrateMajorTicks(valueScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    }

    private _calibrateMajorTicks(valueScale: ChartPanelValueScale) {
        let padding = valueScale.padding,
            panelPadding = valueScale.chartPanel.chartPanelsContainer.panelPadding,
            topOffset = Math.max(padding.top, panelPadding.top),
            height = valueScale.chartPanel.canvas.height() - Math.max(padding.bottom, panelPadding.bottom) - topOffset,
            projection = valueScale.projection,
            ticksCount = <number> this.majorTicksCount,
            tickHeight = height / (ticksCount - 1);

        for (let i = 0; i < ticksCount; i++) {
            let y = Math.round(topOffset + i * tickHeight),
                value = projection.valueByY(y);

            this.majorTicks.push({
                y: y,
                value: value,
                text: valueScale.formatValue(value)
            });
        }
    }
}

ValueScaleCalibrator.register(FixedValueScaleCalibrator);
