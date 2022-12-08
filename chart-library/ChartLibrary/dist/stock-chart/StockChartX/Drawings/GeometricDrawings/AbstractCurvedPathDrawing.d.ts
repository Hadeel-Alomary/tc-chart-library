import { IPoint } from '../../Graphics/ChartPoint';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare abstract class AbstractCurvedPathDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    private path2d;
    savePath(c: IPoint): void;
    private boxHover;
    private pointInPath;
    private allPointInPath;
    private atLeastOnePointInPath;
    private distanceBetweenCursorAndLine01;
    curveHitTest(point: IPoint): boolean;
}
//# sourceMappingURL=AbstractCurvedPathDrawing.d.ts.map