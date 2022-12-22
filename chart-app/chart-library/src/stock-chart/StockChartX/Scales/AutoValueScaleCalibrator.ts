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

export interface IAutoValueScaleCalibratorConfig extends IValueScaleCalibratorConfig {
    majorTicks?: {
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}

interface IAutoValueScaleCalibratorOptions extends IValueScaleCalibratorOptions {
    majorTicks?: {
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}

export interface IAutoValueScaleCalibratorDefaults {
    majorTicks: {
        minOffset: number;
    };
    minorTicks: {
        count: number;
    };
}

/**
 * The value scale calibrator which uses floating value step.
 * @constructor AutoValueScaleCalibrator
 * @augments ValueScaleCalibrator
 */
export class AutoValueScaleCalibrator extends ValueScaleCalibrator {
    static defaults: IAutoValueScaleCalibratorDefaults = {
        majorTicks: {
            minOffset: 10
        },
        minorTicks: {
            count: 0
        }
    };

    static get className(): string {
        return 'StockChartX.AutoValueScaleCalibrator';
    }

    /**
     * The minimum vertical offset between labels.
     * @name minValuesOffset
     * @type {number}
     * @memberOf AutoValueScaleCalibrator#
     */
    get minValuesOffset(): number {
        let majorTicks = (<IAutoValueScaleCalibratorOptions> this._options).majorTicks;

        return majorTicks != null && majorTicks.minOffset != null
            ? majorTicks.minOffset
            : AutoValueScaleCalibrator.defaults.majorTicks.minOffset;
    }

    set minValuesOffset(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Values offset must be a value greater or equal to 0.');

        let options = <IAutoValueScaleCalibratorOptions> this._options;
        (options.majorTicks || (options.majorTicks = {})).minOffset = value;
    }

    /**
     * Gets/Sets number of minor tick marks on the value scale.
     * @name minorTicksCount
     * @type {number}
     * @memberOf AutoValueScaleCalibrator#
     */
    get minorTicksCount(): number {
        let minorTicks = (<IAutoValueScaleCalibratorOptions> this._options).minorTicks;

        return minorTicks && minorTicks.count != null
            ? minorTicks.count
            : AutoValueScaleCalibrator.defaults.minorTicks.count;
    }

    set minorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Tick count must be greater or equal to 0.');

        let options = <IAutoValueScaleCalibratorOptions> this._options;
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
        let theme = valueScale.actualTheme,
            textHeight = HtmlUtil.getFontSize(theme.text),
            minValuesOffset = this.minValuesOffset,
            padding = valueScale.padding,
            panelPadding = valueScale.chartPanel.chartPanelsContainer.panelPadding,
            y = Math.round(Math.max(padding.top, panelPadding.top) + textHeight / 2),
            bottom = valueScale.chartPanel.canvas.height() - padding.bottom - textHeight / 2,
            projection = valueScale.projection;

        while (y < bottom) {
            let value = projection.valueByY(y);

            this.majorTicks.push({
                y: y,
                value: value,
                text: valueScale.formatValue(value)
            });

            y += textHeight + minValuesOffset;
        }
    }
}

ValueScaleCalibrator.register(AutoValueScaleCalibrator);
