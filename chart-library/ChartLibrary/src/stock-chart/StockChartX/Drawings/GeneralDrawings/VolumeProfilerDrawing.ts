import {Drawing, DrawingDragPoint} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {IPoint} from '../../Graphics/ChartPoint';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {VolumeProfilerData, VolumeProfilerSettingsRowType} from '../../../../services/data/volume-profiler/volume-profiler.service';
import {Interval} from '../../../../services/loader';
import {ChartAccessorService} from '../../../../services/chart';
import {Subscription} from 'rxjs/internal/Subscription';
import {VolumeProfilerDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';
import {IRect} from '../../Graphics/Rect';
import {StringUtils} from '../../../../utils';
import {Chart} from '../../Chart';


export class VolumeProfilerDrawing extends ThemedDrawing<VolumeProfilerDrawingTheme> {
    static get className(): string {
        return 'volumeProfiler';
    }

    private showPointsLine = false;
    private volumeProfilerData:VolumeProfilerData;
    private subscription: Subscription;
    private volumeProfilerDataRequested:boolean = false;
    private drawnBars: IRect[];

    // MA cannot use this.id, as we need a unique id that changes every time the drawing is constructed (while id is part of the
    // serialized state that is maintained).
    private guid:string;

    constructor(chart:Chart) {
        super(chart);
        this.guid = StringUtils.guid();
        this.subscription = ChartAccessorService.instance.getVolumeProfilerResultStream().subscribe(result => {
            if (result.requesterId == this.guid) {
                this.volumeProfilerData = result.data[0];
                this.setYForChartPoints(); // MA Y Points may need to be updated due to an interval change, so recompute them
                this.chart.setNeedsUpdate();
            }
        });
    }

    get pointsNeeded(): number {
        return 2;
    }

    preDeleteCleanUp() {
        super.preDeleteCleanUp();
        ChartAccessorService.instance.cleanVolumeProfilerData(this.guid);
        this.subscription.unsubscribe();
    }

    onRemove() {
        super.onRemove();
        ChartAccessorService.instance.cleanVolumeProfilerData(this.guid);
        this.subscription.unsubscribe();
    }

    startUserDrawing() {
        super.startUserDrawing();
        this.showPointsLine = true;
    }

    _panGestureHitTest(point: IPoint) {
        // MA this drawing should not be dragged. Therefore, if the click is around selection points, then let them pass so that
        // drawing can be re-sized, otherwise, return false to prevent it from being dragged.
        let points = this.cartesianPoints();
        if (Geometry.isPointNearPoint(point, points)) {
            return super._panGestureHitTest(point);
        }
        return false;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        let point1, point2;
        if (this.volumeProfilerData) {
            let y = this.projection.yByValue(this.volumeProfilerData.pointOfControl);
            point1 = {x: Math.min(points[0].x, points[1].x), y: y};
            point2 = {x: Math.max(points[0].x, points[1].x), y: y};
            return points.length > 1 && Geometry.isPointNearLine(point, point1, point2) || Geometry.isPointNearPoint(point, points) || this.barsHitTest(point, points);
        }
    }

    barsHitTest(point: IPoint, points: IPoint[]): boolean {
        // HA : there are a bug in console when draw volume profiler drawing.
        if (!this.drawnBars) {
            return false;
        }

        for (let bars  of this.drawnBars) {
            if (Geometry.isPointInsideOrNearRect(point, {
                    left: bars.left,
                    top: bars.top,
                    width: bars.width,
                    height: bars.height
                }))
                return true;
            }
    }

    onApplySettings() {
        this.requestVolumeProfilerData();
    }

    resetDefaultSettings() {
        super.resetDefaultSettings();
        this.requestVolumeProfilerData();
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;

                return true;
            case GestureState.CONTINUED:
                let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                if (this._dragPoint >= 0) {
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    this.showPointsLine = true;
                    this.preventChartPointsFromGettingOutsidePriceRange();
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._setDragPoint(DrawingDragPoint.NONE);
                this.setYForChartPoints();
                this.showPointsLine = false;
                this.ensureChartPointsDoNotOverlap();
                this.requestVolumeProfilerData();
                break;
        }

        return false;
    }

    onMoveChartPointInUserDrawingState() {
        this.preventChartPointsFromGettingOutsidePriceRange();
    }


    draw() {
        if (!this.visible)
            return;


        let points = this.cartesianPoints();

        if (points.length > 1) {
            if (this.showPointsLine) {
                this.context.beginPath();
                this.drawPointsLine(points);
            } else {
                this.context.beginPath();
                this.doInitialRequestIfNeeded();
                this.drawBox(points);
                if(this.volumeProfilerData) {
                    this.drawPointOfControlLine(points);
                    if(this.getDrawingTheme().showBars) {
                        this.drawBars(points);
                    }
                }
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private preventChartPointsFromGettingOutsidePriceRange() {
        let points = this.cartesianPoints();
        let lastVisibleRecord = this.getLastVisibleRecord();
        let furthestPointIndex = points[0].x < points[1].x ? 1 : 0;
        let furthestRecordX = this.projection.xByDate(this.projection.dateByRecord(lastVisibleRecord));
        if (furthestRecordX < points[furthestPointIndex].x) {
            this.chartPoints[furthestPointIndex].moveToX(furthestRecordX, this.projection);
        }
    }

    private ensureChartPointsDoNotOverlap() {
        // MA for volume profiler, we cannot have two points having the same "X". If this happens, then move one of them
        // to the past (by 5 candles to be visible for the user)
        let points = this.cartesianPoints();
        if(points.length == 2) {
            if(points[0].x == points[1].x) {
                let currentRecord = this.projection.recordByX(points[0].x);
                let previousX = this.projection.xByRecord(currentRecord - 5);
                this.chartPoints[0].moveToX(previousX, this.projection);
                this.setYForChartPoints();
            }
        }
    }

    private getLastVisibleRecord() {
        if (this.chart.lastVisibleRecord !== null) {
            return Math.min(Math.ceil(this.chart.lastVisibleRecord), this.chart.recordCount - 1);
        }
    }

    private drawPointsLine(points: IPoint[]) {
        let context = this.context,
            frame = this.chartPanel.contentFrame;
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.moveTo(points[0].x, frame.top);
        context.lineTo(points[0].x, frame.bottom);
        context.moveTo(points[1].x, frame.top);
        context.lineTo(points[1].x, frame.bottom);
        context.scxStroke(this.getDrawingTheme().line);
    }

    private drawBox(points: IPoint[]) {
        let context = this.context,
            height = Math.abs(points[0].y - points[1].y),
            width = Math.abs(points[0].x - points[1].x);
        context.scxFill(this.getDrawingTheme().fill);
        context.fillRect(Math.min(points[0].x, points[1].x), Math.min(points[0].y, points[1].y), width, height);

    }

    private drawPointOfControlLine(points: IPoint[]) {
        let context = this.context,
            y = this.projection.yByValue(this.volumeProfilerData.pointOfControl);
        context.moveTo(Math.min(points[0].x, points[1].x), y);
        context.lineTo(Math.max(points[0].x, points[1].x), y);
        context.scxStroke(this.getDrawingTheme().line);
    }

    private drawBars(points:IPoint[]) {
        this.drawUpDownBars(points);
    }

    private drawUpDownBars(points: IPoint[]) {
        let context = this.context;
        let boxWidth = this.getDrawingTheme().boxWidth > 100 ? 100 : this.getDrawingTheme().boxWidth;
        let quarterDistanceOfTheBox = (Math.max(points[1].x, points[0].x) - Math.min(points[1].x, points[0].x)) * (boxWidth / 100);
        let maximumTotalVolumeBasedOnQuarter = this.maximumTotalVolume() / quarterDistanceOfTheBox;

        let areaDownColor = this.getDrawingTheme().downArea;
        let areaUpColor = this.getDrawingTheme().upArea;

        let volumeDownColor = this.getDrawingTheme().downVolume;
        let volumeUpColor = this.getDrawingTheme().upVolume;
        this.drawnBars = [];
        for (let i = 0; i < this.volumeProfilerData.bars.length; i++) {
            let padding = 1,
                height = Math.abs(this.projection.yByValue(this.volumeProfilerData.bars[i].toPrice) - this.projection.yByValue(this.volumeProfilerData.bars[i].fromPrice)) - padding,
                greenRectWidth = Math.floor(this.volumeProfilerData.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter),
                redRectWidth = Math.floor(this.volumeProfilerData.bars[i].redVolume / maximumTotalVolumeBasedOnQuarter),
                y = this.projection.yByValue(this.volumeProfilerData.bars[i].toPrice) - padding;

            context.scxFill(this.volumeProfilerData.bars[i].valueArea ? areaDownColor : volumeDownColor);
            context.fillRect(this.xPosForDownBars(points, greenRectWidth, redRectWidth), y + 0.5, redRectWidth, height);
            this.drawnBars.push({left:this.xPosForDownBars(points, greenRectWidth, redRectWidth),top:y + 0.5,width:redRectWidth,height:height});

            context.scxFill(this.volumeProfilerData.bars[i].valueArea ? areaUpColor : volumeUpColor);
            context.fillRect(this.xPosForUpBards(points, greenRectWidth), y + 0.5, greenRectWidth, height);
            this.drawnBars.push({left:this.xPosForUpBards(points, greenRectWidth),top:y + 0.5,width:greenRectWidth,height:height});

        }
    }

    private xPosForUpBards(points: IPoint[], greenRectWidth: number) {
        if (this.getDrawingTheme().direction == 'left') {
            return Math.min(points[0].x, points[1].x) + 0.5;
        } else {
            return Math.max(points[0].x, points[1].x) - greenRectWidth - 0.5;
        }
    }

    private xPosForDownBars(points: IPoint[], greenRectWidth: number, redRectWidth: number) {
        if (this.getDrawingTheme().direction == 'left') {
            return Math.min(points[0].x, points[1].x) + greenRectWidth + 0.5;
        } else {
            return Math.max(points[0].x, points[1].x) - redRectWidth - greenRectWidth - 0.5;
        }
    }

    private maximumTotalVolume() {
        let arr = [];
        for (let i = 0; i < this.volumeProfilerData.bars.length; i++) {
            arr.push(this.volumeProfilerData.bars[i].totalVolume);
        }
        return Math.max(...arr);
    }

    private setYForChartPoints() {
        this.chartPoints[0].moveToY(this.getMaxPrice(this.chartPoints[0].date, this.chartPoints[1].date), this.projection);
        this.chartPoints[1].moveToY(this.getMinPrice(this.chartPoints[0].date, this.chartPoints[1].date), this.projection);
    }

    private getMaxPrice(date1:Date, date2:Date):number {
        let firstDate = date1 > date2 ? date2 : date1;
        let secondDate = date1 > date2 ? date1 : date2;
        let highPrices:number[]  = [];

        for (let i = 0; i <= this.chartPanel.chart.barDataSeries().date.values.length -1; i++) {
            if (this.chartPanel.chart.barDataSeries().date.values[i] < firstDate)
                continue;
            if (this.chartPanel.chart.barDataSeries().date.values[i] > secondDate)
                break;
            highPrices.push(<number>this.chartPanel.chart.barDataSeries().high.values[i]);
        }

        return this.projection.yByValue(Math.max(...highPrices));
    }

    private getMinPrice(date1:Date, date2:Date):number {
        let firstDate = date1 > date2 ? date2 : date1;
        let secondDate = date1 > date2 ? date1 : date2;
        let lowPrices:number[]  = [];

        for (let i = 0; i <= this.chartPanel.chart.barDataSeries().date.values.length-1; i++) {
            if (this.chartPanel.chart.barDataSeries().date.values[i] < firstDate)
                continue;

            if (this.chartPanel.chart.barDataSeries().date.values[i] > secondDate)
                break;

            lowPrices.push(<number>this.chartPanel.chart.barDataSeries().low.values[i]);
        }
        return this.projection.yByValue(Math.min(...lowPrices));
    }

    private requestVolumeProfilerData() {

        let symbol = this.chart.instrument.symbol;
        let interval = Interval.fromChartInterval(this.chart.timeInterval);
        let volumeProfileSettings = {
            rowSize: this.getDrawingTheme().rowSize,
            valueAreaVolumeRatio: this.getDrawingTheme().valueAreaPercentage * 0.01,
            rowLayout: this.getDrawingTheme().rowType
        };
        let fromDate = this.chartPoints[0].date < this.chartPoints[1].date ? this.chartPoints[0].date : this.chartPoints[1].date;
        let toDate = this.chartPoints[0].date < this.chartPoints[1].date ? this.chartPoints[1].date : this.chartPoints[0].date;
        let fromDateAsString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
        let toDateAsString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');

        let request = ChartAccessorService.instance.getVolumeProfilerRequestBuilder()
            .prepareHistoricalVolumeProfilerRequest(this.guid, symbol, interval, volumeProfileSettings, fromDateAsString, toDateAsString);

        if(!ChartAccessorService.instance.isVolumeProfilerRequested(request)) {
            ChartAccessorService.instance.requestVolumeProfilerData(request);
            this.volumeProfilerDataRequested = true;
            this.volumeProfilerData = null;
        }

    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        this.setYForChartPoints();
        this.preventChartPointsFromGettingOutsidePriceRange();
        this.ensureChartPointsDoNotOverlap();
        this.requestVolumeProfilerData();
        this.showPointsLine = false;
    }

    private doInitialRequestIfNeeded() {
        if(!this.volumeProfilerDataRequested) {
            if(this.chart && this.chart.instrument && this.chart.instrument.symbol) {
                this.requestVolumeProfilerData();
            }
        }
    }

    canControlPointsBeManuallyChanged() : boolean {
        return false;
    }

}

Drawing.register(VolumeProfilerDrawing);
