import { IValueMarkerTheme } from './Scales/ValueMarker';
export declare const StrokePriority: {
    COLOR: string;
};
export declare const FillPriority: {
    COLOR: string;
};
export declare const LineStyle: {
    SOLID: string;
    DASH: string;
    DOT: string;
    DASH_DOT: string;
};
export declare let FontDefaults: {
    fontFamily: string;
    fontSize: number;
    fontStyle: string;
    fontVariant: string;
    fontWeight: string;
};
export declare let StrokeDefaults: {
    strokePriority: string;
    strokeColor: string;
    width: number;
    lineStyle: string;
    lineJoin: string;
    lineCap: string;
    textAlign: string;
    textBaseline: string;
};
export declare let DashArray: {
    DOT: number[];
    DASH: number[];
    DASH_DOT: number[];
};
export interface IStrokeTheme {
    strokeEnabled?: boolean;
    strokePriority?: string;
    width?: number;
    strokeColor?: string;
    lineStyle?: string;
    lineCap?: string;
    lineJoin?: string;
    textAlign?: string;
    textBaseline?: string;
}
export interface IGridTheme {
    horizontalLines: IStrokeTheme;
    verticalLines: IStrokeTheme;
}
export interface IFillTheme {
    fillEnabled?: boolean;
    fillPriority?: string;
    fillColor: string;
}
export interface ITextTheme extends IStrokeTheme, IFillTheme {
    fontFamily: string;
    fontSize: number;
    fontStyle?: string;
    fillColor: string;
    fontVariant?: string;
    fontWeight?: string;
    backgroundColor?: string;
    borderColor?: string;
    textBackgroundEnabled?: boolean;
    textBorderEnabled?: boolean;
    textWrapEnabled?: boolean;
    decoration?: string;
}
export declare let Theme: {
    [key: string]: ChartTheme;
};
export interface ChartPanelTheme {
    grid: IGridTheme;
    title: ITextTheme;
}
export interface PlotTheme {
}
export interface FilledWithBorderTheme {
    border: IStrokeTheme;
    fill: IFillTheme;
}
export interface ColumnPlotTheme extends PlotTheme {
    upColumn: FilledWithBorderTheme;
    downColumn: FilledWithBorderTheme;
}
export interface LineConnectedPlotTheme extends PlotTheme {
    upLine: IStrokeTheme;
    downLine: IStrokeTheme;
}
export interface LabelConnectedPlotTheme extends PlotTheme {
    stroke: IStrokeTheme;
}
export interface PointPlotTheme extends IStrokeTheme, PlotTheme {
}
export interface LinePlotTheme extends IStrokeTheme, PlotTheme {
}
export interface MountainLinePlotTheme extends PlotTheme {
    line: LinePlotTheme;
    fill: IFillTheme;
}
export interface BarPlotTheme extends PlotTheme {
    upBar: IStrokeTheme;
    downBar: IStrokeTheme;
}
export interface FillPlotTheme extends PlotTheme {
    fill: IFillTheme;
}
export interface LineCandlePlotTheme extends PlotTheme {
    upCandle: {
        border: IStrokeTheme;
    };
    downCandle: {
        border: IStrokeTheme;
    };
}
export interface CandlePlotTheme extends PlotTheme {
    upCandle: {
        border: IStrokeTheme;
        fill: IFillTheme;
        wick: IStrokeTheme;
    };
    downCandle: {
        border: IStrokeTheme;
        fill: IFillTheme;
        wick: IStrokeTheme;
    };
}
export interface WicklessCandlePlotTheme extends PlotTheme {
    upCandle: {
        border: IStrokeTheme;
        fill: IFillTheme;
    };
    downCandle: {
        border: IStrokeTheme;
        fill: IFillTheme;
    };
}
export interface HollowCandlePlotTheme extends CandlePlotTheme {
    upHollowCandle: {
        border: IStrokeTheme;
        wick: IStrokeTheme;
    };
    downHollowCandle: {
        border: IStrokeTheme;
        wick: IStrokeTheme;
    };
}
export interface VolumeProfilerPlotTheme extends PlotTheme {
    fillBox: IFillTheme;
    showVolumeProfile: boolean;
    boxWidth: number;
    placement: string;
    downArea: IFillTheme;
    downVolume: IFillTheme;
    upArea: IFillTheme;
    upVolume: IFillTheme;
    line: IStrokeTheme;
}
export interface KumoPlotTheme extends PlotTheme {
    upColor: IFillTheme;
    downColor: IFillTheme;
}
export interface ValueScaleTheme {
    text: ITextTheme;
    line: IStrokeTheme;
    border: IStrokeTheme;
    valueMarker: IValueMarkerTheme;
}
export interface DateScaleTheme {
    text: ITextTheme;
    line: IStrokeTheme;
    border: IStrokeTheme;
}
export interface ChartTheme {
    name: string;
    chart: {
        background: string[];
        border: IStrokeTheme;
        instrumentWatermark: {
            symbol: ITextTheme;
            details: ITextTheme;
        };
    };
    splitter: {
        fillColor: string;
        hoverFillColor: string;
    };
    chartPanel: ChartPanelTheme;
    valueScale: ValueScaleTheme;
    dateScale: DateScaleTheme;
    crossHair: {
        text: ITextTheme;
        line: IStrokeTheme;
        fill: IFillTheme;
    };
    plot: {
        point: PointPlotTheme;
        line: {
            simple: LinePlotTheme;
            mountain: MountainLinePlotTheme;
            step: LinePlotTheme;
        };
        histogram: {
            columnByPrice: ColumnPlotTheme;
            columnByValue: ColumnPlotTheme;
            column: {
                line: IStrokeTheme;
                fill: IFillTheme;
            };
        };
        fillPlot: FillPlotTheme;
        bar: {
            OHLC: IStrokeTheme;
            HLC: IStrokeTheme;
            HL: IStrokeTheme;
            coloredOHLC: BarPlotTheme;
            coloredHLC: BarPlotTheme;
            coloredHL: BarPlotTheme;
            candle: CandlePlotTheme;
            heikinAshi: CandlePlotTheme;
            renko: WicklessCandlePlotTheme;
            lineBreak: WicklessCandlePlotTheme;
            hollowCandle: HollowCandlePlotTheme;
            pointAndFigure: LineCandlePlotTheme;
            kagi: LineCandlePlotTheme;
        };
        lineConnectedPoints: LineConnectedPlotTheme;
        labelConnectedPoints: LabelConnectedPlotTheme;
    };
    pointerPoint: {
        selectionMarker: {
            line: IStrokeTheme;
            fill: IFillTheme;
        };
        movingSelectionMarker: {
            line: IStrokeTheme;
            fill: IFillTheme;
        };
        onPriceSelectionMarker: {
            line: IStrokeTheme;
            fill: IFillTheme;
        };
    };
    drawing: {
        abstract: {
            line: IStrokeTheme;
            fill: IFillTheme;
            text: ITextTheme;
        };
        abstractMarker: {
            fill: IFillTheme;
        };
        fibonacci: {
            trendLine: IStrokeTheme;
            line: IStrokeTheme;
            fill: IFillTheme;
            text: ITextTheme;
        };
        priceLabel: {
            text: ITextTheme;
            line: IStrokeTheme;
            fill: IFillTheme;
        };
        arrowUp: {
            text: ITextTheme;
            fill: IFillTheme;
        };
        arrowDown: {
            text: ITextTheme;
            fill: IFillTheme;
        };
        arrowLeft: {
            text: ITextTheme;
            fill: IFillTheme;
        };
        arrowRight: {
            text: ITextTheme;
            fill: IFillTheme;
        };
        text: {
            text: ITextTheme;
            fill: IFillTheme;
            line: IStrokeTheme;
        };
        image: {
            noImage: {
                line: IStrokeTheme;
            };
        };
        flag: {
            fill: IFillTheme;
            width: number;
        };
    };
}
export declare class ThemeUtils {
    static mapThemeValuesForBackwardCompatibility(currentThemeValues: {
        [key: string]: unknown;
    }, defaultThemeValues: {
        [key: string]: unknown;
    }): void;
}
//# sourceMappingURL=Theme.d.ts.map