import {ContextMenu, IContextMenuConfig} from "./ContextMenu";
import {HtmlLoader} from "./HtmlLoader";
import {ChartAccessorService} from '../../services/index';
import {ChartPanel} from '..';
import {TechnicalIndicatorType} from "../../components";

const ContextMenuOptionItem = {
    ALERT: 'alert',
    DELETE: 'delete',
    CHART_ELEMENTS: 'chart-elements',
    SETTINGS: 'settings',
    SIMPLE_MOVING_AVERAGE:TechnicalIndicatorType.SimpleMovingAverage,
    EXPO_MOVING_AVERAGE:TechnicalIndicatorType.ExponentialMovingAverage
};
Object.freeze(ContextMenuOptionItem);

export interface IChartPanelMenuConfig extends IContextMenuConfig {
    chartPanel: ChartPanel;
    isArabic:boolean,
}

export class ChartPanelMenu extends ContextMenu {
    private static _container: JQuery = null;

    public static menuItems = ContextMenuOptionItem;
    private readonly chartPanel:ChartPanel = null;
    private readonly isArabic:boolean;

    constructor(config: IChartPanelMenuConfig, targetDomObject?: JQuery) {
        super(config, targetDomObject);

        this.chartPanel = config.chartPanel;
        this.isArabic = config.isArabic;
        HtmlLoader.getView('ChartPanelMenu.html', (html: string) => {
            if (!ChartPanelMenu._container) {
                let contextMenuElement:JQuery = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                ChartPanelMenu._container = contextMenuElement;
            }

            config.menuContainer = ChartPanelMenu._container;
            this._appendMovingAverageOptions();
        });
    }

    show(e: JQueryEventObject): void {
        this.processMenuItemVisibility();
        super.show(e);
        event.stopPropagation();
        event.preventDefault();
    }

    private processMenuItemVisibility() {
        if (this.chartPanel === this.chartPanel.chart.mainPanel) {
            this.hideDeletePanelOption();
            this.showAddAlertOption();
        } else {
            this.showDeletePanelOption();
            if (this.chartPanel.indicators[0].isAlertable()) {
                this.showAddAlertOption();
            } else {
                this.hideAddAlertOption();
            }
        }
    }

    private hideDeletePanelOption() {
        ChartPanelMenu._container.find('[data-id="delete"]').addClass('hidden');
        ChartPanelMenu._container.find('[data-id=delete-divider]').addClass('hidden');
    }

    private showDeletePanelOption() {
        ChartPanelMenu._container.find('[data-id="delete"]').removeClass('hidden');
        ChartPanelMenu._container.find('[data-id=delete-divider]').removeClass('hidden');
    }

    private hideAddAlertOption() {
        ChartPanelMenu._container.find('[data-id="alert"]').addClass('hidden');
    }

    private showAddAlertOption() {
        ChartPanelMenu._container.find('[data-id="alert"]').removeClass('hidden');
    }

    private addSubMenuMovingAverageOptions(dataId: TechnicalIndicatorType, dataPeriod: string, text: string) {
        let movingAverageLi = ChartPanelMenu._container.find('.moving-average');
        let movingAverageSubMenu = movingAverageLi.find('.dropdown-menu');

        if (movingAverageSubMenu.find('[data-id=' + dataId + '][data-period=' + dataPeriod + ']').length < 1 ) {
            movingAverageSubMenu.append(`<li data-id= ${dataId} data-period= ${dataPeriod}><a href="#">${text}</a></li>`);
        }
    }

    private addSubMenuDivider() {
        let movingAverageLi = ChartPanelMenu._container.find('.moving-average');
        let movingAverageSubMenu = movingAverageLi.find('.dropdown-menu');

        if (movingAverageSubMenu.find('.divider.first').length < 1) {
            movingAverageSubMenu.append(`<div class="divider first"></div>`)
        }
    }

     private _appendMovingAverageOptions(): void {
        let simpleMovingAverageOptions = this.chartPanel.chart.movingAverageOptions.simpleMovingAverageOptions();
        simpleMovingAverageOptions.forEach((indicator, index) => {
            let text = this.isArabic ? indicator.arabicName : indicator.englishName;
            this.addSubMenuMovingAverageOptions(indicator.type.type, indicator.period.toString(),text + ' ' + indicator.period);

            if (simpleMovingAverageOptions.length - 1 == index) {
                this.addSubMenuDivider();
            }
        });

        let exponentialMovingAverageOptions = this.chartPanel.chart.movingAverageOptions.exponentialMovingAverageOptions();
        exponentialMovingAverageOptions.forEach(indicator => {
            let text = this.isArabic ? indicator.arabicName : indicator.englishName;
            this.addSubMenuMovingAverageOptions(indicator.type.type, indicator.period.toString(),text + ' ' + indicator.period);
        });
    }
}

