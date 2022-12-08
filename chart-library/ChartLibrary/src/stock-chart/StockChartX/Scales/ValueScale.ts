/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {IChartComponentConfig} from "../Controls/ChartComponent";
import {ValueScalePanel} from "./ValueScalePanel";
import {Rect} from "../Graphics/Rect";
import {Chart} from "../Chart";

export interface IValueScaleConfig extends IChartComponentConfig {
    showLeftPanel?: boolean;
    showRightPanel?: boolean;
    width?: number;
    useManualWidth?: boolean;
}


export interface ValueScale{
    saveState(): IValueScaleConfig;
    layout(frame: Rect):Rect;
    destroy(): void;
    index:number;
    leftPanel:ValueScalePanel;
    rightPanel:ValueScalePanel;
    leftPanelVisible:boolean;
    rightPanelVisible:boolean;
    useManualWidth:boolean;
    manualWidth:number;
    chart:Chart;
    leftPanelCssClass:string;
}
