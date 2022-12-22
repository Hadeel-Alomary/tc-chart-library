/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


// MA ColorPickerOptions "is a" copy of Spectrum Options, in order to remove Spectrum dependency from typescript
export interface ColorPickerOptions {

    /**
     * The initial color can be set with the color option.
     * if you don't pass in a color, Spectrum will use the value attribute on the input.
     * The input is a string that is parsed using https://github.com/bgrins/TinyColor
     */
    color?: string;

    /**
     * The colorpicker will always show up at full size, and be positioned as an inline-block element.
     */
    flat?: boolean;

    /**
     * Adds an input to allow for free form typing.
     */
    showInput?: boolean;

    /**
     * Shows the color that was initially set when opening.
     * This provides an easy way to click back to what was set when opened.
     */
    showInitial?: boolean;

    /**
     * Allows the colorpicker to have no color as a value.
     * Will display a button to set selection to 'no color'.
     */
    allowEmpty?: boolean;

    /**
     * Allows alpha transparency selection
     */
    showAlpha?: boolean;

    /**
     * Automatically disables the colorpicker.
     * Additionally, if the input that you initialize spectrum on is disabled, this will be the default value.
     * Note: you cannot enable spectrum if the input is disabled
     */
    disabled?: boolean;

    /**
     * Sets a palette below the colorpicker to make it convenient for users to choose from
     *  frequently or recently used colors.
     * Default value:  [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]]
     */
    palette?: string[][];

    /**
     * When the colorpicker is closed, the current color will be added to the palette if it isn't there already.
     */
    showPalette?: boolean;

    /**
     * Shows only the colors specified in the palette
     */
    showPaletteOnly?: boolean;

    /**
     * Shows a button to toggle the colorpicker next to the palette.
     * This way, the user can choose from a limited number of colors in the palette,
     * but still be able to pick a color that's not in the palette.
     */
    togglePaletteOnly?: boolean;

    /**
     * Changes the text on the open-toggle colorpicker button.
     */
    togglePaletteMoreText?: string;

    /**
     * Changes the text on the close-toggle colorpicker button.
     */
    togglePaletteLessText?: string;

    /**
     * Automatically hides the colorpicker after a palette color is selected.
     */
    hideAfterPaletteSelect?: boolean;

    /**
     * Keeps track of what has been selected by the user.
     */
    showSelectionPalette?: boolean;

    /**
     * The users selection will be saved in the browser's localStorage object.
     * Any Spectrum with the same string will share the selection.
     */
    localStorageKey?: string;

    /**
     * When clicking outside of the colorpicker,
     *  force it to fire a change event rather than having it revert the change.
     */
    clickoutFiresChange?: boolean;

    /**
     * Sets the text on the cancel button.
     */
    cancelText?: string;

    /**
     * Sets the text on the choose button.
     */
    chooseText?: string;

    /**
     * Adds an additional class name to the just the container element.
     */
    containerClassName?: string;

    /**
     * Adds an additional class name to just the replacer element.
     */
    replacerClassName?: string;

    /**
     * Sets the format that is displayed in the text box.
     * This will also change the format that is displayed in the titles from the palette swatches.
     * Possible values: "hex", "hex3", "hsl", "rgb", "name"
     */
    preferredFormat?: string;

    /**
     * Toggles the choose/cancel buttons.
     * If there are no buttons, the behavior will be to fire the `change` event (and update the original input) when the picker is closed.
     */
    showButtons?: boolean;

    /**
     * Sets which element the colorpicker container is appended to (default is "body").
     * This can be any valid object taken into the jQuery appendTo function.
     * Changing this can help resolve issues with opening the colorpicker in a modal dialog
     * or fixed position container, for instance.
     */
    appendTo?: JQuery | unknown[] | Element| string //same as JQuery appendTo : JQuery| any[] | Element| string

    /**
     * Sets the max size for the palette.
     */
    maxSelectionSize?: number;

    /**
     */
    selectionPalette?: string[];

    /**
     * Called as the original input changes. Only happens when the input is closed or the 'Choose' button is clicked.
     */
    change?: (color: tinycolorInstance) => void;

    /**
     * Called as the user moves around within the colorpicker.
     */
    move?: (color: tinycolorInstance) => void;

    /**
     * Called after the colorpicker is opened. This is ignored on a flat colorpicker.
     * Note, when any colorpicker on the page is shown it will hide any that are already open.
     */
    show?: (color: tinycolorInstance) => void;

    /**
     * Called after the colorpicker is hidden.
     * This happens when clicking outside of the picker while it is open.
     * Note, when any colorpicker on the page is shown it will hide any that are already open.
     * This event is ignored on a flat colorpicker.
     */
    hide?: (color: tinycolorInstance) => void;

    /**
     * You can prevent the colorpicker from showing up if you return false in the beforeShow event.
     * This event is ignored on a flat colorpicker.
     */
    beforeShow?: (color: tinycolorInstance) => void;
}


export class ColorPicker {
    private _picker: JQuery;

    constructor(domObjects: JQuery, config: ColorPickerOptions) {
        let params = {
            color: "#000",
            showInput: false,
            showInitial: true,
            allowEmpty: false,
            showAlpha: false,
            disabled: false,
            maxSelectionSize: 1,
            showPalette: true,
            showSelectionPalette: true,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            cancelText: "Cancel",
            chooseText: "Choose",
            togglePaletteMoreText: "More",
            togglePaletteLessText: "Less"
        };

        this._picker = domObjects.spectrum($.extend(params, config));
    }

    public getColor(): string {
        return <string> this._picker.spectrum('get').toRgbString();
    }

    public getColorWithAlpha(alpha: number): string {
        return <string> this._picker.spectrum('get').setAlpha(alpha).toRgbString();
    }

    public setColor(color: string): void {
        this._picker.spectrum('set', color);
    }

    public disable() {
        this._picker.spectrum('disable');
    }

    public enable() {
        this._picker.spectrum('enable');
    }
}
