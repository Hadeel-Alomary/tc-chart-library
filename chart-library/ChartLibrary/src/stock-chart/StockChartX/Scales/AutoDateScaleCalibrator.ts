/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import {DateScaleCalibrator, IDateScaleCalibratorConfig, IDateScaleCalibratorOptions, IDateScaleMajorTick} from './DateScaleCalibrator';
import {JsUtil} from "../Utils/JsUtil";
import {TimeIntervalDateTimeFormat} from "../Data/TimeIntervalDateTimeFormat";
import {DateScale} from "./DateScale";
import {DummyCanvasContext} from "../Utils/DummyCanvasContext";
import {TimeSpan} from "../Data/TimeFrame";
import {Projection} from "./Projection";

export interface IAutoDateScaleCalibratorConfig extends IDateScaleCalibratorConfig {
    majorTicks?: {
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}

interface IAutoDateScaleCalibratorOptions extends IDateScaleCalibratorOptions {
    majorTicks?: {
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}

export interface IAutoDateScaleCalibratorDefaults {
    majorTicks: {
        minOffset: number;
    };
    minorTicks: {
        count: number;
    };
}

export enum TickType {
    ThreeYears = 1,
    TwoYears,
    OneYear,
    SixMonths,
    FourMonths,
    ThreeMonths,
    OneMonth,
    FifteenDays,
    TenDays,
    FiveDays,
    OneDay,
    HalfTradingDay,
    OneHour,
    ThirteenMinutes,
    FifteenMinutes,
    TenMinutes,
    FiveMinutes,
    OneMinute
}

/**
 * The date scale calibrator which uses floating date format.
 * @constructor AutoDateScaleCalibrator
 * @augments DateScaleCalibrator
 */
export class AutoDateScaleCalibrator extends DateScaleCalibrator {
    static defaults: IAutoDateScaleCalibratorDefaults = {
        majorTicks: {
            minOffset: 30
        },
        minorTicks: {
            count: 0
        }
    };

    static get className(): string {
        return 'StockChartX.AutoDateScaleCalibrator';
    }

    /**
     * Gets/Sets min horizontal offset between date labels.
     * @name minLabelsOffset
     * @type {Number}
     * @memberOf AutoDateScaleCalibrator#
     */
    get minLabelsOffset(): number {
        let majorTicks = (<IAutoDateScaleCalibratorOptions> this._options).majorTicks;

        return majorTicks && majorTicks.minOffset != null
            ? majorTicks.minOffset
            : AutoDateScaleCalibrator.defaults.majorTicks.minOffset;
    }

    set minLabelsOffset(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error("Min labels offset must be greater or equal to 0.");

        let options = <IAutoDateScaleCalibratorOptions> this._options;
        (options.majorTicks || (options.majorTicks = {})).minOffset = value;
    }

    /**
     * Gets/Sets number of minor ticks on the date scale.
     * @name minorTicksCount
     * @type {number}
     * @memberOf AutoDateScaleCalibrator#
     */
    get minorTicksCount(): number {
        let minorTicks = (<IAutoDateScaleCalibratorOptions> this._options).minorTicks;

        return minorTicks && minorTicks.count != null
            ? minorTicks.count
            : AutoDateScaleCalibrator.defaults.minorTicks.count;
    }

    set minorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Ticks count must be a positive number or 0.');

        let options = <IAutoDateScaleCalibratorOptions> this._options;
        (options.minorTicks || (options.minorTicks = {})).count = value;
    }

    private _formatter = new TimeIntervalDateTimeFormat();

    constructor(config?: IAutoDateScaleCalibratorConfig) {
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
        let chart = dateScale.chart,
            projection = dateScale.projection,
            textDrawBounds = dateScale._textDrawBounds(),
            minTextX = textDrawBounds.left,
            maxTextX = textDrawBounds.left + textDrawBounds.width,
            dummyContext = DummyCanvasContext;

        this._formatter.timeInterval = chart.timeInterval;
        this._formatter.locale = chart.locale;

        dummyContext.applyTextTheme(dateScale.actualTheme.text);

        if (!dateScale || !dateScale.getDateDataSeries().values || dateScale.getDateDataSeries().values.length == 0) {
            return;
        }

        let dates = <Date[]>dateScale.getDateDataSeries().values;
        let visibleDates: Date[] = dates.filter((date: Date) => dateScale.projectionFrame.left < dateScale.projection.xByDate(date) - (dateScale.columnWidth / 2) && dateScale.projection.xByDate(date) + (dateScale.columnWidth / 2) < dateScale.projectionFrame.right);
        if (visibleDates.length == 0) {
            //NK Chart is on initialization state or it's too small
            return;
        }

        let charWidth = dummyContext.textWidth('9');
        let textWidth: number = 11 * charWidth; // 99/OCT/9999 count is 11

        let scaleWidth: number = projection.xByDate(visibleDates[visibleDates.length - 1]) - projection.xByDate(visibleDates[0]);
        if (scaleWidth <= textWidth) {
            //NK chart width can not handle any ticks
            return;
        }

        let ticksCount: number = Math.floor(scaleWidth / (textWidth + this.minLabelsOffset));
        let marketTradingMinutesCount: number = this.getMarketTradingMinutesCount(dateScale);
        let timeRangeAsMinutes: number = this.getTimeRangeAsMinutes(visibleDates, marketTradingMinutesCount);
        let tickType: TickType = this.getTickType(marketTradingMinutesCount, timeRangeAsMinutes / ticksCount);

        let prevDate: Date = visibleDates[0];
        for (let date of visibleDates) {
            if (!this.passTickTypeCondition(tickType, prevDate, date, marketTradingMinutesCount)) {
                continue;
            }
            let x: number = projection.xByDate(date);
            let textStartX: number = x - (textWidth / 2);
            let textX: number = x;
            let textAlign: string = "center";
            if (textStartX < minTextX) {
                textAlign = "left";
                textStartX = minTextX;
                textX = minTextX;
            } else if (maxTextX < textStartX + textWidth) {
                textAlign = "right";
                textStartX = maxTextX - textWidth;
                textX = maxTextX;
            }

            this.majorTicks.push({
                x: x,
                textX: textX,
                textAlign: textAlign,
                date: date,
                text: this.getFormattedDateAsString(tickType, prevDate, date),
                major: this.isMajorTick(tickType, prevDate, date)
            });
            prevDate = date;
        }

        this.removeOverlappingTicks(charWidth);
        this.addFirstTickIfNeeded(visibleDates, tickType, projection, minTextX);
    }

    private getTimeRangeAsMinutes(visibleDates: Date[], marketTradingMinutesCount: number): number {
        let interval: number = 0;
        if (TimeSpan.MILLISECONDS_IN_YEAR <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 30 * 12;
        } else if (TimeSpan.MILLISECONDS_IN_MONTH * 3 <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 30 * 3;
        } else if (TimeSpan.MILLISECONDS_IN_MONTH <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 30;
        } else if (TimeSpan.MILLISECONDS_IN_WEEK <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 7;
        } else if (TimeSpan.MILLISECONDS_IN_DAY <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount;
        } else if (TimeSpan.MILLISECONDS_IN_HOUR <= this._formatter.timeInterval) {
            interval = 60;
        } else {
            interval = this._formatter.timeInterval / TimeSpan.MILLISECONDS_IN_MINUTE;
        }

        return interval * visibleDates.length;
    }

    private getTickType(marketTradingMinutesCount: number, tickDurationInMinutes: number): TickType {
        let tickType: TickType;

        let dayAsMinutes: number = marketTradingMinutesCount;
        let monthAsMinutes: number = 30 * dayAsMinutes;
        let yearAsMinutes: number = 12 * monthAsMinutes;

        if (0 < Math.round(tickDurationInMinutes / (yearAsMinutes * 3))) {
            tickType = TickType.ThreeYears;
        } else if (0 < Math.round(tickDurationInMinutes / (yearAsMinutes * 2))) {
            tickType = TickType.TwoYears;
        } else if (0 < Math.round(tickDurationInMinutes / yearAsMinutes)) {
            tickType = TickType.OneYear;
        } else if (0 < Math.round(tickDurationInMinutes / (monthAsMinutes * 6))) {
            tickType = TickType.SixMonths;
        } else if (0 < Math.round(tickDurationInMinutes / (monthAsMinutes * 4))) {
            tickType = TickType.FourMonths;
        } else if (0 < Math.round(tickDurationInMinutes / (monthAsMinutes * 3))) {
            tickType = TickType.ThreeMonths;
        } else if (0 < Math.round(tickDurationInMinutes / monthAsMinutes)) {
            tickType = TickType.OneMonth;
        } else if (0 < Math.round(tickDurationInMinutes / (dayAsMinutes * 15))) {
            tickType = TickType.FifteenDays;
        } else if (0 < Math.round(tickDurationInMinutes / (dayAsMinutes * 10))) {
            tickType = TickType.TenDays;
        } else if (0 < Math.round(tickDurationInMinutes / (dayAsMinutes * 5))) {
            tickType = TickType.FiveDays;
        } else if (0 < Math.round(tickDurationInMinutes / dayAsMinutes)) {
            tickType = TickType.OneDay;
        } else if (0 < Math.round(tickDurationInMinutes / (marketTradingMinutesCount / 2))) {
            tickType = TickType.HalfTradingDay;
        } else if (0 < Math.round(tickDurationInMinutes / 60)) {
            tickType = TickType.OneHour;
        } else if (0 < Math.round(tickDurationInMinutes / 30)) {
            tickType = TickType.ThirteenMinutes;
        } else if (0 < Math.round(tickDurationInMinutes / 15)) {
            tickType = TickType.FifteenMinutes;
        } else if (0 < Math.round(tickDurationInMinutes / 10)) {
            tickType = TickType.TenMinutes;
        } else if (0 < Math.round(tickDurationInMinutes / 5)) {
            tickType = TickType.FiveMinutes;
        } else {
            tickType = TickType.OneMinute;
        }
        return tickType;
    }

    private passTickTypeCondition(tickType: TickType, prevDate: Date, date: Date, marketTradingMinutesCount: number): boolean {
        switch (tickType) {
            case TickType.ThreeYears:
                return 3 <= date.getFullYear() - prevDate.getFullYear();
            case TickType.TwoYears:
                return 2 <= date.getFullYear() - prevDate.getFullYear();
            case TickType.OneYear:
                return date.getFullYear() != prevDate.getFullYear();
            case TickType.SixMonths:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                if (date.getMonth() != prevDate.getMonth()) {
                    return date.getMonth() + 1 == 6 || 6 < date.getMonth() - prevDate.getMonth();
                }
                return false;
            case TickType.FourMonths:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                if (date.getMonth() != prevDate.getMonth()) {
                    return [5, 9].indexOf(date.getMonth() + 1) != -1 || 4 < date.getMonth() - prevDate.getMonth();
                }
                return false;
            case TickType.ThreeMonths:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                if (date.getMonth() != prevDate.getMonth()) {
                    return [4, 7, 10].indexOf(date.getMonth() + 1) != -1 || 3 < date.getMonth() - prevDate.getMonth();
                }
                return false;
            case TickType.OneMonth:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                return date.getMonth() != prevDate.getMonth();
            case TickType.FifteenDays:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }

                if (date.getDate() != prevDate.getDate()) {
                    return date.getDate() == 15 || 15 < date.getDate() - prevDate.getDate();
                }
                return false;
            case TickType.TenDays:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }

                if (date.getDate() != prevDate.getDate()) {
                    return [10, 20].indexOf(date.getDate()) != -1 || 10 < date.getDate() - prevDate.getDate();
                }
                return false;
            case TickType.FiveDays:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }
                if (date.getDate() != prevDate.getDate()) {
                    return [5, 10, 15, 20, 25].indexOf(date.getDate()) != -1 || 5 < date.getDate() - prevDate.getDate();
                }
                return false;
            case TickType.OneDay:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }
                return date.getDate() != prevDate.getDate();
            case TickType.HalfTradingDay:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                return (marketTradingMinutesCount / 2) < moment(date).diff(moment(prevDate), 'minutes');
            case TickType.OneHour:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                return date.getHours() != prevDate.getHours();
            case TickType.ThirteenMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 30].indexOf(date.getMinutes()) != -1 || 30 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.FifteenMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 15, 30, 45].indexOf(date.getMinutes()) != -1 || 15 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.TenMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 10, 20, 30, 40, 50].indexOf(date.getMinutes()) != -1 || 10 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.FiveMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].indexOf(date.getMinutes()) != -1 || 5 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.OneMinute:
                return true;
            default:
                throw new Error('Unknown date tick type: ' + tickType);
        }
    }

    private getFormattedDateAsString(tickType: TickType, prevDate: Date, date: Date) {
        let differentYears: boolean = date.getFullYear() != prevDate.getFullYear();
        let differentMonths: boolean = date.getMonth() != prevDate.getMonth();
        let differentDays: boolean = date.getDate() != prevDate.getDate();
        switch (tickType) {
            case TickType.ThreeYears:
            case TickType.TwoYears:
            case TickType.OneYear:
                return date.getFullYear().toString();
            case TickType.SixMonths:
            case TickType.FourMonths:
            case TickType.ThreeMonths:
            case TickType.OneMonth:
                return differentYears ? date.getFullYear().toString() : moment(date).format("MMMM").substring(0, 3);
            case TickType.FifteenDays:
            case TickType.TenDays:
            case TickType.FiveDays:
            case TickType.OneDay:
                if (differentMonths || differentYears) {
                    return moment(date).format("MMMM").substring(0, 3);
                }
                return date.getDate() < 10 ? "0" + date.getDate().toString() + "/" + (date.getMonth() + 1) : date.getDate().toString() + "/" + (date.getMonth() + 1);
            case TickType.HalfTradingDay:
            case TickType.OneHour:
            case TickType.ThirteenMinutes:
            case TickType.FifteenMinutes:
            case TickType.TenMinutes:
            case TickType.FiveMinutes:
            case TickType.OneMinute:
                let dayAsString: string = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();

                if (differentMonths || differentYears) {
                    return moment(date).format("MMMM").substring(0, 3);
                }
                let hourAsString: string = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
                let minutesAsString: string = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();

                if (differentDays) {
                    return dayAsString + "/" + (date.getMonth() + 1);
                }
                return hourAsString + ":" + minutesAsString;
            default:
                throw new Error('Unknown date tick type: ' + tickType);
        }
    }

    private addFirstTickIfNeeded(visibleDates: Date[], tickType: TickType, projection: Projection, minTextX: number) {
        let firstVisibleDate: Date = visibleDates[0];
        let firstVisibleDateAsString = this.getFormattedDateAsString(tickType, firstVisibleDate, firstVisibleDate);
        let canAddFirstRecord: boolean = this.majorTicks.length == 0;//NK if there is no major ticks, add the first tick

        if (!canAddFirstRecord) {
            let firstMajorTick = this.majorTicks[0];
            if (minTextX <= firstMajorTick.textX - DummyCanvasContext.textWidth(firstMajorTick.text) - this.minLabelsOffset) {//NK there is enough space to add first tick
                if (firstVisibleDateAsString != firstMajorTick.text) {//NK do not add first tick unless it's text is different from the the next tick
                    canAddFirstRecord = true;
                }
            }
        }

        if (canAddFirstRecord) {
            let x = projection.xByDate(firstVisibleDate);
            this.majorTicks.unshift({
                x: x,
                textX: x,
                textAlign: x - (DummyCanvasContext.textWidth(firstVisibleDateAsString) / 2) <= minTextX ? "left" : "center",
                date: firstVisibleDate,
                text: firstVisibleDateAsString,
                major: false
            });
        }
    }

    private removeOverlappingTicks(charWidth: number) {
        let notOverlappingTicks: IDateScaleMajorTick[] = [];
        let lastTick: IDateScaleMajorTick = null;

        for(let i = 0; i < this.majorTicks.length; i++){
            let tick = this.majorTicks[i];
            if (lastTick == null) {
                lastTick = tick;
                continue;
            }

            let lastTickOverlappingWithCurrentTick: boolean = !(lastTick.textX + (lastTick.text.length * charWidth) + (this.minLabelsOffset / 4) < tick.textX);
            if (!lastTickOverlappingWithCurrentTick) {
                notOverlappingTicks.push(lastTick);
                lastTick = tick;
                continue;
            }

            if (!lastTick.major && tick.major) {
                lastTick = tick;
            }
        }

        if(lastTick != null) {
            notOverlappingTicks.push(lastTick);
        }
        this._majorTicks = notOverlappingTicks;
    }

    private getMarketTradingMinutesCount(dateScale: DateScale): number {
        return dateScale.chart.marketTradingMinutesCount;
    }

    private isMajorTick(tickType: TickType, prevDate: Date, date: Date): boolean {
        switch (tickType) {
            case TickType.ThreeYears:
            case TickType.TwoYears:
            case TickType.OneYear:
                return false;
            case TickType.SixMonths:
            case TickType.FourMonths:
            case TickType.ThreeMonths:
            case TickType.OneMonth:
                return date.getFullYear() != prevDate.getFullYear();
            case TickType.FifteenDays:
            case TickType.TenDays:
            case TickType.FiveDays:
            case TickType.OneDay:
                return date.getMonth() != prevDate.getMonth();
            case TickType.HalfTradingDay:
            case TickType.OneHour:
            case TickType.ThirteenMinutes:
            case TickType.FifteenMinutes:
            case TickType.TenMinutes:
            case TickType.FiveMinutes:
            case TickType.OneMinute:
                return date.getDate() != prevDate.getDate();
            default:
                throw new Error('Unknown date tick type: ' + tickType);
        }
    }
}

DateScaleCalibrator.register(AutoDateScaleCalibrator);
