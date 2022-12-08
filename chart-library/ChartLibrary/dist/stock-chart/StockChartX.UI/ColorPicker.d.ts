export interface ColorPickerOptions {
    color?: string;
    flat?: boolean;
    showInput?: boolean;
    showInitial?: boolean;
    allowEmpty?: boolean;
    showAlpha?: boolean;
    disabled?: boolean;
    palette?: string[][];
    showPalette?: boolean;
    showPaletteOnly?: boolean;
    togglePaletteOnly?: boolean;
    togglePaletteMoreText?: string;
    togglePaletteLessText?: string;
    hideAfterPaletteSelect?: boolean;
    showSelectionPalette?: boolean;
    localStorageKey?: string;
    clickoutFiresChange?: boolean;
    cancelText?: string;
    chooseText?: string;
    containerClassName?: string;
    replacerClassName?: string;
    preferredFormat?: string;
    showButtons?: boolean;
    appendTo?: JQuery | unknown[] | Element | string;
    maxSelectionSize?: number;
    selectionPalette?: string[];
    change?: (color: tinycolorInstance) => void;
    move?: (color: tinycolorInstance) => void;
    show?: (color: tinycolorInstance) => void;
    hide?: (color: tinycolorInstance) => void;
    beforeShow?: (color: tinycolorInstance) => void;
}
export declare class ColorPicker {
    private _picker;
    constructor(domObjects: JQuery, config: ColorPickerOptions);
    getColor(): string;
    getColorWithAlpha(alpha: number): string;
    setColor(color: string): void;
    disable(): void;
    enable(): void;
}
//# sourceMappingURL=ColorPicker.d.ts.map