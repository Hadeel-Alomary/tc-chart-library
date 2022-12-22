/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPadding, IRect, Rect} from "../Graphics/Rect";
import {ChartPanel} from './ChartPanel';
import {ChartPanelSplitter} from "./ChartPanelSplitter";
import {Chart} from "../Chart";
import {AxisScaleType} from '../Scales/axis-scale-type';
import {IChartPanelsContainerOptions} from './ChartPanelsContainerImplementation';

export interface ChartPanelsContainer{
    panels:ChartPanel[];
    chart:Chart;
    rootDiv:JQuery;
    frame:Rect;
    panelsContentFrame:Rect;
    panelPadding:IPadding;

    movePanel(panel: ChartPanel, offset: number):void;
    addPanel(index?: number, heightRatio?: number, shrinkMainPanel?: boolean): ChartPanel
    removePanel(panel: number | ChartPanel):void;
    saveState():IChartPanelsContainerOptions;
    loadState(state:IChartPanelsContainerOptions):void;
    findPanelAt(y: number): ChartPanel;
    setPanelHeightRatio(panel: ChartPanel, ratio: number):void;
    getTotalPanelsHeight():number;
    setNeedsAutoScale():void;
    setAxisScale(axisScaleType:AxisScaleType):void;
    getAxisScale():AxisScaleType;
    layoutSplitterPanels(splitter: ChartPanelSplitter):void;
    layout(frame: IRect):void;
    layoutScalePanel(chartPanelsFrame: Rect):Rect;
    draw():void;
}
