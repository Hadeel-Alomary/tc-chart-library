/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {DateScaleCalibrator, IDateScaleCalibratorConfig, IDateScaleCalibratorOptions} from "./DateScaleCalibrator";
import {CustomDateTimeFormat} from "../Data/CustomDateTimeFormat";
import {JsUtil} from "../Utils/JsUtil";
import {DateScale} from "./DateScale";
import {DummyCanvasContext} from "../Utils/DummyCanvasContext";
import {Chart} from "../Chart";
import {TimeSpan} from "../Data/TimeFrame";

export interface IFixedDateScaleCalibratorConfig extends IDateScaleCalibratorConfig {
    majorTicks?: {
        count?: number;
        format?: IFixedDateLabelsFormat;
    };
    minorTicks?: {
        count?: number;
    };
}

interface IFixedDateScaleCalibratorOptions extends IDateScaleCalibratorOptions {
    majorTicks?: {
        count?: number;
        format?: IFixedDateLabelsFormat
    };
    minorTicks?: {
        count?: number;
    };
}

export interface IFixedDateScaleCalibratorDefaults {
    majorTicks: {
        count: number;
        format?: IFixedDateLabelsFormat;
    };
    minorTicks: {
        count: number;
    };
}

export interface IFixedDateLabelsFormat {
    first?: string;
    last?: string;
    other: string;
}

/**
 * The date scale calibrator which produces fixed number of labels.
 * @constructor FixedDateScaleCalibrator
 * @augments DateScaleCalibrator
 */
export class FixedDateScaleCalibrator extends DateScaleCalibrator {
    static defaults: IFixedDateScaleCalibratorDefaults = {
        majorTicks: {
            count: 3
        },
        minorTicks: {
            count: 0
        }
    };

    static get className(): string {
        return 'StockChartX.FixedDateScaleCalibrator';
    }

    private _formatter = new CustomDateTimeFormat();

    /**
     * Gets/Sets number of major ticks on the date scale.
     * @name majorTicksCount
     * @type {number}
     * @memberOf FixedDateScaleCalibrator#
     */
    get majorTicksCount(): number {
        let majorTicks = (<IFixedDateScaleCalibratorOptions> this._options).majorTicks;

        return majorTicks && majorTicks.count != null
            ? majorTicks.count
            : FixedDateScaleCalibrator.defaults.majorTicks.count;
    }

    set majorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Ticks count must be a positive number.');

        let options = <IFixedDateScaleCalibratorOptions> this._options;
        (options.majorTicks || (options.majorTicks = {})).count = value;
    }

    /**
     * Gets/Sets number of minor ticks on the date scale.
     * @name minorTicksCount
     * @type {number}
     * @memberOf FixedDateScaleCalibrator#
     */
    get minorTicksCount(): number {
        let minorTicks = (<IFixedDateScaleCalibratorOptions> this._options).minorTicks;

        return minorTicks && minorTicks.count != null
            ? minorTicks.count
            : FixedDateScaleCalibrator.defaults.minorTicks.count;
    }

    set minorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Ticks count must be a positive number.');

        let options = <IFixedDateScaleCalibratorOptions> this._options;
        (options.minorTicks || (options.minorTicks = {})).count = value;
    }

    /**
     * Gets/Sets format of different major tick labels (first, last, all others)
     * @name majorTicksFormat
     * @type {Object}
     * @memberOf FixedDateScaleCalibrator#
     * @example
     *  calibrator.majorTicksFormat = {
         *      first: 'YYYY-MM-DD HH:mm',
         *      last: 'YYYY-MM-DD HH:mm',
         *      other: 'HH:mm'
         *  };
     */
    get majorTicksFormat(): IFixedDateLabelsFormat {
        let majorTicks = (<IFixedDateScaleCalibratorOptions> this._options).majorTicks;

        return (majorTicks && majorTicks.format) || FixedDateScaleCalibrator.defaults.majorTicks.format;
    }

    set majorTicksFormat(value: IFixedDateLabelsFormat) {
        let options = (<IFixedDateScaleCalibratorOptions> this._options);

        (options.majorTicks || (options.majorTicks = {})).format = value;
    }

    constructor(config?: IFixedDateScaleCalibratorConfig) {
        super(config);
    }

    /**
     * @inheritdoc
     */
    calibrate(dateScale: DateScale) {
        super.calibrate(dateScale);

        this._calibrateMajorTicks(dateScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    }

    private _calibrateMajorTicks(dateScale: DateScale) {
        let frame = dateScale.projectionFrame,
            textDrawBounds = dateScale._textDrawBounds(),
            minTextX = textDrawBounds.left,
            maxTextX = textDrawBounds.left + textDrawBounds.width,
            projection = dateScale.projection,
            padding = dateScale.chart.chartPanelsContainer.panelPadding,
            startX = frame.left - padding.left,
            endX = frame.right + padding.right,
            dummyContext = DummyCanvasContext,
            ticksCount = this.majorTicksCount,
            tickWidth = (endX - startX) / (ticksCount - 1),
            formats = this.majorTicksFormat;

        if (!formats)
            formats = <IFixedDateLabelsFormat> {};
        if (!formats.other)
            formats.other = FixedDateScaleCalibrator._createAutoFormat(dateScale.chart);

        dummyContext.applyTextTheme(dateScale.actualTheme.text);

        for (let i = 0; i < ticksCount; i++) {
            let x = startX + i * tickWidth;
            this._updateFormatterForLabel(i, i === ticksCount - 1, formats);

            let date = projection.dateByX(x),
                dateString = this._formatter.format(date),
                textWidth = dummyContext.textWidth(dateString),
                textAlign = 'center',
                textX = x;

            if (textX - textWidth / 2 < minTextX) {
                textX = minTextX;
                textAlign = 'left';
            } else if (textX + textWidth / 2 > maxTextX) {
                textX = maxTextX;
                textAlign = 'right';
            }

            this.majorTicks.push({
                x: x,
                textX: x,
                textAlign: textAlign,
                date: date,
                text: dateString,
                major: true
            });
        }
    }

    private _updateFormatterForLabel(labelIndex: number, isLastLabel: boolean, formats: IFixedDateLabelsFormat) {
        let formatString: string;

        if (isLastLabel)
            formatString = formats.last || formats.other;
        else if (labelIndex === 0)
            formatString = formats.first || formats.other;
        else
            formatString = formats.other;

        this._formatter.formatString = formatString;
    }

    private static _createAutoFormat(chart: Chart): string {
        let timeInterval = chart.timeInterval,
            format: string;

        if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR)
            format = "YYYY";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH)
            format = "YYYY MMM";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY)
            format = "YYYY-MM-DD";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE)
            format = "YYYY-MM-DD HH:mm";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND)
            format = "YYYY-MM-DD HH:mm:ss";
        else
            format = "YYYY-MM-DD HH:mm:ss.SSS";

        return format;
    }
}

DateScaleCalibrator.register(FixedDateScaleCalibrator);
