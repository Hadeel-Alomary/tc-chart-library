import {Drawing} from './Drawing';
import {BorderedTextDrawingTheme, DrawingTheme, FillThemeElement, LineThemeElement, TextThemeElement} from './DrawingThemeTypes';

export abstract class ThemedDrawing<T extends DrawingTheme> extends Drawing {

    protected getDrawingTheme():T {
        return this.chart ? this.theme as T : null;
    }

    hasBorderedTextDrawingTheme():boolean {
        let theme = (this.getDrawingTheme() as DrawingTheme) as BorderedTextDrawingTheme;
        return theme.text != null && theme.fill != null && theme.borderLine != null;
    }

}
