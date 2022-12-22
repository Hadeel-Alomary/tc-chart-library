/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/////////////////////////////////////////////////////////////////////////////////////////////////
/* !!! WARNING TO NEFARIOUS COMPANYS AND DEVELOPERS !!!

 Your license agreement requires the use of the Modulus LicensePing.com licensing mechanism.
 The mechanism monitors the usage and distribution patterns of our intellectual property.
 If the usage or distribution patterns indicate that our licensing mechanism has either
 been removed, altered, tampered with or that our intellectual property may be misused in
 any form, our legal team may initiate contact with you to investigate the matter further.

 Removal or modification of this license mechanism by any means whatsoever (editing the code,
 removing the LicensePing.com URL reference, etc.) constitutes willful and criminal copyright
 infringement in addition to giving rise to claims by Modulus Financial Engineering, Inc.
 against you, as the developer, and your company as a whole for, among others:

 (1) Copyright Infringement;
 (2) False Designation of Origin;
 (3) Breach of Contract;
 (4) Misappropriation of Trade Secrets;
 (5) Interference with Contract; and
 (6) Interference with Prospective Business Relations.

 17 USC � 506 - Criminal offenses
 (a) Criminal Infringement.
 Any person who willfully infringes a copyright shall be punished as provided under section
 2319 of title 18, if the infringement was committed for purposes of commercial advantage
 or private financial gain.

 18 USC � 2319 - Criminal infringement of a copyright
 (a) Any person who commits an offense under section 506 (a)(1)(A) of title 17 shall be imprisoned
 not more than 5 years, or fined in the amount set forth in this title (up to $150,000), or both,
 if the offense consists of the reproduction or distribution, including by electronic means, during
 any 180-day period, of at least 10 copies, of 1 or more copyrighted works, which have a total retail
 value of more than $2,500.

 For more information, review the license agreement associated with this software and source
 code at http://www.modulusfe.com/support/license.pdf or contact us at legal@modulusfe.com */
/////////////////////////////////////////////////////////////////////////////////////////////////


export const Const = {
    nullValue: -987653421,
    mA_START: 0,
    mA_END: 7,
    simpleMovingAverage: 0,
    exponentialMovingAverage: 1,
    timeSeriesMovingAverage: 2,
    triangularMovingAverage: 3,
    variableMovingAverage: 4,
    VIDYA: 5,
    wellesWilderSmoothing: 6,
    weightedMovingAverage: 7,
    dynamicMovingAverage: 8,
    doubleExponentialMovingAverage: 9
};

export const Unknown = -1;
export const FirstIndicator = -1;
export const SimpleMovingAverage = 0;
export const ExponentialMovingAverage = 1;
export const TimeSeriesMovingAverage = 2;
export const TriangularMovingAverage = 3;
export const VariableMovingAverage = 4;
export const VIDYA = 5;
export const WellesWilderSmoothing = 6;
export const WeightedMovingAverage = 7;
export const WilliamsPctR = 8;
export const WilliamsAccumulationDistribution = 9;
export const VolumeOscillator = 10;
export const VerticalHorizontalFilter = 11;
export const UltimateOscillator = 12;
export const TrueRange = 13;
export const AverageTrueRange = 14;
export const RainbowOscillator = 15;
export const PriceOscillator = 16;
export const ParabolicSAR = 17;
export const MomentumOscillator = 18;
export const MACD = 19;
export const EaseOfMovement = 20;
export const AverageDirectionalIndex = 21;
export const DetrendedPriceOscillator = 22;
export const ChandeMomentumOscillator = 23;
export const ChaikinVolatility = 24;
export const Aroon = 25;
export const AroonOscillator = 26;
export const LinearRegressionRSquared = 27;
export const LinearRegressionForecast = 28;
export const LinearRegressionSlope = 29;
export const LinearRegressionIntercept = 30;
export const PriceVolumeTrend = 31;
export const PerformanceIndex = 32;
export const CommodityChannelIndex = 33;
export const ChaikinMoneyFlow = 34;
export const WeightedClose = 35;
export const VolumeROC = 36;
export const TypicalPrice = 37;
export const StandardDeviation = 38;
export const PriceROC = 39;
export const MedianPrice = 40;
export const HighMinusLow = 41;
export const BollingerBands = 42;
export const FractalChaosBands = 43;
export const HighLowBands = 44;
export const MovingAverageEnvelope = 45;
export const SwingIndex = 46;
export const AccumulativeSwingIndex = 47;
export const ComparativeRelativeStrength = 48;
export const MassIndex = 49;
export const MoneyFlowIndex = 50;
export const NegativeVolumeIndex = 51;
export const OnBalanceVolume = 52;
export const PositiveVolumeIndex = 53;
export const RelativeStrengthIndex = 54;
export const TradeVolumeIndex = 55;
export const StochasticOscillator = 56;
export const StochasticMomentumIndex = 57;
export const FractalChaosOscillator = 58;
export const PrimeNumberOscillator = 59;
export const PrimeNumberBands = 60;
export const HistoricalVolatility = 61;
export const MACDHistogram = 62;
export const HHV = 63;
export const LLV = 64;
export const TimeSeriesForecast = 65;
export const TRIX = 66;
export const ElderRay = 67;
export const ElderForceIndex = 68;
export const ElderThermometer = 69;
export const EhlerFisherTransform = 70;
export const KeltnerChannel = 71;
export const MarketFacilitationIndex = 72;
export const SchaffTrendCycle = 73;
export const QStick = 74;
export const STARC = 75;
export const CenterOfGravity = 76;
export const CoppockCurve = 77;
export const ChandeForecastOscillator = 78;
export const GopalakrishnanRangeIndex = 79;
export const IntradayMomentumIndex = 80;
export const KlingerVolumeOscillator = 81;
export const PrettyGoodOscillator = 82;
export const RAVI = 83;
export const RandomWalkIndex = 84;
export const TwiggsMoneyFlow = 85;
export const LastIndicator = 86;
export const IchimokuKinkoHyo = 87;
export const DynamicMovingAverage = 88;
export const ZigZag = 89;
export const DonchianChannels = 90;
export const ZigZagLabel = 91;
export const LiquidityByNetValue = 92;
export const LiquidityByNetVolume = 93;
export const AccumulatedLiquidityByNetValue = 94;
export const AccumulatedLiquidityByNetVolume = 95;
export const LiquidityByValue = 96;
export const LiquidityByVolume = 97;
export const VolumeProfilerSessionVolume = 98;
export const VolumeProfilerVisibleRange = 99;
export const VolumeWeightedAveragePrice = 100;
export const FastStochastic = 101;
export const PSLandisReversal = 102;
export const DoubleExponentialMovingAverage = 103;
export const TripleExponentialMovingAverage = 104;
export const HullMovingAverage = 105;
export const MaximumValue = 106;
export const PsychologicalLine = 107;
export const StochasticRSI = 108;
export const VolumeChange = 109;
export const VolumeMACD = 110;
export const VolatilityRatio = 111;
export const AccumulationDistribution = 112;
export const BullishBarishIndicator = 113;
export const DirectionalMovementAverage = 114;
export const DirectionalDivergenceIndex = 115;
export const DirectionalMovementIndex = 116;

export const VolumeIndicator = 1000;
