import {Drawing, IDrawingConfig, IDrawingOptions} from '../Drawing';
import {DummyCanvasContext} from '../../Utils/DummyCanvasContext';
import {ChartAccessorService} from '../../../../services/chart';
import {BorderedTextDrawingTheme} from '../DrawingThemeTypes';
import {ITextTheme} from '../../Theme';
import {ThemedDrawing} from '../ThemedDrawing';
import {Chart} from '../../Chart';

export interface ITextBaseConfig extends IDrawingConfig {
    text: string;
}

export interface ITextBaseOptions extends IDrawingOptions {
    text: string;
    textWrapWidth: number;
}

export namespace DrawingEvent {
    export const TEXT_CHANGED = 'drawingTextChanged';
}


export class TextBase extends ThemedDrawing<BorderedTextDrawingTheme> {

    constructor(chart:Chart, config?: ITextBaseConfig) {
        super(chart, config);

        this.text = config && config.text;
    }

    get text(): string {
        if ((<ITextBaseOptions> this._options).text == 'none') {
            return '';
        }
        return (<ITextBaseOptions> this._options).text || this.getDefaultText();
    }

    set text(value: string) {
        value = value || '';
        this._setOption('text', value, DrawingEvent.TEXT_CHANGED);
    }

    get textWrapWidth(): number {
        if ((<ITextBaseOptions> this._options).textWrapWidth == undefined)
            (<ITextBaseOptions> this._options).textWrapWidth = 410;

        return (<ITextBaseOptions> this._options).textWrapWidth;
    }

    set textWrapWidth(value: number) {
        (<ITextBaseOptions> this._options).textWrapWidth = value;
    }

    private getDefaultText():string {
        return ChartAccessorService.instance.isArabic() ? 'النص' : 'Text';
    }

    protected get lines() {
        if (!this.text)
            return [''];

        return this.text.split('\n');
    }

    protected getWrappedLines(): string[] {
        let lines = this.lines, theme = this.getDrawingTheme();
        let wrappedLines: string[] = [];
        for (let line of lines) {
            this.wrapLine(line, this.textWrapWidth, this.getDrawingTheme().text.fontSize).forEach(line => wrappedLines.push(line));
        }
        return wrappedLines;
    }

    protected getLines(): string [] {
        return this.getDrawingTheme().text.textWrapEnabled ? this.getWrappedLines() : this.lines;
    }

    protected getLongestLineSize() {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        let longestLine = this.lines.reduce(function (left: string, right: string) {
            return left.length >= right.length ? left : right;
        });
        let theme = this.getDrawingTheme();
        let size = DummyCanvasContext.measureText(longestLine, this.getDrawingTheme().text as ITextTheme);
        return size;
    }

    protected wrapLine(text: string, maxWidth: number, lineHeight: number): string[] {

        let words = text.split(' '),
            context = this.context,
            testLine,
            line = '';

        let result: string[] = [];

        for (let i = 0; i < words.length; i++) {
            testLine = words[i];
            let testLineWidth = context.measureText(testLine).width;
            while (testLineWidth > maxWidth) {
                testLine = testLine.substring(0, testLine.length - 1);
                testLineWidth = context.measureText(testLine).width;
            }
            if (words[i] != testLine) {
                words.splice(i + 1, 0, words[i].substr(testLine.length));
                words[i] = testLine;
            }
            testLine = line + words[i] + ' ';
            testLineWidth = context.measureText(testLine).width;

            if (testLineWidth > maxWidth && i > 0) {
                result.push(line);
                line = words[i] + ' ';
            }
            else {
                line = testLine;
            }
        }

        result.push(line);
        return result;
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        this.showSettingsDialog();
    }
}
