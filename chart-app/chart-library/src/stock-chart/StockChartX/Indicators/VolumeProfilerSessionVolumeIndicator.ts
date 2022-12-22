import {VolumeProfilerBaseIndicator} from './VolumeProfilerBaseIndicator';
import {Interval} from '../../../services/loader';
import {VolumeProfilerSettings} from '../../../services/volume-profiler/volume-profiler.service';
import {ChartAccessorService} from '../../../services/chart';
import {VolumeProfilerRequest} from '../../../services/volume-profiler/volume-profiler-request-builder';
import {ITAIndicatorConfig} from './TAIndicator';
import {VolumeProfilerSessionPlot} from '../Plots/VolumeProfilerSessionPlot';
import {Gesture, WindowEvent} from '../../StockChartX/Gestures/Gesture';
import {IPoint} from '../../StockChartX/Graphics/ChartPoint';
import {DataSeries} from '../../StockChartX/Data/DataSeries';
import {Plot} from '../../StockChartX/Plots/Plot';
import {Field} from '../../TASdk/Field';
import {Recordset} from '../../TASdk/Recordset';
import {IndicatorField} from './IndicatorConst';
import {PlotTheme} from '../Theme';

const isEqual = require('lodash/isEqual');
const cloneDeep = require('lodash/cloneDeep');

export class VolumeProfilerSessionVolumeIndicator extends VolumeProfilerBaseIndicator  {

    constructor(config?: ITAIndicatorConfig) {
        super(config);
    }

    protected buildSessionProfilerRequest(symbol:string, interval:Interval, settings:VolumeProfilerSettings, from:string, to:string):VolumeProfilerRequest {
        return ChartAccessorService.instance.getVolumeProfilerRequestBuilder()
            .prepareSessionBasedVolumeProfilerRequest(this.id, symbol, interval, settings, from, to);
    }

    protected isLastRequestEncapsulatingNewOne(request: VolumeProfilerRequest):boolean {

        // MA if lastRequest (from, to) encapsulates current request, then no need to do another request as the new
        // request is just a zoomed window of the last request.

        // MA need to clone it as it is a throw-away object with state changed for comparison purposes
        let lastRequestClone = cloneDeep(this.volumeProfilerRequest);
        lastRequestClone.durationInDays = request.durationInDays;

        // MA if lastRequested "from" is before requested "from", then change "from" to match request.
        if(lastRequestClone.from < request.from) {
            lastRequestClone.from = request.from;
        }

        // MA if, on minute based, lastRequested "to" is after requested "to", then change "to" to match request.
        if(request.to.substr(0, 'YYYY-MM-DD HH:mm'.length) <= lastRequestClone.to.substr(0, 'YYYY-MM-DD HH:mm'.length)) {
            lastRequestClone.to = request.to;
        }

        return isEqual(lastRequestClone, request);

    }

    protected hitTest(point: IPoint): boolean {

        if (!this.visible) {
            return false;
        }

        let result = false;
        if(this.volumeProfilerIndicatorData.data.length) {
            let sessionPlot = this._plotItems[0].plot as VolumeProfilerSessionPlot;
            result = sessionPlot.isHoveredOverSessionBox(point);
        }

        if(!result && this.isTitleShown()) {
            this.showNoTitleValue();
        }
        return result;
    }

    protected _handleMoveHoverGesture(gesture: Gesture, event: WindowEvent): void {
        
        let value = this._panel.projection.valueByY(event.pointerPosition.y);

        let date = moment(this._panel.projection.dateByX(event.pointerPosition.x)).format('YYYY-MM-DD HH:mm:ss');

        let volumeProfilerData = this.volumeProfilerIndicatorData.data.find(result => result.fromDate <= date && date <= result.toDate);

        if(!volumeProfilerData){
            this.showNoTitleValue();
            return;
        }

        let bar = volumeProfilerData.bars.find(bar => bar.fromPrice <= value && value <= bar.toPrice);

        if(!bar) {
            this.showNoTitleValue();
            return;
        }

        this.showTitleValue(bar.greenVolume, bar.redVolume, bar.totalVolume);

    }

    protected getVolumeProfilerPlot(index: number, dataSeries: DataSeries, theme: PlotTheme):Plot {
        return new VolumeProfilerSessionPlot(this.chart,{
            dataSeries: dataSeries,
            theme: theme,
            resultData: this.getVolumeProfilerResultData(),
        });
    }

    protected calculateCustomRecordset(pSource: Field): Recordset {
        // MA Recordset contains first record for each daily session (for all indices that belongs to that date),
        // This is done to make it easier for the plot to draw session boxes with no computation needed.
        this.requestVolumeProfilerData();
        let sAlias = IndicatorField.INDICATOR;
        let Field1: Field;
        let Results = new Recordset();
        let iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        let startBoxDate: Date = null;
        let startBoxRecordIndex = null;
        for (let iRecord = 1; iRecord < iRecordCount + 1; iRecord++) {
            let recordDate: Date = (pSource.value(iRecord) as unknown) as Date;
            if ((startBoxDate == null) || (startBoxDate.getDay() != recordDate.getDay())) {
                startBoxDate = recordDate;
                startBoxRecordIndex = iRecord;
            }
            Field1.setValue(iRecord, startBoxRecordIndex - 1); // MA seems that record starts from 1
        }
        Results.addField(Field1);
        return Results;
    }

    protected clearDataOnLoadingNewRequest(): boolean {
        return true;
    }

    protected getDebounceTimer(): number {
        return 500;
    }


}
