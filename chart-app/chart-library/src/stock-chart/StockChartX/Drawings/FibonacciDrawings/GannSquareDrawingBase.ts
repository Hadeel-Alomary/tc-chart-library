import {IDrawingConfig, IDrawingLevel, IDrawingOptions} from '../Drawing';
import {IFillTheme, IStrokeTheme, ITextTheme} from '../../Theme';
import {ChannelRequestType, ChartAccessorService, ViewLoaderType} from '../../../../services';
import {ShowDrawingSettingsDialogRequest} from '../../../../services/shared-channel/channel-request';
import {DrawingTheme, LevelThemeElement} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export interface IGannSquareDrawingBaseLevel {
    value: number;
    visible?: boolean;
    theme?: LevelThemeElement;
}

export interface IGannSquareDrawingBaseLevelTheme {
    text?: ITextTheme;
    line?: IStrokeTheme;
    fill?: IFillTheme;
}


export interface IGannSquareDrawingBaseConfig extends IDrawingConfig {
    levels: IGannSquareDrawingBaseLevel[];
    fans: IGannSquareDrawingBaseLevel[];
    arcs: IGannSquareDrawingBaseLevel[];
}

export interface IGannSquareDrawingBaseOptions extends IDrawingOptions {
    levels?: IGannSquareDrawingBaseLevel[];
    fans?: IGannSquareDrawingBaseLevel[];
    arcs?: IGannSquareDrawingBaseLevel[];
}


export class GannSquareDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T> {

    get levels(): IGannSquareDrawingBaseLevel[] {
        return (<IGannSquareDrawingBaseOptions> this._options).levels;
    }

    set levels(value: IGannSquareDrawingBaseLevel[]) {
        (<IGannSquareDrawingBaseOptions> this._options).levels = [];
        (<IGannSquareDrawingBaseOptions> this._options).levels = value;
    }

    get fans(): IGannSquareDrawingBaseLevel[] {
        return (<IGannSquareDrawingBaseOptions> this._options).fans;
    }

    set fans(value: IGannSquareDrawingBaseLevel[]) {
        (<IGannSquareDrawingBaseOptions> this._options).fans = [];
        (<IGannSquareDrawingBaseOptions> this._options).fans = value;
    }

    get arcs(): IGannSquareDrawingBaseLevel[] {
        return (<IGannSquareDrawingBaseOptions> this._options).arcs;
    }

    set arcs(value: IGannSquareDrawingBaseLevel[]) {
        (<IGannSquareDrawingBaseOptions> this._options).arcs = [];
        (<IGannSquareDrawingBaseOptions> this._options).arcs = value;
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
