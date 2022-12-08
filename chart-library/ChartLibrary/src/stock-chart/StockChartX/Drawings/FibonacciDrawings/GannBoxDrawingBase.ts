import {IFillTheme, IStrokeTheme, ITextTheme} from '../../Theme';
import {Drawing, IDrawingConfig, IDrawingLevel, IDrawingOptions} from '../Drawing';
import {ChannelRequestType, ChartAccessorService, ViewLoaderType} from '../../../../services';
import {ShowDrawingSettingsDialogRequest} from '../../../../services/shared-channel/channel-request';
import {ThemedDrawing} from '../ThemedDrawing';
import {DrawingTheme} from '../DrawingThemeTypes';


export interface IGannBoxDrawingBaseConfig extends IDrawingConfig {
    levels: IDrawingLevel[];
}

export interface IGannBoxDrawingBaseOptions extends IDrawingOptions {
    levels?: IDrawingLevel[];
    timeLevels?: IDrawingLevel[];
}


export class GannBoxDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T>{
    get levels(): IDrawingLevel[] {
        return (<IGannBoxDrawingBaseOptions> this._options).levels;
    }

    set levels(value: IDrawingLevel[]) {
        (<IGannBoxDrawingBaseOptions> this._options).levels = [];

        (<IGannBoxDrawingBaseOptions> this._options).levels = value;
    }

    get timeLevels(): IDrawingLevel[] {
        if ((<IGannBoxDrawingBaseOptions> this._options).timeLevels == undefined) {
            return [];
        }
        return (<IGannBoxDrawingBaseOptions> this._options).timeLevels;
    }

    set timeLevels(value: IDrawingLevel[]) {
        (<IGannBoxDrawingBaseOptions> this._options).timeLevels = [];

        (<IGannBoxDrawingBaseOptions> this._options).timeLevels = value;
    }


    protected _isLevelVisible(level: IDrawingLevel): boolean {
        return level.visible != null ? level.visible : true;
    }

    public showSettingsDialog(): void {
        let showFiboDrawingSettingsRequest: ShowDrawingSettingsDialogRequest = {
            type: ChannelRequestType.FiboDrawingSettingsDialog,
            drawing: this
        };
        ChartAccessorService.instance.sendSharedChannelRequest(showFiboDrawingSettingsRequest);
    }

}
