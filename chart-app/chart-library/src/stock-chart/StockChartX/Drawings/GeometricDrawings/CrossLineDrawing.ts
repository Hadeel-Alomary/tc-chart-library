import {Drawing} from "../Drawing";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {DummyCanvasContext} from "../../Utils/DummyCanvasContext";
import {HtmlUtil} from "../../Utils/HtmlUtil";
import {TimeSpan} from "../../Data/TimeFrame";
import {IRect} from "../../Graphics/Rect";
import {ITextTheme} from '../../Theme';
import {LineWithLabelDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class CrossLineDrawing extends ThemedDrawing<LineWithLabelDrawingTheme> {

  static get className(): string {
    return 'crossLine';
  }

  bounds(): IRect {
    let point = this.cartesianPoint(0);
    if (!point)
      return null;

    let frame = this.chartPanel.contentFrame;

    return {
      left: frame.left,
      top: frame.top,
      width: frame.width,
      height: frame.height
    };
  }

  hitTest(point: IPoint): boolean {
    let p = this.cartesianPoint(0);

    return point && Geometry.isValueNearValue(point.x, p.x) || Geometry.isValueNearValue(point.y, p.y);
  }

  draw() {
    if (!this.visible)
      return;

    let point = this.cartesianPoint(0);
    if (!point)
      return;

    let context = this.context,
      frame = this.chartPanel.contentFrame;

    context.beginPath();
    context.moveTo(point.x, frame.top);
    context.lineTo(point.x, frame.bottom);
    context.scxStroke(this.getDrawingTheme().line);
    context.moveTo(frame.right, point.y);
    context.lineTo(frame.left, point.y);
    context.scxStroke(this.getDrawingTheme().line);

    if (this.selected) {
      this._drawSelectionMarkers({x: point.x, y: point.y});
    }
    this.drawVerticalValue();
    this.drawHorizontalValue();
  }

  drawVerticalValue() {
    let textTheme : ITextTheme= <ITextTheme>{fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: ''};
    let point = this.cartesianPoint(0),
      frame = this.chartPanel.contentFrame,
      context = this.chartPanel.context,
      text = this.getFormattedDate(point.x),
      theme = this.getDrawingTheme(),
      textSize = DummyCanvasContext.measureText(text, textTheme),
      padding = 5,
      valuePosition = {x: point.x, y: Math.round(frame.bottom - padding)};

    context.scxApplyFillTheme({fillColor: theme.line.strokeColor});

    let x = valuePosition.x + padding,
      y = valuePosition.y - textSize.height - ( 2 * padding ),
      width = textSize.width + (padding * 2),
      height = textSize.height + (padding * 2);

    context.fillRect(x, y, width, height);

    textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
    context.scxApplyTextTheme(textTheme);
    context.fillText(text, x + padding, y + textSize.height + (padding / 2));
  }


  private getFormattedDate(x: number): string {
    let date = this.projection.dateByColumn(this.projection.columnByX(x));

    if (this.intradDayTimeIntervals.indexOf(this.chart.timeInterval) !== -1) // Minutes intervals
      return moment(date).format("DD-MM-YYYY , HH:mm:ss");

    return moment(date).format("DD-MM-YYYY");
  }

  private intradDayTimeIntervals: number[] = [TimeSpan.MILLISECONDS_IN_MINUTE, TimeSpan.MILLISECONDS_IN_HOUR];

  drawHorizontalValue() {
    let textTheme : ITextTheme= <ITextTheme>{fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: ''};
    let point = this.cartesianPoint(0),
      frame = this.chartPanel.contentFrame,
      context = this.chartPanel.context,
      value = this.projection.valueByY(point.y),
      text = this.chartPanel.formatValue(value),
      theme = this.getDrawingTheme(),
      textSize = DummyCanvasContext.measureText(text, textTheme),
      padding = 5,
      valuePosition = {x: Math.round(frame.right - padding), y: point.y};

    context.scxApplyFillTheme({fillColor: theme.line.strokeColor});

    let x = valuePosition.x - textSize.width - (2 * padding),
      y = valuePosition.y - textSize.height - (3 * padding),
      width = textSize.width + (padding * 2),
      height = textSize.height + (padding * 2);

    context.fillRect(x, y, width, height);

    textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
    context.scxApplyTextTheme(textTheme);
    context.fillText(text, x + padding, y + (3 * padding));
  }

    protected shouldDrawMarkers(): boolean {
        return false;
    }

}

Drawing.register(CrossLineDrawing);
