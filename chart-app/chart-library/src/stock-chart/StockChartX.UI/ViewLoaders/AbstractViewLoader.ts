
import {ICallbackFunction, LanguageService} from "../../../services/index";
import {JsUtil} from "../../StockChartX/Utils/JsUtil";
import {IDialog} from '../Dialog';

export abstract class AbstractViewLoader{

    protected _insertIntoPage(html: string, languageService:LanguageService): JQuery {
        let htmlPage:JQuery = $(html).appendTo($('body'));
        languageService.translateHtml(htmlPage);
        return htmlPage;
    }

    protected _invokeOnLoad(onLoad: ICallbackFunction, dialog: IDialog): void {
        JsUtil.isFunction(onLoad) && onLoad(dialog);
    }
}
