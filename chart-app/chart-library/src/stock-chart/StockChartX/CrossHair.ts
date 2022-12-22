/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {IChartComponentConfig} from "./Controls/ChartComponent";
import {IFillTheme, IStrokeTheme, ITextTheme} from "./Theme";
import {Chart} from "./Chart";
import {IPoint} from "./Graphics/ChartPoint";
import {Gesture, WindowEvent} from "./Gestures/Gesture";

/**
 * The cross hair theme structure.
 * @typedef {object} CrossHairTheme
 * @type {object}
 * @property {StrokeTheme} line The border line theme.
 * @property {FillTheme} fill The fill theme.
 * @property {TextTheme} text The text theme.
 * @memberOf StockChartX
 * @example
 * var theme = {
 *   line: {
 *     strokeColor: 'black'
 *   },
 *   fill: {
 *     fillColor: 'white'
 *   },
 *   text: {
 *     fontFamily: 'Calibri',
 *     fontSize: 12,
 *     fillColor: 'red'
 *   }
 * };
 */


export interface ICrossHairState { // MA compile typescript - export declarations
    crossHairType: string;
}

export interface ICrossHairConfig extends IChartComponentConfig {
    crossHairType?: string;
}

export interface ICrossHairTheme {
    line: IStrokeTheme;
    fill: IFillTheme;
    text: ITextTheme;
}


export interface CrossHair{
    crossHairType:string;
    chart:Chart;
    visible:boolean;
    saveState(): ICrossHairState;
    loadState(state:ICrossHairState):void;
    layout():void;
    update():void;
    setPosition(point: IPoint, animated?: boolean):void;
    hide():void;
    show():void;
    handleMouseHoverGesture(gesture: Gesture, event: WindowEvent):void;
    applyTheme():void;
    showTradingContextMenu(e: JQueryEventObject, value: number, panelIndex: number): void;

}

/**
 * Cross hair type enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const CrossHairType = {
    /** Cross hair is not shown. Use regular cursor. */
    NONE: 'none',
    /** Show date and value markers. Cross hair lines are hidden. */
    MARKERS: 'markers',
    /** Show cross hair lines and markers. */
    CROSS: 'cross'
};
Object.freeze(CrossHairType);
