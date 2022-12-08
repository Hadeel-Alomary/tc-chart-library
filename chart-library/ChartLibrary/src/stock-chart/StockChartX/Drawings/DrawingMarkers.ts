import {ITextTheme} from '../Theme';
import {Chart, ChartPanelValueScale, IPoint, Projection} from '../..';
import {BrowserUtils} from '../../../utils';


export class DrawingMarkers {

    private valueMarkers:DrawingValueMarkers;
    private dateMarkers:DrawingDateMarkers;

    public constructor() {
        this.valueMarkers = new DrawingValueMarkers();
        this.dateMarkers = new DrawingDateMarkers();
    }

    public drawSelectionValueMarkers(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, projection:Projection, panelValueScale:ChartPanelValueScale) {
        this.valueMarkers.draw(chart, points, context, projection, panelValueScale);
    }

    public drawSelectionDateMarkers(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, projection:Projection) {
        this.dateMarkers.draw(chart, points, context, projection);
    }

}

class DrawingDateMarkers {

    public draw(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, projection:Projection) {
        this.drawValueMarkerIfRequired(chart, points, context, projection);
        this.fillValueScaleIfRequired(chart, points, context, projection);
    }

    private drawValueMarkerIfRequired(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, projection:Projection) {
        for (let i = 0; i < points.length; i++) {
            this.drawValueScaleMarkerForEachPoint(chart, points[i].x, context, projection);
        }
    }

    private drawValueScaleMarkerForEachPoint(chart:Chart, x: number, context:CanvasRenderingContext2D, projection:Projection) {

        let padding = 2;

        let text = chart.dateScale.formatDate(projection.dateByX(x));
        let textTheme: ITextTheme = {
            fillColor: '#fff',
            fontFamily: chart.theme.dateScale.text.fontFamily,
            fontSize: chart.theme.dateScale.text.fontSize
        };

        let textWidth = context.measureText(text).width;
        context.beginPath();
        context.rect(x - textWidth / 2 - padding, 1, textWidth + padding * 2, chart.dateScale.bottomPanel.frame.height);
        context.scxFill({fillColor: 'rgb(70,130,180)'});
        context.scxApplyTextTheme(textTheme);
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(text, x - textWidth / 2, chart.dateScale.bottomPanel.frame.height / 2);

    }

    private fillValueScaleIfRequired(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, projection:Projection) {
        let sortedPoints = this.sortXOfPoints(points);
        for (let i = 1; i < sortedPoints.length; i++) {
            this.fillValueScaleDistanceBetweenPoints(chart, sortedPoints[i], sortedPoints[i - 1], context, projection);
        }
    }

    private fillValueScaleDistanceBetweenPoints(chart:Chart, X_currentPoint:number , X_prevPoint:number, context:CanvasRenderingContext2D, projection:Projection) {

        let padding = 2;

        let prevTextWidth = this.textWidth(chart, context, projection, X_prevPoint);
        let currTextWidth = this.textWidth(chart, context, projection, X_currentPoint);
        let x_rect = X_prevPoint - prevTextWidth / 2 - padding;
        let rectWidth = (X_currentPoint + currTextWidth / 2 + padding) - (X_prevPoint - prevTextWidth / 2 - padding);
        let rectHeight = chart.dateScale.bottomPanel.frame.height;
        let markersOverlapped = (X_prevPoint - prevTextWidth / 2 - padding) <= ( X_currentPoint + currTextWidth / 2 + padding);
        if (!markersOverlapped) {
            context.beginPath();
            context.rect(x_rect, 1, rectWidth , rectHeight);
            context.scxFill({fillColor: 'rgba(70,130,180,0.3)'});
        }

    }

    private textWidth(chart: Chart, context: CanvasRenderingContext2D, projection: Projection, x: number) {
        let text = chart.dateScale.formatDate(projection.dateByX(x));
        return context.measureText(text).width;
    }

    private sortXOfPoints(points:IPoint[]):number[] {
        let yValues:number[] = [];
        for (let i = 0; i < points.length; i++) {
            yValues.push(points[i].x);
        }
        return yValues.sort((a, b) => b - a); // sort alphanumerically in descending order
    }

}

class DrawingValueMarkers {

    public draw(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, projection:Projection, panelValueScale:ChartPanelValueScale) {
        this.drawValueMarkerIfRequired(chart, points, context, projection, panelValueScale);
        this.fillValueScaleIfRequired(chart, points, context, panelValueScale);
    }

    private drawValueMarkerIfRequired(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, projection:Projection, panelValueScale:ChartPanelValueScale) {
        for (let i = 0; i < points.length; i++) {
            this.drawValueScaleMarkerForEachPoint(chart, points[i].y, context, projection, panelValueScale);
        }
    }

    private drawValueScaleMarkerForEachPoint(chart:Chart, y: number, context:CanvasRenderingContext2D, projection:Projection, panelValueScale:ChartPanelValueScale) {
        let rightFrame = panelValueScale.rightFrame;
        let xTextOffset = chart.valueMarker.textOffset - 1;
        let padding = 2;

        let text = panelValueScale.formatValue(projection.valueByY(y));
        let textTheme: ITextTheme = {fillColor: '#fff',
            fontFamily: chart.theme.valueScale.text.fontFamily,
            fontSize: chart.theme.valueScale.text.fontSize};
        let yOffset = textTheme.fontSize / 2 + padding;
        context.beginPath();
        context.rect(rightFrame.left, y - yOffset, rightFrame.right - rightFrame.left, yOffset * 2);
        context.scxFill({fillColor: 'rgb(70,130,180)'});
        context.scxApplyTextTheme(textTheme);
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(text , rightFrame.left + xTextOffset, y);
    }

    private fillValueScaleIfRequired(chart:Chart, points:IPoint[], context:CanvasRenderingContext2D, panelValueScale:ChartPanelValueScale) {
        let sortedPoints = this.sortYOfPoints(points);
        for (let i = 1; i < sortedPoints.length; i++) {
            this.fillValueScaleDistanceBetweenPoints(chart, sortedPoints[i], sortedPoints[i - 1], context, panelValueScale);
        }
    }

    private fillValueScaleDistanceBetweenPoints(chart:Chart, Y_currentPoint:number , Y_prevPoint:number, context:CanvasRenderingContext2D, panelValueScale:ChartPanelValueScale) {
        let padding = 2;
        let rightFrame = panelValueScale.rightFrame;
        let textTheme: ITextTheme = {fillColor: '#fff',
            fontFamily: chart.theme.valueScale.text.fontFamily,
            fontSize: chart.theme.valueScale.text.fontSize};
        let yOffset = textTheme.fontSize / 2 + padding;
        let rectHeight = (Math.max(Y_prevPoint,Y_currentPoint) - Math.min(Y_prevPoint,Y_currentPoint)) - yOffset * 2;
        context.beginPath();
        context.rect(rightFrame.left, Math.min(Y_prevPoint,Y_currentPoint) + yOffset, rightFrame.right - rightFrame.left, rectHeight);
        context.scxFill({fillColor: 'rgba(70,130,180,0.1)'});
    }

    private sortYOfPoints(points:IPoint[]):number[] {
        let yValues:number[] = [];
        for (let i = 0; i < points.length; i++) {
            yValues.push(points[i].y);
        }
        return yValues.sort((a, b) => b - a); // sort alphanumerically in descending order
    }


}

