import { ValueScale } from "./ValueScale";
import { FrameControl } from "../Controls/FrameControl";
import { Chart } from "../Chart";
import { ISize, Rect } from "../Graphics/Rect";
export interface IValueScalePanelConfig {
    valueScale: ValueScale;
    cssClass: string;
    visible?: boolean;
}
export declare class ValueScalePanel extends FrameControl {
    private _valueScale;
    get valueScale(): ValueScale;
    private _cssClass;
    get cssClass(): string;
    private _isVisible;
    get visible(): boolean;
    set visible(value: boolean);
    get chart(): Chart;
    get size(): ISize;
    get contentSize(): ISize;
    constructor(config: IValueScalePanelConfig);
    layout(frame: Rect, isLeftPanel?: boolean): Rect;
    getWidth(): number;
    applyTheme(): void;
}
//# sourceMappingURL=ValueScalePanel.d.ts.map