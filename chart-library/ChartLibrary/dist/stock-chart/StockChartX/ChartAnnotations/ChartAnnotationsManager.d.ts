import { ChartAnnotation, ChartAnnotationType } from './ChartAnnotation';
export declare class ChartAnnotationsManager {
    private chartAnnotations;
    register(object: ChartAnnotation): void;
    removeByType(type: ChartAnnotationType): void;
    getChartAnnotations(): ChartAnnotation[];
    private positionAnnotationsForPositionIndex;
}
//# sourceMappingURL=ChartAnnotationsManager.d.ts.map