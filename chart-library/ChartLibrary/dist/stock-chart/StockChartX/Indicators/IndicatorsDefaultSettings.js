import { LineStyle } from '../Theme';
import { DataSeriesSuffix } from "../Data/DataSeries";
import { AverageTrueRange, Const, ExponentialMovingAverage, DoubleExponentialMovingAverage, PriceOscillator, RainbowOscillator, SimpleMovingAverage, TimeSeriesMovingAverage, TriangularMovingAverage, TRIX, TrueRange, UltimateOscillator, VariableMovingAverage, VerticalHorizontalFilter, VIDYA, VolumeOscillator, WeightedMovingAverage, WellesWilderSmoothing, WilliamsAccumulationDistribution, AccumulationDistribution, WilliamsPctR, ParabolicSAR, MomentumOscillator, MACD, EaseOfMovement, AverageDirectionalIndex, RelativeStrengthIndex, MoneyFlowIndex, CommodityChannelIndex, IchimokuKinkoHyo, AccumulativeSwingIndex, Aroon, AroonOscillator, BollingerBands, BullishBarishIndicator, CenterOfGravity, ChaikinMoneyFlow, ChaikinVolatility, ChandeForecastOscillator, ChandeMomentumOscillator, ComparativeRelativeStrength, CoppockCurve, DetrendedPriceOscillator, DonchianChannels, DynamicMovingAverage, EhlerFisherTransform, ElderForceIndex, ElderRay, ElderThermometer, FractalChaosBands, FractalChaosOscillator, GopalakrishnanRangeIndex, HHV, HighLowBands, HighMinusLow, HistoricalVolatility, HullMovingAverage, IntradayMomentumIndex, KeltnerChannel, KlingerVolumeOscillator, LinearRegressionForecast, LinearRegressionIntercept, LinearRegressionRSquared, LinearRegressionSlope, LLV, MACDHistogram, MarketFacilitationIndex, MassIndex, MaximumValue, MedianPrice, MovingAverageEnvelope, NegativeVolumeIndex, OnBalanceVolume, PerformanceIndex, PositiveVolumeIndex, PrettyGoodOscillator, PriceROC, PriceVolumeTrend, PrimeNumberBands, PrimeNumberOscillator, PsychologicalLine, QStick, RandomWalkIndex, DirectionalMovementAverage, DirectionalDivergenceIndex, DirectionalMovementIndex, RAVI, SchaffTrendCycle, StandardDeviation, STARC, StochasticMomentumIndex, StochasticOscillator, StochasticRSI, SwingIndex, TimeSeriesForecast, TradeVolumeIndex, TripleExponentialMovingAverage, TwiggsMoneyFlow, TypicalPrice, VolumeROC, WeightedClose, ZigZag, ZigZagLabel, LiquidityByNetValue, LiquidityByNetVolume, AccumulatedLiquidityByNetValue, AccumulatedLiquidityByNetVolume, LiquidityByValue, LiquidityByVolume, VolumeIndicator, VolumeProfilerSessionVolume, VolumeProfilerVisibleRange, VolumeWeightedAveragePrice, VolumeChange, VolumeMACD, VolatilityRatio, FastStochastic, PSLandisReversal } from '../../TASdk/TASdk';
import { IchimokuIndicatorParam, IndicatorParam, IndicatorParamValue, vwapIndicatorParam } from './IndicatorConst';
import { VolumeProfilerSettingsRowType } from '../../../services/data/volume-profiler/volume-profiler.service';
import { HorizontalLine } from './HorizontalLine';
import { ChartAccessorService } from '../../../services/chart';
import { ThemeType } from '../ThemeType';
var IndicatorsDefaultSettings = (function () {
    function IndicatorsDefaultSettings() {
    }
    IndicatorsDefaultSettings.getIndicatorDefaultSettings = function (themeType, indicatorNumber) {
        var settings = IndicatorsDefaultSettings.indicatorsSavedDefaultSettings[indicatorNumber] ||
            IndicatorsDefaultSettings.getIndicatorOriginalSettings(themeType, indicatorNumber);
        return $.extend(true, {}, settings);
    };
    IndicatorsDefaultSettings.setIndicatorDefaultSettings = function (indicatorNumber, parameters, horizontalLines) {
        IndicatorsDefaultSettings.indicatorsSavedDefaultSettings[indicatorNumber] = {
            parameters: parameters,
            horizontalLines: horizontalLines
        };
        IndicatorsDefaultSettings.writeIndicatorsDefaultSettings();
    };
    IndicatorsDefaultSettings.resetIndicatorSettings = function (themeType, indicatorNumber) {
        IndicatorsDefaultSettings.indicatorsSavedDefaultSettings[indicatorNumber] = null;
        IndicatorsDefaultSettings.writeIndicatorsDefaultSettings();
        return IndicatorsDefaultSettings.getIndicatorOriginalSettings(themeType, indicatorNumber);
    };
    IndicatorsDefaultSettings.resetAllSavedSettings = function () {
        IndicatorsDefaultSettings.savedDefaultSettings = null;
        IndicatorsDefaultSettings.writeIndicatorsDefaultSettings();
    };
    Object.defineProperty(IndicatorsDefaultSettings, "indicatorsSavedDefaultSettings", {
        get: function () {
            if (!IndicatorsDefaultSettings.savedDefaultSettings) {
                IndicatorsDefaultSettings.savedDefaultSettings = ChartAccessorService.instance.getIndicatorDefaultSettings() || {};
                IndicatorsDefaultSettings.writeIndicatorsDefaultSettings();
            }
            return IndicatorsDefaultSettings.savedDefaultSettings;
        },
        enumerable: false,
        configurable: true
    });
    IndicatorsDefaultSettings.getIndicatorOriginalSettings = function (themeType, indicatorNumber) {
        return {
            parameters: IndicatorsDefaultSettings.getIndicatorParam(themeType, indicatorNumber),
            horizontalLines: IndicatorsDefaultSettings.getIndicatorHorizontalLine(themeType, indicatorNumber)
        };
    };
    IndicatorsDefaultSettings.writeIndicatorsDefaultSettings = function () {
        ChartAccessorService.instance.setIndicatorDefaultSettings(IndicatorsDefaultSettings.savedDefaultSettings);
    };
    IndicatorsDefaultSettings.getIndicatorParam = function (themeType, indicatorNumber) {
        var params = {};
        var theme = themeType == ThemeType.Light ? IndicatorTheme.Light : IndicatorTheme.Dark;
        params[IndicatorParam.LINE_WIDTH] = 2;
        params[IndicatorParam.LINE_STYLE] = LineStyle.SOLID;
        params[IndicatorParam.LINE2_WIDTH] = 2;
        params[IndicatorParam.LINE2_STYLE] = LineStyle.SOLID;
        params[IndicatorParam.LINE3_WIDTH] = 2;
        params[IndicatorParam.LINE3_STYLE] = LineStyle.SOLID;
        params[IndicatorParam.LINE4_WIDTH] = 2;
        params[IndicatorParam.LINE4_STYLE] = LineStyle.SOLID;
        switch (indicatorNumber) {
            case SimpleMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.SimpleMovingAverage.line.strokeColor;
                break;
            case ExponentialMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ExponentialMovingAverage.line.strokeColor;
                break;
            case DoubleExponentialMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 50;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.DoubleExponentialMovingAverage.line.strokeColor;
                break;
            case TripleExponentialMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 50;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TripleExponentialMovingAverage.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.TripleExponentialMovingAverage.line_down.strokeColor;
                break;
            case HullMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 16;
                params[IndicatorParam.MA_TYPE] = Const.weightedMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.HullMovingAverage.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.HullMovingAverage.line_down.strokeColor;
                break;
            case TimeSeriesMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TimeSeriesMovingAverage.line.strokeColor;
                break;
            case VariableMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VariableMovingAverage.line.strokeColor;
                break;
            case TriangularMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TriangularMovingAverage.line.strokeColor;
                break;
            case WeightedMovingAverage:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.WeightedMovingAverage.line.strokeColor;
                break;
            case WellesWilderSmoothing:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.WellesWilderSmoothing.line.strokeColor;
                break;
            case VIDYA:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.R2_SCALE] = 0.65;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VIDYA.line.strokeColor;
                break;
            case WilliamsPctR:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.WilliamsPctR.line.strokeColor;
                break;
            case WilliamsAccumulationDistribution:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.WilliamsAccumulationDistribution.line.strokeColor;
                break;
            case AccumulationDistribution:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.AccumulationDistribution.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.AccumulationDistribution.line_down.strokeColor;
                break;
            case VolumeOscillator:
                params[IndicatorParam.SHORT_TERM] = 12;
                params[IndicatorParam.LONG_TERM] = 26;
                params[IndicatorParam.POINTS_OR_PERCENT] = IndicatorParamValue.PERCENT;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeOscillator.line.strokeColor;
                break;
            case VolumeChange:
                params[IndicatorParam.PERIODS] = 13;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeChange.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.VolumeChange.line_down.strokeColor;
                break;
            case VerticalHorizontalFilter:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 28;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VerticalHorizontalFilter.line.strokeColor;
                break;
            case UltimateOscillator:
                params[IndicatorParam.CYCLE_1] = 7;
                params[IndicatorParam.CYCLE_2] = 14;
                params[IndicatorParam.CYCLE_3] = 28;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.UltimateOscillator.line.strokeColor;
                break;
            case TrueRange:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TrueRange.line.strokeColor;
                break;
            case AverageTrueRange:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.AverageTrueRange.line.strokeColor;
                params[IndicatorParam.PERIODS] = 10;
                break;
            case TRIX:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TRIX.line.strokeColor;
                break;
            case RainbowOscillator:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.LEVELS] = 3;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.RainbowOscillator.line.strokeColor;
                break;
            case PriceOscillator:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.SHORT_CYCLE] = 12;
                params[IndicatorParam.LONG_CYCLE] = 26;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PriceOscillator.line.strokeColor;
                break;
            case ParabolicSAR:
                params[IndicatorParam.MIN_AF] = 0.02;
                params[IndicatorParam.MAX_AF] = 0.20;
                params[IndicatorParam.LINE_WIDTH] = 1;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ParabolicSAR.line.strokeColor;
                break;
            case MomentumOscillator:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MomentumOscillator.line.strokeColor;
                break;
            case MACD:
                params[IndicatorParam.SIGNAL_PERIODS] = 9;
                params[IndicatorParam.LONG_CYCLE] = 26;
                params[IndicatorParam.SHORT_CYCLE] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MACD.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.MACD.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.MACD.line3.strokeColor;
                params[IndicatorParam.LINE3_COLOR_DOWN] = theme.indicator.MACD.line3_Down.strokeColor;
                break;
            case VolumeMACD:
                params[IndicatorParam.SIGNAL_PERIODS] = 30;
                params[IndicatorParam.LONG_CYCLE] = 26;
                params[IndicatorParam.SHORT_CYCLE] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeMACD.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.VolumeMACD.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.VolumeMACD.line3.strokeColor;
                params[IndicatorParam.LINE3_COLOR_DOWN] = theme.indicator.VolumeMACD.line3_Down.strokeColor;
                break;
            case EaseOfMovement:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.EaseOfMovement.line.strokeColor;
                break;
            case BullishBarishIndicator:
                params[IndicatorParam.PERIOD1] = 3;
                params[IndicatorParam.PERIOD2] = 6;
                params[IndicatorParam.PERIOD3] = 12;
                params[IndicatorParam.PERIOD4] = 24;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.BullishBarishIndicator.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.BullishBarishIndicator.line_down.strokeColor;
                break;
            case AverageDirectionalIndex:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.AverageDirectionalIndex.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.AverageDirectionalIndex.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.AverageDirectionalIndex.line3.strokeColor;
                break;
            case FastStochastic:
                params[IndicatorParam.PCT_K_PERIODS] = 3;
                params[IndicatorParam.PCT_D_PERIODS] = 3;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.FastStochastic.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.FastStochastic.line2.strokeColor;
                break;
            case PSLandisReversal:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PSLandisReversal.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.PSLandisReversal.line_down.strokeColor;
                break;
            case DetrendedPriceOscillator:
                params[IndicatorParam.PERIODS] = 20;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.DetrendedPriceOscillator.line.strokeColor;
                break;
            case ChandeMomentumOscillator:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 9;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ChandeMomentumOscillator.line.strokeColor;
                break;
            case ChaikinVolatility:
                params[IndicatorParam.PERIODS] = 10;
                params[IndicatorParam.RATE_OF_CHANGE] = 2;
                params[IndicatorParam.MA_TYPE] = Const.exponentialMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ChaikinVolatility.line.strokeColor;
                break;
            case VolatilityRatio:
                params[IndicatorParam.PERIODS] = 26;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolatilityRatio.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.VolatilityRatio.line_down.strokeColor;
                break;
            case Aroon:
                params[IndicatorParam.PERIODS] = 25;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.Aroon.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.Aroon.line2.strokeColor;
                break;
            case AroonOscillator:
                params[IndicatorParam.PERIODS] = 25;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.AroonOscillator.line.strokeColor;
                break;
            case LinearRegressionRSquared:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 9;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LinearRegressionRSquared.line.strokeColor;
                break;
            case LinearRegressionForecast:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 9;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LinearRegressionForecast.line.strokeColor;
                break;
            case LinearRegressionSlope:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 9;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LinearRegressionSlope.line.strokeColor;
                break;
            case LinearRegressionIntercept:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 9;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LinearRegressionIntercept.line.strokeColor;
                break;
            case PriceVolumeTrend:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PriceVolumeTrend.line.strokeColor;
                break;
            case PerformanceIndex:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PerformanceIndex.line.strokeColor;
                break;
            case CommodityChannelIndex:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.CommodityChannelIndex.line.strokeColor;
                break;
            case ChaikinMoneyFlow:
                params[IndicatorParam.PERIODS] = 20;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ChaikinMoneyFlow.line.strokeColor;
                break;
            case WeightedClose:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.WeightedClose.line.strokeColor;
                break;
            case VolumeROC:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.VOLUME;
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeROC.line.strokeColor;
                break;
            case TypicalPrice:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TypicalPrice.line.strokeColor;
                break;
            case StandardDeviation:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 26;
                params[IndicatorParam.STANDARD_DEVIATIONS] = 2;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.StandardDeviation.line.strokeColor;
                break;
            case PriceROC:
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PriceROC.line.strokeColor;
                break;
            case MedianPrice:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MedianPrice.line.strokeColor;
                break;
            case HighMinusLow:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.HighMinusLow.line.strokeColor;
                break;
            case BollingerBands:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 20;
                params[IndicatorParam.STANDARD_DEVIATIONS] = 2;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_WIDTH] = 1;
                params[IndicatorParam.LINE2_WIDTH] = 2;
                params[IndicatorParam.LINE3_WIDTH] = 1;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.BollingerBands.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.BollingerBands.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.BollingerBands.line3.strokeColor;
                params[IndicatorParam.FILL_COLOR] = theme.indicator.BollingerBands.fill.fillColor;
                break;
            case FractalChaosBands:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.FractalChaosBands.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.FractalChaosBands.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.FractalChaosBands.line3.strokeColor;
                break;
            case HighLowBands:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.HighLowBands.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.HighLowBands.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.HighLowBands.line3.strokeColor;
                break;
            case MovingAverageEnvelope:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.SHIFT] = 5;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MovingAverageEnvelope.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.MovingAverageEnvelope.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.MovingAverageEnvelope.line3.strokeColor;
                break;
            case SwingIndex:
                params[IndicatorParam.LIMIT_MOVE] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.SwingIndex.line.strokeColor;
                break;
            case AccumulativeSwingIndex:
                params[IndicatorParam.LIMIT_MOVE] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.AccumulativeSwingIndex.line.strokeColor;
                break;
            case ComparativeRelativeStrength:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ComparativeRelativeStrength.line.strokeColor;
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.SOURCE2] = DataSeriesSuffix.OPEN;
                break;
            case StochasticRSI:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.StochasticRSI.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.StochasticRSI.line_down.strokeColor;
                break;
            case MassIndex:
                params[IndicatorParam.PERIODS] = 9;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MassIndex.line.strokeColor;
                break;
            case MoneyFlowIndex:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MoneyFlowIndex.line.strokeColor;
                break;
            case NegativeVolumeIndex:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.NegativeVolumeIndex.line.strokeColor;
                break;
            case OnBalanceVolume:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.OnBalanceVolume.line.strokeColor;
                break;
            case PositiveVolumeIndex:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PositiveVolumeIndex.line.strokeColor;
                break;
            case RelativeStrengthIndex:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.RelativeStrengthIndex.line.strokeColor;
                break;
            case TradeVolumeIndex:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.MIN_TICK] = 0.25;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TradeVolumeIndex.line.strokeColor;
                break;
            case StochasticOscillator:
                params[IndicatorParam.PCT_K_PERIODS] = 14;
                params[IndicatorParam.PCT_K_SMOOTHING] = 3;
                params[IndicatorParam.PCT_D_PERIODS] = 3;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.StochasticOscillator.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.StochasticOscillator.line2.strokeColor;
                break;
            case StochasticMomentumIndex:
                params[IndicatorParam.PCT_K_PERIODS] = 10;
                params[IndicatorParam.PCT_K_SMOOTHING] = 3;
                params[IndicatorParam.PCT_K_DOUBLE_SMOOTHING] = 3;
                params[IndicatorParam.PCT_D_PERIODS] = 3;
                params[IndicatorParam.MA_TYPE] = Const.exponentialMovingAverage;
                params[IndicatorParam.PCT_D_MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.StochasticMomentumIndex.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.StochasticMomentumIndex.line2.strokeColor;
                break;
            case FractalChaosOscillator:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.FractalChaosOscillator.line.strokeColor;
                break;
            case PrimeNumberOscillator:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PrimeNumberOscillator.line.strokeColor;
                break;
            case PrimeNumberBands:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PrimeNumberBands.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.PrimeNumberBands.line2.strokeColor;
                break;
            case HistoricalVolatility:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 21;
                params[IndicatorParam.BAR_HISTORY] = 252;
                params[IndicatorParam.STANDARD_DEVIATIONS] = 2;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.HistoricalVolatility.line.strokeColor;
                break;
            case MACDHistogram:
                params[IndicatorParam.SIGNAL_PERIODS] = 9;
                params[IndicatorParam.LONG_CYCLE] = 26;
                params[IndicatorParam.SHORT_CYCLE] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MACDHistogram.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.MACDHistogram.line_down.strokeColor;
                break;
            case HHV:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.HHV.line.strokeColor;
                break;
            case LLV:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LLV.line.strokeColor;
                break;
            case MaximumValue:
                params[IndicatorParam.PERIODS] = 20;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MaximumValue.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.MaximumValue.line_down.strokeColor;
                break;
            case TimeSeriesForecast:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TimeSeriesForecast.line.strokeColor;
                break;
            case ElderRay:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ElderRay.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.ElderRay.line2.strokeColor;
                break;
            case ElderForceIndex:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ElderForceIndex.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.ElderForceIndex.line2.strokeColor;
                break;
            case ElderThermometer:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ElderThermometer.line.strokeColor;
                break;
            case EhlerFisherTransform:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.EhlerFisherTransform.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.EhlerFisherTransform.line2.strokeColor;
                break;
            case KeltnerChannel:
                params[IndicatorParam.PERIODS] = 16;
                params[IndicatorParam.SHIFT] = 1.3;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.KeltnerChannel.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.KeltnerChannel.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.KeltnerChannel.line3.strokeColor;
                break;
            case MarketFacilitationIndex:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.MarketFacilitationIndex.line.strokeColor;
                break;
            case SchaffTrendCycle:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.SHORT_CYCLE] = 13;
                params[IndicatorParam.LONG_CYCLE] = 25;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.SchaffTrendCycle.line.strokeColor;
                break;
            case QStick:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.QStick.line.strokeColor;
                break;
            case STARC:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.SHIFT] = 5;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.STARC.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.STARC.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.STARC.line3.strokeColor;
                break;
            case CenterOfGravity:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.CenterOfGravity.line.strokeColor;
                break;
            case CoppockCurve:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.CoppockCurve.line.strokeColor;
                break;
            case ChandeForecastOscillator:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ChandeForecastOscillator.line.strokeColor;
                break;
            case GopalakrishnanRangeIndex:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.GopalakrishnanRangeIndex.line.strokeColor;
                break;
            case IntradayMomentumIndex:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.IntradayMomentumIndex.line.strokeColor;
                break;
            case KlingerVolumeOscillator:
                params[IndicatorParam.PERIODS] = 13;
                params[IndicatorParam.LONG_CYCLE] = 55;
                params[IndicatorParam.SHORT_CYCLE] = 34;
                params[IndicatorParam.MA_TYPE] = Const.simpleMovingAverage;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.KlingerVolumeOscillator.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.KlingerVolumeOscillator.line2.strokeColor;
                break;
            case PrettyGoodOscillator:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PrettyGoodOscillator.line.strokeColor;
                break;
            case RAVI:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.CLOSE;
                params[IndicatorParam.SHORT_CYCLE] = 9;
                params[IndicatorParam.LONG_CYCLE] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.RAVI.line.strokeColor;
                break;
            case RandomWalkIndex:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.RandomWalkIndex.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.RandomWalkIndex.line2.strokeColor;
                break;
            case DirectionalMovementAverage:
                params[IndicatorParam.SHORT_CYCLE] = 10;
                params[IndicatorParam.LONG_CYCLE] = 50;
                params[IndicatorParam.PERIODS] = 10;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.DirectionalMovementAverage.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.DirectionalMovementAverage.line_down.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.DirectionalMovementAverage.line2.strokeColor;
                params[IndicatorParam.LINE2_COLOR_DOWN] = theme.indicator.DirectionalMovementAverage.line2_down.strokeColor;
                break;
            case DirectionalDivergenceIndex:
                params[IndicatorParam.PERIOD1] = 13;
                params[IndicatorParam.PERIOD2] = 30;
                params[IndicatorParam.PERIOD3] = 10;
                params[IndicatorParam.PERIOD4] = 5;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.DirectionalDivergenceIndex.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.DirectionalDivergenceIndex.line_down.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.DirectionalDivergenceIndex.line2.strokeColor;
                params[IndicatorParam.LINE2_COLOR_DOWN] = theme.indicator.DirectionalDivergenceIndex.line2_down.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.DirectionalDivergenceIndex.line3.strokeColor;
                params[IndicatorParam.LINE3_COLOR_DOWN] = theme.indicator.DirectionalDivergenceIndex.line3_down.strokeColor;
                break;
            case DirectionalMovementIndex:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.DirectionalMovementIndex.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.DirectionalMovementIndex.line_down.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.DirectionalMovementIndex.line2.strokeColor;
                params[IndicatorParam.LINE2_COLOR_DOWN] = theme.indicator.DirectionalMovementIndex.line2_down.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.DirectionalMovementIndex.line3.strokeColor;
                params[IndicatorParam.LINE3_COLOR_DOWN] = theme.indicator.DirectionalMovementIndex.line3_down.strokeColor;
                params[IndicatorParam.LINE4_COLOR] = theme.indicator.DirectionalMovementIndex.line4.strokeColor;
                params[IndicatorParam.LINE4_COLOR_DOWN] = theme.indicator.DirectionalMovementIndex.line4_down.strokeColor;
                break;
            case TwiggsMoneyFlow:
                params[IndicatorParam.PERIODS] = 14;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.TwiggsMoneyFlow.line.strokeColor;
                break;
            case DynamicMovingAverage:
                break;
            case ZigZag:
                params[IndicatorParam.SOURCE] = DataSeriesSuffix.HIGH;
                params[IndicatorParam.SOURCE2] = DataSeriesSuffix.LOW;
                params[IndicatorParam.PERIODS] = 10;
                params[IndicatorParam.LINE_WIDTH] = 1;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ZigZag.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.ZigZag.line_down.strokeColor;
                break;
            case DonchianChannels:
                params[IndicatorParam.PERIODS] = 20;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.DonchianChannels.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.DonchianChannels.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.DonchianChannels.line3.strokeColor;
                params[IndicatorParam.FILL_COLOR] = theme.indicator.DonchianChannels.fill.fillColor;
                break;
            case ZigZagLabel:
                params[IndicatorParam.PERIODS] = 10;
                params[IndicatorParam.LINE_WIDTH] = 1;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.ZigZagLabel.line.strokeColor;
                break;
            case PsychologicalLine:
                params[IndicatorParam.PERIODS] = 12;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.PsychologicalLine.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.PsychologicalLine.line_down.strokeColor;
                break;
            case VolumeIndicator:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeIndicator.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.VolumeIndicator.line_down.strokeColor;
                break;
            case IchimokuKinkoHyo:
                params[IchimokuIndicatorParam.BASELINEPERIODS] = 26;
                params[IchimokuIndicatorParam.CONVERSIONLINEPERIODS] = 9;
                params[IchimokuIndicatorParam.LOGGINGSPAN2PERIODS] = 52;
                params[IchimokuIndicatorParam.LINES] = theme.indicator.IchimokuKinkoHyo.lines;
                break;
            case LiquidityByNetValue:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LiquidityByNetValue.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.LiquidityByNetValue.line_down.strokeColor;
                break;
            case LiquidityByNetVolume:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LiquidityByNetVolume.line.strokeColor;
                params[IndicatorParam.LINE_COLOR_DOWN] = theme.indicator.LiquidityByNetVolume.line_down.strokeColor;
                break;
            case AccumulatedLiquidityByNetValue:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.AccumulatedLiquidityByNetValue.line.strokeColor;
                break;
            case AccumulatedLiquidityByNetVolume:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.AccumulatedLiquidityByNetVolume.line.strokeColor;
                break;
            case LiquidityByVolume:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LiquidityByVolume.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.LiquidityByVolume.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.LiquidityByVolume.line3.strokeColor;
                params[IndicatorParam.LINE3_COLOR_DOWN] = theme.indicator.LiquidityByVolume.line3_down.strokeColor;
                break;
            case LiquidityByValue:
                params[IndicatorParam.LINE_COLOR] = theme.indicator.LiquidityByValue.line.strokeColor;
                params[IndicatorParam.LINE2_COLOR] = theme.indicator.LiquidityByValue.line2.strokeColor;
                params[IndicatorParam.LINE3_COLOR] = theme.indicator.LiquidityByValue.line3.strokeColor;
                params[IndicatorParam.LINE3_COLOR_DOWN] = theme.indicator.LiquidityByValue.line3_down.strokeColor;
                break;
            case VolumeProfilerVisibleRange:
                params[IndicatorParam.SHOW_VOLUME_PROFILE_BARS] = true;
                params[IndicatorParam.STROKE_ENABLED] = true;
                params[IndicatorParam.BOX_WIDTH] = 30;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeProfilerVisibleRange.line.strokeColor;
                params[IndicatorParam.UP_VOLUME] = theme.indicator.VolumeProfilerVisibleRange.up_volume.strokeColor;
                params[IndicatorParam.DOWN_VOLUME] = theme.indicator.VolumeProfilerVisibleRange.down_volume.strokeColor;
                params[IndicatorParam.UP_AREA] = theme.indicator.VolumeProfilerVisibleRange.up_area.strokeColor;
                params[IndicatorParam.DOWN_AREA] = theme.indicator.VolumeProfilerVisibleRange.down_area.strokeColor;
                params[IndicatorParam.PLACEMENT] = 'right';
                params[IndicatorParam.LINE_WIDTH] = 2;
                params[IndicatorParam.VP_ROW_SIZE] = 24;
                params[IndicatorParam.VP_VALUE_AREA_VOLUME_RATIO] = 70;
                params[IndicatorParam.VP_ROW_LAYOUT] = VolumeProfilerSettingsRowType.NUMBER_OF_ROWS;
                break;
            case VolumeProfilerSessionVolume:
                params[IndicatorParam.SHOW_VOLUME_PROFILE_BARS] = true;
                params[IndicatorParam.STROKE_ENABLED] = true;
                params[IndicatorParam.BOX_WIDTH] = 30;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeProfilerSessionVolume.line.strokeColor;
                params[IndicatorParam.BOX_FILL] = theme.indicator.VolumeProfilerSessionVolume.box_fill.fillColor;
                params[IndicatorParam.UP_VOLUME] = theme.indicator.VolumeProfilerSessionVolume.up_volume.strokeColor;
                params[IndicatorParam.DOWN_VOLUME] = theme.indicator.VolumeProfilerSessionVolume.down_volume.strokeColor;
                params[IndicatorParam.UP_AREA] = theme.indicator.VolumeProfilerSessionVolume.up_area.strokeColor;
                params[IndicatorParam.DOWN_AREA] = theme.indicator.VolumeProfilerSessionVolume.down_area.strokeColor;
                params[IndicatorParam.PLACEMENT] = 'left';
                params[IndicatorParam.LINE_WIDTH] = 2;
                params[IndicatorParam.VP_ROW_SIZE] = 24;
                params[IndicatorParam.VP_VALUE_AREA_VOLUME_RATIO] = 70;
                params[IndicatorParam.VP_ROW_LAYOUT] = VolumeProfilerSettingsRowType.NUMBER_OF_ROWS;
                break;
            case VolumeWeightedAveragePrice:
                params[IndicatorParam.VWAP_ANCHOR] = vwapIndicatorParam.SESSION;
                params[IndicatorParam.LINE_COLOR] = theme.indicator.VolumeWeightedAveragePrice.line.strokeColor;
                break;
        }
        return params;
    };
    IndicatorsDefaultSettings.getIndicatorHorizontalLine = function (themeType, indicatorNumber) {
        var horizontalLines = [];
        var theme = themeType == ThemeType.Light ? IndicatorTheme.Light : IndicatorTheme.Dark;
        switch (indicatorNumber) {
            case RelativeStrengthIndex:
                horizontalLines.push(new HorizontalLine({
                    value: 30,
                    theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.RelativeStrengthIndex.down_line.line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                horizontalLines.push(new HorizontalLine({
                    value: 70, theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.RelativeStrengthIndex.up_line.line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                break;
            case MoneyFlowIndex:
                horizontalLines.push(new HorizontalLine({
                    value: 20, theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.MoneyFlowIndex.down_line.line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                horizontalLines.push(new HorizontalLine({
                    value: 80, theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.MoneyFlowIndex.up_line.line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                break;
            case MACD:
                horizontalLines.push(new HorizontalLine({
                    value: 0, theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.MACD.line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                break;
            case CommodityChannelIndex:
                horizontalLines.push(new HorizontalLine({
                    value: -100, theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.CommodityChannelIndex.up_line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                horizontalLines.push(new HorizontalLine({
                    value: 0, theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.CommodityChannelIndex.center_line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                horizontalLines.push(new HorizontalLine({
                    value: 100, theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.CommodityChannelIndex.down_line.strokeColor,
                            lineStyle: LineStyle.SOLID
                        }
                    }
                }));
                break;
            case PSLandisReversal:
                horizontalLines.push(new HorizontalLine({
                    value: 80,
                    theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.PSLandisReversal.up_line.line.strokeColor,
                            lineStyle: LineStyle.SOLID,
                        }
                    }
                }));
                horizontalLines.push(new HorizontalLine({
                    value: 40,
                    theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.PSLandisReversal.center_line1.line.strokeColor,
                            lineStyle: LineStyle.SOLID,
                        }
                    }
                }));
                horizontalLines.push(new HorizontalLine({
                    value: 10,
                    theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.PSLandisReversal.center_line2.line.strokeColor,
                            lineStyle: LineStyle.SOLID,
                        }
                    }
                }));
                horizontalLines.push(new HorizontalLine({
                    value: 5,
                    theme: {
                        line: {
                            width: 1,
                            strokeColor: theme.horizontalLines.PSLandisReversal.down_line.line.strokeColor,
                            lineStyle: LineStyle.SOLID,
                        }
                    }
                }));
        }
        return horizontalLines;
    };
    IndicatorsDefaultSettings.savedDefaultSettings = null;
    return IndicatorsDefaultSettings;
}());
export { IndicatorsDefaultSettings };
var IndicatorTheme = {
    Dark: {
        name: 'Dark',
        indicator: {
            BollingerBands: {
                line: {
                    strokeColor: '#26a69a'
                },
                line2: {
                    strokeColor: '#8B0000'
                },
                line3: {
                    strokeColor: '#26a69a'
                },
                fill: {
                    fillColor: 'rgba(38 , 166 ,154 , 0.1)'
                }
            },
            MovingAverageEnvelope: {
                line: {
                    strokeColor: 'rgba(255,0,0,0.7)'
                },
                line2: {
                    strokeColor: '#0000FF'
                },
                line3: {
                    strokeColor: 'rgba(255,0,0,0.7)'
                }
            },
            MACDHistogram: {
                line: {
                    strokeColor: '#26a69a'
                },
                line_down: {
                    strokeColor: '#ef5350'
                },
            },
            MACD: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)',
                },
                line2: {
                    strokeColor: '#d2691e',
                },
                line3: {
                    strokeColor: '#26a69a',
                },
                line3_Down: {
                    strokeColor: '#ef5350',
                }
            },
            VolumeMACD: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)',
                },
                line2: {
                    strokeColor: '#d2691e',
                },
                line3: {
                    strokeColor: '#26a69a',
                },
                line3_Down: {
                    strokeColor: '#ef5350',
                }
            },
            VolumeIndicator: {
                line: {
                    strokeColor: '#6ba583'
                },
                line_down: {
                    strokeColor: '#d75442'
                }
            },
            RelativeStrengthIndex: {
                line: {
                    strokeColor: '#8D38C9'
                }
            },
            MoneyFlowIndex: {
                line: {
                    strokeColor: '#b45f06'
                }
            },
            StochasticOscillator: {
                line: {
                    strokeColor: '#d2691e'
                },
                line2: {
                    strokeColor: '#42d100'
                }
            },
            IchimokuKinkoHyo: {
                lines: [
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(0, 148, 255)',
                            width: 1,
                            lineStyle: 'solid'
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: '#8B0000',
                            width: 1,
                            lineStyle: 'solid'
                        },
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(66, 209, 0,0.5)',
                            width: 1,
                            lineStyle: 'solid'
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(76, 175, 80)',
                            width: 1,
                            lineStyle: 'solid'
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: '#ef5350',
                            width: 1,
                            lineStyle: 'solid',
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            upColor: {
                                fillColor: 'rgb(76, 175,80, 0.1)'
                            },
                            downColor: {
                                fillColor: 'rgba(239,83,80,0.1)'
                            }
                        }
                    }
                ]
            },
            AccumulatedLiquidityByNetValue: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                }
            },
            AccumulatedLiquidityByNetVolume: {
                line: {
                    strokeColor: '#d55141'
                }
            },
            LiquidityByNetValue: {
                line: {
                    strokeColor: '#26a69a'
                },
                line_down: {
                    strokeColor: '#ef5350'
                }
            },
            LiquidityByNetVolume: {
                line: {
                    strokeColor: '#26a69a'
                },
                line_down: {
                    strokeColor: '#ef5350'
                }
            },
            LiquidityByValue: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#d2691e'
                },
                line3: {
                    strokeColor: '#26a69a'
                },
                line3_down: {
                    strokeColor: '#ef5350'
                }
            },
            LiquidityByVolume: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#d2691e'
                },
                line3: {
                    strokeColor: '#26a69a'
                },
                line3_down: {
                    strokeColor: '#ef5350'
                }
            },
            ZigZagLabel: {
                line: {
                    strokeColor: '#000000'
                }
            },
            DonchianChannels: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#d2691e'
                },
                line3: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                fill: {
                    fillColor: 'rgba(0, 148, 255, 0.1)'
                }
            },
            ZigZag: {
                line: {
                    strokeColor: '#6ba583'
                },
                line_down: {
                    strokeColor: '#d75442'
                }
            },
            PsychologicalLine: {
                line: {
                    strokeColor: '#969ba8'
                },
                line_down: {
                    strokeColor: '#969ba8'
                }
            },
            RAVI: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                }
            },
            RandomWalkIndex: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#42d100'
                }
            },
            DirectionalMovementAverage: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                },
                line2: {
                    strokeColor: '#d60000'
                },
                line2_down: {
                    strokeColor: '#d60000'
                }
            },
            DirectionalDivergenceIndex: {
                line: {
                    strokeColor: '#d60000'
                },
                line_down: {
                    strokeColor: '#d60000'
                },
                line2: {
                    strokeColor: '#0094ff'
                },
                line2_down: {
                    strokeColor: '#0094ff'
                },
                line3: {
                    strokeColor: '#d60000'
                },
                line3_down: {
                    strokeColor: '#d60000'
                }
            },
            DirectionalMovementIndex: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                },
                line2: {
                    strokeColor: '#d60000'
                },
                line2_down: {
                    strokeColor: '#d60000'
                },
                line3: {
                    strokeColor: '#0094ff'
                },
                line3_down: {
                    strokeColor: '#0094ff'
                },
                line4: {
                    strokeColor: '#7f0404'
                },
                line4_down: {
                    strokeColor: '#7f0404'
                }
            },
            TwiggsMoneyFlow: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            ChandeForecastOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            GopalakrishnanRangeIndex: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            IntradayMomentumIndex: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            KlingerVolumeOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            PrettyGoodOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            KeltnerChannel: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)',
                },
                line2: {
                    strokeColor: 'rgb(0, 148, 255)',
                },
                line3: {
                    strokeColor: 'rgb(0, 148, 255)',
                }
            },
            MarketFacilitationIndex: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            SchaffTrendCycle: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            QStick: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            STARC: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#42d100'
                },
                line3: {
                    strokeColor: '#8B0000'
                },
            },
            CenterOfGravity: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            CoppockCurve: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            SimpleMovingAverage: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            ExponentialMovingAverage: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            DoubleExponentialMovingAverage: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            TripleExponentialMovingAverage: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                }
            },
            HullMovingAverage: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line_down: {
                    strokeColor: 'rgb(0, 148, 255)'
                }
            },
            TimeSeriesMovingAverage: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            VariableMovingAverage: {
                line: {
                    strokeColor: '#ffa500'
                },
            },
            TriangularMovingAverage: {
                line: {
                    strokeColor: '#800080'
                },
            },
            WeightedMovingAverage: {
                line: {
                    strokeColor: '#ffa500'
                },
            },
            WellesWilderSmoothing: {
                line: {
                    strokeColor: '#800080'
                },
            },
            VIDYA: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            WilliamsPctR: {
                line: {
                    strokeColor: '#8B0000'
                },
            },
            WilliamsAccumulationDistribution: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            AccumulationDistribution: {
                line: {
                    strokeColor: '#aa2929'
                },
                line_down: {
                    strokeColor: '#aa2929'
                },
            },
            VolumeOscillator: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            VolumeChange: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#f00000'
                }
            },
            VerticalHorizontalFilter: {
                line: {
                    strokeColor: '#8B0000'
                },
            },
            UltimateOscillator: {
                line: {
                    strokeColor: '#d2691e'
                },
            },
            TrueRange: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            AverageTrueRange: {
                line: {
                    strokeColor: '#800080'
                },
            },
            TRIX: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            RainbowOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            PriceOscillator: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            ParabolicSAR: {
                line: {
                    strokeColor: '#b45f06'
                },
            },
            MomentumOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            BullishBarishIndicator: {
                line: {
                    strokeColor: 'rgba(255,0,0,0.7)'
                },
                line_down: {
                    strokeColor: 'rgba(255,0,0,0.7)'
                }
            },
            EaseOfMovement: {
                line: {
                    strokeColor: '#800080'
                },
            },
            AverageDirectionalIndex: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#42d100'
                },
                line3: {
                    strokeColor: '#8B0000'
                },
            },
            FastStochastic: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#8B0000'
                },
            },
            PSLandisReversal: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                },
            },
            DetrendedPriceOscillator: {
                line: {
                    strokeColor: '#42d100'
                }
            },
            ChandeMomentumOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                }
            },
            ChaikinVolatility: {
                line: {
                    strokeColor: 'rgb(0, 0, 255)'
                }
            },
            VolatilityRatio: {
                line: {
                    strokeColor: '#0094ff'
                },
                line_down: {
                    strokeColor: '#0094ff'
                }
            },
            Aroon: {
                line: {
                    strokeColor: 'rgb(255, 106, 0)'
                },
                line2: {
                    strokeColor: 'rgb(0, 148, 255)'
                }
            },
            AroonOscillator: {
                line: {
                    strokeColor: 'rgb(255, 0, 0)'
                },
            },
            LinearRegressionRSquared: {
                line: {
                    strokeColor: '#800080'
                },
            },
            LinearRegressionForecast: {
                line: {
                    strokeColor: '#800080'
                },
            },
            LinearRegressionSlope: {
                line: {
                    strokeColor: '#800080'
                },
            },
            LinearRegressionIntercept: {
                line: {
                    strokeColor: '#800080'
                },
            },
            PriceVolumeTrend: {
                line: {
                    strokeColor: 'rgba(255,0,0,0.7)'
                },
            },
            PerformanceIndex: {
                line: {
                    strokeColor: '#a52a2a'
                },
            },
            CommodityChannelIndex: {
                line: {
                    strokeColor: '#a52a2a'
                },
            },
            ChaikinMoneyFlow: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            WeightedClose: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            VolumeROC: {
                line: {
                    strokeColor: '#8B0000'
                },
            },
            TypicalPrice: {
                line: {
                    strokeColor: '#800080'
                },
            },
            StandardDeviation: {
                line: {
                    strokeColor: '#8B0000'
                },
            },
            PriceROC: {
                line: {
                    strokeColor: '#d2691e'
                },
            },
            MedianPrice: {
                line: {
                    strokeColor: '#d60000'
                },
            },
            HighMinusLow: {
                line: {
                    strokeColor: '#d2691e'
                },
            },
            FractalChaosBands: {
                line: {
                    strokeColor: 'rgb(255, 0, 0)'
                },
                line2: {
                    strokeColor: 'rgb(0, 128, 0)'
                },
                line3: {
                    strokeColor: '#8B0000'
                },
            },
            ElderRay: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            ElderForceIndex: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            ElderThermometer: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            EhlerFisherTransform: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            HighLowBands: {
                line: {
                    strokeColor: 'rgba(255,0,0,0.7)'
                },
                line2: {
                    strokeColor: 'rgb(0, 0, 255)'
                },
                line3: {
                    strokeColor: 'rgba(255,0,0,0.7)'
                }
            },
            SwingIndex: {
                line: {
                    strokeColor: '#800080'
                },
            },
            AccumulativeSwingIndex: {
                line: {
                    strokeColor: '#800080'
                },
            },
            ComparativeRelativeStrength: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            StochasticRSI: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
                line_down: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            MassIndex: {
                line: {
                    strokeColor: '#800080'
                },
            },
            NegativeVolumeIndex: {
                line: {
                    strokeColor: '#a52a2a'
                },
            },
            OnBalanceVolume: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            PositiveVolumeIndex: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            TradeVolumeIndex: {
                line: {
                    strokeColor: '#b45f06'
                }
            },
            StochasticMomentumIndex: {
                line: {
                    strokeColor: '#8B0000'
                },
                line2: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            FractalChaosOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            PrimeNumberOscillator: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                },
            },
            PrimeNumberBands: {
                line: {
                    strokeColor: 'rgb(255, 0, 0)'
                },
                line2: {
                    strokeColor: 'rgb(0, 128, 0)'
                },
            },
            HistoricalVolatility: {
                line: {
                    strokeColor: '#800080'
                },
            },
            HHV: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                }
            },
            LLV: {
                line: {
                    strokeColor: 'rgb(0, 148, 255)'
                }
            },
            MaximumValue: {
                line: {
                    strokeColor: '#800080'
                },
                line_down: {
                    strokeColor: '#800080'
                }
            },
            TimeSeriesForecast: {
                line: {
                    strokeColor: '#b45f06'
                }
            },
            VolumeProfilerVisibleRange: {
                line: {
                    strokeColor: '#8B0000'
                },
                up_volume: {
                    strokeColor: 'rgba(30,144,255,0.3)'
                },
                down_volume: {
                    strokeColor: ' rgba(240,190,50,0.3)'
                },
                up_area: {
                    strokeColor: 'rgba(30,144,255,0.75)'
                },
                down_area: {
                    strokeColor: ' rgba(240,190,50,0.75)'
                }
            },
            VolumeProfilerSessionVolume: {
                line: {
                    strokeColor: '#8B0000'
                },
                up_volume: {
                    strokeColor: 'rgba(30,144,255,0.3)'
                },
                down_volume: {
                    strokeColor: ' rgba(240,190,50,0.3)'
                },
                up_area: {
                    strokeColor: 'rgba(30,144,255,0.75)'
                },
                down_area: {
                    strokeColor: ' rgba(240,190,50,0.75)'
                },
                box_fill: {
                    fillColor: 'rgba(30,144,255,0.1)'
                }
            },
            VolumeWeightedAveragePrice: {
                line: {
                    strokeColor: '#800080'
                },
            },
        },
        horizontalLines: {
            MACD: {
                line: {
                    strokeColor: '#363c4e'
                }
            },
            RelativeStrengthIndex: {
                up_line: {
                    line: {
                        strokeColor: '#8B0000'
                    }
                },
                down_line: {
                    line: {
                        strokeColor: '#8B0000'
                    }
                }
            },
            MoneyFlowIndex: {
                up_line: {
                    line: {
                        strokeColor: '#cc0a0a'
                    }
                },
                down_line: {
                    line: {
                        strokeColor: '#22b215'
                    }
                }
            },
            CommodityChannelIndex: {
                up_line: {
                    strokeColor: '#cc0a0a',
                },
                center_line: {
                    strokeColor: '#22b215',
                },
                down_line: {
                    strokeColor: '#cc0a0a',
                }
            },
            PSLandisReversal: {
                up_line: {
                    line: {
                        strokeColor: '#cc0a0a'
                    }
                },
                center_line1: {
                    line: {
                        strokeColor: '#034c03'
                    }
                },
                center_line2: {
                    line: {
                        strokeColor: '#cc0a0a'
                    }
                },
                down_line: {
                    line: {
                        strokeColor: '#034c03'
                    }
                }
            }
        }
    },
    Light: {
        name: 'Light',
        indicator: {
            BollingerBands: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#0094ff'
                },
                line3: {
                    strokeColor: '#0094ff'
                },
                fill: {
                    fillColor: 'rgba(185, 226, 255, 0.35)'
                }
            },
            MovingAverageEnvelope: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
                line3: {
                    strokeColor: 'black'
                }
            },
            MACDHistogram: {
                line: {
                    strokeColor: '#000000'
                },
                line_down: {
                    strokeColor: '#d75442'
                },
            },
            MACD: {
                line: {
                    strokeColor: '#0094ff',
                },
                line2: {
                    strokeColor: '#d60000',
                },
                line3: {
                    strokeColor: '#000000',
                },
                line3_Down: {
                    strokeColor: '#d75442',
                }
            },
            VolumeMACD: {
                line: {
                    strokeColor: '#0094ff',
                },
                line2: {
                    strokeColor: '#d60000',
                },
                line3: {
                    strokeColor: '#000000',
                },
                line3_Down: {
                    strokeColor: '#d75442',
                }
            },
            VolumeIndicator: {
                line: {
                    strokeColor: '#6ba583'
                },
                line_down: {
                    strokeColor: '#d75442'
                }
            },
            RelativeStrengthIndex: {
                line: {
                    strokeColor: '#0094ff'
                }
            },
            StochasticRSI: {
                line: {
                    strokeColor: '#0094ff'
                },
                line_down: {
                    strokeColor: '#0094ff'
                }
            },
            MoneyFlowIndex: {
                line: {
                    strokeColor: '#b45f06'
                }
            },
            StochasticOscillator: {
                line: {
                    strokeColor: '#d60000'
                },
                line2: {
                    strokeColor: '#0094ff'
                }
            },
            IchimokuKinkoHyo: {
                lines: [
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(0, 148, 255)',
                            width: 2,
                            lineStyle: 'solid'
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(214, 0, 0)',
                            width: 2,
                            lineStyle: 'solid'
                        },
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(66, 209, 0)',
                            width: 2,
                            lineStyle: 'solid'
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(66, 209, 0)',
                            width: 1,
                            lineStyle: 'solid'
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            strokeColor: 'rgb(214, 0, 0)',
                            width: 1,
                            lineStyle: 'solid',
                        }
                    },
                    {
                        visible: true,
                        priceLine: false,
                        theme: {
                            upColor: {
                                fillColor: 'rgba(0, 255, 0, 0.35)'
                            },
                            downColor: {
                                fillColor: 'rgba(255, 0, 0, 0.35)'
                            }
                        }
                    }
                ]
            },
            AccumulatedLiquidityByNetValue: {
                line: {
                    strokeColor: '#0094ff'
                }
            },
            AccumulatedLiquidityByNetVolume: {
                line: {
                    strokeColor: '#d55141'
                }
            },
            LiquidityByNetValue: {
                line: {
                    strokeColor: '#000000'
                },
                line_down: {
                    strokeColor: '#d55141'
                }
            },
            LiquidityByNetVolume: {
                line: {
                    strokeColor: '#000000'
                },
                line_down: {
                    strokeColor: '#d55141'
                }
            },
            LiquidityByValue: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#d55141'
                },
                line3: {
                    strokeColor: '#000000'
                },
                line3_down: {
                    strokeColor: '#d55141'
                }
            },
            LiquidityByVolume: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#d55141'
                },
                line3: {
                    strokeColor: '#000000'
                },
                line3_down: {
                    strokeColor: '#d55141'
                }
            },
            ZigZagLabel: {
                line: {
                    strokeColor: '#000000'
                }
            },
            DonchianChannels: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
                line3: {
                    strokeColor: '#d60000'
                },
                fill: {
                    fillColor: 'rgba(66, 209, 0, 0.35)'
                }
            },
            ZigZag: {
                line: {
                    strokeColor: '#6ba583'
                },
                line_down: {
                    strokeColor: '#d75442'
                }
            },
            PsychologicalLine: {
                line: {
                    strokeColor: '#000000'
                },
                line_down: {
                    strokeColor: '#000000'
                }
            },
            RAVI: {
                line: {
                    strokeColor: '#0094ff'
                }
            },
            RandomWalkIndex: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                }
            },
            DirectionalMovementAverage: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                },
                line2: {
                    strokeColor: '#d60000'
                },
                line2_down: {
                    strokeColor: '#d60000'
                }
            },
            DirectionalDivergenceIndex: {
                line: {
                    strokeColor: '#d60000'
                },
                line_down: {
                    strokeColor: '#d60000'
                },
                line2: {
                    strokeColor: '#0094ff'
                },
                line2_down: {
                    strokeColor: '#0094ff'
                },
                line3: {
                    strokeColor: '#d60000'
                },
                line3_down: {
                    strokeColor: '#d60000'
                },
            },
            DirectionalMovementIndex: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                },
                line2: {
                    strokeColor: '#d60000'
                },
                line2_down: {
                    strokeColor: '#d60000'
                },
                line3: {
                    strokeColor: '#0094ff'
                },
                line3_down: {
                    strokeColor: '#0094ff'
                },
                line4: {
                    strokeColor: '#7f0404'
                },
                line4_down: {
                    strokeColor: '#7f0404'
                }
            },
            TwiggsMoneyFlow: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            ChandeForecastOscillator: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            GopalakrishnanRangeIndex: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            IntradayMomentumIndex: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            KlingerVolumeOscillator: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            PrettyGoodOscillator: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            KeltnerChannel: {
                line: {
                    strokeColor: '#d60000'
                },
                line2: {
                    strokeColor: '#0094ff'
                },
                line3: {
                    strokeColor: 'black',
                }
            },
            MarketFacilitationIndex: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            SchaffTrendCycle: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            QStick: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            STARC: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
                line3: {
                    strokeColor: '#d60000'
                },
            },
            CenterOfGravity: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            CoppockCurve: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            SimpleMovingAverage: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            ExponentialMovingAverage: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            DoubleExponentialMovingAverage: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            TripleExponentialMovingAverage: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                }
            },
            HullMovingAverage: {
                line: {
                    strokeColor: '#0094ff'
                },
                line_down: {
                    strokeColor: '#0094ff'
                }
            },
            TimeSeriesMovingAverage: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            VariableMovingAverage: {
                line: {
                    strokeColor: '#ffa500'
                },
            },
            TriangularMovingAverage: {
                line: {
                    strokeColor: '#800080'
                },
            },
            WeightedMovingAverage: {
                line: {
                    strokeColor: '#ffa500'
                },
            },
            WellesWilderSmoothing: {
                line: {
                    strokeColor: '#800080'
                },
            },
            VIDYA: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            WilliamsPctR: {
                line: {
                    strokeColor: '#d60000'
                },
            },
            WilliamsAccumulationDistribution: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            AccumulationDistribution: {
                line: {
                    strokeColor: '#aa2929'
                },
                line_down: {
                    strokeColor: '#aa2929'
                }
            },
            VolumeOscillator: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            VolumeChange: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#f00000'
                }
            },
            VerticalHorizontalFilter: {
                line: {
                    strokeColor: '#d60000'
                },
            },
            UltimateOscillator: {
                line: {
                    strokeColor: '#000000'
                },
            },
            TrueRange: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            AverageTrueRange: {
                line: {
                    strokeColor: '#800080'
                },
            },
            TRIX: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            RainbowOscillator: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            PriceOscillator: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            ParabolicSAR: {
                line: {
                    strokeColor: '#b45f06'
                },
            },
            MomentumOscillator: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            EaseOfMovement: {
                line: {
                    strokeColor: '#800080'
                },
            },
            BullishBarishIndicator: {
                line: {
                    strokeColor: '#d60000'
                },
                line_down: {
                    strokeColor: '#d60000'
                }
            },
            AverageDirectionalIndex: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
                line3: {
                    strokeColor: '#d60000'
                },
            },
            FastStochastic: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#d60000'
                },
            },
            PSLandisReversal: {
                line: {
                    strokeColor: '#42d100'
                },
                line_down: {
                    strokeColor: '#42d100'
                },
            },
            DetrendedPriceOscillator: {
                line: {
                    strokeColor: '#42d100'
                }
            },
            ChandeMomentumOscillator: {
                line: {
                    strokeColor: '#0094ff'
                }
            },
            ChaikinVolatility: {
                line: {
                    strokeColor: '#000000'
                }
            },
            VolatilityRatio: {
                line: {
                    strokeColor: '#0094ff'
                },
                line_down: {
                    strokeColor: '#0094ff'
                }
            },
            Aroon: {
                line: {
                    strokeColor: '#42d100'
                },
                line2: {
                    strokeColor: '#d60000'
                }
            },
            AroonOscillator: {
                line: {
                    strokeColor: '#000000'
                },
            },
            LinearRegressionRSquared: {
                line: {
                    strokeColor: '#800080'
                },
            },
            LinearRegressionForecast: {
                line: {
                    strokeColor: '#800080'
                },
            },
            LinearRegressionSlope: {
                line: {
                    strokeColor: '#800080'
                },
            },
            LinearRegressionIntercept: {
                line: {
                    strokeColor: '#800080'
                },
            },
            PriceVolumeTrend: {
                line: {
                    strokeColor: '#000000'
                },
            },
            PerformanceIndex: {
                line: {
                    strokeColor: '#a52a2a'
                },
            },
            CommodityChannelIndex: {
                line: {
                    strokeColor: '#a52a2a'
                },
            },
            ChaikinMoneyFlow: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            WeightedClose: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            VolumeROC: {
                line: {
                    strokeColor: '#d60000'
                },
            },
            TypicalPrice: {
                line: {
                    strokeColor: '#800080'
                },
            },
            StandardDeviation: {
                line: {
                    strokeColor: '#d60000'
                },
            },
            PriceROC: {
                line: {
                    strokeColor: 'black'
                },
            },
            MedianPrice: {
                line: {
                    strokeColor: '#d60000'
                },
            },
            HighMinusLow: {
                line: {
                    strokeColor: '#000000'
                },
            },
            FractalChaosBands: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
                line3: {
                    strokeColor: '#d60000'
                },
            },
            ElderRay: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            ElderForceIndex: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            ElderThermometer: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            EhlerFisherTransform: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#42d100'
                },
            },
            HighLowBands: {
                line: {
                    strokeColor: '#0094ff'
                },
                line2: {
                    strokeColor: '#d60000'
                },
                line3: {
                    strokeColor: '#0094ff'
                }
            },
            SwingIndex: {
                line: {
                    strokeColor: '#800080'
                },
            },
            AccumulativeSwingIndex: {
                line: {
                    strokeColor: '#800080'
                },
            },
            ComparativeRelativeStrength: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            MassIndex: {
                line: {
                    strokeColor: '#800080'
                },
            },
            NegativeVolumeIndex: {
                line: {
                    strokeColor: '#a52a2a'
                },
            },
            OnBalanceVolume: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            PositiveVolumeIndex: {
                line: {
                    strokeColor: '#42d100'
                },
            },
            TradeVolumeIndex: {
                line: {
                    strokeColor: '#b45f06'
                }
            },
            StochasticMomentumIndex: {
                line: {
                    strokeColor: '#d60000'
                },
                line2: {
                    strokeColor: '#0094ff'
                },
            },
            FractalChaosOscillator: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            PrimeNumberOscillator: {
                line: {
                    strokeColor: '#0094ff'
                },
            },
            PrimeNumberBands: {
                line: {
                    strokeColor: '#d60000'
                },
                line2: {
                    strokeColor: '#0094ff'
                },
            },
            HistoricalVolatility: {
                line: {
                    strokeColor: '#800080'
                },
            },
            HHV: {
                line: {
                    strokeColor: '#0094ff'
                }
            },
            LLV: {
                line: {
                    strokeColor: '#0094ff'
                }
            },
            MaximumValue: {
                line: {
                    strokeColor: '#800080'
                },
                line_down: {
                    strokeColor: '#800080'
                }
            },
            TimeSeriesForecast: {
                line: {
                    strokeColor: '#b45f06'
                }
            },
            VolumeProfilerVisibleRange: {
                line: {
                    strokeColor: '#FF0000'
                },
                up_volume: {
                    strokeColor: 'rgba(30,144,255,0.3)'
                },
                down_volume: {
                    strokeColor: ' rgba(240,190,50,0.3)'
                },
                up_area: {
                    strokeColor: 'rgba(30,144,255,0.75)'
                },
                down_area: {
                    strokeColor: ' rgba(240,190,50,0.75)'
                }
            },
            VolumeProfilerSessionVolume: {
                line: {
                    strokeColor: '#FF0000'
                },
                up_volume: {
                    strokeColor: 'rgba(30,144,255,0.3)'
                },
                down_volume: {
                    strokeColor: ' rgba(240,190,50,0.3)'
                },
                up_area: {
                    strokeColor: 'rgba(30,144,255,0.75)'
                },
                down_area: {
                    strokeColor: ' rgba(240,190,50,0.75)'
                },
                box_fill: {
                    fillColor: 'rgba(30,144,255,0.1)'
                }
            },
            VolumeWeightedAveragePrice: {
                line: {
                    strokeColor: '#800080'
                },
            },
        },
        horizontalLines: {
            MACD: {
                line: {
                    strokeColor: 'black'
                }
            },
            RelativeStrengthIndex: {
                up_line: {
                    line: {
                        strokeColor: '#cc0a0a'
                    }
                },
                down_line: {
                    line: {
                        strokeColor: '#22b215'
                    }
                }
            },
            MoneyFlowIndex: {
                up_line: {
                    line: {
                        strokeColor: '#cc0a0a'
                    }
                },
                down_line: {
                    line: {
                        strokeColor: '#22b215'
                    }
                }
            },
            CommodityChannelIndex: {
                up_line: {
                    strokeColor: '#cc0a0a',
                },
                center_line: {
                    strokeColor: '#22b215',
                },
                down_line: {
                    strokeColor: '#cc0a0a',
                }
            },
            PSLandisReversal: {
                up_line: {
                    line: {
                        strokeColor: '#cc0a0a'
                    }
                },
                center_line1: {
                    line: {
                        strokeColor: '#034c03'
                    }
                },
                center_line2: {
                    line: {
                        strokeColor: '#cc0a0a'
                    }
                },
                down_line: {
                    line: {
                        strokeColor: '#034c03'
                    }
                }
            }
        }
    }
};
//# sourceMappingURL=IndicatorsDefaultSettings.js.map