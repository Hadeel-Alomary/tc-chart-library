import {ChartPanelObject, IChartPanelObjectConfig} from '../ChartPanels/ChartPanelObject';
import {GestureArray} from '../Gestures/GestureArray';
import {IPoint} from '../Graphics/ChartPoint';
import {Gesture, GestureState, WindowEvent} from '../Gestures/Gesture';
import {ChartPanel} from '../ChartPanels/ChartPanel';
import {ClickGesture} from '../Gestures/ClickGesture';
import {MouseHoverGesture} from '../Gestures/MouseHoverGesture';
import {Chart, IRect} from '../..';

export enum ChartAnnotationType {
    Split = 1,
    TradingOrder,
    News
}

export interface IChartAnnotationConfig extends IChartPanelObjectConfig {
    date: string;
    type: ChartAnnotationType;
    belowCandle: boolean;
}

export const ChartAnnotationEvents = {
    CLICK_EVENT: 'Click event',
    HOVER_EVENT: 'Hover event'
};

export abstract class ChartAnnotation extends ChartPanelObject {

    private gestures: GestureArray;

    protected type: ChartAnnotationType;
    protected date: string;
    protected time:number;
    protected belowCandle:boolean;
    protected offset: number = 0;

    constructor(chart:Chart, config: IChartAnnotationConfig) {
        super(chart, config);

        this.setInitialState(config);
        this.initGesture();
    }

    /* abstract methods */

    public abstract draw(): void;

    protected abstract bounds(): IRect;

    protected abstract isVisible(): boolean;

    protected abstract hitTest(point: IPoint): boolean;

    protected abstract handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void;


    /* public methods */

    public getAnnotationType():ChartAnnotationType {
        return this.type;
    }

    public setOffset(offset: number):void {
        this.offset = offset;
    }

    public handleEvent(event: WindowEvent): boolean {
        return this.gestures.handleEvent(event);
    }

    public setPanel(panel: ChartPanel): void {
        this.chartPanel = panel;
    }

    public isBelowCandle():boolean {
        return this.belowCandle;
    }

    public getPositionIndex():number {
        // MA used to call this return Math.floor(this.time / this.chart.timeInterval);
        // However, if the annotation on a day that has "no candle", then the above will not take that into account (which is
        // pushing it to the closest candle after the missing time).
        // Therefore, better to use getRecord, even if it is slower (as long as it is not causing performance issues ;-))
        return this.getRecord();
    }

    /* protected methods */

    protected getCandleHigh(): number {

        let priceData = this.getPriceData();

        switch (this.chart.priceStyleKind) {
            case 'line':
            case 'mountain':
                return priceData.close;
            case 'coloredBar':
            case 'candle':
            case 'hollowCandle':
            case 'renko':
            case 'heikinAshi':
                return priceData.high;
            default:
                throw new Error('unknown price style kind ' + this.chart.priceStyleKind);
        }
    }

    protected getCandleLow(): number {

        let priceData = this.getPriceData();

        switch (this.chart.priceStyleKind) {
            case 'line':
            case 'mountain':
                return priceData.close;
            case 'coloredBar':
            case 'candle':
            case 'hollowCandle':
            case 'renko':
            case 'heikinAshi':
                return priceData.low;
            default:
                throw new Error('unknown price style kind ' + this.chart.priceStyleKind);
        }
    }

    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.CONTINUED:
                this.chartPanel.rootDiv.addClass('chart-annotation-mouse-hover');
                break;
            case GestureState.FINISHED:
                this.chartPanel.rootDiv.removeClass('chart-annotation-mouse-hover');
                break;
        }
    }


    protected getRecord(): number {
        return this.projection.recordByDate(new Date(this.date));
    }

    /* private methods */

    private setInitialState(config: IChartAnnotationConfig) {
        if (!config) {
            throw new Error('cannot find config for chart annotation');
        }

        if (!config.date) {
            throw new Error('cannot find date for chart annotation');
        }

        this.date = config.date;

        this.time = new Date(this.date).getTime();

        if (!config.type) {
            throw new Error('cannot find type for chart annotation');
        }
        this.type = config.type;

        this.belowCandle = config.belowCandle;
    }

    private initGesture(): void {
        this.gestures = new GestureArray([
            new ClickGesture({
                handler: this.handleMouseClickGesture.bind(this),
                hitTest: this.hitTest.bind(this)
            }),
            new MouseHoverGesture({
                handler: this.handleMouseHoverGesture.bind(this),
                hitTest: this.hitTest.bind(this)
            })
        ], this);
    }

    private getPriceData(): { open: number, high: number, low: number, close: number } {
        
        let record:number = this.getRecord();
        
        switch (this.chart.priceStyleKind) {
            case 'line':
            case 'mountain':
            case 'coloredBar':
            case 'candle':
            case 'hollowCandle':
                let chartBarDataSeries = this.chart.barDataSeries();
                return {
                    open: <number>chartBarDataSeries.open.valueAtIndex(record),
                    high: <number>chartBarDataSeries.high.valueAtIndex(record),
                    low: <number>chartBarDataSeries.low.valueAtIndex(record),
                    close: <number>chartBarDataSeries.close.valueAtIndex(record)
                };
                break;
            case 'renko':
                return {
                    open: <number> this.chart.dataManager.getDataSeries('.renko.open').valueAtIndex(record),
                    high: <number> this.chart.dataManager.getDataSeries('.renko.high').valueAtIndex(record),
                    low: <number> this.chart.dataManager.getDataSeries('.renko.low').valueAtIndex(record),
                    close: <number> this.chart.dataManager.getDataSeries('.renko.close').valueAtIndex(record)
                };
                break;
            case 'heikinAshi':
                return {
                    open: <number> this.chart.dataManager.getDataSeries('.heikin_ashi.open').valueAtIndex(record),
                    high: <number> this.chart.dataManager.getDataSeries('.heikin_ashi.high').valueAtIndex(record),
                    low: <number> this.chart.dataManager.getDataSeries('.heikin_ashi.low').valueAtIndex(record),
                    close: <number> this.chart.dataManager.getDataSeries('.heikin_ashi.close').valueAtIndex(record)
                };
                break;
            default:
                throw new Error('unknown price style kind ' + this.chart.priceStyleKind);
        }
    }

}
