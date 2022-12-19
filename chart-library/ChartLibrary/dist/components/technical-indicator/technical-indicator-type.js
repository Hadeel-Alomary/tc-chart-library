export var TechnicalIndicatorType;
(function (TechnicalIndicatorType) {
    TechnicalIndicatorType[TechnicalIndicatorType["SimpleMovingAverage"] = 0] = "SimpleMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["ExponentialMovingAverage"] = 1] = "ExponentialMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["TimeSeriesMovingAverage"] = 2] = "TimeSeriesMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["TriangularMovingAverage"] = 3] = "TriangularMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["VariableMovingAverage"] = 4] = "VariableMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["VIDYA"] = 5] = "VIDYA";
    TechnicalIndicatorType[TechnicalIndicatorType["WellesWilderSmoothing"] = 6] = "WellesWilderSmoothing";
    TechnicalIndicatorType[TechnicalIndicatorType["WeightedMovingAverage"] = 7] = "WeightedMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["WilliamsPctR"] = 8] = "WilliamsPctR";
    TechnicalIndicatorType[TechnicalIndicatorType["WilliamsAccumulationDistribution"] = 9] = "WilliamsAccumulationDistribution";
    TechnicalIndicatorType[TechnicalIndicatorType["VolumeOscillator"] = 10] = "VolumeOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["VerticalHorizontalFilter"] = 11] = "VerticalHorizontalFilter";
    TechnicalIndicatorType[TechnicalIndicatorType["UltimateOscillator"] = 12] = "UltimateOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["TrueRange"] = 13] = "TrueRange";
    TechnicalIndicatorType[TechnicalIndicatorType["AverageTrueRange"] = 14] = "AverageTrueRange";
    TechnicalIndicatorType[TechnicalIndicatorType["RainbowOscillator"] = 15] = "RainbowOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["PriceOscillator"] = 16] = "PriceOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["ParabolicSAR"] = 17] = "ParabolicSAR";
    TechnicalIndicatorType[TechnicalIndicatorType["MomentumOscillator"] = 18] = "MomentumOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["MACD"] = 19] = "MACD";
    TechnicalIndicatorType[TechnicalIndicatorType["EaseOfMovement"] = 20] = "EaseOfMovement";
    TechnicalIndicatorType[TechnicalIndicatorType["AverageDirectionalIndex"] = 21] = "AverageDirectionalIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["DetrendedPriceOscillator"] = 22] = "DetrendedPriceOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["ChandeMomentumOscillator"] = 23] = "ChandeMomentumOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["ChaikinVolatility"] = 24] = "ChaikinVolatility";
    TechnicalIndicatorType[TechnicalIndicatorType["Aroon"] = 25] = "Aroon";
    TechnicalIndicatorType[TechnicalIndicatorType["AroonOscillator"] = 26] = "AroonOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["LinearRegressionRSquared"] = 27] = "LinearRegressionRSquared";
    TechnicalIndicatorType[TechnicalIndicatorType["LinearRegressionForecast"] = 28] = "LinearRegressionForecast";
    TechnicalIndicatorType[TechnicalIndicatorType["LinearRegressionSlope"] = 29] = "LinearRegressionSlope";
    TechnicalIndicatorType[TechnicalIndicatorType["LinearRegressionIntercept"] = 30] = "LinearRegressionIntercept";
    TechnicalIndicatorType[TechnicalIndicatorType["PriceVolumeTrend"] = 31] = "PriceVolumeTrend";
    TechnicalIndicatorType[TechnicalIndicatorType["PerformanceIndex"] = 32] = "PerformanceIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["CommodityChannelIndex"] = 33] = "CommodityChannelIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["ChaikinMoneyFlow"] = 34] = "ChaikinMoneyFlow";
    TechnicalIndicatorType[TechnicalIndicatorType["WeightedClose"] = 35] = "WeightedClose";
    TechnicalIndicatorType[TechnicalIndicatorType["VolumeROC"] = 36] = "VolumeROC";
    TechnicalIndicatorType[TechnicalIndicatorType["TypicalPrice"] = 37] = "TypicalPrice";
    TechnicalIndicatorType[TechnicalIndicatorType["StandardDeviation"] = 38] = "StandardDeviation";
    TechnicalIndicatorType[TechnicalIndicatorType["PriceROC"] = 39] = "PriceROC";
    TechnicalIndicatorType[TechnicalIndicatorType["MedianPrice"] = 40] = "MedianPrice";
    TechnicalIndicatorType[TechnicalIndicatorType["HighMinusLow"] = 41] = "HighMinusLow";
    TechnicalIndicatorType[TechnicalIndicatorType["BollingerBands"] = 42] = "BollingerBands";
    TechnicalIndicatorType[TechnicalIndicatorType["FractalChaosBands"] = 43] = "FractalChaosBands";
    TechnicalIndicatorType[TechnicalIndicatorType["HighLowBands"] = 44] = "HighLowBands";
    TechnicalIndicatorType[TechnicalIndicatorType["MovingAverageEnvelope"] = 45] = "MovingAverageEnvelope";
    TechnicalIndicatorType[TechnicalIndicatorType["SwingIndex"] = 46] = "SwingIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["AccumulativeSwingIndex"] = 47] = "AccumulativeSwingIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["ComparativeRelativeStrength"] = 48] = "ComparativeRelativeStrength";
    TechnicalIndicatorType[TechnicalIndicatorType["MassIndex"] = 49] = "MassIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["MoneyFlowIndex"] = 50] = "MoneyFlowIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["NegativeVolumeIndex"] = 51] = "NegativeVolumeIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["OnBalanceVolume"] = 52] = "OnBalanceVolume";
    TechnicalIndicatorType[TechnicalIndicatorType["PositiveVolumeIndex"] = 53] = "PositiveVolumeIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["RelativeStrengthIndex"] = 54] = "RelativeStrengthIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["TradeVolumeIndex"] = 55] = "TradeVolumeIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["StochasticOscillator"] = 56] = "StochasticOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["StochasticMomentumIndex"] = 57] = "StochasticMomentumIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["FractalChaosOscillator"] = 58] = "FractalChaosOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["PrimeNumberOscillator"] = 59] = "PrimeNumberOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["PrimeNumberBands"] = 60] = "PrimeNumberBands";
    TechnicalIndicatorType[TechnicalIndicatorType["HistoricalVolatility"] = 61] = "HistoricalVolatility";
    TechnicalIndicatorType[TechnicalIndicatorType["MACDHistogram"] = 62] = "MACDHistogram";
    TechnicalIndicatorType[TechnicalIndicatorType["HHV"] = 63] = "HHV";
    TechnicalIndicatorType[TechnicalIndicatorType["LLV"] = 64] = "LLV";
    TechnicalIndicatorType[TechnicalIndicatorType["TimeSeriesForecast"] = 65] = "TimeSeriesForecast";
    TechnicalIndicatorType[TechnicalIndicatorType["TRIX"] = 66] = "TRIX";
    TechnicalIndicatorType[TechnicalIndicatorType["ElderRay"] = 67] = "ElderRay";
    TechnicalIndicatorType[TechnicalIndicatorType["ElderForceIndex"] = 68] = "ElderForceIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["ElderThermometer"] = 69] = "ElderThermometer";
    TechnicalIndicatorType[TechnicalIndicatorType["EhlerFisherTransform"] = 70] = "EhlerFisherTransform";
    TechnicalIndicatorType[TechnicalIndicatorType["KeltnerChannel"] = 71] = "KeltnerChannel";
    TechnicalIndicatorType[TechnicalIndicatorType["MarketFacilitationIndex"] = 72] = "MarketFacilitationIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["SchaffTrendCycle"] = 73] = "SchaffTrendCycle";
    TechnicalIndicatorType[TechnicalIndicatorType["QStick"] = 74] = "QStick";
    TechnicalIndicatorType[TechnicalIndicatorType["STARC"] = 75] = "STARC";
    TechnicalIndicatorType[TechnicalIndicatorType["CenterOfGravity"] = 76] = "CenterOfGravity";
    TechnicalIndicatorType[TechnicalIndicatorType["CoppockCurve"] = 77] = "CoppockCurve";
    TechnicalIndicatorType[TechnicalIndicatorType["ChandeForecastOscillator"] = 78] = "ChandeForecastOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["GopalakrishnanRangeIndex"] = 79] = "GopalakrishnanRangeIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["IntradayMomentumIndex"] = 80] = "IntradayMomentumIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["KlingerVolumeOscillator"] = 81] = "KlingerVolumeOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["PrettyGoodOscillator"] = 82] = "PrettyGoodOscillator";
    TechnicalIndicatorType[TechnicalIndicatorType["RAVI"] = 83] = "RAVI";
    TechnicalIndicatorType[TechnicalIndicatorType["RandomWalkIndex"] = 84] = "RandomWalkIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["TwiggsMoneyFlow"] = 85] = "TwiggsMoneyFlow";
    TechnicalIndicatorType[TechnicalIndicatorType["LastIndicator"] = 86] = "LastIndicator";
    TechnicalIndicatorType[TechnicalIndicatorType["IchimokuKinkoHyo"] = 87] = "IchimokuKinkoHyo";
    TechnicalIndicatorType[TechnicalIndicatorType["ZigZag"] = 89] = "ZigZag";
    TechnicalIndicatorType[TechnicalIndicatorType["DonchianChannels"] = 90] = "DonchianChannels";
    TechnicalIndicatorType[TechnicalIndicatorType["ZigZagLabel"] = 91] = "ZigZagLabel";
    TechnicalIndicatorType[TechnicalIndicatorType["LiquidityByNetValue"] = 92] = "LiquidityByNetValue";
    TechnicalIndicatorType[TechnicalIndicatorType["LiquidityByNetVolume"] = 93] = "LiquidityByNetVolume";
    TechnicalIndicatorType[TechnicalIndicatorType["AccumulatedLiquidityByNetValue"] = 94] = "AccumulatedLiquidityByNetValue";
    TechnicalIndicatorType[TechnicalIndicatorType["AccumulatedLiquidityByNetVolume"] = 95] = "AccumulatedLiquidityByNetVolume";
    TechnicalIndicatorType[TechnicalIndicatorType["LiquidityByValue"] = 96] = "LiquidityByValue";
    TechnicalIndicatorType[TechnicalIndicatorType["LiquidityByVolume"] = 97] = "LiquidityByVolume";
    TechnicalIndicatorType[TechnicalIndicatorType["VolumeProfilerSessionVolume"] = 98] = "VolumeProfilerSessionVolume";
    TechnicalIndicatorType[TechnicalIndicatorType["VolumeProfilerVisibleRange"] = 99] = "VolumeProfilerVisibleRange";
    TechnicalIndicatorType[TechnicalIndicatorType["VolumeWeightedAveragePrice"] = 100] = "VolumeWeightedAveragePrice";
    TechnicalIndicatorType[TechnicalIndicatorType["FastStochastic"] = 101] = "FastStochastic";
    TechnicalIndicatorType[TechnicalIndicatorType["PSLandisReversal"] = 102] = "PSLandisReversal";
    TechnicalIndicatorType[TechnicalIndicatorType["DoubleExponentialMovingAverage"] = 103] = "DoubleExponentialMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["TripleExponentialMovingAverage"] = 104] = "TripleExponentialMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["HullMovingAverage"] = 105] = "HullMovingAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["MaximumValue"] = 106] = "MaximumValue";
    TechnicalIndicatorType[TechnicalIndicatorType["PsychologicalLine"] = 107] = "PsychologicalLine";
    TechnicalIndicatorType[TechnicalIndicatorType["StochasticRSI"] = 108] = "StochasticRSI";
    TechnicalIndicatorType[TechnicalIndicatorType["VolumeChange"] = 109] = "VolumeChange";
    TechnicalIndicatorType[TechnicalIndicatorType["VolumeMACD"] = 110] = "VolumeMACD";
    TechnicalIndicatorType[TechnicalIndicatorType["VolatilityRatio"] = 111] = "VolatilityRatio";
    TechnicalIndicatorType[TechnicalIndicatorType["AccumulationDistribution"] = 112] = "AccumulationDistribution";
    TechnicalIndicatorType[TechnicalIndicatorType["BullishBarishIndicator"] = 113] = "BullishBarishIndicator";
    TechnicalIndicatorType[TechnicalIndicatorType["DirectionalMovementAverage"] = 114] = "DirectionalMovementAverage";
    TechnicalIndicatorType[TechnicalIndicatorType["DirectionalDivergenceIndex"] = 115] = "DirectionalDivergenceIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["DirectionalMovementIndex"] = 116] = "DirectionalMovementIndex";
    TechnicalIndicatorType[TechnicalIndicatorType["Volume"] = 1000] = "Volume";
})(TechnicalIndicatorType || (TechnicalIndicatorType = {}));
//# sourceMappingURL=technical-indicator-type.js.map