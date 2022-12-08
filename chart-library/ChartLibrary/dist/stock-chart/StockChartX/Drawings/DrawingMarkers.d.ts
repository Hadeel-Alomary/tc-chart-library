import { Chart, ChartPanelValueScale, IPoint, Projection } from '../..';
export declare class DrawingMarkers {
    private valueMarkers;
    private dateMarkers;
    constructor();
    drawSelectionValueMarkers(chart: Chart, points: IPoint[], context: CanvasRenderingContext2D, projection: Projection, panelValueScale: ChartPanelValueScale): void;
    drawSelectionDateMarkers(chart: Chart, points: IPoint[], context: CanvasRenderingContext2D, projection: Projection): void;
}
//# sourceMappingURL=DrawingMarkers.d.ts.map