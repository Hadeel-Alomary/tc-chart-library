import {
    AccumulationDistribution,
    AccumulatedLiquidityByNetValue,
    AccumulatedLiquidityByNetVolume,
    AccumulativeSwingIndex,
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
    DirectionalDivergenceIndex,
    DirectionalMovementAverage,
    DirectionalMovementIndex,
    AverageDirectionalIndex,
    DonchianChannels,
    DoubleExponentialMovingAverage,
    DynamicMovingAverage,
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
    IchimokuKinkoHyo,
    IntradayMomentumIndex,
    KeltnerChannel,
    KlingerVolumeOscillator,
    LastIndicator,
    LinearRegressionForecast,
    LinearRegressionIntercept,
    LinearRegressionRSquared,
    LinearRegressionSlope,
    LiquidityByNetValue,
    LiquidityByNetVolume,
    LiquidityByValue,
    LiquidityByVolume,
    LLV,
    MACD,
    MACDHistogram,
    MarketFacilitationIndex,
    MassIndex,
    MedianPrice,
    MomentumOscillator,
    MoneyFlowIndex,
    MovingAverageEnvelope,
    MaximumValue,
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
    VolumeChange,
    VolumeMACD,
    VolumeIndicator,
    VolumeOscillator, VolumeProfilerSessionVolume, VolumeProfilerVisibleRange,
    VolumeROC,
    VolatilityRatio,
    WeightedClose,
    WeightedMovingAverage,
    WellesWilderSmoothing,
    WilliamsAccumulationDistribution,
    WilliamsPctR,
    ZigZag,
    ZigZagLabel,
    VolumeWeightedAveragePrice,
    FastStochastic,
    PSLandisReversal
} from '../../TASdk/TASdk';
import {IndicatorField, vwapIndicatorParam} from './IndicatorConst';

export class IndicatorHelper {

    public static indicatorToString(indicatorTypeId: number): string {
        switch (indicatorTypeId) {
            case SimpleMovingAverage:
                return "Simple Moving Average";
            case ExponentialMovingAverage:
                return "Exponential Moving Average";
            case DoubleExponentialMovingAverage:
                return "Double Exponential Moving Average";
            case  TripleExponentialMovingAverage:
                return "Triple Exponential Moving Average";
            case HullMovingAverage:
                return "Hull Moving Average";
            case TimeSeriesMovingAverage:
                return "Time Series Moving Average";
            case TriangularMovingAverage:
                return "Triangular Moving Average";
            case VariableMovingAverage:
                return "Variable Moving Average";
            case VIDYA:
                return "Volatility Index Dynamic Average";
            case WellesWilderSmoothing:
                return "Welles Wilder Smoothing";
            case WeightedMovingAverage:
                return "Weighted Moving Average";
            case WilliamsPctR:
                return "Williams %R";
            case WilliamsAccumulationDistribution:
                return "Williams Accumulation Distribution";
            case AccumulationDistribution:
                return "Accumulation Distribution";
            case VolumeOscillator:
                return "Volume Oscillator";
            case VolumeChange:
                return "Volume Change";
            case VerticalHorizontalFilter:
                return "Vertical Horizontal Filter";
            case UltimateOscillator:
                return "Ultimate Oscillator";
            case TrueRange:
                return "True Range";
            case AverageTrueRange:
                return "Average True Range";
            case TRIX:
                return "TRIX";
            case RainbowOscillator:
                return "Rainbow Oscillator";
            case PriceOscillator:
                return "Price Oscillator";
            case ParabolicSAR:
                return "Parabolic SAR";
            case MomentumOscillator:
                return "Momentum Oscillator";
            case MACD:
                return "MACD";
            case VolumeMACD:
                return "VMACD";
            case EaseOfMovement:
                return "Ease of Movement";
            case AverageDirectionalIndex:
                return "Average Directional Index";
            case FastStochastic:
                return "Fast Stochastic";
            case PSLandisReversal:
                return "PS Landis Reversal"
            case DetrendedPriceOscillator:
                return "Detrended Price Oscillator";
            case ChandeMomentumOscillator:
                return "Chande Momentum Oscillator";
            case ChaikinVolatility:
                return "Chaikin Volatility";
            case VolatilityRatio:
                return "Volatility Ratio";
            case Aroon:
                return "Aroon";
            case AroonOscillator:
                return "Aroon Oscillator";
            case LinearRegressionRSquared:
                return "Linear Regression R2";
            case LinearRegressionForecast:
                return "Linear Regression Forecast";
            case LinearRegressionSlope:
                return "Linear Regression Slope";
            case LinearRegressionIntercept:
                return "Linear Regression Intercept";
            case PriceVolumeTrend:
                return "Price Volume Trend";
            case PerformanceIndex:
                return "Performance Index";
            case CommodityChannelIndex:
                return "Commodity Channel Index";
            case ChaikinMoneyFlow:
                return "Chaikin Money Flow";
            case WeightedClose:
                return "Weighted Close";
            case VolumeROC:
                return "Volume Rate of Change";
            case TypicalPrice:
                return "Typical Price";
            case StandardDeviation:
                return "Standard Deviation";
            case PriceROC:
                return "Price Rate of Change";
            case MedianPrice:
                return "Median Price";
            case HighMinusLow:
                return "High Minus Low";
            case BollingerBands:
                return "Bollinger Bands";
            case FractalChaosBands:
                return "Fractal Chaos Bands";
            case HighLowBands:
                return "High Low Bands";
            case MovingAverageEnvelope:
                return "Moving Average Envelope";
            case SwingIndex:
                return "Swing Index";
            case AccumulativeSwingIndex:
                return "Accumulative Swing Index";
            case ComparativeRelativeStrength:
                return "Comparative Relative Strength";
            case MassIndex:
                return "Mass Index";
            case MoneyFlowIndex:
                return "Money Flow Index";
            case NegativeVolumeIndex:
                return "Negative Volume Index";
            case OnBalanceVolume:
                return "On Balance Volume";
            case PositiveVolumeIndex:
                return "Positive Volume Index";
            case RelativeStrengthIndex:
                return "Relative Strength Index";
            case StochasticRSI:
                return "StochasticRSI";
            case TradeVolumeIndex:
                return "Trade Volume Index";
            case StochasticOscillator:
                return "Stochastic Oscillator";
            case StochasticMomentumIndex:
                return "Stochastic Momentum Index";
            case FractalChaosOscillator:
                return "Fractal Chaos Oscillator";
            case PrimeNumberOscillator:
                return "Prime Number Oscillator";
            case PrimeNumberBands:
                return "Prime Number Bands";
            case HistoricalVolatility:
                return "Historical Volatility";
            case MACDHistogram:
                return "MACD Histogram";
            case BullishBarishIndicator:
                return "Bullish-Barish Indicator"
            case HHV:
                return "Highest High Value";
            case LLV:
                return "Lowest Low Value";
            case MaximumValue:
                return "Maximum Value"
            case TimeSeriesForecast:
                return "Time Series Forecast";
            case ElderRay:
                return "Elder Ray";
            case ElderForceIndex:
                return "Elder Force Index";
            case ElderThermometer:
                return "Elder Thermometer";
            case EhlerFisherTransform:
                return "Ehler Fisher Transform";
            case KeltnerChannel:
                return "Keltner Channel";
            case MarketFacilitationIndex:
                return "Market Facilitation Index";
            case SchaffTrendCycle:
                return "Schaff Trend Cycle";
            case QStick:
                return "QStick";
            case STARC:
                return "Stoller Average Range Channel";
            case CenterOfGravity:
                return "Center Of Gravity";
            case CoppockCurve:
                return "Coppock Curve";
            case ChandeForecastOscillator:
                return "Chande Forecast Oscillator";
            case GopalakrishnanRangeIndex:
                return "Gopalakrishnan Range Index";
            case IntradayMomentumIndex:
                return "Intraday Momentum Index";
            case KlingerVolumeOscillator:
                return "Klinger Volume Oscillator";
            case PrettyGoodOscillator:
                return "Pretty Good Oscillator";
            case RAVI:
                return "RAVI";
            case RandomWalkIndex:
                return "Random Walk Index";
            case DirectionalMovementAverage:
                return "Directional Movement Average";
            case DirectionalMovementIndex:
                return "Directional Movement Index";
            case DirectionalDivergenceIndex:
                return "Directional Divergence Index";
            case TwiggsMoneyFlow:
                return "Twiggs Money Flow";
            case IchimokuKinkoHyo:
                return "Ichimoku Kinko Hyo";
            case DynamicMovingAverage:
                return "Dynamic Moving Average";
            case ZigZag:
                return "Zig Zag";
            case DonchianChannels:
                return "Donchian Channels";
            case ZigZagLabel:
                return "Zig Zag Label";
            case PsychologicalLine:
                return "Psychological Line";
            case LiquidityByNetValue:
                return "Liquidity By Net Value";
            case LiquidityByNetVolume:
                return "Liquidity By Net Volume";
            case AccumulatedLiquidityByNetValue:
                return "Acc. Liquidity By Net Value";
            case AccumulatedLiquidityByNetVolume:
                return "Acc. Liquidity By Net Volume";
            case LiquidityByValue:
                return "Liquidity By Value";
            case LiquidityByVolume:
                return "Liquidity By Volume";
            case VolumeIndicator:
                return "Volume";
            case VolumeProfilerSessionVolume:
                return "VPSV";
            case VolumeProfilerVisibleRange:
                return "VPVR";
            case VolumeWeightedAveragePrice:
                return "Volume Weighted Average Price";
            case Unknown:
                return "";
        }
    }

    public static isExistedIndicator(indicatorTypeId: number): boolean {
        switch (indicatorTypeId) {
            case SimpleMovingAverage:
            case ExponentialMovingAverage:
            case DoubleExponentialMovingAverage:
            case TripleExponentialMovingAverage:
            case HullMovingAverage:
            case TimeSeriesMovingAverage:
            case TriangularMovingAverage:
            case VariableMovingAverage:
            case VIDYA:
            case WellesWilderSmoothing:
            case WeightedMovingAverage:
            case WilliamsPctR:
            case WilliamsAccumulationDistribution:
            case AccumulationDistribution:
            case VolumeOscillator:
            case VolumeChange:
            case VerticalHorizontalFilter:
            case UltimateOscillator:
            case TrueRange:
            case AverageTrueRange:
            case TRIX:
            case LastIndicator:
            case RainbowOscillator:
            case PriceOscillator:
            case ParabolicSAR:
            case MomentumOscillator:
            case MACD:
            case VolumeMACD:
            case EaseOfMovement:
            case AverageDirectionalIndex:
            case FastStochastic:
            case PSLandisReversal:
            case DetrendedPriceOscillator:
            case ChandeMomentumOscillator:
            case ChaikinVolatility:
            case VolatilityRatio:
            case Aroon:
            case AroonOscillator:
            case LinearRegressionRSquared:
            case LinearRegressionForecast:
            case LinearRegressionSlope:
            case LinearRegressionIntercept:
            case PriceVolumeTrend:
            case PerformanceIndex:
            case CommodityChannelIndex:
            case ChaikinMoneyFlow:
            case WeightedClose:
            case VolumeROC:
            case TypicalPrice:
            case StandardDeviation:
            case PriceROC:
            case MedianPrice:
            case HighMinusLow:
            case BollingerBands:
            case FractalChaosBands:
            case HighLowBands:
            case MovingAverageEnvelope:
            case SwingIndex:
            case AccumulativeSwingIndex:
            case ComparativeRelativeStrength:
            case MassIndex:
            case MoneyFlowIndex:
            case NegativeVolumeIndex:
            case OnBalanceVolume:
            case PositiveVolumeIndex:
            case RelativeStrengthIndex:
            case StochasticRSI:
            case TradeVolumeIndex:
            case StochasticOscillator:
            case StochasticMomentumIndex:
            case FractalChaosOscillator:
            case PrimeNumberOscillator:
            case PrimeNumberBands:
            case HistoricalVolatility:
            case MACDHistogram:
            case BullishBarishIndicator:
            case HHV:
            case LLV:
            case MaximumValue:
            case TimeSeriesForecast:
            case ElderRay:
            case ElderForceIndex:
            case ElderThermometer:
            case EhlerFisherTransform:
            case KeltnerChannel:
            case MarketFacilitationIndex:
            case SchaffTrendCycle:
            case QStick:
            case STARC:
            case CenterOfGravity:
            case CoppockCurve:
            case ChandeForecastOscillator:
            case GopalakrishnanRangeIndex:
            case IntradayMomentumIndex:
            case KlingerVolumeOscillator:
            case PrettyGoodOscillator:
            case RAVI:
            case RandomWalkIndex:
            case DirectionalMovementAverage:
            case DirectionalDivergenceIndex:
            case DirectionalMovementIndex:
            case TwiggsMoneyFlow:
            case IchimokuKinkoHyo:
            case DynamicMovingAverage:
            case ZigZag:
            case DonchianChannels:
            case ZigZagLabel:
            case PsychologicalLine:
            case LiquidityByNetValue:
            case LiquidityByNetVolume:
            case AccumulatedLiquidityByNetValue:
            case AccumulatedLiquidityByNetVolume:
            case LiquidityByValue:
            case LiquidityByVolume:
            case VolumeProfilerSessionVolume:
            case VolumeProfilerVisibleRange:
            case VolumeWeightedAveragePrice:
                return true;
            default:
                return false;
        }
    }

    public static getDesktopShortName(indicatorTypeId: number): string {
        switch (indicatorTypeId) {
            case SimpleMovingAverage:
                return "SMA";
            case ExponentialMovingAverage:
                return "EMA";
            case DoubleExponentialMovingAverage:
                return "DEMA";
            case TripleExponentialMovingAverage:
                return "TEMA";
            case HullMovingAverage:
                return "HullMovingAverage";
            case TimeSeriesMovingAverage:
                return "TSMA";
            case TriangularMovingAverage:
                return "TMA";
            case VariableMovingAverage:
                return "VMA";
            case VIDYA:
                return "VIDYA";
            case WellesWilderSmoothing:
                return "Welles Wilder Smoothing";
            case WeightedMovingAverage:
                return "WMA";
            case WilliamsPctR:
                return "Williams %R";
            case WilliamsAccumulationDistribution:
                return "Williams Accumulation Distribution";
            case AccumulationDistribution:
                return "AD";
            case VolumeOscillator:
                return "Volume Oscillator";
            case VolumeChange:
                return "Volume Change";
            case VerticalHorizontalFilter:
                return "Vertical Horizontal Filter";
            case UltimateOscillator:
                return "Ultimate Oscillator";
            case TrueRange:
                return "True Range";
            case AverageTrueRange:
                return "ATR";
            case TRIX:
                return "TRIX";
            case RainbowOscillator:
                return "Rainbow Oscillator";
            case PriceOscillator:
                return "Price Oscillator";
            case ParabolicSAR:
                return "PSAR";
            case MomentumOscillator:
                return "Momentum Oscillator";
            case MACD:
                return "MACD";
            case VolumeMACD:
                return "VMACD";
            case EaseOfMovement:
                return "Ease of Movement";
            case AverageDirectionalIndex:
                return "Average Directional Index";
            case FastStochastic:
                return "Fast Stochastic";
            case PSLandisReversal:
                return "PSLNRV";
            case DetrendedPriceOscillator:
                return "Detrended Price Oscillator";
            case ChandeMomentumOscillator:
                return "Chande Momentum Oscillator";
            case ChaikinVolatility:
                return "Chaikin Volatility";
            case VolatilityRatio:
                return "VR";
            case Aroon:
                return "Aroon";
            case AroonOscillator:
                return "Aroon Oscillator";
            case LinearRegressionRSquared:
                return "Linear Regression R2";
            case LinearRegressionForecast:
                return "Linear Regression Forecast";
            case LinearRegressionSlope:
                return "Linear Regression Slope";
            case LinearRegressionIntercept:
                return "Linear Regression Intercept";
            case PriceVolumeTrend:
                return "Price Volume Trend";
            case PerformanceIndex:
                return "Performance Index";
            case CommodityChannelIndex:
                return "Commodity Channel Index";
            case ChaikinMoneyFlow:
                return "Chaikin Money Flow";
            case WeightedClose:
                return "Weighted Close";
            case VolumeROC:
                return "Volume ROC";
            case TypicalPrice:
                return "Typical Price";
            case StandardDeviation:
                return "Standard Deviation";
            case PriceROC:
                return "Price ROC";
            case MedianPrice:
                return "Median Price";
            case HighMinusLow:
                return "High Minus Low";
            case BollingerBands:
                return "Bollinger";
            case FractalChaosBands:
                return "Fractal Chaos Bands";
            case HighLowBands:
                return "High Low Bands";
            case MovingAverageEnvelope:
                return "MA Env";
            case SwingIndex:
                return "Swing Index";
            case AccumulativeSwingIndex:
                return "Accumulative Swing Index";
            case ComparativeRelativeStrength:
                return "Comparative Relative Strength";
            case MassIndex:
                return "Mass Index";
            case MoneyFlowIndex:
                return "Money Flow Index";
            case NegativeVolumeIndex:
                return "Negative Volume Index";
            case OnBalanceVolume:
                return "On Balance Volume";
            case PositiveVolumeIndex:
                return "Positive Volume Index";
            case RelativeStrengthIndex:
                return "RSI";
            case StochasticRSI:
                return "StochasticRSI";
            case TradeVolumeIndex:
                return "Trade Volume Index";
            case StochasticOscillator:
                return "Stochastic Oscillator";
            case StochasticMomentumIndex:
                return "Stochastic Momentum Index";
            case FractalChaosOscillator:
                return "Fractal Chaos Oscillator";
            case PrimeNumberOscillator:
                return "Prime Number Oscillator";
            case PrimeNumberBands:
                return "Prime Number Bands";
            case HistoricalVolatility:
                return "Historical Volatility";
            case MACDHistogram:
                return "MACD Histogram";
            case BullishBarishIndicator:
                return "BBI";
            case HHV:
                return "Highest High Value";
            case LLV:
                return "Lowest Low Value";
            case MaximumValue:
                return "MAXV";
            case TimeSeriesForecast:
                return "TSF";
            case ElderRay:
                return "Elder Ray";
            case ElderForceIndex:
                return "Elder Force Index";
            case ElderThermometer:
                return "Elder Thermometer";
            case EhlerFisherTransform:
                return "Ehler Fisher Transform";
            case KeltnerChannel:
                return "Keltner Channel";
            case MarketFacilitationIndex:
                return "Market Facilitation Index";
            case SchaffTrendCycle:
                return "Schaff Trend Cycle";
            case QStick:
                return "QStick";
            case STARC:
                return "STARC";
            case CenterOfGravity:
                return "Center Of Gravity";
            case CoppockCurve:
                return "Coppock Curve";
            case ChandeForecastOscillator:
                return "Chande Forecast Oscillator";
            case GopalakrishnanRangeIndex:
                return "Gopalakrishnan Range Index";
            case IntradayMomentumIndex:
                return "Intraday Momentum Index";
            case KlingerVolumeOscillator:
                return "Klinger Volume Oscillator";
            case PrettyGoodOscillator:
                return "Pretty Good Oscillator";
            case RAVI:
                return "RAVI";
            case RandomWalkIndex:
                return "Random Walk Index";
            case DirectionalMovementAverage:
                return "DMA";
            case DirectionalMovementIndex:
                return "DMI";
            case DirectionalDivergenceIndex:
                return "DDI";
            case TwiggsMoneyFlow:
                return "Twiggs Money Flow";
            case VolumeIndicator:
                return "Volume";
            case ZigZag:
                return "Zig Zag";
            case DonchianChannels:
                return "Donchian Channels";
            case ZigZagLabel:
                return "Zig Zag Label";
            case PsychologicalLine:
                return "PSY";
            case IchimokuKinkoHyo:
                return "Ichimoku Kinko Hyo";
            case LiquidityByNetValue:
                return "Liquidity Net Value";
            case LiquidityByNetVolume:
                return "Liquidity Net Volume";
            case AccumulatedLiquidityByNetValue:
                return "Accumulated Net Value";
            case AccumulatedLiquidityByNetVolume:
                return "Accumulated Net Volume";
            case LiquidityByValue:
                return "Liquidity By Value";
            case LiquidityByVolume:
                return "Liquidity By Volume";
            case VolumeProfilerSessionVolume:
                return "VPSV";
            case VolumeProfilerVisibleRange:
                return "VPVR";
            case VolumeWeightedAveragePrice:
                return "VWAP";
            default:
                return "";
        }
    }

    public static getMobileShortName(indicatorTypeId: number):string{
        switch (indicatorTypeId) {
            case SimpleMovingAverage:
                return "SMA";
            case ExponentialMovingAverage:
                return "EMA";
            case DoubleExponentialMovingAverage:
                return "DEMA";
            case TripleExponentialMovingAverage:
                return "TEMA";
            case HullMovingAverage:
                return "HullMovingAverage";
            case TimeSeriesMovingAverage:
                return "TSMA";
            case TriangularMovingAverage:
                return "TMA";
            case VariableMovingAverage:
                return "VMA";
            case VIDYA:
                return "VIDYA";
            case WellesWilderSmoothing:
                return "WWS";
            case WeightedMovingAverage:
                return "WMA";
            case WilliamsPctR:
                return "W %R";
            case WilliamsAccumulationDistribution:
                return "WAD";
            case AccumulationDistribution:
                return "AD";
            case VolumeOscillator:
                return "VO";
            case VolumeChange:
                return "VC";
            case VerticalHorizontalFilter:
                return "VHF";
            case UltimateOscillator:
                return "UO";
            case TrueRange:
                return "TR";
            case AverageTrueRange:
                return "ATR";
            case TRIX:
                return "TRIX";
            case RainbowOscillator:
                return "RO";
            case PriceOscillator:
                return "PO";
            case ParabolicSAR:
                return "PSAR";
            case MomentumOscillator:
                return "MO";
            case MACD:
                return "MACD";
            case VolumeMACD:
                return "VMACD";
            case EaseOfMovement:
                return "EOM";
            case AverageDirectionalIndex:
                return "ADX";
            case FastStochastic:
                return "FastSTO";
            case PSLandisReversal:
                return "PSLNRV";
            case DetrendedPriceOscillator:
                return "DPO";
            case ChandeMomentumOscillator:
                return "CMO";
            case ChaikinVolatility:
                return "CV";
            case VolatilityRatio:
                return "VR";
            case Aroon:
                return "Aroon";
            case AroonOscillator:
                return "AO";
            case LinearRegressionRSquared:
                return "LRR2";
            case LinearRegressionForecast:
                return "LRF";
            case LinearRegressionSlope:
                return "LRS";
            case LinearRegressionIntercept:
                return "LRI";
            case PriceVolumeTrend:
                return "PVT";
            case PerformanceIndex:
                return "PI";
            case CommodityChannelIndex:
                return "CCI";
            case ChaikinMoneyFlow:
                return "CMF";
            case WeightedClose:
                return "WC";
            case VolumeROC:
                return "VROC";
            case TypicalPrice:
                return "TP";
            case StandardDeviation:
                return "SD";
            case PriceROC:
                return "PROC";
            case MedianPrice:
                return "MP";
            case HighMinusLow:
                return "HML";
            case BollingerBands:
                return "Bollinger";
            case FractalChaosBands:
                return "FCB";
            case HighLowBands:
                return "HLB";
            case MovingAverageEnvelope:
                return "MAE";
            case SwingIndex:
                return "SI";
            case AccumulativeSwingIndex:
                return "ASI";
            case ComparativeRelativeStrength:
                return "CRS";
            case MassIndex:
                return "MI";
            case MoneyFlowIndex:
                return "MFI";
            case NegativeVolumeIndex:
                return "NVI";
            case OnBalanceVolume:
                return "OBV";
            case PositiveVolumeIndex:
                return "PVI";
            case RelativeStrengthIndex:
                return "RSI";
            case StochasticRSI:
                return "SRSI";
            case TradeVolumeIndex:
                return "TVI";
            case StochasticOscillator:
                return "SO";
            case StochasticMomentumIndex:
                return "SMI";
            case FractalChaosOscillator:
                return "FCO";
            case PrimeNumberOscillator:
                return "PNO";
            case PrimeNumberBands:
                return "PNB";
            case HistoricalVolatility:
                return "HV";
            case MACDHistogram:
                return "MACDH";
            case BullishBarishIndicator:
                return "BBI";
            case HHV:
                return "HHV";
            case LLV:
                return "LLV";
            case MaximumValue:
                return "MAXV";
            case TimeSeriesForecast:
                return "TSF";
            case ElderRay:
                return "ER";
            case ElderForceIndex:
                return "EFI";
            case ElderThermometer:
                return "ET";
            case EhlerFisherTransform:
                return "EFT";
            case KeltnerChannel:
                return "KC";
            case MarketFacilitationIndex:
                return "MFI";
            case SchaffTrendCycle:
                return "STC";
            case QStick:
                return "QStick";
            case STARC:
                return "STARC";
            case CenterOfGravity:
                return "COG";
            case CoppockCurve:
                return "CC";
            case ChandeForecastOscillator:
                return "CFO";
            case GopalakrishnanRangeIndex:
                return "GRI";
            case IntradayMomentumIndex:
                return "IMI";
            case KlingerVolumeOscillator:
                return "KVO";
            case PrettyGoodOscillator:
                return "PGO";
            case RAVI:
                return "RAVI";
            case RandomWalkIndex:
                return "RWI";
            case DirectionalMovementAverage:
                return "DMA";
            case DirectionalMovementIndex:
                return "DMI";
            case DirectionalDivergenceIndex:
                return "DDI";
            case TwiggsMoneyFlow:
                return "TMF";
            case VolumeIndicator:
                return "Volume";
            case ZigZag:
                return "ZZ";
            case DonchianChannels:
                return "DC";
            case ZigZagLabel:
                return "ZZL";
            case PsychologicalLine:
                return "PSY";
            case IchimokuKinkoHyo:
                return "Ichimoku";
            case LiquidityByNetValue:
                return "Liq. Net Value";
            case LiquidityByNetVolume:
                return "Liq. Net Volume";
            case AccumulatedLiquidityByNetValue:
                return "Acc. Net Value";
            case AccumulatedLiquidityByNetVolume:
                return "Acc. Net Volume";
            case LiquidityByValue:
                return "Liq. Value";
            case LiquidityByVolume:
                return "Liq. Volume";
            case VolumeProfilerSessionVolume:
                return "VPSV";
            case VolumeProfilerVisibleRange:
                return "VPVR";
            case VolumeWeightedAveragePrice:
                return "VWAP";
            default:
                return "";
        }

    }

    public static getPlotName(fieldName: string): string {
        switch (fieldName) {
            case IndicatorField.INDICATOR_HIGH:
            case IndicatorField.FRACTAL_HIGH:
                return "High";
            case IndicatorField.INDICATOR_LOW:
            case IndicatorField.FRACTAL_LOW:
                return "Low";
            case IndicatorField.INDICATOR_SIGNAL:
            case IndicatorField.INDICATORSIGNAL:
                return "Signal";
            case IndicatorField.INDICATOR_HISTOGRAM:
                return "Histogram";
            case IndicatorField.INDICATOR_MACDH:
                return "MACDH";
            case IndicatorField.INDICATOR_DEA:
                return "DEA";
            case IndicatorField.BOLLINGER_BAND_TOP:
            case IndicatorField.ENVELOPE_TOP:
            case IndicatorField.HIGH_LOW_BANDS_TOP:
            case IndicatorField.PRIME_BANDS_TOP:
            case IndicatorField.KELTNER_CHANNEL_TOP:
            case IndicatorField.STARC_CHANNEL_TOP:
            case IndicatorField.DONCHIAN_CHANNEL_TOP:
                return "Top";
            case IndicatorField.BOLLINGER_BAND_MEDIAN:
            case IndicatorField.ENVELOPE_MEDIAN:
            case IndicatorField.HIGH_LOW_BANDS_MEDIAN:
            case IndicatorField.KELTNER_CHANNEL_MEDIAN:
            case IndicatorField.STARC_CHANNEL_MEDIAN:
            case IndicatorField.DONCHIAN_CHANNEL_MEDIAN:
                return "Median";
            case IndicatorField.BOLLINGER_BAND_BOTTOM:
            case IndicatorField.ENVELOPE_BOTTOM:
            case IndicatorField.HIGH_LOW_BANDS_BOTTOM:
            case IndicatorField.PRIME_BANDS_BOTTOM:
            case IndicatorField.KELTNER_CHANNEL_BOTTOM:
            case IndicatorField.STARC_CHANNEL_BOTTOM:
            case IndicatorField.DONCHIAN_CHANNEL_BOTTOM:
                return "Bottom";
            case IndicatorField.PCT_D:
            case IndicatorField.PCT_K:
            case IndicatorField.ADX:
            case IndicatorField.DI_PLUS:
            case IndicatorField.DI_MINUS:
            case IndicatorField.DIRECTIONAL_DIVERGENCE_INDEX_DDI:
            case IndicatorField.DIRECTIONAL_DIVERGENCE_INDEX_ADDI:
            case IndicatorField.DIRECTIONAL_DIVERGENCE_INDEX_AD:
            case IndicatorField.Directional_Movement_Average_DDD:
            case IndicatorField.Directional_Movement_Average_AMA:
            case IndicatorField.DIRECTIONAL_MOVEMENT_INDEX_PDI:
            case IndicatorField.DIRECTIONAL_MOVEMENT_INDEX_MDI:
            case IndicatorField.DIRECTIONAL_MOVEMENT_INDEX_ADXR:
                return fieldName;
            case IndicatorField.AROON_UP:
                return "Up";
            case IndicatorField.AROON_DOWN:
                return "Down";
            case IndicatorField.BULL_POWER:
                return "Bull Power";
            case IndicatorField.BEAR_POWER:
                return "Bear Power";
            case IndicatorField.TRIGGER:
                return "Trigger";
            case IndicatorField.VOLUME:
                return "Volume";
            case IndicatorField.INDICATOR_FILL:
                return "Fill";
            case IndicatorField.ICHIMOKU_TENKAN_SEN:
                return "Tenkan Sen";
            case IndicatorField.ICHIMOKU_KIJUN_SEN:
                return "Kijun Sen";
            case IndicatorField.ICHIMOKU_CHIKOU_SPAN:
                return "Chikou Span";
            case IndicatorField.ICHIMOKU_SENKOU_SPAN_A:
                return "Senkou Span A";
            case IndicatorField.ICHIMOKU_SENKOU_SPAN_B:
                return "Senkou Span B";
            case IndicatorField.ICHIMOKU_KUMO:
                return "Kumo";
            case IndicatorField.LIQUIDITY_INFLOW_VALUE:
                return "Inflow Value";
            case IndicatorField.LIQUIDITY_OUTFLOW_VALUE:
                return "Outflow Value";
            case IndicatorField.LIQUIDITY_NET_VALUE:
                return "Net Value";
            case IndicatorField.LIQUIDITY_INFLOW_VOLUME:
                return "Inflow Volume";
            case IndicatorField.LIQUIDITY_OUTFLOW_VOLUME:
                return "Outflow Volume";
            case IndicatorField.LIQUIDITY_NET_VOLUME:
                return "Net Volume";
            case IndicatorField.PS_LANDIS_REVERSAL:
                return "LanRevl";
            default:
                return "";
        }
    }

    public static isLiquidityIndicator(indicator: number) {
        return [LiquidityByNetValue, LiquidityByNetVolume, AccumulatedLiquidityByNetValue,
            AccumulatedLiquidityByNetVolume, LiquidityByValue, LiquidityByVolume].indexOf(indicator) > -1
    }

    public static allIndicators(): number[] {
        return this.bands().concat(
            this.general(),
            this.indices(),
            this.regressions(),
            this.movingAverages(),
            this.oscillators());
    }

    public static bands(): number[] {
        return [
            IchimokuKinkoHyo,
            BollingerBands,
            MovingAverageEnvelope,
            HighLowBands,
            FractalChaosBands,
            PrimeNumberBands,
            KeltnerChannel,
            STARC
        ];
    }

    public static general(): number[] {
        return [
            HighMinusLow,
            MedianPrice,
            TypicalPrice,
            WeightedClose,
            VolumeROC,
            PriceROC,
            StandardDeviation,
            HHV,
            LLV,
            MaximumValue,
            VolumeIndicator,
            VolumeProfilerSessionVolume,
            VolumeProfilerVisibleRange,
            VolumeWeightedAveragePrice
        ];
    }

    public static indices(): number[] {
        return [
            MoneyFlowIndex,
            TradeVolumeIndex,
            SwingIndex,
            AccumulativeSwingIndex,
            RelativeStrengthIndex,
            ComparativeRelativeStrength,
            PriceVolumeTrend,
            PositiveVolumeIndex,
            NegativeVolumeIndex,
            PerformanceIndex,
            OnBalanceVolume,
            MassIndex,
            ChaikinMoneyFlow,
            CommodityChannelIndex,
            StochasticMomentumIndex,
            StochasticRSI,
            HistoricalVolatility,
            ElderForceIndex,
            ElderThermometer,
            MarketFacilitationIndex,
            QStick,
            GopalakrishnanRangeIndex,
            IntradayMomentumIndex,
            RAVI,
            RandomWalkIndex,
            DirectionalMovementAverage,
            DirectionalDivergenceIndex,
            DirectionalMovementIndex,
            TwiggsMoneyFlow
        ];
    }

    public static regressions(): number[] {
        return [
            LinearRegressionRSquared,
            LinearRegressionForecast,
            LinearRegressionSlope,
            LinearRegressionIntercept,
            TimeSeriesForecast
        ];
    }

    public static movingAverages(): number[] {
        return [
            SimpleMovingAverage,
            ExponentialMovingAverage,
            DoubleExponentialMovingAverage,
            TripleExponentialMovingAverage,
            HullMovingAverage,
            TimeSeriesMovingAverage,
            VariableMovingAverage,
            TriangularMovingAverage,
            WeightedMovingAverage,
            VIDYA,
            WellesWilderSmoothing
        ];
    }

    public static oscillators(): number[] {
        return [
            ChandeMomentumOscillator,
            MomentumOscillator,
            TRIX,
            UltimateOscillator,
            VerticalHorizontalFilter,
            WilliamsPctR,
            WilliamsAccumulationDistribution,
            AccumulationDistribution,
            VolumeOscillator,
            VolumeChange,
            ChaikinVolatility,
            VolatilityRatio,
            StochasticOscillator,
            PriceOscillator,
            MACD,
            MACDHistogram,
            VolumeMACD,
            BullishBarishIndicator,
            EaseOfMovement,
            DetrendedPriceOscillator,
            ParabolicSAR,
            AverageDirectionalIndex,
            FastStochastic,
            PSLandisReversal,
            TrueRange,
            AverageTrueRange,
            Aroon,
            AroonOscillator,
            RainbowOscillator,
            FractalChaosOscillator,
            PrimeNumberOscillator,
            ElderRay,
            EhlerFisherTransform,
            SchaffTrendCycle,
            CenterOfGravity,
            CoppockCurve,
            ChandeForecastOscillator,
            KlingerVolumeOscillator,
            PrettyGoodOscillator,
            PsychologicalLine
        ];
    }

    public static getMaTypeString(maType: number): string {
        switch (maType) {
            case Const.simpleMovingAverage:
                return "Simple";
            case Const.exponentialMovingAverage:
                return "Exponential";
            case Const.doubleExponentialMovingAverage:
                return "Double Exponential";
            case Const.triangularMovingAverage:
                return "Triangular";
            case Const.timeSeriesMovingAverage:
                return "Time Series";
            case Const.variableMovingAverage:
                return "Variable";
            case Const.VIDYA:
                return "VIDYA";
            case Const.wellesWilderSmoothing:
                return "Welles Wilder";
            case Const.weightedMovingAverage:
                return "Weighted";
            default:
                return "";
        }
    }

    public static getVwapTypeString(vwapType: number): string {
        switch (vwapType) {
            case vwapIndicatorParam.SESSION:
                return "Session";
            case vwapIndicatorParam.WEEK:
                return "Week";
            case vwapIndicatorParam.MONTH:
                return "Month";
            case vwapIndicatorParam.YEAR:
                return "Year";
            case vwapIndicatorParam.DECADE:
                return "Decade";
            default:
                return "";
        }
    }

    public static isAlertable(indicatorTypeId: number): boolean {
        switch (indicatorTypeId) {
            case BollingerBands:
            case MovingAverageEnvelope:
            case KeltnerChannel:
            case PriceROC:
            case StandardDeviation:
            case MoneyFlowIndex:
            case RelativeStrengthIndex:
            case OnBalanceVolume:
            case MassIndex:
            case ChaikinMoneyFlow:
            case CommodityChannelIndex:
            case IntradayMomentumIndex:
            case SimpleMovingAverage:
            case ExponentialMovingAverage:
            case DoubleExponentialMovingAverage:
            case TripleExponentialMovingAverage:
            case HullMovingAverage:
            case WeightedMovingAverage:
            case MomentumOscillator:
            case TRIX:
            case WilliamsPctR:
            case StochasticOscillator:
            case PriceOscillator:
            case MACD:
            case EaseOfMovement:
            case DetrendedPriceOscillator:
            case ParabolicSAR:
            case AverageTrueRange:
            case Aroon:
            case AroonOscillator:
            case VolumeIndicator:
            case DonchianChannels:
            case IchimokuKinkoHyo:
                return true;
            default:
                return false;
        }
    }

    public static getServerIndicatorFields(indicatorTypeId: number): string[] {
        switch (indicatorTypeId) {
            case Unknown:
                return ['CLOSE'];
            case BollingerBands: {
                return ['BBU', 'BBM', 'BBL']
            }
            case MovingAverageEnvelope: {
                return ['ENVU', 'ENVL'];
            }
            case KeltnerChannel: {
                return ['KELTNERU', 'KELTNERM', 'KELTNERL'];
            }
            case HighMinusLow:
                return ['HML'];
            case MedianPrice:
                return ['MPRICE'];
            case TypicalPrice:
                return ['TPRICE'];
            case PriceROC:
                return ['ROC'];
            case StandardDeviation: {
                return ['STD'];
            }
            case MoneyFlowIndex:
                return ['MFI'];
            case RelativeStrengthIndex:
                return ['RSI'];
            case OnBalanceVolume:
                return ['OBV'];
            case MassIndex:
                return ['MASS'];
            case ChaikinMoneyFlow:
                return ['CMF'];
            case CommodityChannelIndex:
                return ['CCI'];
            case IntradayMomentumIndex:
                return ['IMI'];
            case SimpleMovingAverage:
                return ['MA'];
            case ExponentialMovingAverage:
                return ['EMA'];
            case DoubleExponentialMovingAverage:
                return ['DEMA'];
            case TripleExponentialMovingAverage:
                return ['TEMA'];
            case HullMovingAverage:
                return ['HMA'];
            case WeightedMovingAverage:
                return ['WEIGHTEDMA'];
            case MomentumOscillator:
                return ['MOMENTUM'];
            case TRIX:
                return ['TRIX'];
            case WilliamsPctR:
                return ['WR'];
            case StochasticOscillator:
                return ['SLOWSTOD', 'SLOWSTOK'];
            case PriceOscillator:
                return ['PPO'];
            case MACD:
                return ['MACD', 'MACDSIGNAL', 'MACDH'];
            case EaseOfMovement:
                return ['EOM'];
            case DetrendedPriceOscillator:
                return ['DPO'];
            case ParabolicSAR:
                return ['SAR'];
            case TrueRange:
                return ['TR'];
            case AverageTrueRange:
                return ['ATR'];
            case Aroon:
                return ['AROONUP', 'AROONDOWN'];
            case AroonOscillator:
                return ['AROONOSC'];
            case VolumeIndicator:
                return ['VOLUME'];
            case DonchianChannels:
                return ['DCHU', 'DCHM', 'DCHL'];
            case IchimokuKinkoHyo:
                return ['TENKANSEN', 'KIJUNSEN', 'SENKOUSPANA', 'SENKOUSPANB'];
            default:
                throw new Error("Unsupported indicator: " + indicatorTypeId);
        }
    }
}
