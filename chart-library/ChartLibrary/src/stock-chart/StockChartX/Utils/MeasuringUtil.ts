import {TimeSpan} from "../Data/TimeFrame";
import {ChartPoint} from "../Graphics/ChartPoint";
import {ChartPanel} from "../ChartPanels/ChartPanel";

export interface IMeasurementValues {
    barsCount: number;
    change: number;
    changePercentage: number;
    period: string;
}

export interface IMeasurementPoint {
    date: Date,
    price: number
}

interface IChangeValues{
    change:number;
    changePercentage:number;
}

export class MeasuringUtil {

    private constructor() {
    }

    public static getMeasuringValues(points: ChartPoint[], chartPanel:ChartPanel): IMeasurementValues {
        let measuringPoint1: IMeasurementPoint = {date: points[0].date, price: points[0].value},
            measuringPoint2: IMeasurementPoint = {date: points[1].date, price: points[1].value},
            changeValues: IChangeValues = MeasuringUtil.getChangValues(measuringPoint1, measuringPoint2),
            barsCount: number = MeasuringUtil.getBarsCount(measuringPoint1, measuringPoint2, chartPanel),
            period: string = MeasuringUtil.getPeriod(measuringPoint1, measuringPoint2, chartPanel);

        return {
            change: changeValues.change,
            changePercentage: changeValues.changePercentage,
            barsCount: barsCount,
            period: period
        };
    }

    private static getChangValues(measuringPoint1:IMeasurementPoint, measuringPoint2:IMeasurementPoint):IChangeValues{
        let change = measuringPoint2.price - measuringPoint1.price;
        return {
            change: change,
            changePercentage: (change / measuringPoint1.price) * 100
        };
    }

    private static getBarsCount(measuringPoint1:IMeasurementPoint, measuringPoint2:IMeasurementPoint, chartPanel:ChartPanel):number{
        let bars = 0;

        let firstDate = measuringPoint1.date > measuringPoint2.date ? measuringPoint2.date : measuringPoint1.date;
        let secondDate = measuringPoint1.date > measuringPoint2.date ? measuringPoint1.date : measuringPoint2.date;

        for (let date of chartPanel.chart.barDataSeries().date.values) {
            if (date <= firstDate)
                continue;

            if (date > secondDate)
                break;

            bars += 1;
        }

        if (measuringPoint1.date > measuringPoint2.date) {
            bars = bars * -1;
        }

        return bars;
    }

    private static getPeriod(measuringPoint1:IMeasurementPoint, measuringPoint2:IMeasurementPoint, chartPanel:ChartPanel):string{
        let firstDate = measuringPoint1.date > measuringPoint2.date ? MeasuringUtil.mapToCandleDate(measuringPoint2.date, chartPanel) : MeasuringUtil.mapToCandleDate(measuringPoint1.date, chartPanel);
        let secondDate = measuringPoint1.date > measuringPoint2.date ? MeasuringUtil.mapToCandleDate(measuringPoint1.date, chartPanel) : MeasuringUtil.mapToCandleDate(measuringPoint2.date, chartPanel);
        let period:string;

        if (TimeSpan.MILLISECONDS_IN_DAY <= chartPanel.chart.timeInterval) { // day intervals
            let days = moment(secondDate).diff(moment(firstDate), 'days');
            if (measuringPoint1.date > measuringPoint2.date) {
                days *= -1;
            }
            period = days + 'd';
        } else { // minute intervals

            let minutes = moment(secondDate).diff(moment(firstDate), 'minutes');
            let hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
            let days = Math.floor(hours / 24);
            hours = hours % 24;

            if (days) {
                period = days + 'd  ' + hours + 'h  ' + minutes + 'm';
            } else if (hours) {
                period = hours + 'h ' + minutes + 'm';
            } else {
                period = minutes + 'm';
            }

            if (measuringPoint1.date > measuringPoint2.date) {
                period = '- ' + period;
            }
        }

        return period;
    }

    private static mapToCandleDate(date:Date, chartPanel:ChartPanel){
        let column:number = chartPanel.projection.columnByDate(date);
        return chartPanel.projection.dateByColumn(column);
    }
}