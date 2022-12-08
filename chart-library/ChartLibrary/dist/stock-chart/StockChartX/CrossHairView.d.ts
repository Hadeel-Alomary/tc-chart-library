import { IDestroyable } from './Controls/Component';
import { CrossHair, ICrossHairTheme } from './CrossHair';
import { IPoint } from './Graphics/ChartPoint';
export declare class CrossHairView implements IDestroyable {
    private _crossHair;
    private _controls;
    private _position;
    private _prevPosition;
    private _positionAnimation;
    private get chart();
    private get rootDiv();
    constructor(crossHair: CrossHair);
    private static _applyMarkerTheme;
    private static _updateValueMarkerMetrics;
    private static _updateAddControlMetrics;
    private static _updateDateMarkerMetrics;
    private _createValueMarker;
    private _createControls;
    private _syncValueMarkers;
    layout(): void;
    applyTheme(theme: ICrossHairTheme): void;
    updateVisibility(isVisible?: boolean): void;
    toggleAddControlVisibilityOnPositionChange(): void;
    isInMainPanel(): boolean;
    setPosition(point: IPoint, animated?: boolean): void;
    updatePosition(force?: boolean): void;
    updateMarkers(): void;
    private _updateValueMarker;
    private _updateAddControl;
    private _updateDateMarker;
    private getPanelIndex;
    private getAddControlPrice;
    destroy(): void;
}
//# sourceMappingURL=CrossHairView.d.ts.map