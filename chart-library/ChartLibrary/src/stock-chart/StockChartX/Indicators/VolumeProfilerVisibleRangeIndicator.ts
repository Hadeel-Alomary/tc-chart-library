import {VolumeProfilerBaseIndicator} from './VolumeProfilerBaseIndicator';
import {Interval} from '../../../services/loader';
import {VolumeProfilerSettings} from '../../../services/data/volume-profiler/volume-profiler.service';
import {ChartAccessorService} from '../../../services/chart';
import {VolumeProfilerRequest} from '../../../services/data/volume-profiler/volume-profiler-request-builder';
import {ITAIndicatorConfig} from './TAIndicator';
import {VolumeProfilerVisibleRangePlot} from '../Plots/VolumeProfilerVisibleRangePlot';
import {Gesture, WindowEvent} from '../../StockChartX/Gestures/Gesture';
import {IPoint} from '../../StockChartX/Graphics/ChartPoint';
import {DataSeries} from '../../StockChartX/Data/DataSeries';
import {Plot} from '../../StockChartX/Plots/Plot';
import {Field} from '../../TASdk/Field';
import {Recordset} from '../../TASdk/Recordset';
import {IndicatorField} from './IndicatorConst';
import {PlotTheme} from '../Theme';
import {Chart} from '../Chart';

export class VolumeProfilerVisibleRangeIndicator extends VolumeProfilerBaseIndicator  {

    constructor(config?: ITAIndicatorConfig) {
        super(config);
    }

    protected buildSessionProfilerRequest(symbol:string, interval:Interval, settings:VolumeProfilerSettings, from:string, to:string):VolumeProfilerRequest {
        return ChartAccessorService.instance.getVolumeProfilerRequestBuilder()
            .prepareHistoricalVolumeProfilerRequest(this.id, symbol, interval, settings, from, to);
    }

    protected isLastRequestEncapsulatingNewOne(request: VolumeProfilerRequest):boolean {
        return false;
    }

    protected getDebounceTimer():number {
        return 250;
    }

    protected clearDataOnLoadingNewRequest():boolean {
        return false;
    }

    protected _handleMoveHoverGesture(gesture: Gesture, event: WindowEvent): void {

        let value = this._panel.projection.valueByY(event.pointerPosition.y);

        let bar = this.volumeProfilerIndicatorData.data[0].bars.find(bar => bar.fromPrice <= value && value <= bar.toPrice);

        if(!bar) {
            this.showNoTitleValue();
            return;
        }

        this.showTitleValue(bar.greenVolume, bar.redVolume, bar.totalVolume);

    }

    protected hitTest(point: IPoint): boolean {
        if (!this.visible) {
            return false;
        }
        return 0 < this.volumeProfilerIndicatorData.data.length; // MA there is a plot
    }

    protected getVolumeProfilerPlot(index: number, dataSeries: DataSeries, theme: PlotTheme):Plot {
        return new VolumeProfilerVisibleRangePlot(this.chart, {
            dataSeries: dataSeries,
            theme: theme,
            resultData: this.getVolumeProfilerResultData(),
        })
    }

    protected calculateCustomRecordset(pSource: Field): Recordset {
        this.requestVolumeProfilerData();

        // MA "visible range" needs no recordset, therefore, returns a dummy one that just contains
        // the index of the records.
        let sAlias = IndicatorField.INDICATOR;
        let Field1: Field;
        let Results = new Recordset();
        let iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        for (let iRecord = 1; iRecord < iRecordCount + 1; iRecord++) {
            Field1.setValue(iRecord, iRecord); // MA "dummy" recordset that has no meaning
        }
        Results.addField(Field1);
        return Results;

    }

}
