import {ChartAnnotation, ChartAnnotationType} from './ChartAnnotation';

export class ChartAnnotationsManager {

    private chartAnnotations: ChartAnnotation[] = [];

    public register(object: ChartAnnotation): void {
        this.chartAnnotations.push(object);
        this.positionAnnotationsForPositionIndex(object.getPositionIndex());
    }

    public removeByType(type:ChartAnnotationType): void {
        this.chartAnnotations = this.chartAnnotations.filter(o => o.getAnnotationType() !== type);
    }

    public getChartAnnotations(): ChartAnnotation[] {
        return this.chartAnnotations;
    }

    private positionAnnotationsForPositionIndex(positionIndex: number) {
        let sameCandleObjects: ChartAnnotation[] = this.chartAnnotations.filter(object => object.getPositionIndex() == positionIndex);
        let aboveIndex: number = 0;
        let belowIndex: number = 0;
        sameCandleObjects.forEach(object => {
            object.setOffset(object.isBelowCandle() ? belowIndex++ : aboveIndex++);
        });
    }

}
