import { Chart } from './Chart';
import { IFillTheme, IStrokeTheme } from './Theme';
import { IPoint } from './Graphics/ChartPoint';
export interface ISelectionMarkerConfig {
    chart: Chart;
    theme?: ISelectionMarkerTheme;
    width?: number;
}
export interface ISelectionMarkerTheme {
    line: IStrokeTheme;
    fill: IFillTheme;
}
export declare class SelectionMarker {
    private _chart;
    get chart(): Chart;
    private _width;
    private set width(value);
    private get width();
    get actualTheme(): ISelectionMarkerTheme;
    constructor(config: ISelectionMarkerConfig);
    draw(context: CanvasRenderingContext2D, point: IPoint | IPoint[], theme: ISelectionMarkerTheme): void;
}
//# sourceMappingURL=SelectionMarker.d.ts.map