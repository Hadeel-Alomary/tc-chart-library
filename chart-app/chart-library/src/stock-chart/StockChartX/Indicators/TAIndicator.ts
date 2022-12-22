/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {IIndicatorConfig, IIndicatorOptions, Indicator, PlotItem} from './Indicator';

import {
    AccumulativeSwingIndex,
    AccumulationDistribution,
    Aroon,
    AroonOscillator,
    AverageTrueRange,
    BollingerBands,
    BullishBarishIndicator,
    CenterOfGravity,
    ChaikinMoneyFlow,
    ChaikinVolatility,
    ChandeForecastOscillator,
    ChandeMomentumOscillator,
    CommodityChannelIndex,
    ComparativeRelativeStrength,
    Const,
    CoppockCurve,
    DetrendedPriceOscillator,
    DoubleExponentialMovingAverage,
    DirectionalMovementAverage,
    DirectionalMovementIndex,
    DirectionalDivergenceIndex,
    AverageDirectionalIndex,
    FastStochastic,
    PSLandisReversal,
    DonchianChannels,
    EaseOfMovement,
    EhlerFisherTransform,
    ElderForceIndex,
    ElderRay,
    ElderThermometer,
    ExponentialMovingAverage,
    TripleExponentialMovingAverage,
    HullMovingAverage,
    FractalChaosBands,
    FractalChaosOscillator,
    GopalakrishnanRangeIndex,
    HHV,
    HighLowBands,
    HighMinusLow,
    HistoricalVolatility,
    IntradayMomentumIndex,
    KeltnerChannel,
    KlingerVolumeOscillator,
    LinearRegressionForecast,
    LinearRegressionIntercept,
    LinearRegressionRSquared,
    LinearRegressionSlope,
    LLV,
    MACD,
    MACDHistogram,
    MarketFacilitationIndex,
    MassIndex,
    MaximumValue,
    MedianPrice,
    MomentumOscillator,
    MoneyFlowIndex,
    MovingAverageEnvelope,
    NegativeVolumeIndex,
    OnBalanceVolume,
    ParabolicSAR,
    PerformanceIndex,
    PositiveVolumeIndex,
    PrettyGoodOscillator,
    PriceOscillator,
    PriceROC,
    PriceVolumeTrend,
    PrimeNumberBands,
    PrimeNumberOscillator,
    PsychologicalLine,
    QStick,
    RainbowOscillator,
    RandomWalkIndex,
    RAVI,
    RelativeStrengthIndex,
    SchaffTrendCycle,
    SimpleMovingAverage,
    StandardDeviation,
    STARC,
    StochasticMomentumIndex,
    StochasticOscillator,
    StochasticRSI,
    SwingIndex,
    TimeSeriesForecast,
    TimeSeriesMovingAverage,
    TradeVolumeIndex,
    TriangularMovingAverage,
    TRIX,
    TrueRange,
    TwiggsMoneyFlow,
    TypicalPrice,
    UltimateOscillator,
    Unknown,
    VariableMovingAverage,
    VerticalHorizontalFilter,
    VIDYA,
    VolatilityRatio,
    VolumeChange,
    VolumeIndicator,
    VolumeMACD,
    VolumeOscillator,
    VolumeProfilerSessionVolume,
    VolumeProfilerVisibleRange,
    VolumeROC,
    WeightedClose,
    WeightedMovingAverage,
    WellesWilderSmoothing,
    WilliamsAccumulationDistribution,
    WilliamsPctR,
    ZigZag,
    ZigZagLabel,
    VolumeWeightedAveragePrice
} from '../../TASdk/TASdk';
import {IndicatorsDefaultSettings} from './IndicatorsDefaultSettings';
import {HorizontalLine} from './HorizontalLine';
import {Bands} from '../../TASdk/Bands';
import {General} from '../../TASdk/General';
import {Index} from '../../TASdk/Index';
import {Oscillator} from '../../TASdk/Oscillator';
import {LinearRegression} from '../../TASdk/LinearRegression';
import {SupportAndResistance} from '../../TASdk/SupportAndResistance';
import {Recordset} from '../../TASdk/Recordset';
import {MovingAverage} from '../../TASdk/MovingAverage';
import {Field} from '../../TASdk/Field';
import {DataSeries, DataSeriesSuffix} from '../Data/DataSeries';
import {HistogramPlot} from '../Plots/HistogramPlot';
import {IPoint} from '../Graphics/ChartPoint';
import {IndicatorField, IndicatorParam, IndicatorPlotTypes} from './IndicatorConst';
import {Tc} from '../../../utils';
import {IndicatorHelper} from './IndicatorHelper';
import {TAIndicatorParameters} from './TAIndicatorParameters';
import {Chart} from '../Chart';
import {ThemeType} from '../ThemeType';

export interface ITAIndicatorConfig extends IIndicatorConfig {
    taIndicator?: number;
}

interface ITAIndicatorOptions extends IIndicatorOptions {
    taIndicator: number;
}

/**
 * Represent chart TA indicator.
 * @param {Object} config The configuration object.
 * @param {Chart} [config.chart] The parent chart.
 * @param {Number} config.indicatorTypeId The TA indicator number.
 * @param {Object} [config.parameters] The TA indicator parameters.
 * @param {Number} [config.panelHeightRatio] The height ratio of the chart panel.
 * @param {Boolean} [config.showValueMarkers] The flag that indicates whether value markers are visible.
 * @param {Boolean} [config.showValuesInTitle] The flag that indicates whether values are visible in the title.
 * @constructor TAIndicator
 * @augments Indicator
 * @example
 *  // Create simple moving average indicator.
 *  var sma1 = new TAIndicator({indicatorTypeId: SimpleMovingAverage});
 *
 *  // Create simple moving average indicator with custom properties.
 *  var sma2 = new TAIndicator({
     *      indicatorTypeId: SimpleMovingAverage,
     *      parameters: {
     *          IndicatorParam.SOURCE: HIGH_DATA_SERIES_SUFFIX,
     *          IndicatorParam.PERIODS: 21,
     *          IndicatorParam.LINE_COLOR: 'green'
     *          IndicatorParam.LINE_WIDTH: 3,
     *          IndicatorParam.LINE_STYLE: LineStyle.DASH
     *      }
     *  });
 */
export class TAIndicator extends Indicator {
    /**
     * TA indicator number.
     * @name indicatorTypeId
     * @type {number}
     * @readonly
     * @memberOf TAIndicator#
     */
    get indicatorTypeId(): number {
        return (<ITAIndicatorOptions> this._options).taIndicator;
    }

    constructor(config: ITAIndicatorConfig) {
        super(config);

        (<ITAIndicatorOptions> this._options).taIndicator = config.taIndicator != null ? config.taIndicator : Unknown;
    }

    _initIndicator(config: ITAIndicatorConfig) {
        super._initIndicator(config);
        let fieldName = IndicatorField;

        (<ITAIndicatorOptions> this._options).taIndicator = config.taIndicator != null ? config.taIndicator : Unknown;

        switch (this.indicatorTypeId) {
            case HighMinusLow:
            case VolumeROC:
            case PriceROC:
            case StandardDeviation:
            case MoneyFlowIndex:
            case TradeVolumeIndex:
            case SwingIndex:
            case AccumulativeSwingIndex:
            case RelativeStrengthIndex:
            case ComparativeRelativeStrength:
            case StochasticRSI:
            case PriceVolumeTrend:
            case PositiveVolumeIndex:
            case NegativeVolumeIndex:
            case PerformanceIndex:
            case OnBalanceVolume:
            case MassIndex:
            case CommodityChannelIndex:
            case ChaikinMoneyFlow:
            case HistoricalVolatility:
            case ElderThermometer:
            case MarketFacilitationIndex:
            case QStick:
            case GopalakrishnanRangeIndex:
            case IntradayMomentumIndex:
            case RAVI:
            case TwiggsMoneyFlow:
            case ChandeMomentumOscillator:
            case MomentumOscillator:
            case TRIX:
            case VerticalHorizontalFilter:
            case UltimateOscillator:
            case AverageTrueRange:
            case FractalChaosOscillator:
            case PrettyGoodOscillator:
            case WilliamsPctR:
            case WilliamsAccumulationDistribution:
            case AccumulationDistribution:
            case VolumeOscillator:
            case VolumeChange:
            case ChaikinVolatility:
            case VolatilityRatio:
            case PriceOscillator:
            case EaseOfMovement:
            case DetrendedPriceOscillator:
            case TrueRange:
            case RainbowOscillator:
            case PrimeNumberOscillator:
            case SchaffTrendCycle:
            case CenterOfGravity:
            case ChandeForecastOscillator:
            case CoppockCurve:
            case MaximumValue:
            case PsychologicalLine:
                this._fieldNames = [fieldName.INDICATOR];
                break;
            case MedianPrice:
            case TypicalPrice:
            case WeightedClose:
            case HHV:
            case LLV:
            case TimeSeriesForecast:
            case ExponentialMovingAverage:
            case DoubleExponentialMovingAverage:
            case TripleExponentialMovingAverage:
            case HullMovingAverage:
            case SimpleMovingAverage:
            case TimeSeriesMovingAverage:
            case VariableMovingAverage:
            case TriangularMovingAverage:
            case WeightedMovingAverage:
            case WellesWilderSmoothing:
            case VIDYA:
            case ParabolicSAR:
            case VolumeWeightedAveragePrice:
            case BullishBarishIndicator:
                this._isOverlay = true;
                this._fieldNames = [fieldName.INDICATOR];
                break;
            // Bands
            case BollingerBands:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.BOLLINGER_BAND_TOP,
                    fieldName.BOLLINGER_BAND_MEDIAN,
                    fieldName.BOLLINGER_BAND_BOTTOM,
                    fieldName.INDICATOR_FILL
                ];
                break;
            case MovingAverageEnvelope:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.ENVELOPE_TOP,
                    fieldName.ENVELOPE_MEDIAN,
                    fieldName.ENVELOPE_BOTTOM
                ];
                break;
            case HighLowBands:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.HIGH_LOW_BANDS_TOP,
                    fieldName.HIGH_LOW_BANDS_MEDIAN,
                    fieldName.HIGH_LOW_BANDS_BOTTOM
                ];
                break;
            case FractalChaosBands:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.FRACTAL_HIGH,
                    fieldName.FRACTAL_LOW
                ];
                break;
            case PrimeNumberBands:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.PRIME_BANDS_TOP,
                    fieldName.PRIME_BANDS_BOTTOM
                ];
                break;
            case KeltnerChannel:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.KELTNER_CHANNEL_TOP,
                    fieldName.KELTNER_CHANNEL_MEDIAN,
                    fieldName.KELTNER_CHANNEL_BOTTOM
                ];
                break;
            case STARC:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.STARC_CHANNEL_TOP,
                    fieldName.STARC_CHANNEL_MEDIAN,
                    fieldName.STARC_CHANNEL_BOTTOM
                ];
                break;
            case StochasticMomentumIndex:
                this._fieldNames = [
                    fieldName.PCT_D,
                    fieldName.PCT_K
                ];
                break;
            case ElderForceIndex:
                this._fieldNames = [
                    fieldName.INDICATOR,
                    fieldName.INDICATOR_SIGNAL
                ];
                break;
            case RandomWalkIndex:
                this._fieldNames = [
                    fieldName.INDICATOR_HIGH,
                    fieldName.INDICATOR_LOW
                ];
                break;
            case DirectionalMovementAverage:
                this._fieldNames = [
                    fieldName.Directional_Movement_Average_DDD,
                    fieldName.Directional_Movement_Average_AMA
                ]
                break;
            case DirectionalDivergenceIndex:
                this._fieldNames = [
                    fieldName.DIRECTIONAL_DIVERGENCE_INDEX_DDI,
                    fieldName.DIRECTIONAL_DIVERGENCE_INDEX_ADDI,
                    fieldName.DIRECTIONAL_DIVERGENCE_INDEX_AD
                ]
                break;
            case DirectionalMovementIndex:
                this._fieldNames = [
                    fieldName.DIRECTIONAL_MOVEMENT_INDEX_PDI,
                    fieldName.DIRECTIONAL_MOVEMENT_INDEX_MDI,
                    fieldName.ADX,
                    fieldName.DIRECTIONAL_MOVEMENT_INDEX_ADXR
                ]
                break;
            // Regression
            case LinearRegressionRSquared:
                this._fieldNames = [fieldName.RSQUARED];
                break;
            case LinearRegressionForecast:
                this._isOverlay = true;
                this._fieldNames = [fieldName.FORECAST];
                break;
            case LinearRegressionSlope:
                this._fieldNames = [fieldName.SLOPE];
                break;
            case LinearRegressionIntercept:
                this._isOverlay = true;
                this._fieldNames = [fieldName.INTERCEPT];
                break;
            case StochasticOscillator:
                this._fieldNames = [
                    fieldName.PCT_K,
                    fieldName.PCT_D
                ];
                break;
            case FastStochastic:
                this._fieldNames = [
                    fieldName.PCT_K,
                    fieldName.PCT_D
                ];
                break;
            case PSLandisReversal:
                this._fieldNames = [fieldName.PS_LANDIS_REVERSAL];
                break;
            case MACD:
                this._fieldNames = [
                    fieldName.INDICATOR,
                    fieldName.INDICATORSIGNAL,
                    fieldName.INDICATOR_HISTOGRAM
                ];
                break;
            case VolumeMACD:
                this._fieldNames = [
                    fieldName.INDICATOR,
                    fieldName.INDICATOR_DEA,
                    fieldName.INDICATOR_MACDH
                ];
                break;
            case MACDHistogram:
                this._fieldNames = [fieldName.INDICATOR_HISTOGRAM];
                break;
            case AverageDirectionalIndex:
                this._fieldNames = [
                    fieldName.ADX,
                    fieldName.DI_PLUS,
                    fieldName.DI_MINUS
                ];
                break;
            case Aroon:
                this._fieldNames = [
                    fieldName.AROON_UP,
                    fieldName.AROON_DOWN
                ];
                break;
            case AroonOscillator:
                this._fieldNames = [fieldName.AROON_OSCILLATOR];
                break;
            case ElderRay:
                this._fieldNames = [
                    fieldName.BULL_POWER,
                    fieldName.BEAR_POWER
                ];
                break;
            case EhlerFisherTransform:
                this._fieldNames = [
                    fieldName.INDICATOR,
                    fieldName.TRIGGER
                ];
                break;
            case KlingerVolumeOscillator:
                this._fieldNames = [
                    fieldName.INDICATOR,
                    fieldName.INDICATORSIGNAL
                ];
                break;
            case VolumeIndicator:
                this._fieldNames = [fieldName.VOLUME];
                break;
            case ZigZag:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.INDICATOR
                ];
                break;
            case ZigZagLabel:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.INDICATOR
                ];
                break;
            case DonchianChannels:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.DONCHIAN_CHANNEL_TOP,
                    fieldName.DONCHIAN_CHANNEL_MEDIAN,
                    fieldName.DONCHIAN_CHANNEL_BOTTOM,
                    fieldName.INDICATOR_FILL
                ];
                break;
            case VolumeProfilerSessionVolume:
            case VolumeProfilerVisibleRange:
                this._isOverlay = true;
                this._fieldNames = [
                    fieldName.INDICATOR
                ];
                break;
            default:
                throw new Error("Unknown indicator: " + this.indicatorTypeId);
        }
    }

    protected _initIndicatorParameters(config: ITAIndicatorConfig) {
        let defaultSettings = IndicatorsDefaultSettings.getIndicatorDefaultSettings(this.chart.getThemeType(), config.taIndicator);
        let parameters = $.extend({}, defaultSettings.parameters, config.parameters);
        for (let prop in parameters) {
            if (parameters.hasOwnProperty(prop)) {
                // noinspection JSUnfilteredForInLoop
                this.setParameterValue(prop, parameters[prop]);
            }
        }

        //Abu5, on load indicator settings, if default source is custom indicator, then check if that indicator is exist
        // this is used to old version where the user can save default indicators with custom indicator
        if(this.hasParameter(IndicatorParam.SOURCE)) {
            let source: string =  this.parameters[IndicatorParam.SOURCE].toString();
            let isCustomSource: boolean = source.includes('_');
            if(isCustomSource) {
                let customSourceIndicatorId = source.split('_')[0];
                let customSourceIndicator = this.chart.getIndicatorById(customSourceIndicatorId);
                if(!customSourceIndicator) {
                    this.setSelectedSource(this._getOverlayIndicatorDefaultSource());
                } else {
                    this.setSelectedSource(source);
                }
            }
        }
    }

    protected _initIndicatorHorizontalLines(config: ITAIndicatorConfig) {
        let defaultSettings = IndicatorsDefaultSettings.getIndicatorDefaultSettings(this.chart.getThemeType(), config.taIndicator);
        let horizontalLines = config.horizontalLines || defaultSettings.horizontalLines;
        for (let horizontalLine of horizontalLines) {
            this.addHorizontalLine(new HorizontalLine(horizontalLine.options));
        }
    }

    protected _initPanel() {
        if (this.indicatorTypeId === VolumeIndicator)
            this._panel.valueScale.formatter.setDecimalDigits(0);
    }

    isValidAlertParameters(): boolean {
        Tc.assert(IndicatorHelper.isAlertable(this.indicatorTypeId), 'cannot validate the parameters of non-alertable indicator: ' + this.indicatorTypeId);

        let maType = this.getParameterValue(IndicatorParam.MA_TYPE);
        return !maType || maType == Const.simpleMovingAverage;
    }

    getAlertParameters() {
        let parameters = this.getParameters();
        switch (this.indicatorTypeId) {
            case BollingerBands:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods, parameters.standardDeviations];
            case PriceOscillator:
                return [`$${parameters.source.toUpperCase()}$`, parameters.longCycle, parameters.shortCycle];
            case StandardDeviation:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods, parameters.standardDeviations];
            case MovingAverageEnvelope:
                return [parameters.periods, parameters.shift];
            case MACD:
                return [parameters.longCycle, parameters.shortCycle, parameters.signalPeriods];
            case DetrendedPriceOscillator:
                return [parameters.periods];
            case StochasticOscillator:
                return [parameters.kPercentSmoothing, parameters.kPercentPeriods, parameters.dPercentPeriods];
            case FastStochastic:
                return [parameters.kPercentPeriods, parameters.dPercentPeriods];
            case PSLandisReversal:
                return [];
            case EaseOfMovement:
                return [parameters.periods];
            case RelativeStrengthIndex:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods];
            case ExponentialMovingAverage:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods];
            case DoubleExponentialMovingAverage:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods];
            case MomentumOscillator:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods];
            case OnBalanceVolume:
                return [`$${parameters.source.toUpperCase()}$`];
            case SimpleMovingAverage:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods];
            case WeightedMovingAverage:
                return [`$${parameters.source.toUpperCase()}$`, parameters.periods];
            case TRIX:
                return [parameters.periods];
            case KeltnerChannel:
                return [parameters.periods, parameters.shift];
            case PriceROC:
                return [parameters.periods];
            case MoneyFlowIndex:
                return [parameters.periods];
            case MassIndex:
                return [parameters.periods];
            case ChaikinMoneyFlow:
                return [parameters.periods];
            case CommodityChannelIndex:
                return [parameters.periods];
            case IntradayMomentumIndex:
                return [parameters.periods];
            case WilliamsPctR:
                return [parameters.periods];
            case ParabolicSAR:
                // MA for ParabolicSAR, backend (for alerts) expects parameters to be as percentages, so we multiply by 100
                return [100 * parameters.minAf, 100 * parameters.maxAf];
            case AverageTrueRange:
                return [parameters.periods];
            case Aroon:
                return [parameters.periods];
            case AroonOscillator:
                return [parameters.periods];
            case VolumeIndicator:
                return [];
            case DonchianChannels:
                return [parameters.periods];
            default:
                Tc.error('Alert parameters is not handled for indicator: ' + this.indicatorTypeId);
        }
    }

    getParameters(): TAIndicatorParameters {
        let sourceSuffix = <string> this.getParameterValue(IndicatorParam.SOURCE),
            periods = this.getParameterValue(IndicatorParam.PERIODS) as number,
            maType = this.getParameterValue(IndicatorParam.MA_TYPE) as number;

        let sourceField = this.customSourceIndicatorId ? this._getCustomSourceField() : this._createField(sourceSuffix);

        let taIndicatorParameters:TAIndicatorParameters = {};

        switch (this.indicatorTypeId) {
            case BollingerBands: {
                let stdev = this.getParameterValue(IndicatorParam.STANDARD_DEVIATIONS) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.standardDeviations = stdev;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case MovingAverageEnvelope: {
                let shift = this.getParameterValue(IndicatorParam.SHIFT) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.shift = shift;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case HighLowBands:
                taIndicatorParameters.periods = periods;
                break;
            case FractalChaosBands:
                taIndicatorParameters.periods = periods;
                break;
            case KeltnerChannel: {
                let shift = this.getParameterValue(IndicatorParam.SHIFT) as number;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.shift = shift;
                break;
            }
            case STARC: {
                let shift = this.getParameterValue(IndicatorParam.SHIFT) as number;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.shift = shift;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case VolumeROC:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case PriceROC:
                taIndicatorParameters.periods = periods;
                break;
            case StandardDeviation: {
                let stdev = this.getParameterValue(IndicatorParam.STANDARD_DEVIATIONS) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.standardDeviations = stdev;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case HHV:
                taIndicatorParameters.periods = periods;
                break;
            case LLV:
                taIndicatorParameters.periods = periods;
                break;
            case MaximumValue:
                taIndicatorParameters.periods = periods;
                break;
            case MoneyFlowIndex:
                taIndicatorParameters.periods = periods;
                break;
            case TradeVolumeIndex: {
                let minTick = this.getParameterValue(IndicatorParam.MIN_TICK) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.minTick = minTick;
                break;
            }
            case SwingIndex: {
                let limitMove = this.getParameterValue(IndicatorParam.LIMIT_MOVE) as number;
                taIndicatorParameters.limitMove = limitMove;
                break;
            }
            case AccumulativeSwingIndex: {
                let limitMove = this.getParameterValue(IndicatorParam.LIMIT_MOVE) as number;
                taIndicatorParameters.limitMove = limitMove;
                break;
            }
            case RelativeStrengthIndex:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case ComparativeRelativeStrength: {
                let source2Field = this._createField(this.getParameterValue(IndicatorParam.SOURCE2) as string);
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.source2 = source2Field.name;
                break;
            }
            case StochasticRSI: {
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods
                break;
            }
            case PriceVolumeTrend:
                taIndicatorParameters.source = sourceField.name;
                break;
            case PositiveVolumeIndex:
                taIndicatorParameters.source = sourceField.name;
                break;
            case NegativeVolumeIndex:
                taIndicatorParameters.source = sourceField.name;
                break;
            case PerformanceIndex:
                taIndicatorParameters.source = sourceField.name;
                break;
            case OnBalanceVolume:
                taIndicatorParameters.source = sourceField.name;
                break;
            case MassIndex:
                taIndicatorParameters.periods = periods;
                break;
            case ChaikinMoneyFlow:
                taIndicatorParameters.periods = periods;
                break;
            case CommodityChannelIndex:
                taIndicatorParameters.periods = periods;
                break;
            case StochasticMomentumIndex: {
                let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS) as number,
                    kSmoothing = this.getParameterValue(IndicatorParam.PCT_K_SMOOTHING) as number,
                    kDoubleSmoothing = this.getParameterValue(IndicatorParam.PCT_K_DOUBLE_SMOOTHING) as number,
                    dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS) as number,
                    dMaType = this.getParameterValue(IndicatorParam.PCT_D_MA_TYPE) as number;
                taIndicatorParameters.kPercentPeriods = kPeriods;
                taIndicatorParameters.kPercentSmoothing = kSmoothing;
                taIndicatorParameters.kPercentDoubleSmoothing = kDoubleSmoothing;
                taIndicatorParameters.dPercentPeriods = dPeriods;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                taIndicatorParameters.dPercentMaType = IndicatorHelper.getMaTypeString(dMaType);
                break;
            }
            case HistoricalVolatility: {
                let barHistory = this.getParameterValue(IndicatorParam.BAR_HISTORY) as number;
                let stdev = this.getParameterValue(IndicatorParam.STANDARD_DEVIATIONS) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.barHistory = barHistory;
                taIndicatorParameters.standardDeviations = stdev;
                break;
            }
            case QStick:
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            case GopalakrishnanRangeIndex:
                taIndicatorParameters.periods = periods;
                break;
            case IntradayMomentumIndex:
                taIndicatorParameters.periods = periods;
                break;
            case RAVI: {
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number,
                    longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.longCycle = longCycle;
                break;
            }
            case RandomWalkIndex:
                taIndicatorParameters.periods = periods;
                break;
            case DirectionalMovementAverage:
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number,
                    longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.longCycle = longCycle;
                break;
            case DirectionalDivergenceIndex:
                let period1: number = this.getParameterValue(IndicatorParam.PERIOD1) as number,
                    period2: number = this.getParameterValue(IndicatorParam.PERIOD2) as number,
                    period3: number = this.getParameterValue(IndicatorParam.PERIOD3) as number,
                    period4: number = this.getParameterValue(IndicatorParam.PERIOD4) as number;
                taIndicatorParameters.period1 = period1;
                taIndicatorParameters.period2 = period2;
                taIndicatorParameters.period3 = period3;
                taIndicatorParameters.period4 = period4;
                break;
            case DirectionalMovementIndex:
                taIndicatorParameters.periods = periods;
                break;
            case TwiggsMoneyFlow:
                taIndicatorParameters.periods = periods;
                break;

            // Linear regression
            case LinearRegressionRSquared:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case LinearRegressionForecast:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case LinearRegressionSlope:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case LinearRegressionIntercept:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case TimeSeriesForecast:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case SimpleMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case ExponentialMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case DoubleExponentialMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case TripleExponentialMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case HullMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            case TimeSeriesMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case VariableMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case TriangularMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case WeightedMovingAverage:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case VIDYA: {
                let r2scale = this.getParameterValue(IndicatorParam.R2_SCALE) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.r2Scale = r2scale;
                break;
            }
            case WellesWilderSmoothing:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;

            // Oscillator
            case ChandeMomentumOscillator:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case MomentumOscillator:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case TRIX:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case UltimateOscillator: {
                let cycle1 = this.getParameterValue(IndicatorParam.CYCLE_1) as number,
                    cycle2 = this.getParameterValue(IndicatorParam.CYCLE_2) as number,
                    cycle3 = this.getParameterValue(IndicatorParam.CYCLE_3) as number;
                taIndicatorParameters.cycle1 = cycle1;
                taIndicatorParameters.cycle2 = cycle2;
                taIndicatorParameters.cycle3 = cycle3;
                break;
            }
            case VerticalHorizontalFilter:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case WilliamsPctR:
                taIndicatorParameters.periods = periods;
                break;
            case VolumeOscillator: {
                let shortTerm = this.getParameterValue(IndicatorParam.SHORT_TERM) as number,
                    longTerm = this.getParameterValue(IndicatorParam.LONG_TERM) as number;
                taIndicatorParameters.shortTerm = shortTerm;
                taIndicatorParameters.longTerm = longTerm;
                break;
            }
            case VolumeChange:
                taIndicatorParameters.periods = periods;
                break;
            case ChaikinVolatility: {
                let roc = this.getParameterValue(IndicatorParam.RATE_OF_CHANGE) as number;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.rateOfChange = roc;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case VolatilityRatio: {
                taIndicatorParameters.periods = periods;
                break;
            }
            case StochasticOscillator: {
                let kSlowing = this.getParameterValue(IndicatorParam.PCT_K_SMOOTHING) as number;
                let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS) as number;
                let dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS) as number;
                taIndicatorParameters.kPercentSmoothing = kSlowing;
                taIndicatorParameters.kPercentPeriods = kPeriods;
                taIndicatorParameters.dPercentPeriods = dPeriods;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case FastStochastic: {
                let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS) as number;
                let dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS) as number;
                taIndicatorParameters.kPercentPeriods = kPeriods;
                taIndicatorParameters.dPercentPeriods = dPeriods;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case BullishBarishIndicator: {
                let period1: number = this.getParameterValue(IndicatorParam.PERIOD1) as number,
                    period2: number = this.getParameterValue(IndicatorParam.PERIOD2) as number,
                    period3: number = this.getParameterValue(IndicatorParam.PERIOD3) as number,
                    period4: number = this.getParameterValue(IndicatorParam.PERIOD4) as number;
                taIndicatorParameters.period1 = period1;
                taIndicatorParameters.period2 = period2;
                taIndicatorParameters.period3 = period3;
                taIndicatorParameters.period4 = period4;
            }
                break;
            case PSLandisReversal:
                break;
            case PriceOscillator: {
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.longCycle = longCycle;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case MACD: {
                let signalPeriods = this.getParameterValue(IndicatorParam.SIGNAL_PERIODS) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                taIndicatorParameters.longCycle = longCycle;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.signalPeriods = signalPeriods;
                break;
            }
            case VolumeMACD: {
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let signalPeriods = this.getParameterValue(IndicatorParam.SIGNAL_PERIODS) as number;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.longCycle = longCycle;
                taIndicatorParameters.signalPeriods = signalPeriods;
                break;
            }
            case MACDHistogram: {
                let signalPeriods = this.getParameterValue(IndicatorParam.SIGNAL_PERIODS) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                taIndicatorParameters.signalPeriods = signalPeriods;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.longCycle = longCycle;
                break;
            }
            case EaseOfMovement:
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            case DetrendedPriceOscillator:
                taIndicatorParameters.periods = periods;
                break;
            case ParabolicSAR: {
                let minAf = this.getParameterValue(IndicatorParam.MIN_AF) as number,
                    maxAf = this.getParameterValue(IndicatorParam.MAX_AF) as number;
                taIndicatorParameters.minAf = minAf;
                taIndicatorParameters.maxAf = maxAf;
                break;
            }
            case AverageDirectionalIndex:
                taIndicatorParameters.periods = periods;
                break;
            case AverageTrueRange: {
                taIndicatorParameters.periods = periods;
                break;
            }
            case Aroon:
                taIndicatorParameters.periods = periods;
                break;
            case AroonOscillator:
                taIndicatorParameters.periods = periods;
                break;
            case RainbowOscillator: {
                let levels = this.getParameterValue(IndicatorParam.LEVELS) as number;
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.levels = levels;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case FractalChaosOscillator:
                taIndicatorParameters.periods = periods;
                break;
            case ElderRay:
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            case EhlerFisherTransform:
                taIndicatorParameters.periods = periods;
                break;
            case SchaffTrendCycle: {
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;

                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.longCycle = longCycle;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);

                break;
            }
            case CenterOfGravity:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case CoppockCurve:
                taIndicatorParameters.source = sourceField.name;
                break;
            case ChandeForecastOscillator:
                taIndicatorParameters.source = sourceField.name;
                taIndicatorParameters.periods = periods;
                break;
            case KlingerVolumeOscillator: {
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                taIndicatorParameters.periods = periods;
                taIndicatorParameters.shortCycle = shortCycle;
                taIndicatorParameters.longCycle = longCycle;
                taIndicatorParameters.maType = IndicatorHelper.getMaTypeString(maType);
                break;
            }
            case PrettyGoodOscillator:
                taIndicatorParameters.periods = periods;
                break;
            case VolumeIndicator:
                break;
            case ZigZag:
                taIndicatorParameters.periods = periods;
                break;
            case DonchianChannels:
                taIndicatorParameters.periods = periods;
                break;
            case PsychologicalLine:
                taIndicatorParameters.periods = periods;
                break;
            case ZigZagLabel:
                taIndicatorParameters.periods = periods;
                break;
            case VolumeProfilerSessionVolume:
            case VolumeProfilerVisibleRange:
                let vpValueAreaVolumeRatio = this.getParameterValue(IndicatorParam.VP_VALUE_AREA_VOLUME_RATIO) as number;
                let vpRowSize = this.getParameterValue(IndicatorParam.VP_ROW_SIZE) as number;
                taIndicatorParameters.vpRowSize = vpRowSize;
                taIndicatorParameters.vpValueAreaVolumeRatio = vpValueAreaVolumeRatio;
                break;
            case VolumeWeightedAveragePrice:
                let vwapAnchor: number = this.getParameterValue(IndicatorParam.VWAP_ANCHOR) as number;
                taIndicatorParameters.anchor = IndicatorHelper.getVwapTypeString(vwapAnchor);
                break;
        }

        return taIndicatorParameters;
    }

    getParametersString() {
        let parameters = this.getParameters();
        let paramsArray = [];
        for (let param of Object.keys(parameters)) {
            if(param) {
                paramsArray.push(parameters[param]);
            }
        }
        return paramsArray.join(', ')
    }

    calculate() {
        let sourceSuffix = <string> this.getParameterValue(IndicatorParam.SOURCE),
            periods = this.getParameterValue(IndicatorParam.PERIODS) as number,
            indicatorName = IndicatorField.INDICATOR,
            maType = this.getParameterValue(IndicatorParam.MA_TYPE) as number,
            startIndex = periods + 1,
            bands = Bands.prototype,
            general = General.prototype,
            index = Index.prototype,
            oscillator = Oscillator.prototype,
            regression = LinearRegression.prototype,
            supportAndResistance = SupportAndResistance.prototype,
            recordSet: Recordset;

        let sourceField = this.customSourceIndicatorId ? this._getCustomSourceField() : this._createField(sourceSuffix);

        switch (this.indicatorTypeId) {
            // Bands
            case BollingerBands: {
                let stdev = this.getParameterValue(IndicatorParam.STANDARD_DEVIATIONS) as number;

                recordSet = bands.bollingerBands(sourceField, periods, stdev, maType);
                break;
            }
            case MovingAverageEnvelope: {
                let shift = this.getParameterValue(IndicatorParam.SHIFT) as number;

                recordSet = bands.movingAverageEnvelope(sourceField, periods, maType, shift);
                break;
            }
            case HighLowBands:
                recordSet = bands.highLowBands(this._createHighField(), this._createLowField(), this._createCloseField(), periods);
                break;
            case FractalChaosBands:
                recordSet = bands.fractalChaosBands(this._createRecordset(), periods);
                break;
            case PrimeNumberBands:
                startIndex = 1;
                recordSet = bands.primeNumberBands(this._createHighField(), this._createLowField());
                break;
            case KeltnerChannel: {
                let shift = this.getParameterValue(IndicatorParam.SHIFT) as number;

                recordSet = bands.keltner(this._createRecordset(), periods, shift, Const.exponentialMovingAverage, "Keltner");
                break;
            }
            case STARC: {
                let shift = this.getParameterValue(IndicatorParam.SHIFT) as number;

                recordSet = bands.keltner(this._createRecordset(), periods, shift, maType, "STARC");
                break;
            }

            // General
            case HighMinusLow:
                startIndex = 1;
                recordSet = general.highMinusLow(this._createRecordset(), indicatorName);
                break;
            case MedianPrice:
                startIndex = 1;
                recordSet = general.medianPrice(this._createRecordset(), indicatorName);
                break;
            case TypicalPrice:
                startIndex = 1;
                recordSet = general.typicalPrice(this._createRecordset(), indicatorName);
                break;
            case WeightedClose:
                startIndex = 1;
                recordSet = general.weightedClose(this._createRecordset(), indicatorName);
                break;
            case VolumeROC:
                recordSet = general.volumeROC(sourceField, periods, indicatorName);
                break;
            case PriceROC:
                recordSet = general.priceROC(this._createCloseField(), periods, indicatorName);
                break;
            case StandardDeviation: {
                let stdev = this.getParameterValue(IndicatorParam.STANDARD_DEVIATIONS) as number;

                recordSet = general.standardDeviation(sourceField, periods, stdev, maType, indicatorName);
                break;
            }
            case HHV:
                recordSet = general.HHV(this._createHighField(), periods, indicatorName);
                break;
            case LLV:
                recordSet = general.LLV(this._createLowField(), periods, indicatorName);
                break;

            case MaximumValue:
                recordSet = general.MAXV(this._createVolumeField(), periods, indicatorName);
                break;
            // Index
            case MoneyFlowIndex:
                recordSet = index.moneyFlowIndex(this._createRecordset(), periods, indicatorName);
                break;
            case TradeVolumeIndex: {
                let minTick = this.getParameterValue(IndicatorParam.MIN_TICK) as number;

                startIndex = 1;
                recordSet = index.tradeVolumeIndex(sourceField, this._createVolumeField(), minTick, indicatorName);
                break;
            }
            case SwingIndex: {
                let limitMove = this.getParameterValue(IndicatorParam.LIMIT_MOVE) as number;

                startIndex = 1;
                recordSet = index.swingIndex(this._createRecordset(), limitMove, indicatorName);
                break;
            }
            case AccumulativeSwingIndex: {
                let limitMove = this.getParameterValue(IndicatorParam.LIMIT_MOVE) as number;

                startIndex = 1;
                recordSet = index.accumulativeSwingIndex(this._createRecordset(), limitMove, indicatorName);
                break;
            }
            case RelativeStrengthIndex:
                startIndex = periods + 2;
                recordSet = index.relativeStrengthIndex(sourceField, periods, indicatorName);
                break;
            case ComparativeRelativeStrength: {
                let source2Field = this._createField(this.getParameterValue(IndicatorParam.SOURCE2) as string);

                startIndex = 1;
                recordSet = index.comparativeRelativeStrength(sourceField, source2Field, indicatorName);
                break;
            }
            case StochasticRSI :
                startIndex = periods * 2;
                recordSet = index.stochasticRelativeStrength(sourceField, periods, indicatorName);
                break;
            case PriceVolumeTrend:
                startIndex = 2;
                recordSet = index.priceVolumeTrend(sourceField, this._createVolumeField(), indicatorName);
                break;
            case PositiveVolumeIndex:
                startIndex = 1;
                recordSet = index.positiveVolumeIndex(sourceField, this._createVolumeField(), indicatorName);
                break;
            case NegativeVolumeIndex:
                startIndex = 1;
                recordSet = index.negativeVolumeIndex(sourceField, this._createVolumeField(), indicatorName);
                break;
            case PerformanceIndex:
                startIndex = 1;
                recordSet = index.performance(sourceField, indicatorName);
                break;
            case OnBalanceVolume:
                startIndex = 1;
                recordSet = index.onBalanceVolume(sourceField, this._createVolumeField(), indicatorName);
                break;
            case MassIndex:
                startIndex = Math.floor(periods * 3);
                recordSet = index.massIndex(this._createRecordset(), periods, indicatorName);
                break;
            case ChaikinMoneyFlow:
                recordSet = index.chaikinMoneyFlow(this._createRecordset(), periods, indicatorName);
                break;
            case CommodityChannelIndex:
                startIndex = Math.floor(periods * 2);
                recordSet = index.commodityChannelIndex(this._createRecordset(), periods, indicatorName);
                break;
            case StochasticMomentumIndex: {
                let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS) as number,
                    kSmoothing = this.getParameterValue(IndicatorParam.PCT_K_SMOOTHING) as number,
                    kDoubleSmoothing = this.getParameterValue(IndicatorParam.PCT_K_DOUBLE_SMOOTHING) as number,
                    dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS) as number,
                    dMaType = this.getParameterValue(IndicatorParam.PCT_D_MA_TYPE) as number;

                startIndex = kPeriods + kSmoothing + dPeriods;
                recordSet = index.stochasticMomentumIndex(this._createRecordset(), kPeriods, kSmoothing, kDoubleSmoothing, dPeriods, maType, dMaType);
                break;
            }
            case HistoricalVolatility: {
                let barHistory = this.getParameterValue(IndicatorParam.BAR_HISTORY) as number;
                let stdev = this.getParameterValue(IndicatorParam.STANDARD_DEVIATIONS) as number;

                recordSet = index.historicalVolatility(sourceField, periods, barHistory, stdev, indicatorName);
                break;
            }
            case ElderForceIndex: {
                startIndex = 7;
                recordSet = index.elderForceIndex(this._createRecordset(), indicatorName);
                let ema = MovingAverage.prototype.exponentialMovingAverage(recordSet.getField(indicatorName), 2, indicatorName + " Signal").getField(indicatorName + " Signal");
                recordSet.addField(ema);
                break;
            }
            case ElderThermometer:
                startIndex = 2;
                recordSet = index.elderThermometer(this._createRecordset(), indicatorName);
                break;
            case MarketFacilitationIndex:
                startIndex = 2;
                recordSet = index.marketFacilitationIndex(this._createRecordset(), indicatorName);
                break;
            case QStick:
                recordSet = index.qStick(this._createRecordset(), periods, maType, indicatorName);
                break;
            case GopalakrishnanRangeIndex:
                recordSet = index.gopalakrishnanRangeIndex(this._createRecordset(), periods, indicatorName);
                break;
            case IntradayMomentumIndex:
                startIndex = 3;
                recordSet = index.intradayMomentumIndex(this._createRecordset(), periods, indicatorName);
                break;
            case RAVI: {
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number,
                    longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;

                startIndex = longCycle + 2;
                recordSet = index.RAVI(sourceField, shortCycle, longCycle, indicatorName);
                break;
            }
            case RandomWalkIndex:
                startIndex = periods * 2;
                recordSet = index.randomWalkIndex(this._createRecordset(), periods, indicatorName);
                break;
            case DirectionalMovementAverage:
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number,
                    longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                startIndex = Math.max(longCycle, shortCycle) + 20;
                recordSet = index.directionalMovementAverage(this._createCloseField() , shortCycle , longCycle , periods);
                break;
            case DirectionalDivergenceIndex:
                let period1 = this.getParameterValue(IndicatorParam.PERIOD1) as number,
                    period2 = this.getParameterValue(IndicatorParam.PERIOD2) as number,
                    period3 = this.getParameterValue(IndicatorParam.PERIOD3) as number,
                    period4 = this.getParameterValue(IndicatorParam.PERIOD4) as number;
                startIndex = period1 + 3;
                recordSet = index.directionalDivergenceIndex(this._createRecordset() , period1 , period2 , period3 , period4);
                break;
            case DirectionalMovementIndex:
                startIndex = periods + 3;
                recordSet = index.directionalMovementIndex(this._createRecordset() , periods);
                break;
            case TwiggsMoneyFlow:
                recordSet = index.twiggsMoneyFlow(this._createRecordset(), periods, indicatorName);
                break;

            // Linear regression
            case LinearRegressionRSquared:
                recordSet = regression.regression(sourceField, periods);
                break;
            case LinearRegressionForecast:
                recordSet = regression.regression(sourceField, periods);
                break;
            case LinearRegressionSlope:
                recordSet = regression.regression(sourceField, periods);
                break;
            case LinearRegressionIntercept:
                recordSet = regression.regression(sourceField, periods);
                break;
            case TimeSeriesForecast:
                recordSet = regression.timeSeriesForecast(sourceField, periods, indicatorName);
                break;

            // Moving Average
            case SimpleMovingAverage:
                recordSet = MovingAverage.prototype.simpleMovingAverage(sourceField, periods, indicatorName);
                break;
            case ExponentialMovingAverage:
                recordSet = MovingAverage.prototype.exponentialMovingAverage(sourceField, periods, indicatorName);
                break;
            case DoubleExponentialMovingAverage:
                recordSet = MovingAverage.prototype.doubleExponentialMovingAverage(sourceField, periods, indicatorName);
                break;
            case TripleExponentialMovingAverage:
                recordSet = MovingAverage.prototype.tripleExponentialMovingAverage(sourceField, periods, indicatorName);
                break;
            case HullMovingAverage:
                startIndex = periods + 6;
                recordSet = MovingAverage.prototype.hullMovingAverage(sourceField , periods  , maType , indicatorName);
                break;
            case TimeSeriesMovingAverage:
                recordSet = MovingAverage.prototype.timeSeriesMovingAverage(sourceField, periods, indicatorName);
                break;
            case VariableMovingAverage:
                startIndex = Math.floor(periods * 2);
                recordSet = MovingAverage.prototype.variableMovingAverage(sourceField, periods, indicatorName);
                break;
            case TriangularMovingAverage:
                startIndex = Math.floor(periods * 2);
                recordSet = MovingAverage.prototype.triangularMovingAverage(sourceField, periods, indicatorName);
                break;
            case WeightedMovingAverage:
                recordSet = MovingAverage.prototype.weightedMovingAverage(sourceField, periods, indicatorName);
                break;
            case VIDYA: {
                let r2scale = this.getParameterValue(IndicatorParam.R2_SCALE) as number;

                startIndex = 2;
                recordSet = MovingAverage.prototype.VIDYA(sourceField, periods, r2scale, indicatorName);
                break;
            }
            case WellesWilderSmoothing:
                startIndex = Math.floor(periods * 2);
                recordSet = MovingAverage.prototype.wellesWilderSmoothing(sourceField, periods, indicatorName);
                break;

            // Oscillator
            case ChandeMomentumOscillator:
                recordSet = MovingAverage.prototype.chandeMomentumOscillator(sourceField, periods, indicatorName);
                break;
            case MomentumOscillator:
                startIndex = periods + 2;
                recordSet = oscillator.momentum(sourceField, periods, indicatorName);
                break;
            case TRIX:
                startIndex = Math.floor(periods * 2);
                recordSet = oscillator.TRIX(sourceField, periods, indicatorName);
                break;
            case UltimateOscillator: {
                let cycle1 = this.getParameterValue(IndicatorParam.CYCLE_1) as number,
                    cycle2 = this.getParameterValue(IndicatorParam.CYCLE_2) as number,
                    cycle3 = this.getParameterValue(IndicatorParam.CYCLE_3) as number;

                startIndex = Math.max(cycle1, cycle2, cycle3) + 1;
                recordSet = oscillator.ultimateOscillator(this._createRecordset(), cycle1, cycle2, cycle3, indicatorName);
                break;
            }
            case VerticalHorizontalFilter:
                recordSet = oscillator.verticalHorizontalFilter(sourceField, periods, indicatorName);
                break;
            case WilliamsPctR:
                startIndex = Math.floor(periods * 2);
                recordSet = oscillator.williamsPctR(this._createRecordset(), periods, indicatorName);
                break;
            case WilliamsAccumulationDistribution:
                startIndex = 1;
                recordSet = oscillator.williamsAccumulationDistribution(this._createRecordset(), indicatorName);
                break;
            case AccumulationDistribution:
                startIndex = 1;
                recordSet = oscillator.accumulationDistribution(this._createRecordset(), indicatorName);
                break;
            case VolumeOscillator: {
                let shortTerm = this.getParameterValue(IndicatorParam.SHORT_TERM) as number,
                    longTerm = this.getParameterValue(IndicatorParam.LONG_TERM) as number,
                    pointsOrPercent = this.getParameterValue(IndicatorParam.POINTS_OR_PERCENT) as number;

                startIndex = Math.max(shortTerm, longTerm) + 1;
                recordSet = oscillator.volumeOscillator(this._createVolumeField(), shortTerm, longTerm, pointsOrPercent, indicatorName);
                break;
            }
            case VolumeChange:
                recordSet = oscillator.volumeChange(this._createRecordset() , periods , indicatorName);
                break;
            case ChaikinVolatility: {
                let roc = this.getParameterValue(IndicatorParam.RATE_OF_CHANGE) as number;

                startIndex = Math.floor(periods * 1.5);
                recordSet = oscillator.chaikinVolatility(this._createRecordset(), periods, roc, maType, indicatorName);
                break;
            }
            case VolatilityRatio: {
                recordSet = oscillator.volatilityRatio(this._createRecordset(), periods, indicatorName);
                break;
            }
            case StochasticOscillator: {
                let kSlowing = this.getParameterValue(IndicatorParam.PCT_K_SMOOTHING) as number;
                let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS) as number;
                let dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS) as number;

                startIndex = Math.max(kPeriods, dPeriods, kSlowing) + 1;
                recordSet = oscillator.stochasticOscillator(this._createRecordset(), kPeriods, kSlowing, dPeriods, maType);
                break;
            }
            case FastStochastic: {
                let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS) as number;
                let dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS) as number;

                startIndex = Math.max(kPeriods, dPeriods) + 1;
                recordSet = oscillator.fastStochastic(this._createRecordset(), kPeriods, dPeriods, maType);
                break;
            }
            case BullishBarishIndicator: {
                let period1: number = this.getParameterValue(IndicatorParam.PERIOD1) as number;
                let period2: number = this.getParameterValue(IndicatorParam.PERIOD2) as number;
                let period3: number = this.getParameterValue(IndicatorParam.PERIOD3) as number;
                let period4: number = this.getParameterValue(IndicatorParam.PERIOD4) as number;
                startIndex = Math.max(period1, period2, period3, period4) + 1;
                recordSet =  oscillator.bullishBarishIndicator(this._createCloseField(), period1, period2, period3, period4, indicatorName);
                break;
            }
            case PSLandisReversal: {
                startIndex =  1;
                recordSet = oscillator.psLandisReversal(this._createRecordset() , 'LanRevl' );
                break;
            }
            case PriceOscillator: {
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;

                startIndex = Math.max(longCycle, shortCycle) + 1;
                recordSet = oscillator.priceOscillator(sourceField, longCycle, shortCycle, maType, indicatorName);
                break;
            }
            case MACD: {
                let signalPeriods = this.getParameterValue(IndicatorParam.SIGNAL_PERIODS) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                startIndex = Math.trunc(Math.max(longCycle, shortCycle) * 2.25);
                let macdSourceField = this._createCloseField();
                recordSet = oscillator.MACD(macdSourceField, signalPeriods, longCycle, shortCycle, Const.exponentialMovingAverage, indicatorName);
                let recordSet2 = oscillator.macdHistogram(macdSourceField, signalPeriods, longCycle, shortCycle, Const.exponentialMovingAverage, indicatorName + " Histogram");
                let field = recordSet2.getField(indicatorName + " Histogram");
                recordSet.addField(field);

                break;
            }
            case VolumeMACD: {
                let signalPeriods = this.getParameterValue(IndicatorParam.SIGNAL_PERIODS) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                startIndex = Math.trunc(Math.max(longCycle, shortCycle) * 2.25);
                let macdSourceField = this._createVolumeField();
                recordSet = oscillator.MACD(macdSourceField, signalPeriods, longCycle, shortCycle, Const.exponentialMovingAverage, indicatorName);
                recordSet.renameField(indicatorName + "Signal" , indicatorName + " DEA")
                let recordSet2 = oscillator.macdHistogram(macdSourceField, signalPeriods, longCycle, shortCycle, Const.exponentialMovingAverage, indicatorName + " MACDH");
                let field = recordSet2.getField(indicatorName + " MACDH");
                recordSet.addField(field);
                break;
            }
            case MACDHistogram: {
                let signalPeriods = this.getParameterValue(IndicatorParam.SIGNAL_PERIODS) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;

                startIndex = Math.trunc(Math.max(longCycle, shortCycle) * 2.25);
                recordSet = oscillator.macdHistogram(this._createCloseField(), signalPeriods, longCycle, shortCycle, Const.exponentialMovingAverage, indicatorName + " Histogram");
                break;
            }
            case EaseOfMovement:
                recordSet = oscillator.easeOfMovement(this._createRecordset(), periods, maType, indicatorName);
                break;
            case DetrendedPriceOscillator:
                startIndex = periods * 2;
                recordSet = oscillator.detrendedPriceOscillator(this._createCloseField(), periods, Const.simpleMovingAverage, indicatorName);
                break;
            case ParabolicSAR: {
                let minAf = this.getParameterValue(IndicatorParam.MIN_AF) as number,
                    maxAf = this.getParameterValue(IndicatorParam.MAX_AF) as number;

                startIndex = 2;
                recordSet = oscillator.parabolicSAR(this._createHighField(), this._createLowField(), minAf, maxAf, indicatorName);
                break;
            }
            case AverageDirectionalIndex:
                recordSet = oscillator.averageDirectionalIndex(this._createRecordset(), periods);
                break;
            case TrueRange:
                startIndex = 2;
                recordSet = oscillator.trueRange(this._createRecordset(), indicatorName);
                break;
            case AverageTrueRange: {
                recordSet = oscillator.trueRange(this._createRecordset(), indicatorName);
                let tr = recordSet.getField(indicatorName);
                recordSet = MovingAverage.prototype.dynamicMovingAverage(tr, periods, 1 / periods, indicatorName);
                break;
            }
            case Aroon:
                recordSet = oscillator.aroon(this._createRecordset(), periods);
                break;
            case AroonOscillator:
                recordSet = oscillator.aroon(this._createRecordset(), periods);
                break;
            case RainbowOscillator: {
                let levels = this.getParameterValue(IndicatorParam.LEVELS) as number;

                startIndex = levels + 1;
                recordSet = oscillator.rainbowOscillator(sourceField, levels, maType, indicatorName);
                break;
            }
            case FractalChaosOscillator:
                recordSet = oscillator.fractalChaosOscillator(this._createRecordset(), periods, indicatorName);
                break;
            case PrimeNumberOscillator:
                startIndex = 1;
                recordSet = oscillator.primeNumberOscillator(this._createCloseField(), indicatorName);
                break;
            case ElderRay:
                recordSet = oscillator.elderRay(this._createRecordset(), periods, maType, indicatorName);
                break;
            case EhlerFisherTransform:
                startIndex = periods + 2;
                recordSet = oscillator.ehlerFisherTransform(this._createRecordset(), periods, indicatorName);
                break;
            case SchaffTrendCycle: {
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;

                recordSet = oscillator.schaffTrendCycle(sourceField, periods, shortCycle, longCycle, maType, indicatorName);
                break;
            }
            case CenterOfGravity:
                recordSet = oscillator.centerOfGravity(sourceField, periods, indicatorName);
                break;
            case CoppockCurve:
                startIndex = 12;
                recordSet = oscillator.coppockCurve(sourceField, indicatorName);
                break;
            case ChandeForecastOscillator:
                recordSet = oscillator.chandeForecastOscillator(sourceField, periods, indicatorName);
                break;
            case KlingerVolumeOscillator: {
                let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE) as number;
                let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE) as number;

                startIndex = Math.max(periods, shortCycle) + 1;
                recordSet = oscillator.klingerVolumeOscillator(this._createRecordset(), periods, longCycle, shortCycle, maType, indicatorName);
                break;
            }
            case PrettyGoodOscillator:
                recordSet = oscillator.prettyGoodOscillator(this._createRecordset(), periods, indicatorName);
                break;
            case VolumeIndicator:
                break;
            case ZigZag:
                startIndex = 1;
                let sourceSuffix2 = <string> this.getParameterValue(IndicatorParam.SOURCE2),
                    sourceField2 = this._createField(sourceSuffix2);
                recordSet = supportAndResistance.zigZag(sourceField, sourceField2, periods, indicatorName);
                break;
            case DonchianChannels:
                recordSet = oscillator.donchianChannels(this._createRecordset(), periods);
                break;
            case PsychologicalLine:
                startIndex = periods + 2;
                recordSet = oscillator.psychologicalLine(this._createCloseField(), periods, indicatorName);
                break;
            case ZigZagLabel:
                startIndex = 1;
                recordSet = supportAndResistance.zigZagLabel(this._createHighField(), this._createLowField(), periods, indicatorName);
                break;
            case VolumeProfilerSessionVolume:
            case VolumeProfilerVisibleRange:
                startIndex = 1;
                recordSet = this.calculateCustomRecordset(this._createDateField());
                break;
            case VolumeWeightedAveragePrice:
                startIndex = 1;
                let anchor = this.getParameterValue(IndicatorParam.VWAP_ANCHOR) as number;
                recordSet = MovingAverage.prototype.volumeWeightedAveragePrice(this._createRecordset(), this._createDateField(), anchor, indicatorName);
                break;
            default:
                throw new Error("Unsupported indicator: " + this.indicatorTypeId);
        }

        return {
            parameters: this.getParametersString(),
            recordSet: recordSet,
            startIndex: startIndex
        };
    }

    _createField(nameSuffix: string, fieldName?: string): Field {
        if (!nameSuffix)
            return null;

        if (fieldName === undefined) {
            switch (nameSuffix) {
                case DataSeriesSuffix.OPEN:
                    fieldName = IndicatorField.OPEN;
                    break;
                case DataSeriesSuffix.HIGH:
                    fieldName = IndicatorField.HIGH;
                    break;
                case DataSeriesSuffix.LOW:
                    fieldName = IndicatorField.LOW;
                    break;
                case DataSeriesSuffix.CLOSE:
                    fieldName = IndicatorField.CLOSE;
                    break;
                case DataSeriesSuffix.VOLUME:
                    fieldName = IndicatorField.VOLUME;
                    break;
            }
        }
        var dataSeries = this._usePrimaryDataSeries ? this._chart.primaryDataSeries(nameSuffix) : this._chart.getDataSeries(nameSuffix);

        return dataSeries ? dataSeries.toField(fieldName) : null;
    }

    _createOpenField(): Field {
        return this._createField(DataSeriesSuffix.OPEN, IndicatorField.OPEN);
    }

    _createHighField(): Field {
        return this._createField(DataSeriesSuffix.HIGH, IndicatorField.HIGH);
    }

    _createLowField(): Field {
        return this._createField(DataSeriesSuffix.LOW, IndicatorField.LOW);
    }

    _createCloseField(): Field {
        return this._createField(DataSeriesSuffix.CLOSE, IndicatorField.CLOSE);
    }

    _createVolumeField(): Field {
        return this._createField(DataSeriesSuffix.VOLUME, IndicatorField.VOLUME);
    }

    _createDateField(): Field {
        return this._createField(DataSeriesSuffix.DATE, IndicatorField.DATE);
    }

    _createRecordset(): Recordset {
        let recordSet = new Recordset();
        recordSet.addField(this._createOpenField());
        recordSet.addField(this._createHighField());
        recordSet.addField(this._createLowField());
        recordSet.addField(this._createCloseField());

        recordSet.addField(this._createVolumeField());
        return recordSet;
    }

    protected _updatePlotItem(index: number): boolean {
        if (this._fieldNames[index] === IndicatorField.VOLUME) {
            this._updateVolumeIndicator(this._plotItems[index]);
            return true;
        }

        return false;
    }

    _updateVolumeIndicator(plotItem: PlotItem) {
        plotItem.dataSeries = this._usePrimaryDataSeries ? this._chart.primaryDataSeries(DataSeriesSuffix.VOLUME) : this._chart.getDataSeries(DataSeriesSuffix.VOLUME);
        plotItem.plot = new HistogramPlot(this.chart,{
            plotStyle: HistogramPlot.Style.COLUMNBYPRICE,
            dataSeries: plotItem.dataSeries,
            theme: this._getHistogramTheme(0)
        });

        plotItem.color = this.chart.getThemeType() == ThemeType.Light ? 'rgb(51, 51, 51)' : 'rgb(200, 200, 200)';
    }

    protected hitTest(point: IPoint): boolean {
        if (!this.visible)
            return false;

        if (super.hitTest(point))
            return true;

        for (let item of this._plotItems) {
            if (item.plot.hitTest(point))
                return true;
        }
        return false;
    }

    _getFillDataSeries() {
        switch (this.indicatorTypeId) {
            case BollingerBands:
            case DonchianChannels:
                return [this._plotItems[0].plot.dataSeries[0], this._plotItems[2].plot.dataSeries[0]];
        }
    }

    _getIndicatorPlotType(fieldName: string) {
        switch (fieldName) {
            case IndicatorField.INDICATOR_HISTOGRAM:
            case IndicatorField.DIRECTIONAL_DIVERGENCE_INDEX_DDI:
            case IndicatorField.INDICATOR_MACDH:
                return IndicatorPlotTypes.HISTOGRAM_PLOT;
            case IndicatorField.INDICATOR_FILL:
                return IndicatorPlotTypes.FILL_PLOT;
            case IndicatorField.INDICATOR:
            case IndicatorField.PS_LANDIS_REVERSAL:
            case IndicatorField.Directional_Movement_Average_AMA:
            case IndicatorField.Directional_Movement_Average_DDD:
            case IndicatorField.DIRECTIONAL_DIVERGENCE_INDEX_ADDI:
            case IndicatorField.DIRECTIONAL_DIVERGENCE_INDEX_AD:
            case IndicatorField.DIRECTIONAL_MOVEMENT_INDEX_PDI:
            case IndicatorField.DIRECTIONAL_MOVEMENT_INDEX_MDI:
            case IndicatorField.DIRECTIONAL_MOVEMENT_INDEX_ADXR:
            case IndicatorField.ADX:
                return this._getPlotTypeDependsOnIndicator();
            default:
                return IndicatorPlotTypes.LINE_PLOT;
        }
    }

    protected _getOverlayIndicatorDefaultSource(): string {
        // NK till now the default source for all overlay one source indicators is CLOSE
        switch (this.indicatorTypeId) {
            case BollingerBands:
            case MovingAverageEnvelope:
            case LinearRegressionForecast:
            case LinearRegressionIntercept:
            case TimeSeriesForecast:
            case ExponentialMovingAverage:
            case DoubleExponentialMovingAverage:
            case TripleExponentialMovingAverage:
            case HullMovingAverage:
            case SimpleMovingAverage:
            case TimeSeriesMovingAverage:
            case VariableMovingAverage:
            case TriangularMovingAverage:
            case WeightedMovingAverage:
            case WellesWilderSmoothing:
            case VIDYA:
            default:
                return DataSeriesSuffix.CLOSE;
        }
    }

    private _getPlotTypeDependsOnIndicator() {
        switch (this.indicatorTypeId) {
            case ZigZag:
            case PSLandisReversal:
            case MaximumValue:
            case PsychologicalLine:
            case StochasticRSI:
            case TripleExponentialMovingAverage:
            case HullMovingAverage:
            case VolumeChange:
            case VolatilityRatio:
            case AccumulationDistribution:
            case BullishBarishIndicator:
            case DirectionalMovementAverage:
            case DirectionalDivergenceIndex:
            case DirectionalMovementIndex:
                return IndicatorPlotTypes.LINE_CONNECTED_POINTS_PLOT;
            case ParabolicSAR:
                return IndicatorPlotTypes.POINTS_PLOT;
            case ZigZagLabel:
                return IndicatorPlotTypes.LABEL_CONNECTED_POINTS_PLOT;
            case VolumeProfilerSessionVolume:
                return IndicatorPlotTypes.VOLUME_PROFILER_SESSION_PLOT;
            case VolumeProfilerVisibleRange:
                return IndicatorPlotTypes.VOLUME_PROFILER_VISIBLE_RANGE_PLOT;
            default:
                return IndicatorPlotTypes.LINE_PLOT;
        }
    }

    private _getCustomSourceField() {
        let sourceIndicator = this._chart.getIndicatorById(this.customSourceIndicatorId);
        let sourceDataSeries: DataSeries = null;
        let customSourceParam: string = this.getParameterValue(IndicatorParam.SOURCE) as string;
        for (let i = 0; i < sourceIndicator.plots.length; i++) {
            if (sourceIndicator.id + '_' + i == customSourceParam) {
                sourceDataSeries = sourceIndicator.plots[i].dataSeries[0];
                break;
            }
        }

        if (sourceDataSeries) {
            return sourceDataSeries.toField(sourceDataSeries.name);
        }

        // NK the source is OPEN || HIGH || LOW || CLOSE || VOLUME
        return this._createField(customSourceParam);
    }

    /* Default settings */
    resetDefaultSettings() {
        let settings = IndicatorsDefaultSettings.resetIndicatorSettings(this.chart.getThemeType(), this.indicatorTypeId);
        this._options.parameters = settings.parameters;

        for (let horizontalLine of settings.horizontalLines) {
            this.addHorizontalLine(new HorizontalLine(horizontalLine.options));
        }

    }

    saveAsDefaultSettings() {
        IndicatorsDefaultSettings.setIndicatorDefaultSettings(this.indicatorTypeId, this.parameters, this.horizontalLines);
    }

    protected calculateCustomRecordset(sourceField: Field):Recordset {
        return null;
    }

}
