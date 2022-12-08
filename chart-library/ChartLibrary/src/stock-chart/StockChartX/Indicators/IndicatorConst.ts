/**
 * Indicator parameter name constants.
 * @readonly
 * @enum {string}
 */
export const IndicatorParam = {
    SOURCE: "Source",
    SOURCE2: "Source 2",
    PERIODS: "Periods",
    PERIOD1: "Period1",
    PERIOD2: "Period2",
    PERIOD3: "Period3",
    PERIOD4: "Period4",
    STANDARD_DEVIATIONS: "Standard Deviations",
    MA_TYPE: "Moving Average Type",
    SHIFT: "Shift",
    MIN_TICK: "Min Tick Value",
    LIMIT_MOVE: "Limit Move Value",
    PCT_K_PERIODS: "%K Periods",
    PCT_K_SMOOTHING: "%K Smoothing",
    PCT_K_DOUBLE_SMOOTHING: "%K Double Smoothing",
    PCT_D_PERIODS: "%D Periods",
    PCT_D_MA_TYPE: "%D Moving Average Type",
    BAR_HISTORY: "Bar History",
    R2_SCALE: "R2 Scale",
    CYCLE_1: "Cycle 1",
    CYCLE_2: "Cycle 2",
    CYCLE_3: "Cycle 3",
    SHORT_TERM: "Short Term",
    LONG_TERM: "Long Term",
    POINTS_OR_PERCENT: "Points or Percent",
    RATE_OF_CHANGE: "Rate of Change",
    SHORT_CYCLE: "Short Cycle",
    LONG_CYCLE: "Long Cycle",
    SIGNAL_PERIODS: "Signal Periods",
    MIN_AF: "Min AF",
    MAX_AF: "Max AF",
    LEVELS: "Levels",
    LINE_WIDTH: "Line Width",
    LINE_STYLE: "Line Style",
    LINE_COLOR: "Line Color",
    LINE_COLOR_DOWN: "Line Color Down",
    LINE2_WIDTH: "Line 2 Width",
    LINE2_STYLE: "Line 2 Style",
    LINE2_COLOR: "Line 2 Color",
    LINE2_COLOR_DOWN: "Line 2 Color Down",
    LINE3_WIDTH: "Line 3 Width",
    LINE3_STYLE: "Line 3 Style",
    LINE3_COLOR: "Line 3 Color",
    LINE3_COLOR_DOWN: "Line 3 Color Down",
    LINE4_WIDTH: "Line 4 Width",
    LINE4_STYLE: "Line 4 Style",
    LINE4_COLOR: "Line 4 Color",
    LINE4_COLOR_DOWN: "Line 4 Color Down",
    FILL_COLOR: "FIll Color",
    VP_ROW_SIZE: "Row Size",
    VP_VALUE_AREA_VOLUME_RATIO: "Area Volume Ratio",
    VP_ROW_LAYOUT: "Row Layout",
    BOX_FILL:'Box Fill',
    UP_VOLUME:'Up Volume',
    DOWN_VOLUME:'Down Volume',
    UP_AREA:'Up Area',
    DOWN_AREA:'Down Area',
    SHOW_VOLUME_PROFILE_BARS:'Show Volume Profile Bars',
    PLACEMENT:'placement',
    BOX_WIDTH:'Box Width',
    STROKE_ENABLED:'stroke enabled',
    VWAP_ANCHOR:'Anchor'
};
Object.freeze(IndicatorParam);

//NK whenever we want add indicator with new plot type, we must add the type here
export const IndicatorPlotTypes = {
    LINE_PLOT: 'Line',
    HISTOGRAM_PLOT: 'Histogram',
    FILL_PLOT: 'Fill',
    LINE_CONNECTED_POINTS_PLOT: 'Line Connected Points',
    LABEL_CONNECTED_POINTS_PLOT: 'Label Connected Points',
    POINTS_PLOT: 'Points',
    KUMO: "Kumo",
    VOLUME_PROFILER_SESSION_PLOT: "Volume Profiler Session",
    VOLUME_PROFILER_VISIBLE_RANGE_PLOT: "Volume Profiler Visible Range"
};


export const IndicatorField = {
    OPEN: "Open",
    HIGH: "High",
    LOW: "Low",
    CLOSE: "Close",
    VOLUME: "Volume",
    DATE: "Date",
    INDICATOR: "Indicator",
    INDICATOR_HIGH: "Indicator High",
    INDICATOR_LOW: "Indicator Low",
    INDICATOR_SIGNAL: "Indicator Signal",
    INDICATORSIGNAL: "IndicatorSignal",
    INDICATOR_HISTOGRAM: "Indicator Histogram",
    INDICATOR_MACDH: "Indicator MACDH",
    INDICATOR_DEA: "Indicator DEA",
    BOLLINGER_BAND_TOP: "Bollinger Band Top",
    BOLLINGER_BAND_MEDIAN: "Bollinger Band Median",
    BOLLINGER_BAND_BOTTOM: "Bollinger Band Bottom",
    ENVELOPE_TOP: "Envelope Top",
    ENVELOPE_MEDIAN: "Envelope Median",
    ENVELOPE_BOTTOM: "Envelope Bottom",
    HIGH_LOW_BANDS_TOP: "High Low Bands Top",
    HIGH_LOW_BANDS_MEDIAN: "High Low Bands Median",
    HIGH_LOW_BANDS_BOTTOM: "High Low Bands Bottom",
    FRACTAL_HIGH: "Fractal High",
    FRACTAL_LOW: "Fractal Low",
    PRIME_BANDS_TOP: "Prime Bands Top",
    PRIME_BANDS_BOTTOM: "Prime Bands Bottom",
    KELTNER_CHANNEL_TOP: "Keltner Top",
    KELTNER_CHANNEL_MEDIAN: "Keltner Median",
    KELTNER_CHANNEL_BOTTOM: "Keltner Bottom",
    STARC_CHANNEL_TOP: "STARC Top",
    STARC_CHANNEL_MEDIAN: "STARC Median",
    STARC_CHANNEL_BOTTOM: "STARC Bottom",
    PCT_D: "%D",
    PCT_K: "%K",
    RSQUARED: "RSquared",
    FORECAST: "Forecast",
    SLOPE: "Slope",
    INTERCEPT: "Intercept",
    SIGNAL: "Signal",
    HISTOGRAM: "Histogram",
    ADX: "ADX",
    DI_PLUS: "DI+",
    DI_MINUS: "DI-",
    AROON_UP: "Aroon Up",
    AROON_DOWN: "Aroon Down",
    AROON_OSCILLATOR: "Aroon Oscillator",
    BULL_POWER: "Indicator Bull Power",
    BEAR_POWER: "Indicator Bear Power",
    TRIGGER: "Indicator Trigger",
    INDICATOR_FILL: "Fill",
    DONCHIAN_CHANNEL_TOP: "Donchian Top",
    DONCHIAN_CHANNEL_MEDIAN: "Donchian Median",
    DONCHIAN_CHANNEL_BOTTOM: "Donchian Bottom",
    LIQUIDITY_INFLOW_VALUE: " Liquidity Inflow Value",
    LIQUIDITY_OUTFLOW_VALUE: "Liquidity Outflow Value",
    LIQUIDITY_NET_VALUE: "Liquidity Net Value",
    LIQUIDITY_INFLOW_VOLUME: "Liquidity Inflow Volume",
    LIQUIDITY_OUTFLOW_VOLUME: "Liquidity Outflow Volume",
    LIQUIDITY_NET_VOLUME: "Liquidity Net Volume",
    ICHIMOKU_TENKAN_SEN: "Ichimoku Tenkan Sen",
    ICHIMOKU_KIJUN_SEN: "Ichimoku Kijun Sen",
    ICHIMOKU_CHIKOU_SPAN: "Ichimoku Chikou Span",
    ICHIMOKU_SENKOU_SPAN_A: "Ichimoku Senkou Span A",
    ICHIMOKU_SENKOU_SPAN_B: "Ichimoku Senkou Span B",
    ICHIMOKU_KUMO: "Ichimoku Kumo",
    VOLUME_PROFILER_SESSION_VOLUME: "VPSV",
    VOLUME_PROFILER_VISIBLE_RANGE: "VPVS",
    PS_LANDIS_REVERSAL: "LanRevl",
    Directional_Movement_Average_DDD: "DDD",
    Directional_Movement_Average_AMA: "AMA",
    DIRECTIONAL_DIVERGENCE_INDEX_DDI:"DDI",
    DIRECTIONAL_DIVERGENCE_INDEX_ADDI:"ADDI",
    DIRECTIONAL_DIVERGENCE_INDEX_AD:"AD",
    DIRECTIONAL_MOVEMENT_INDEX_PDI: "PDI",
    DIRECTIONAL_MOVEMENT_INDEX_MDI: "MDI",
    DIRECTIONAL_MOVEMENT_INDEX_ADXR: "ADXR"
};
Object.freeze(IndicatorField);

export const IndicatorParamValue = {
    POINT: 1,
    PERCENT: 2
};
Object.freeze(IndicatorParamValue);

export const IchimokuIndicatorParam = {
    LINES: 'lines',
    CONVERSIONLINEPERIODS: 'conversion line periods',
    BASELINEPERIODS: 'base line periods',
    LOGGINGSPAN2PERIODS: 'logging span 2 periods'
};
Object.freeze(IchimokuIndicatorParam);

export const vwapIndicatorParam = {
    SESSION: 1,
    WEEK: 2,
    MONTH:3,
    YEAR:4,
    DECADE:5
};
Object.freeze(vwapIndicatorParam);