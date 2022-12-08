interface CanvasRenderingContext2D {
    scxApplyStrokeTheme(theme: any): CanvasRenderingContext2D;
    scxApplyFillTheme(theme: any): CanvasRenderingContext2D;
    scxApplyTextTheme(theme: any): CanvasRenderingContext2D;
    scxFill(theme: any, force?: boolean): CanvasRenderingContext2D;
    scxStroke(theme: any, force?: boolean): CanvasRenderingContext2D;
    scxFillStroke(fillTheme: any, strokeTheme: any): CanvasRenderingContext2D;
    scxStrokePolyline(points: any[], theme: any): CanvasRenderingContext2D;
    scxFillPolyLine(points: any[], theme: any): CanvasRenderingContext2D;
    scxRounderRectangle(bounds: any, radius: number): CanvasRenderingContext2D;
    scxDrawAntiAliasingLine(point1: any, point2: any): CanvasRenderingContext2D;
    scxDrawArrow(point: any, radians: number, width: number, height: number): CanvasRenderingContext2D;
}
//# sourceMappingURL=index.d.ts.map