import {IPlotConfig, Plot} from "./Plot";
import {DataSeries} from "../Data/DataSeries";
import {Chart} from '../Chart';

export interface IAbstractConnectedPointsPlotConfig extends IPlotConfig {
    connectedPointsSeries: DataSeries;
}

export class AbstractConnectedPointsPlot extends Plot {

    protected connectedPointsSeries: DataSeries = null;

    constructor(chart:Chart, config: IAbstractConnectedPointsPlotConfig) {
        super(chart, config);

        if (typeof config.connectedPointsSeries == 'undefined') {
            throw new TypeError('main points Series is required');
        }

        this.connectedPointsSeries = config.connectedPointsSeries;
        this.createDefaultDataSeries();
    }

    private createDefaultDataSeries() {
        let last = -1;
        let values: number[] = <number[]>this.connectedPointsSeries.values;
        let newValues: number[] = [];
        for (let i = 0; i < this.connectedPointsSeries.length; i++) {
            let value = <number> values[i];

            if (value == null || isNaN(value) || value == 0)
                continue;

            if (last !== -1) {
                // NK line formula between two points y = slope * x + intercept
                let slope = (value - values[last]) / (i - last);
                let intercept = value - (slope * i);
                for (let j = last + 1; j < i; j++) {
                    newValues[j] = (slope * j) + intercept;
                }
                newValues[i] = value;
            } else {
                newValues[i] = value;
            }
            last = i;
        }

        this.setDataSeries(new DataSeries({
            name: 'Indicator',
            values: newValues
        }));
    }

    drawSelectionPoints(): void {

    }

}
