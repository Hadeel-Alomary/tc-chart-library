/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ChartPanel} from "../ChartPanels/ChartPanel";
import {IPadding, Rect} from "../Graphics/Rect";
import {Projection} from "./Projection";
import {INumberFormat, INumberFormatState} from '../Data/NumberFormat';
import {IValueScaleCalibrator, IValueScaleCalibratorState} from './ValueScaleCalibrator';
import {ValueScale} from "./ValueScale";
import {WindowEvent} from "../Gestures/Gesture";
import {AxisScaleType} from './axis-scale-type';
import {ValueScaleTheme} from '../Theme';

export interface IChartPanelValueScaleState {
    options: IChartPanelValueScaleConfig;
    formatter: INumberFormatState;
    calibrator: IValueScaleCalibratorState;
}

export interface IChartPanelValueScaleConfig {
    chartPanel: ChartPanel;
    minAllowedValue?: number;
    maxAllowedValue?: number;
    minAllowedValueRatio?: number;
    maxAllowedValueRatio?: number;
    minValueRangeRatio?: number;
    maxValueRangeRatio?: number;
    padding?: IPadding;
    minValueOffset?: number;
    decimalDigits?: number;
    customFormat?: string;
    range?: Object;
    majorTickMarkLength?: number; // MA compile typescript - make it optional
    minorTickMarkLength?: number; // MA compile typescript - make it optional
    axisScaleType?:AxisScaleType;
}

export interface ChartPanelValueScale{
    formatter:INumberFormat;
    projection:Projection;
    chartValueScale:ValueScale;
    actualTheme:ValueScaleTheme;
    calibrator:IValueScaleCalibrator;
    padding:IPadding;
    chartPanel:ChartPanel;
    maxVisibleValue:number;
    minVisibleValue:number;
    axisScale:AxisScaleType;
    projectionFrame:Rect;
    leftFrame:Rect;
    rightFrame:Rect;

    _zoomOrScrollWithUpdate(offset: number, func: (value: number) => void):boolean;
    setNeedsAutoScale():void;
    preferredWidth(): number;
    handleEvent(event: WindowEvent): boolean;
    formatValue(value: number): string;
    formatAllDigitsValue(value: number): string;
    saveState():IChartPanelValueScaleState;
    layout(frame: Rect):void;
    draw():void;
    clip():boolean;
    scrollOnPixels(pixels: number):boolean;
    scrollOnValue(valueOffset: number):boolean;


}
