/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Chart} from "../StockChartX/Chart";
import {HtmlLoader} from "./HtmlLoader";

export interface IChartNavigationConfig {
    target: JQuery;
    chart: Chart;
}

export class ChartNavigation {

    constructor(config: IChartNavigationConfig) {

        HtmlLoader.getView('Navigation.html', (html: string) => {
            this._init(html, config);
        });
    }

    private _init(html: string, config: IChartNavigationConfig): void {
        let controls = $(html).appendTo(config.target);
        let chart = config.chart;

        controls.find('.scxNavigation-btn-scrollLeft').on('click', () => {
            chart.scrollOnPixels(chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-scrollRight').on('click', () => {
            chart.scrollOnPixels(-chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-zoomIn').on('click', () => {
            chart.handleZoom(chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-zoomOut').on('click', () => {
            chart.handleZoom(-chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-scrollToFirst').on('click', () => {
            let records = chart.lastVisibleRecord - chart.firstVisibleRecord;
            if (records > 1) {
                chart.firstVisibleRecord = 0;
                chart.lastVisibleRecord = Math.min(records, chart.recordCount - 1);
                chart.setNeedsUpdate(true);
            }
            return false;
        });
        controls.find('.scxNavigation-btn-scrollToLast').on('click', () => {
            let recordCount = chart.recordCount;
            if (recordCount > 0) {
                let firstRec = chart.firstVisibleRecord;
                let lastRec = chart.lastVisibleRecord;

                chart.lastVisibleRecord = recordCount - 1;
                chart.firstVisibleRecord = Math.max(recordCount - (lastRec - firstRec + 1), 0);
                chart.setNeedsUpdate(true);
            }
            return false;
        });
    }
}