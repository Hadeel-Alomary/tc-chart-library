import {TechnicalIndicatorType} from './technical-indicator-type';
import {TechnicalIndicatorGroupType} from './technical-indicator-group-type';
import {Tc} from "../../utils";
import {IndicatorHelper} from "../../stock-chart";

const sortBy = require("lodash/sortBy");

export class TechnicalIndicator {

     static indicators:TechnicalIndicator[] = [];

    constructor(public type:TechnicalIndicatorType, public name:string, public groupType: TechnicalIndicatorGroupType) { }

    static fromType(type:TechnicalIndicatorType):TechnicalIndicator {
        let result:TechnicalIndicator = TechnicalIndicator.getTechnicalIndicators().find(indicator => indicator.type == type);
        Tc.assert(result != null, "fail to find technical indicator");
        return result;
    }

    static allIndicatorsSorted(): TechnicalIndicator[] {
        return sortBy(TechnicalIndicator.indicators, 'name');
    }

    static getGroupIndicators(groupType: TechnicalIndicatorGroupType): TechnicalIndicator[] {
        let indicators = TechnicalIndicator.indicators.filter(indicator => indicator.groupType == groupType);
        return sortBy(indicators, 'name');
    }

     static getTechnicalIndicators():TechnicalIndicator[] {
        if(!TechnicalIndicator.indicators.length) {
            TechnicalIndicator.matchTASdk();
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.DoubleExponentialMovingAverage, "Double Exponential MA - (DEMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.SimpleMovingAverage, "Simple Moving Average (MA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ExponentialMovingAverage, "Exponential Moving Average (EMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TripleExponentialMovingAverage, "Triple Exponential Moving Average (TEMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.HullMovingAverage, "Hull Moving Average (HMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TimeSeriesMovingAverage, "Time Series Moving Average (TSMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TriangularMovingAverage, "Triangular Moving Average (TMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VariableMovingAverage, "Variable Moving Average (VMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VIDYA, "Volatility Index Dynamic Average", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.WellesWilderSmoothing, "Welles Wilder Smoothing", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.WeightedMovingAverage, "Weighted Moving Average (WMA)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.WilliamsPctR, "Williams %R (WR)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.WilliamsAccumulationDistribution, "Williams Accumulation Distribution (WAD)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.AccumulationDistribution, "Accumulation Distribution (AD)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolumeOscillator, "Volume Oscillator (VOSC)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolumeChange, "Volume Change", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VerticalHorizontalFilter, "Vertical Horizontal Filter (VHF)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.UltimateOscillator, "Ultimate Oscillator (ULT)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TrueRange, "True Range (TR)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.AverageTrueRange, "Average True Range (ATR)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TRIX, "TRIX", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.RainbowOscillator, "Rainbow Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PriceOscillator, "Price Oscillator (PPO)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ParabolicSAR, "Parabolic SAR (SAR)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MomentumOscillator, "Momentum Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MACD, "MACD", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.EaseOfMovement, "Ease of Movement (EOM)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.AverageDirectionalIndex, "Average Directional Index (ADX)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.FastStochastic, "Fast Stochastic (FastSTO)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PSLandisReversal, "PS Landis Reversal (PSLR)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.DetrendedPriceOscillator, "Detrended Price Oscillator (DPO)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ChandeMomentumOscillator, "Chande Momentum Oscillator (CMO)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ChaikinVolatility, "Chaikin Volatility", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolatilityRatio, "Volatility Ratio (VR)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.Aroon, "Aroon", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.AroonOscillator, "Aroon Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LinearRegressionRSquared, "Linear Regression R2", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LinearRegressionForecast, "Linear Regression Forecast", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LinearRegressionSlope, "Linear Regression Slope", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LinearRegressionIntercept, "Linear Regression Intercept", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PriceVolumeTrend, "Price Volume Trend (PVT)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PerformanceIndex, "Performance Index (PERF)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.CommodityChannelIndex, "Commodity Channel Index (CCI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ChaikinMoneyFlow, "Chaikin Money Flow (CMF)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.WeightedClose, "Weighted Close", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolumeROC, "Volume Rate of Change (VROC)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TypicalPrice, "Typical Price", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.StandardDeviation, "Standard Deviation (STD)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PriceROC, "Price Rate of Change (ROC)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MedianPrice, "Median Price (MPrice)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.HighMinusLow, "High Minus Low (HML)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.BollingerBands, "Bollinger Bands (BB)", TechnicalIndicatorGroupType.Band));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.FractalChaosBands, "Fractal Chaos Bands", TechnicalIndicatorGroupType.Band));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.HighLowBands, "High Low Bands (HLBAND)", TechnicalIndicatorGroupType.Band));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MovingAverageEnvelope, "Moving Average Envelope (ENV)", TechnicalIndicatorGroupType.Band));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.SwingIndex, "Swing Index (SI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.AccumulativeSwingIndex, "Accumulative Swing Index (ASI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ComparativeRelativeStrength, "Comparative Relative Strength (CRS)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MassIndex, "Mass Index (MASS)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MoneyFlowIndex, "Money Flow Index (MFI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.NegativeVolumeIndex, "Negative Volume Index (NVI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.OnBalanceVolume, "On Balance Volume (OBV)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PositiveVolumeIndex, "Positive Volume Index (PVI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.RelativeStrengthIndex, "Relative Strength Index (RSI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TradeVolumeIndex, "Trade Volume Index (TVI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.StochasticOscillator, "Stochastic Oscillator (SlowSTO)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.StochasticMomentumIndex, "Stochastic Momentum Index", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.StochasticRSI, "Stochastic RSI", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.FractalChaosOscillator, "Fractal Chaos Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PrimeNumberOscillator, "Prime Number Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PrimeNumberBands, "Prime Number Bands", TechnicalIndicatorGroupType.Band));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.HistoricalVolatility, "Historical Volatility (HV)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MACDHistogram, "MACD Histogram", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolumeMACD, "Volume MACD (VMACD)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.HHV, "Highest High Value", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LLV, "Lowest Low Value", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MaximumValue, "Maximum Value (MAXV)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TimeSeriesForecast, "Time Series Forecast", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ElderRay, "Elder Ray", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ElderForceIndex, "Elder Force Index", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ElderThermometer, "Elder Thermometer", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.EhlerFisherTransform, "Ehler Fisher Transform", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.KeltnerChannel, "Keltner Channel", TechnicalIndicatorGroupType.Band));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.MarketFacilitationIndex, "Market Facilitation Index", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.SchaffTrendCycle, "Schaff Trend Cycle", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.QStick, "QStick", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.STARC, "Stoller Average Range Channel", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.CenterOfGravity, "Center Of Gravity", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.CoppockCurve, "Coppock Curve", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ChandeForecastOscillator, "Chande Forecast Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.GopalakrishnanRangeIndex, "Gopalakrishnan Range Index", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.IntradayMomentumIndex, "Intraday Momentum Index", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.KlingerVolumeOscillator, "Klinger Volume Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PrettyGoodOscillator, "Pretty Good Oscillator", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.RAVI, "RAVI", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.RandomWalkIndex, "Random Walk Index", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.TwiggsMoneyFlow, "Twiggs Money Flow", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.IchimokuKinkoHyo, "Ichimoku Kinko Hyo", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.Volume, "Volume (VOL)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ZigZag, "Zig Zag", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.DonchianChannels, "Donchian Channels", TechnicalIndicatorGroupType.Band));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.ZigZagLabel, "Zig Zag Label", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LiquidityByNetValue, "Liquidity By Net Value", TechnicalIndicatorGroupType.Liquidity));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LiquidityByNetVolume, "Liquidity By Net Volume", TechnicalIndicatorGroupType.Liquidity));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.AccumulatedLiquidityByNetValue, "Acc. Liquidity By Net Value", TechnicalIndicatorGroupType.Liquidity));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.AccumulatedLiquidityByNetVolume, "Acc. Liquidity By Net Volume", TechnicalIndicatorGroupType.Liquidity));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LiquidityByValue, "Liquidity By Value", TechnicalIndicatorGroupType.Liquidity));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.LiquidityByVolume, "Liquidity By Volume", TechnicalIndicatorGroupType.Liquidity));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolumeProfilerSessionVolume, "Volume Profiler Per Session", TechnicalIndicatorGroupType.VolumeProfiler));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolumeProfilerVisibleRange, "Volume Profiler Visible Range", TechnicalIndicatorGroupType.VolumeProfiler));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.VolumeWeightedAveragePrice, "Volume Weighted Average Price (VWAP)", TechnicalIndicatorGroupType.MovingAverage));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.PsychologicalLine, "Psychological Line (PSY)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.BullishBarishIndicator, "Bullish-Barish Indicator (BBI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.DirectionalMovementAverage, "Directional Movement Average (DMA)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.DirectionalDivergenceIndex, "Directional Divergence Index (DDI)", TechnicalIndicatorGroupType.None));
            TechnicalIndicator.indicators.push(new TechnicalIndicator(TechnicalIndicatorType.DirectionalMovementIndex, "Directional Movement Index (DMI)", TechnicalIndicatorGroupType.None));

        }
        return TechnicalIndicator.indicators;
    }

    // MA do a match between TechnicalIndicatorType and TASdk to ensure they match
    // in their definitions.
     static matchTASdk() {
        Tc.enumValues(TechnicalIndicatorType).forEach(type => {
            if(type != TechnicalIndicatorType.Volume) { // skip volume, as it doesn't exist in TASdk
                let enumName:string = TechnicalIndicatorType[type];
                Tc.assert(IndicatorHelper.isExistedIndicator(type), `fail to match ${enumName} with TASdk`);
            }
        });
    }

}
