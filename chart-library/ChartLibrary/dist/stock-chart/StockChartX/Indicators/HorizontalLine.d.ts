import { IStrokeTheme } from '../Theme';
import { Indicator } from "./Indicator";
import { IPoint } from "../Graphics/ChartPoint";
export interface HorizontalLineConfig {
    value: number;
    theme?: HorizontalLineTheme;
}
interface HorizontalLineOptions extends HorizontalLineConfig {
}
interface HorizontalLineTheme {
    line: IStrokeTheme;
}
export declare class HorizontalLine {
    options: HorizontalLineOptions;
    get theme(): HorizontalLineTheme;
    set theme(value: HorizontalLineTheme);
    get value(): number;
    set value(value: number);
    constructor(config: HorizontalLineConfig);
    setColor(color: string): void;
    getColor(): string;
    setLineStyle(style: string): void;
    getLineStyle(): string;
    setLineWidth(width: number): void;
    getLineWidth(): number;
    draw(indicator: Indicator): void;
    drawValueMarkers(indicator: Indicator): void;
    hitTest(point: IPoint, indicator: Indicator): boolean;
}
export {};
//# sourceMappingURL=HorizontalLine.d.ts.map