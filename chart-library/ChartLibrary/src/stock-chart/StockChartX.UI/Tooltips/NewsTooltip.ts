import {ChartAccessorService, ChartTooltip, ChartTooltipConfig, ChartTooltipType} from '../../../services/index';
import {IPoint} from '../../StockChartX/Graphics/ChartPoint';
import {ChartPanel} from '../../StockChartX/ChartPanels/ChartPanel';
import {DataRequesterTooltip} from './DataRequesterTooltip';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {ChartEvent} from '../../StockChartX/Chart';

const IDS = {
    TABLE_ID: '#scxNewsTooltip',
    TEXT_ID: '#scxNewsTooltip-text',
    DETAILS_ANCHOR_ID: '#scxNewsTooltip-details-anchor'
};

export interface NewsTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
    newsId: number;
}

export class NewsTooltip extends DataRequesterTooltip<string> implements ChartTooltip {

    private width: number = 350;
    private height: number = 80;
    private _isPointerInsideTooltip: boolean;
    private _config: NewsTooltipConfig;

    private static _instance:NewsTooltip = null;

    public static get instance():NewsTooltip{
        if(NewsTooltip._instance == null){
            NewsTooltip._instance = new NewsTooltip();
        }
        return NewsTooltip._instance;
    }

    private constructor(){
        super();
        this._initGestures();
        this._initDetailsClickGesture();
    }

    getType():ChartTooltipType{
        return ChartTooltipType.News;
    }

    show(config: NewsTooltipConfig): void {

        // MA handle "stack" of vertical news, so that navigating between them is going to change shown news
        if(this._config && this._config.newsId != config.newsId) {
            this.hide();
        }

        if(this.shown) {
            return;
        }

        this._config = config;
        this.showTooltip();

        this.requestData(this._config.newsId.toString());

    }


    hide(): void {

        if(this._isPointerInsideTooltip) {
            return;
        }

        this.shown = false;

        this.hideTable();

    }

    protected onDataCb(data: string) {
        this._appendDataToHTML(data);
    }

    protected getTooltipId():string {
        return IDS.TABLE_ID;
    }

    private hideTable() {
        $(IDS.TABLE_ID).removeClass('shown');
    }

    protected getRequestObservable(): Observable<string> {
        return ChartAccessorService.instance.getNewsService().loadNewsTitle(this._config.newsId).pipe(
            map((title: string) => {return title})
        )
    }

    private getTableId(): string {
        return IDS.TABLE_ID;
    }

    private _appendDataToHTML(text: string) {
        $(IDS.TEXT_ID).text(text);
    }

    private _setDimensions() {
        $(IDS.TABLE_ID).css('width', `${this.width}px`);
        $(IDS.TABLE_ID).css('height', `${this.height}px`);
    }

    private _initDetailsClickGesture() {
        $(document).on('click', IDS.DETAILS_ANCHOR_ID, () => {
            this._config.chartPanel.chart.fireValueChanged(ChartEvent.SHOW_NEWS_DETAILS, this._config.newsId);
        });
    }

    private _initGestures() {
        let self = this;
        $(document).on('mouseleave', this.getTableId(), function () {
            self._isPointerInsideTooltip = false;
            self.hide();
        });
        $(document).on('mouseenter', this.getTableId(), function () {
            self._isPointerInsideTooltip = true;
        });
    }

    private showTooltip() {
        this.shown = true;
        this._setDimensions();
        this._appendDataToHTML('');
        $(IDS.TABLE_ID).addClass('shown');
        this.setPosition(this._config.chartPanel, this._config.mousePosition, `${this.getTableId()}`, this.width);
    }

}
