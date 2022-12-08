import { ICallbackFunction, LanguageService } from "../../../services/index";
import { IDialog } from '../Dialog';
export declare abstract class AbstractViewLoader {
    protected _insertIntoPage(html: string, languageService: LanguageService): JQuery;
    protected _invokeOnLoad(onLoad: ICallbackFunction, dialog: IDialog): void;
}
//# sourceMappingURL=AbstractViewLoader.d.ts.map